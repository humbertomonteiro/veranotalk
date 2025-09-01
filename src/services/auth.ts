import { auth } from "../config/firebaseConfig";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { config } from "../config";

export default class FirebaseAuth {
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const response = await fetch(`${config.baseUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userCredential.user.uid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar checkout manual");
      }

      return await response.json();
    } catch (error) {
      console.log("error ao logar", error);
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: string,
    permissions: string[],
    isActive?: boolean
  ) {
    try {
      const response = await fetch(`${config.baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          permissions,
          isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar usuário");
      }

      return await response.json();
    } catch (error) {
      console.log("error ao logar", error);
    }
  }

  async logout() {
    await signOut(auth);
  }
}
