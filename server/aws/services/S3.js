import dotenv from "dotenv";
import { S3Client, CreateBucketCommand, HeadBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
dotenv.config();

const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Fungsi untuk membuat bucket baru
async function createBucket(bucketName = process.env.AWS_BUCKET_NAME) {
  try {
    await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" created successfully.`);
  } catch (err) {
    console.error("Error creating bucket:", err);
  }
}

// Cek apakah bucket sudah ada, jika tidak maka buat baru
async function ensureBucketExists() {
  try {
    // Cek keberadaan bucket dengan HeadBucketCommand
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`✅ S3 Bucket "${BUCKET_NAME}" sudah ada di MiniStack.`);
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      // Bucket tidak ditemukan, buat baru
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`✅ S3 Bucket "${BUCKET_NAME}" berhasil dibuat di MiniStack.`);
    } else {
      // Error lain terjadi saat mengecek atau membuat bucket
      console.error('❌ Error S3 MiniStack:', err.message);
      throw err;
    }
  }
}

export async function uploadImageToS3(fileBuffer, fileName, mimeType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  return `${process.env.AWS_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
}

export { ensureBucketExists };