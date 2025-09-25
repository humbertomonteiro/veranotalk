import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { PointOfSale, Refresh } from "@mui/icons-material";
import useUser from "../../../hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import type { UserProps } from "../../../contexts/UserContext";
import { UserService } from "../../../services/user";

export default function UserTransfers() {
  const { users, user, getUsers } = useUser();
  const userPdv = users.filter((u) => u.id === user?.id)[0];
  const [transfersSentValues, setTransfersSentValues] = useState(0);
  const [transfersAcceptedValues, setTransfersAcceptedValues] = useState(0);
  const [valueAvailable, setValueAvailable] = useState(0);
  const [valueTransfer, setValueTransfer] = useState<string>("0.00");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  if (!userPdv) return;

  // Calcula os valores de repasses e atualiza estados
  useEffect(() => {
    const sentValues = userPdv.transfers
      ? userPdv.transfers
          .filter((transfer) => transfer.status === "sent")
          .reduce((acc, transfer) => acc + transfer.value, 0)
      : 0;

    const acceptedValues = userPdv.transfers
      ? userPdv.transfers
          .filter((transfer) => transfer.status === "accepted")
          .reduce((acc, transfer) => acc + transfer.value, 0)
      : 0;

    // CORREÇÃO: O valor disponível deve ser vendas - (enviados + aceitos)
    const available = (userPdv.valueSold ?? 0) - acceptedValues;

    console.log("Cálculos:", {
      sold: userPdv.valueSold,
      sentValues,
      acceptedValues,
      available,
    });

    setTransfersSentValues(sentValues);
    setTransfersAcceptedValues(acceptedValues);
    setValueAvailable(available - sentValues);
    setValueTransfer(
      available - sentValues > 0 ? (available - sentValues).toFixed(2) : "0.00"
    );
  }, [userPdv]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const transferValue = Number(valueTransfer);

      if (transferValue <= 0) {
        toast.error("O valor do repasse deve ser maior que zero.");
        return;
      }

      if (transferValue > valueAvailable) {
        toast.error(
          `Valor do repasse deve ser menor ou igual ao disponível: R$ ${valueAvailable.toFixed(
            2
          )}`
        );
        return;
      }

      if (!user) {
        toast.error("Usuário não encontrado. Recarregue a página.");
        return;
      }

      const dataUserProps: UserProps = {
        ...user,
        name: user.name!,
        email: user.email!,
        role: user.role!,
        permissions: user.permissions!,
        isActive: user.isActive!,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: new Date(),
        transfers: [
          ...(user.transfers || []).map((t) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          })),
          {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            status: "sent" as const,
            value: transferValue,
          },
        ],
      };

      console.log("Enviando dados:", dataUserProps);

      const userService = new UserService();
      await userService.updateUser(dataUserProps);

      await getUsers();

      toast.success("Repasse enviado para aprovação!");

      setValueTransfer("0.00");
    } catch (error) {
      console.error("Erro ao enviar repasse:", error);
      toast.error(`Erro ao enviar repasse: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getUsers();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
      toast.error("Erro ao recarregar dados.");
    } finally {
      setRefreshing(false);
    }
  };

  // const showSnackbar = (message: string, severity: "success" | "error") => {
  //   setSnackbar({ open: true, message, severity });
  // };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
      <ToastContainer />
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <PointOfSale sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h5" fontWeight="bold">
          Caixa - PDV
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: 2,
          display: "flex",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "50%",
          }}
        >
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Resumo de Vendas e Repasses
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Valor de Vendas:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              R$ {(user?.valueSold ?? 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Repasses Confirmados:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              R$ {transfersAcceptedValues.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Repasses Pendentes:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              R$ {transfersSentValues.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Disponível para Repasse:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              R$ {valueAvailable.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ mt: 2, borderRadius: 1 }}
          >
            {refreshing ? "Atualizando..." : "Recarregar Dados"}
          </Button>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "50%",
          }}
        >
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Novo Repasse
          </Typography>
          <TextField
            fullWidth
            label="Valor do Repasse"
            type="number"
            value={valueTransfer}
            onChange={(e) => setValueTransfer(e.target.value)}
            placeholder="Digite o valor do repasse"
            required
            error={
              Number(valueTransfer) > valueAvailable ||
              Number(valueTransfer) <= 0
            }
            helperText={
              Number(valueTransfer) > valueAvailable
                ? `Máximo: R$ ${valueAvailable.toFixed(2)}`
                : Number(valueTransfer) <= 0
                ? "Valor deve ser maior que zero"
                : ""
            }
          />
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={
              submitting ||
              Number(valueTransfer) <= 0 ||
              Number(valueTransfer) > valueAvailable
            }
            startIcon={submitting ? <></> : <PointOfSale />}
            sx={{ borderRadius: 1 }}
          >
            {submitting ? "Enviando..." : "Fechar Caixa"}
          </Button>
        </Box>
      </Paper>

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
