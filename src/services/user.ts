import { config } from "../config";
import { type UserProps } from "../contexts/UserContext";

export class UserService {
  async getUsers(): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar checkout manual");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(userData: UserProps, password: string): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar usuário");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(userData: UserProps): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao editar usuário");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}
