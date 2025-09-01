import { useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { UserService } from "../../../services/user";
import useUser from "../../../hooks/useUser";

import { type UserProps } from "../../../contexts/UserContext";

interface FormEditUserProps {
  editingUser: UserProps;
  onClose: () => void;
  //   onUserUpdated: () => void; // Callback to refresh user list
}

export default function FormEditUser({
  editingUser,
  onClose,
}: //   onUserUpdated,
FormEditUserProps) {
  const { users, setUsers, permissionsList } = useUser();
  const [formData, setFormData] = useState<UserProps>({
    id: editingUser?.id || "",
    name: editingUser?.name || "",
    email: editingUser?.email || "",
    role: editingUser?.role || "staff",
    permissions: editingUser?.permissions || [],
    isActive: editingUser?.isActive ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const userService = new UserService();

  const handleInputChange = (field: keyof UserProps, value: any) => {
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

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Por favor, insira um nome.");
      return;
    }
    if (!formData.role) {
      setError("Por favor, selecione uma função.");
      return;
    }

    try {
      await userService.updateUser(formData);
      const newUsers = users.filter((user) => user.id !== formData.id);
      if (setUsers) {
        setUsers([...newUsers, formData]);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar usuário"
      );
    }
  };

  return (
    <Grid container sx={{ pt: 1, gap: 2 }}>
      {error && (
        <Grid>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Grid>
        <TextField
          fullWidth
          label="Nome"
          value={formData?.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />
      </Grid>

      <Grid>
        <TextField
          fullWidth
          select
          label="Função"
          value={formData?.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
          required
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="staff">Equipe</MenuItem>
          <MenuItem value="viewer">Visualizador</MenuItem>
        </TextField>
      </Grid>
      <Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData?.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              color="primary"
            />
          }
          label="Usuário Ativo (pode fazer login)"
          sx={{
            "& .MuiCheckbox-root": {
              color: "primary.main",
            },
            "& .Mui-checked": {
              color: "primary.main",
            },
            "& .MuiFormControlLabel-label": {
              fontSize: "0.875rem",
              fontWeight: 500,
            },
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="subtitle2" gutterBottom>
          Permissões
        </Typography>
        <Grid container>
          {permissionsList.map((permission) => (
            <Grid key={permission?.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.includes(permission?.id)}
                    onChange={(e) =>
                      handlePermissionChange(permission?.id, e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={permission?.label}
                sx={{
                  "& .MuiCheckbox-root": {
                    color: "primary.main",
                  },
                  "& .Mui-checked": {
                    color: "primary.main",
                  },
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
