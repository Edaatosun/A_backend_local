// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./arelnetworkstorage-firebase-adminsdk-fbsvc-5609ba0fd5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'arelnetworkstorage.firebasestorage.app' 
});

const bucket = admin.storage().bucket();
module.exports = bucket;
