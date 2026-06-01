const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const path = require('path');

let storageInstance = null;

/**
 * Ambil instance bucket Google Cloud Storage
 */
function getBucket() {
  try {
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

    if (!bucketName) {
      console.warn(
        'WARNING: GOOGLE_CLOUD_STORAGE_BUCKET environment variable belum diset'
      );
      return null;
    }

    // Inisialisasi storage sekali saja
    if (!storageInstance) {
      storageInstance = new Storage();
      console.log('Google Cloud Storage initialized');
    }

    return storageInstance.bucket(bucketName);
  } catch (error) {
    console.error('Failed to initialize Google Cloud Storage:', error.message);
    return null;
  }
}

/**
 * Upload file buffer ke Google Cloud Storage
 * @param {Object} file - file dari multer
 * @param {String} folder - folder tujuan di bucket
 * @returns {String|null} public URL file
 */
async function uploadBuffer(file, folder = 'reports') {
  if (!file) {
    console.warn('No file provided for upload');
    return null;
  }

  const bucket = getBucket();

  if (!bucket) {
    console.warn('Bucket unavailable, upload skipped');
    return null;
  }

  try {
    const ext = path.extname(file.originalname || '');

    const filename = `${folder}/${Date.now()}-${crypto.randomUUID()}${ext}`;

    const gcsFile = bucket.file(filename);

    await gcsFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    });

    console.log(`File uploaded: ${filename}`);

    // Optional public access
    try {
      await gcsFile.makePublic();
      console.log('File set to public');
    } catch (publicError) {
      console.warn(
        'Upload berhasil tetapi file tidak public:',
        publicError.message
      );
    }

    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  } catch (error) {
    console.error('GCS upload failed:', error.message);
    return null;
  }
}

module.exports = {
  uploadBuffer
};