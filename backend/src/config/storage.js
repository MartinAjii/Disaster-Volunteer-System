const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const path = require('path');

let storage = null;
let bucket = null;

function getBucket() {
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  
  if (!bucketName) {
    return null;
  }

  if (!storage) {
    storage = new Storage();
    bucket = storage.bucket(bucketName);
  }

  return bucket;
}

async function uploadBuffer(file, folder = 'reports') {
  const selectedBucket = getBucket();

  if (!selectedBucket || !file) {
    return null;
  }

  const ext = path.extname(file.originalname || '');
  const filename = `${folder}/${Date.now()}-${crypto.randomUUID()}${ext}`;
  const gcsFile = selectedBucket.file(filename);

  await gcsFile.save(file.buffer, {
    metadata: {
      contentType: file.mimetype
    },
    resumable: false
  });

  try {
    await gcsFile.makePublic();
  } catch (error) {
    console.warn('Upload berhasil, tetapi file tidak dibuat public:', error.message);
  }

  return `https://storage.googleapis.com/${selectedBucket.name}/${filename}`;
}

module.exports = { uploadBuffer };
