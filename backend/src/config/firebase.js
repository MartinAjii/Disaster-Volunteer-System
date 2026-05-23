const admin = require('firebase-admin');

let firestore = null;

function initFirebase() {
  if (admin.apps.length > 0) {
    firestore = admin.firestore();
    return firestore;
  }

  try {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (base64) {
      const json = Buffer.from(base64, 'base64').toString('utf-8');
      const serviceAccount = JSON.parse(json);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId
      });
    }

    firestore = admin.firestore();
    console.log('Firestore connected');
  } catch (error) {
    console.warn('Firestore is not configured yet:', error.message);
    firestore = null;
  }

  return firestore;
}

function getFirestore() {
  if (!firestore) {
    initFirebase();
  }

  if (!firestore) {
    const error = new Error(
      'Firestore belum dikonfigurasi. Isi FIREBASE_PROJECT_ID dan GOOGLE_APPLICATION_CREDENTIALS atau FIREBASE_SERVICE_ACCOUNT_BASE64.'
    );
    error.statusCode = 503;
    throw error;
  }

  return firestore;
}

function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

initFirebase();

module.exports = {
  getFirestore,
  serverTimestamp
};
