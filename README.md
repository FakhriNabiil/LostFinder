# 🔍 LostFinder - Katalog Kehilangan

LostFinder adalah aplikasi web modern yang dirancang untuk membantu pengguna mengelola dan memantau informasi barang atau hewan peliharaan yang hilang. Dengan simulasi cloud menggunakan MiniStack, memakai `S3` dan `DynamoDB` service.

---

## 🚀 Fitur Utama

- **Authentication**: Sistem Registrasi dan Login pengguna.
- **Dashboard Modern**: Katalog poster kehilangan dengan statistik real-time.
- **Pencarian & Filter**: Cari poster berdasarkan judul/deskripsi atau filter berdasarkan status (Hilang/Ditemukan).
- **Unggah Gambar**: Dukungan unggah foto asli ke S3 bucket.
- **Manajemen Poster**: Pemilik poster dapat memperbarui status (Hilang ↔ Ditemukan) atau menghapus poster.
- **Dark Mode**: Tampilan gelap yang modern dan nyaman di mata.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, Framer Motion (Animations).
- **Backend**: Node.js, Express, Multer (File Handling).
- **Database**: AWS DynamoDB (NoSQL).
- **Storage**: AWS S3 (Image Storage).
- **Local Dev Environment**: MiniStack (Simulasi AWS lokal via Docker).

---

## 📦 Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini :

### 1. Yang dibutuhkan
- **Node.js** (Versi 18 ke atas direkomendasikan).
- **Docker Desktop** (Untuk menjalankan MiniStack).
- **Git** (Untuk clone repositori).

### 2. Clone Repositori
```bash
git clone https://github.com/FakhriNabiil/LostFinder.git
cd LostFinder
```

### 3. Jalankan Database & S3 (MiniStack)
Pastikan Docker sudah terinstall, lalu buka terminal di root folder proyek :
```bash
docker-compose up -d
```
*Ini akan menjalankan layanan DynamoDB dan S3 di port `4566`.*

### 4. Konfigurasi Backend
Pindah ke direktori `server`:
```bash
cd server
npm install
```
Buka file `.env` di dalam folder `server` (bisa mengganti URL dan port jika diperlukan). Pastikan port dan url benar dan sesuai (nilai default sudah ada, tidak perlu mengantinya jika sudah sesuai).

Jalankan server:
```bash
npm start
```

### 5. Konfigurasi Frontend
Buka terminal baru, pindah ke direktori `client`:
```bash
cd client
npm install
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`.

---

## 📖 Manual Penggunaan

### 1. Registrasi & Login
- Buka aplikasi, Anda akan diarahkan ke halaman **Login**.
- Jika belum punya akun, klik **Daftar** dan buat akun baru dengan email dan password.
- Gunakan akun tersebut untuk masuk.
- *Tip: Tersedia akun demo `demo@mail.com` dengan password `123456`.*

### 2. Halaman Dashboard
- Anda dapat melihat semua poster yang aktif.
- Gunakan bar pencarian untuk mencari barang tertentu.
- Gunakan tombol filter (Semua, Hilang, Ditemukan) untuk menyaring tampilan.
- Statistik di bagian atas menunjukkan jumlah total poster dan statusnya.

### 3. Membuat Poster Baru
- Klik tombol **+ Poster Baru** di dashboard.
- Isi judul, deskripsi lengkap, dan nomor kontak yang bisa dihubungi.
- Unggah foto barang/hewan yang hilang (opsional namun sangat disarankan).
- Klik **Publikasikan**.

### 4. Detail & Manajemen Poster
- Klik pada kartu poster untuk melihat detail lengkap.
- Jika Anda adalah pemilik poster:
    - Klik **Tandai Sudah Ditemukan** jika barang telah kembali.
    - Klik **Hapus** jika ingin menghapus pengumuman tersebut.

---

## 📁 Struktur Proyek
- `/client`: Source code frontend (React).
- `/server`: Source code backend (Express API).
- `docker-compose.yml`: Konfigurasi infrastruktur lokal.

---

*LostFinder - © 2026*
