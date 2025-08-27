// // frontend/src/contexts/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
// import { auth } from "../config/firebaseConfig";
// import { getUserProfile } from "../services/auth";

// interface UserProfile {
//   uid: string;
//   email: string;
//   name: string;
//   role: string;
//   permissions: string[];
//   isActive: boolean;
// }

// interface AuthContextType {
//   user: FirebaseUser | null;
//   userProfile: UserProfile | null;
//   loading: boolean;
//   refreshUserProfile: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   userProfile: null,
//   loading: true,
//   refreshUserProfile: async () => {},
// });

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<FirebaseUser | null>(null);
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   const refreshUserProfile = async () => {
//     if (!user) {
//       setUserProfile(null);
//       return;
//     }

//     try {
//       const profile = await getUserProfile(user.uid);
//       setUserProfile(profile);
//     } catch (error) {
//       console.error("Erro ao carregar perfil:", error);
//       setUserProfile(null);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       setUser(firebaseUser);

//       if (firebaseUser) {
//         try {
//           const profile = await getUserProfile(firebaseUser.uid);
//           setUserProfile(profile);
//         } catch (error) {
//           console.error("Erro ao carregar perfil:", error);
//           setUserProfile(null);
//         }
//       } else {
//         setUserProfile(null);
//       }

//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, userProfile, loading, refreshUserProfile }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
