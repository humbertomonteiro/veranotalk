import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { config } from "../config";
import useUser from "../hooks/useUser";
import Loading from "../components/shared/Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch(
            `${config.baseUrl}/users/${firebaseUser.uid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Adiciona o token JWT
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Erro ao buscar dados do usuário"
            );
          }

          const userData = await response.json();
          setUser(userData); // Atualiza o estado do usuário
        } catch (err) {
          console.error("Erro ao buscar usuário:", err);
          setUser(null); // Limpa o usuário em caso de erro
        }
      } else {
        console.log("Nenhum usuário logado");
        setUser(null); // Limpa o usuário se não estiver logado
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]); // Adiciona setUser como dependência

  if (isLoading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
