const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-account.json');

console.log('SERVICE ACCOUNT PROJECT:', serviceAccount.project_id);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

console.log('Firestore connected');

function getFirestore() {
  return firestore;
}

function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

module.exports = {
  getFirestore,
  serverTimestamp
};