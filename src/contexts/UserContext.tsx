import { useState, createContext, useEffect } from "react";
import { UserService } from "../services/user";

export interface UserProps {
  id?: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "viewer";
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

interface UserContextType {
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  users: UserProps[] | [];
  setUsers: React.Dispatch<React.SetStateAction<[] | UserProps[]>> | null;
  permissionsList: PermissionsList[] | [];
  setPermissionsList: React.Dispatch<
    React.SetStateAction<[] | PermissionsList[]>
  > | null;
}

interface PermissionsList {
  id: string;
  label: string;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

const userService = new UserService();

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [users, setUsers] = useState<UserProps[] | []>([]);
  const [permissionsList, setPermissionsList] = useState<
    PermissionsList[] | []
  >([
    { id: "view_dashboard", label: "Visualizar Dashboard" },
    { id: "create_checkout", label: "Criar Checkouts" },
    { id: "manage_credentials", label: "Gerenciar Credenciamento" },
    { id: "manage_users", label: "Gerenciar Usuários" },
    { id: "view_stats_cards", label: "Metricas" },
    { id: "details_checkout", label: "Detalhes do checkout" },
    { id: "manage_coupons", label: "Gestão de Cupons" },
  ]);

  useEffect(() => {
    async function getUsers() {
      try {
        const users = await userService.getUsers();

        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    }

    getUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        permissionsList,
        setPermissionsList,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
