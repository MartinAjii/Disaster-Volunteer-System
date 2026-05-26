const admin = require('firebase-admin');

admin.initializeApp();

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