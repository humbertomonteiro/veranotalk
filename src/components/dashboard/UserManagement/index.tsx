import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { People, Add, Edit, Delete } from "@mui/icons-material";

function UserManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Dados de exemplo
  const users = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@verano.com",
      role: "admin",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Credenciador",
      email: "credenciador@verano.com",
      role: "staff",
      permissions: ["manage_credentials"],
    },
  ];

  const permissionsList = [
    { id: "view_dashboard", label: "Visualizar Dashboard" },
    { id: "create_checkout", label: "Criar Checkouts" },
    { id: "manage_credentials", label: "Gerenciar Credenciamento" },
    { id: "manage_users", label: "Gerenciar Usuários" },
  ];

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <People sx={{ mr: 1 }} />
          <Typography variant="h5">Gestão de Usuários</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Permissões</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === "admin" ? "Administrador" : "Equipe"}
                    color={user.role === "admin" ? "primary" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {user.permissions.map((perm: string) => (
                      <Chip
                        key={perm}
                        label={perm === "all" ? "Todas permissões" : perm}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditUser(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Editar Usuário" : "Novo Usuário"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid>
              <TextField
                fullWidth
                label="Nome"
                defaultValue={editingUser?.name}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                defaultValue={editingUser?.email}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                select
                label="Função"
                defaultValue={editingUser?.role || "staff"}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="staff">Equipe</MenuItem>
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
                          defaultChecked={
                            editingUser?.permissions?.includes(permission.id) ||
                            editingUser?.permissions?.includes("all")
                          }
                        />
                      }
                      label={permission.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
