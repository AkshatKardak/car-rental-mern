import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

/**
 * Register new user with Firebase
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data and token
 */
export const registerWithFirebase = async (name, email, password) => {
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with name
    await updateProfile(user, { displayName: name });

    // Send email verification
    try {
      await sendEmailVerification(user);
      console.log('✅ Verification email sent');
    } catch (emailError) {
      console.warn('⚠️ Could not send verification email:', emailError.message);
    }

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Send to backend to create user record
    const response = await axios.post(`${API_URL}/auth/firebase-register`, {
      firebaseUid: user.uid,
      name: name,
      email: email,
      idToken: idToken
    });

    // Store JWT token from backend
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
      message: 'Registration successful! Please verify your email.'
    };
  } catch (error) {
    console.error('Firebase registration error:', error);
    
    // Handle Firebase errors
    let errorMessage = 'Registration failed';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use. Please sign in or use a different email.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password sign up is not enabled';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Login with Firebase
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data and token
 */
export const loginWithFirebase = async (email, password) => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Send to backend for verification
    const response = await axios.post(`${API_URL}/auth/firebase-login`, {
      firebaseUid: user.uid,
      email: email,
      idToken: idToken
    });

    // Store JWT token from backend
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    console.error('Firebase login error:', error);
    
    // Handle Firebase errors
    let errorMessage = 'Login failed';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Login with Google
 * @returns {Promise<Object>} User data and token
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Set custom parameters for Google sign-in
    provider.setCustomParameters({
      prompt: 'select_account' // Always show account selection
    });

    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Send to backend
    const response = await axios.post(`${API_URL}/auth/firebase-google`, {
      idToken: idToken
    });

    // Store JWT token from backend
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    console.error('Google login error:', error);
    
    // Handle Firebase errors
    let errorMessage = 'Google sign-in failed';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completion';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in cancelled';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Sign-in popup was blocked by browser';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google sign-in is not enabled';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with the same email but different sign-in method';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutFirebase = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local storage even if Firebase signOut fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Logout failed');
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>} Success message
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Get current Firebase user
 * @returns {Object|null} Current Firebase user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} Current user data
 */
export const getCurrentUserData = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Subscribe to authentication state changes
 * @param {Function} callback - Callback function to execute on auth state change
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Refresh user token
 * @returns {Promise<string>} New ID token
 */
export const refreshUserToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true); // Force refresh
      return idToken;
    }
    throw new Error('No user logged in');
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error('Failed to refresh token');
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates (displayName, photoURL)
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    await updateProfile(user, updates);

    // Update local storage
    const userData = getCurrentUserData();
    if (userData) {
      if (updates.displayName) userData.name = updates.displayName;
      if (updates.photoURL) userData.profilePicture = updates.photoURL;
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error('Failed to update profile');
  }
};

/**
 * Re-send verification email
 * @returns {Promise<Object>} Success message
 */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email already verified'
      };
    }

    await sendEmailVerification(user);
    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    
    let errorMessage = 'Failed to send verification email';
    
    if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Check if current user's email is verified
 * @returns {boolean} Email verification status
 */
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

// Export all functions as default object
export default {
  registerWithFirebase,
  loginWithFirebase,
  loginWithGoogle,
  logoutFirebase,
  resetPassword,
  getCurrentUser,
  getCurrentUserData,
  getAuthToken,
  isAuthenticated,
  onAuthChange,
  refreshUserToken,
  updateUserProfile,
  resendVerificationEmail,
  isEmailVerified
};
