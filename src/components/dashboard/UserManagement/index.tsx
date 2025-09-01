import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
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
} from "@mui/material";
import { People, Add, Edit, Check, Close } from "@mui/icons-material";
import useUser from "../../../hooks/useUser";
import FormNewUser from "../FormNewUser";
import FormEditUser from "../FormEditUser";

function UserManagement() {
  const { users, permissionsList } = useUser();
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setOpenDialog("edit");
  };

  const handleNewUser = () => {
    setOpenDialog("create");
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
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
        <Button variant="contained" startIcon={<Add />} onClick={handleNewUser}>
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
              <TableCell>Ativo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user?.email}>
                <TableCell>{user?.name}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      user?.role === "admin"
                        ? "Administrador"
                        : user?.role === "staff"
                        ? "Equipe"
                        : "Visualizador"
                    }
                    color={user?.role === "admin" ? "primary" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {user.permissions.map((perm: string) => (
                      <Chip
                        key={perm}
                        label={
                          permissionsList.find((p) => p.id === perm)?.label ||
                          perm
                        }
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{user?.isActive ? <Check /> : <Close />}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditUser(user)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog !== null}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {openDialog === "edit" ? "Editar Usuário" : "Novo Usuário"}
        </DialogTitle>
        <DialogContent>
          {openDialog === "create" ? (
            <FormNewUser onClose={handleCloseDialog} />
          ) : (
            <FormEditUser
              onClose={handleCloseDialog}
              editingUser={editingUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
