import { auth, db } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default class FirebaseAuth {
  async getCurrentUser() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            const role = await this.getUserRole(user.uid);
            resolve({ ...user, role });
          } else {
            resolve(null);
          }
        },
        reject
      );
    });
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const role = await this.getUserRole(userCredential.user.uid);
    return { ...userCredential.user, role };
  }

  async register(name: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      role: "user",
    });
    return { ...userCredential.user, role: "user" };
  }

  async logout() {
    await signOut(auth);
  }

  async getUserRole(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data().role || "none";
      }
      return "none";
    } catch (error) {
      console.error("Erro ao obter papel:", error);
      return "none";
    }
  }
}
