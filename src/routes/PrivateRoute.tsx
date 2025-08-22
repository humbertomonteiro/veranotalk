import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Loading from "../components/shared/Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("Verificando role para UID:", user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const role = userDoc.exists()
            ? userDoc.data().role || "none"
            : "none";
          console.log("Role:", role);
          setIsAuthorized(role === "admin");
        } catch (err) {
          console.error("Erro ao verificar role:", err);
          setIsAuthorized(false);
        }
      } else {
        console.log("Nenhum usuário logado");
        setIsAuthorized(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
