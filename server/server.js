import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { ensureBucketExists, uploadImageToS3 } from './aws/services/S3.js';
import { initDb } from './aws/services/DynamoDB.js';
import { insertUser, getUserByEmail, getAllPosters, insertPoster, getPosterById, deletePoster, updatePosterStatus } from './data/db.js';
import { response } from './utils/response.js';

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT;

// Multer — simpan di memory lalu kirim ke S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar yang diizinkan.'));
  },
});

// Konfigurasi CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response(400, 'Semua field harus diisi!', null, res);
  }

  const user = await getUserByEmail(email);
  if (!user) return response(404, 'Pengguna tidak ditemukan!', null, res);
  if (user.password !== password) return response(401, 'Kata sandi salah!', null, res);

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  return response(200, 'Login berhasil!', { email: user.email, token }, res);
});

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response(400, 'Semua field harus diisi!', null, res);
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) return response(409, 'Email sudah terdaftar!', null, res);

  const id = Date.now().toString();
  await insertUser({ id, email, password });
  return response(201, 'Registrasi berhasil!', { email }, res);
});

// Posters 
// Buat poster baru — terima FormData + file gambar opsional
app.post('/api/posters', upload.single('image'), async (req, res) => {
  try {
    const { title, description, contact, owner, status } = req.body;

    if (!title || !description || !contact) {
      return response(400, 'Judul, deskripsi, dan kontak wajib diisi!', null, res);
    }

    let imgUrl = '';
    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const fileName = `posters/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      imgUrl = await uploadImageToS3(req.file.buffer, fileName, req.file.mimetype);
    }

    const id = Date.now().toString();
    await insertPoster({
      id,
      title,
      description,
      contact,
      owner: owner || 'anonymous',
      imgUrl,
      status: status || 'missing',
    });

    return response(201, 'Poster berhasil dibuat!', { id }, res);
  } catch (err) {
    console.error('Error buat poster:', err);
    return response(500, err.message || 'Gagal membuat poster.', null, res);
  }
});

app.get('/api/posters', async (req, res) => {
  const posters = await getAllPosters();
  return response(200, 'Berhasil mengambil daftar poster!', posters, res);
});

app.get('/api/posters/:id', async (req, res) => {
  const { id } = req.params;
  const poster = await getPosterById(id);
  if (!poster) return response(404, 'Poster tidak ditemukan!', null, res);
  return response(200, 'Berhasil mengambil poster!', poster, res);
});

app.delete('/api/posters/:id', async (req, res) => {
  const { id } = req.params;
  await deletePoster(id);
  return response(200, 'Poster berhasil dihapus!', { id }, res);
});

app.patch('/api/posters/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return response(400, 'Status wajib diisi!', null, res);
  await updatePosterStatus(id, status);
  return response(200, 'Status poster berhasil diperbarui!', { id, status }, res);
});

// Start
async function startServer() {
  try {
    await ensureBucketExists();
    await initDb();

    // Cek user demo
    const demoUser = await getUserByEmail('demo@mail.com');
    if (!demoUser) {
      await insertUser({ id: 'demo-user', email: 'demo@mail.com', password: '123456' });
      console.log('✅ Demo user berhasil dibuat.');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Gagal menginisialisasi server:', err);
    process.exit(1);
  }
}

startServer();