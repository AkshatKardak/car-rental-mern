const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  // Method 1: Using environment variables (Recommended for production)
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
    
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    console.log('✅ Firebase Admin initialized with environment variables');
  } 
  // Method 2: Using service account JSON file (Development)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('✅ Firebase Admin initialized with service account file');
  } 
  else {
    console.warn('⚠️ Firebase Admin not initialized - Missing credentials');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
}

/**
 * Verify Firebase ID Token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<Object>} Decoded token with user info
 */
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification error:', error);
    throw new Error('Invalid Firebase token');
  }
};

/**
 * Get user by UID
 * @param {string} uid - Firebase user UID
 * @returns {Promise<Object>} Firebase user record
 */
const getUserByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Firebase get user error:', error);
    throw new Error('User not found');
  }
};

/**
 * Create custom token for user
 * @param {string} uid - Firebase user UID
 * @returns {Promise<string>} Custom token
 */
const createCustomToken = async (uid) => {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error('Firebase create token error:', error);
    throw new Error('Failed to create custom token');
  }
};

module.exports = {
  admin,
  verifyIdToken,
  getUserByUid,
  createCustomToken,
};
