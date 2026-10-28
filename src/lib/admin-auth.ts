import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function isAdminSignedIn(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (auth.currentUser) return true;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 5000);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(!!user);
    });
  });
}

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    return true;
  } catch {
    return false;
  }
}

export async function signOutAdmin() {
  await signOut(auth);
}
