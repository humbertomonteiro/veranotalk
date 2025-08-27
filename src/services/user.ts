// // frontend/src/services/dashboard.ts
// export class DashboardService {
//     // ... outros métodos existentes

//     async getUserProfile(uid: string): Promise<any> {
//       try {
//         const response = await fetch(`${this.baseUrl}/users/${uid}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${this.getAuthToken()}`
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Erro ao buscar perfil do usuário');
//         }

//         return await response.json();
//       } catch (error) {
//         console.error('Erro no getUserProfile:', error);
//         throw error;
//       }
//     }

//     async updateUserProfile(uid: string, updates: any): Promise<any> {
//       try {
//         const response = await fetch(`${this.baseUrl}/users/${uid}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${this.getAuthToken()}`
//           },
//           body: JSON.stringify(updates),
//         });

//         if (!response.ok) {
//           throw new Error('Erro ao atualizar perfil do usuário');
//         }

//         return await response.json();
//       } catch (error) {
//         console.error('Erro no updateUserProfile:', error);
//         throw error;
//       }
//     }

//     async getCurrentUserProfile(): Promise<any> {
//       try {
//         const response = await fetch(`${this.baseUrl}/users/me`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${this.getAuthToken()}`
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Erro ao buscar perfil do usuário atual');
//         }

//         return await response.json();
//       } catch (error) {
//         console.error('Erro no getCurrentUserProfile:', error);
//         throw error;
//       }
//     }
//   }
