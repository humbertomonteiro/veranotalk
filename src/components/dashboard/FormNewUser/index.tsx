import { useState } from "react";
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { UserService } from "../../../services/user";

import { type UserProps } from "../../../contexts/UserContext";
import { toast } from "react-toastify";
import useUser from "../../../hooks/useUser";

interface FormNewUserProps {
  onClose: () => void;
}

export default function FormNewUser({ onClose }: FormNewUserProps) {
  const { users, setUsers, permissionsList } = useUser();
  const [formData, setFormData] = useState<UserProps>({
    email: "",
    name: "",
    role: "staff",
    permissions: [],
    isActive: true,
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const userService = new UserService();

  const handleInputChange = (
    field: keyof UserProps,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((perm) => perm !== permissionId);
      return { ...prev, permissions: newPermissions };
    });
  };

  const validateForm = (): boolean => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Por favor, insira um nome.");
      return false;
    }
    if (!formData.role) {
      setError("Por favor, selecione uma função.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    try {
      await userService.createUser(formData, password);
      if (setUsers) {
        setUsers([...users, formData]);
      }
      toast.success("Usuário criado com sucesso!");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar usuário");
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {error && (
        <Grid>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Grid>
        <TextField
          fullWidth
          label="Nome"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />
      </Grid>
      <Grid>
        <TextField
          fullWidth
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </Grid>
      <Grid>
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Grid>
      <Grid>
        <TextField
          fullWidth
          select
          label="Função"
          value={formData.role}
          onChange={(e) =>
            handleInputChange(
              "role",
              e.target.value as "admin" | "staff" | "viewer"
            )
          }
          required
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="staff">Equipe</MenuItem>
          <MenuItem value="viewer">Visualizador</MenuItem>
        </TextField>
      </Grid>
      <Grid>
        <Typography variant="subtitle2" gutterBottom>
          Permissões
        </Typography>
        <Grid container>
          {permissionsList.map((permission) => (
            <Grid key={permission.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) =>
                      handlePermissionChange(permission.id, e.target.checked)
                    }
                  />
                }
                label={permission.label}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Criar
        </Button>
      </Grid>
    </Grid>
  );
}
