import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { CheckCircle, Cancel, ExpandMore } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import type { UserProps } from "../../../contexts/UserContext";
import { UserService } from "../../../services/user";

export default function AdmUserTransfers({
  users,
  handleUpdate,
}: {
  users: UserProps[];
  handleUpdate: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [totalPending, setTotalPending] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalValueSold, setTotalValueSold] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Calcula totais gerais
  useEffect(() => {
    const pending = users.reduce((acc, user) => {
      const userPending = user.transfers
        ? user.transfers
            .filter((t) => t.status === "sent")
            .reduce((sum, t) => sum + t.value, 0)
        : 0;
      return acc + userPending;
    }, 0);

    const accepted = users.reduce((acc, user) => {
      const userAccepted = user.transfers
        ? user.transfers
            .filter((t) => t.status === "accepted")
            .reduce((sum, t) => sum + t.value, 0)
        : 0;
      return acc + userAccepted;
    }, 0);

    const valueSold = users
      .filter((user) => user?.valueSold && user?.valueSold > 0)
      .reduce((sum, t) => (t.valueSold ? sum + t.valueSold : 0), 0);

    setTotalPending(pending);
    setTotalAccepted(accepted);
    setTotalValueSold(valueSold);
  }, [users]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      console.log(event.timeStamp);
    };

  const handleUpdateStatus = async (
    user: UserProps,
    transferId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    setLoading(true);
    try {
      const updatedTransfers =
        user.transfers?.map((transfer) =>
          transfer.id === transferId
            ? {
                ...transfer,
                status: newStatus,
                createdAt: new Date(transfer.createdAt),
              }
            : { ...transfer, createdAt: new Date(transfer.createdAt) }
        ) || [];

      const updatedUser: UserProps = {
        ...user,
        name: user.name!,
        email: user.email!,
        role: user.role!,
        permissions: user.permissions!,
        isActive: user.isActive!,

        transfers: updatedTransfers,
      };

      const userService = new UserService();
      await userService.updateUser(updatedUser);
      toast.success(
        `Repasse ${
          newStatus === "accepted" ? "aceito" : "rejeitado"
        } com sucesso!`
      );
      handleUpdate();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      showSnackbar(`Erro ao atualizar repasse: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#fff", mb: 2, borderRadius: 1 }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CheckCircle sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Gestão de Repasses</Typography>
        </Box>
        <Button onClick={handleUpdate}>Atualizar</Button>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Resumo Geral de Todos os PDVs
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Total Vendido:
            </Typography>
            <Chip
              label={`R$ ${totalValueSold.toFixed(2)}`}
              color="warning"
              sx={{ fontWeight: "bold", width: "fit-content" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Repassado (Aceito):
            </Typography>
            <Chip
              label={`R$ ${totalAccepted.toFixed(2)}`}
              color="success"
              sx={{ fontWeight: "bold", width: "fit-content" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Falta receber:
            </Typography>
            <Chip
              label={`R$ ${(totalValueSold - totalAccepted).toFixed(2)}`}
              color="info"
              sx={{ fontWeight: "bold", width: "fit-content" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Solicitações Pendentes:
            </Typography>
            <Chip
              label={`R$ ${totalPending.toFixed(2)}`}
              color="secondary"
              sx={{ fontWeight: "bold", width: "fit-content" }}
            />
          </Box>
        </Box>
      </Paper>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ bgcolor: "grey.100" }}
        >
          <Typography variant="h6" sx={{ width: "33%", flexShrink: 0 }}>
            Detalhes por PDV
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Clique para ver detalhes de cada PDV
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {users.length === 0 ? (
            <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
              Nenhum PDV encontrado.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {users
                .filter(
                  (user) => user.transfers?.length && user.transfers?.length > 0
                )
                .map((user) => {
                  const sold = user.valueSold ?? 0;
                  const accepted = user.transfers
                    ? user.transfers
                        .filter((t) => t.status === "accepted")
                        .reduce((sum, t) => sum + t.value, 0)
                    : 0;
                  const pending = user.transfers
                    ? user.transfers
                        .filter((t) => t.status === "sent")
                        .reduce((sum, t) => sum + t.value, 0)
                    : 0;
                  const remaining = sold - accepted;

                  return (
                    <Paper
                      key={user.id}
                      sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight="medium">
                          {user.name} ({user.email})
                        </Typography>
                        <Chip
                          label={`Vendido: R$ ${sold.toFixed(2)}`}
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>

                      <Box
                        sx={{
                          mb: 3,
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Repassado:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            R$ {accepted.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Pendente:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            R$ {pending.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Falta Repassar:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            R$ {remaining.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Repasses Pendentes:
                      </Typography>

                      <List>
                        {user.transfers
                          ?.filter((transfer) => transfer.status === "sent")
                          .map((transfer) => (
                            <ListItem
                              key={transfer.id}
                              divider
                              sx={{ py: 1.5 }}
                            >
                              <ListItemText
                                primary={`Repasse: R$ ${transfer.value.toFixed(
                                  2
                                )}`}
                                secondary={`Data: ${new Date(
                                  transfer.createdAt
                                ).toLocaleDateString("pt-BR")}`}
                                primaryTypographyProps={{
                                  fontWeight: "medium",
                                }}
                              />
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<CheckCircle />}
                                  onClick={() =>
                                    handleUpdateStatus(
                                      user,
                                      transfer.id,
                                      "accepted"
                                    )
                                  }
                                  disabled={loading}
                                  size="small"
                                  sx={{ minWidth: 100 }}
                                >
                                  Aceitar
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<Cancel />}
                                  color="error"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      user,
                                      transfer.id,
                                      "rejected"
                                    )
                                  }
                                  disabled={loading}
                                  size="small"
                                  sx={{ minWidth: 100 }}
                                >
                                  Rejeitar
                                </Button>
                              </Box>
                            </ListItem>
                          ))}
                      </List>
                    </Paper>
                  );
                })}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
