import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { config } from '@/config';

let app: FirebaseApp | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!app && !getApps().length) {
    app = initializeApp(config.firebase);
  }
  return app || getApps()[0];
}

export const auth = getAuth(getFirebaseApp());

export const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  return signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export async function verifyResetCode(code: string): Promise<string> {
  return verifyPasswordResetCode(auth, code);
}

export async function resetPassword(code: string, newPassword: string): Promise<void> {
  return confirmPasswordReset(auth, code, newPassword);
}

export async function loginWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
