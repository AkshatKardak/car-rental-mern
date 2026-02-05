import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

// Google Sign-In with REDIRECT (instead of popup)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // Add custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Use redirect instead of popup
    await signInWithRedirect(auth, provider);

    // Note: The result will be handled by getRedirectResult on page load
    return { success: true, message: 'Redirecting to Google...' };

  } catch (error) {
    console.error('Google login error:', error);
    throw {
      success: false,
      message: error.message || 'Google login failed'
    };
  }
};

// Handle redirect result (call this on app initialization)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);

    if (!result) {
      // No redirect result (user didn't come from OAuth redirect)
      return null;
    }

    const user = result.user;
    const idToken = await user.getIdToken();

    // Send to backend
    const response = await axios.post(`${API_URL}/auth/firebase-google`, {
      idToken,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });

    if (response.data.success) {
      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    }

    throw new Error('Backend authentication failed');

  } catch (error) {
    console.error('Redirect result error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Regular email/password login
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      idToken
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    }

    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    console.error('Email login error:', error);
    let errorMessage = 'Login failed';

    if (error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password. Please check your credentials or sign up if you haven\'t already.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }

    throw {
      success: false,
      message: errorMessage
    };
  }
};

// Sign up with email/password
export const signupWithEmail = async (name, email, password, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      phone,
      idToken
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    }

    throw new Error(response.data.message || 'Registration failed');
  } catch (error) {
    console.error('Email signup error:', error);
    throw {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw {
      success: false,
      message: error.message || 'Sign out failed'
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};
