import { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
  MenuItem,
} from "@mui/material";
import { DashboardService } from "../../../services/dashboard";
import { CheckoutService } from "../../../services/checkout";
import { type EnhancedParticipant } from "../ParticipantList";
import styles from "./participantCard.module.css";
import useCheckout from "../../../hooks/useCheckout";

interface FormData {
  participant: {
    name: string;
    document: string;
    email: string;
    phone: string;
  };
  checkout: {
    status: string;
    paymentMethod: string;
    totalAmount: number;
  };
}

interface ParticipantDetailsFormProps {
  participant: EnhancedParticipant;
  onClose: () => void;
}

export default function ParticipantDetailsForm({
  participant,
  onClose,
}: ParticipantDetailsFormProps) {
  const { fetchData } = useCheckout();
  const initialFormData: FormData = {
    participant: {
      name: participant?.name,
      document: participant?.document,
      email: participant?.email,
      phone: participant?.phone || "",
    },
    checkout: {
      status: participant.checkout?.status || "pending",
      paymentMethod: participant.checkout?.paymentMethod || "pix",
      totalAmount: participant.checkout?.totalAmount || 0,
    },
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const dashboardService = new DashboardService();
  const checkoutService = new CheckoutService();

  const handleInputChange = (
    section: "participant" | "checkout",
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleDelete = async () => {
    try {
      await checkoutService.deleteCheckout(participant.checkoutId);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar dados");
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.participant.email ||
      !/\S+@\S+\.\S+/.test(formData.participant.email)
    ) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    if (!formData.participant.name.trim()) {
      setError("Por favor, insira um nome.");
      return;
    }

    if (!formData.checkout.status) {
      setError("Por favor, selecione um status.");
      return;
    }
    if (!formData.checkout.paymentMethod) {
      setError("Por favor, selecione um método de pagamento.");
      return;
    }

    if (formData.checkout.totalAmount < 0) {
      setError("O valor total não pode ser negativo.");
      return;
    }

    try {
      const participantChanged =
        formData.participant.name !== initialFormData.participant.name ||
        formData.participant.email !== initialFormData.participant.email ||
        formData.participant.phone !== initialFormData.participant.phone ||
        formData.participant.document !== initialFormData.participant.document;

      const checkoutChanged =
        formData.checkout.status !== initialFormData.checkout.status ||
        formData.checkout.paymentMethod !==
          initialFormData.checkout.paymentMethod ||
        formData.checkout.totalAmount !== initialFormData.checkout.totalAmount;

      let repo: "participant" | "checkout" | "both";
      if (participantChanged && checkoutChanged) {
        repo = "both";
      } else if (participantChanged) {
        repo = "participant";
      } else if (checkoutChanged) {
        repo = "checkout";
      } else {
        setError("Nenhum campo foi alterado.");
        return;
      }

      // Enviar apenas os campos alterados
      const updateData: { [key: string]: any } = {};
      if (participantChanged) {
        updateData.name = formData.participant.name;
        updateData.email = formData.participant.email;
        updateData.phone = formData.participant.phone;
      }
      if (checkoutChanged) {
        updateData.status = formData.checkout.status;
        updateData.paymentMethod = formData.checkout.paymentMethod;
        updateData.totalAmount = formData.checkout.totalAmount;
      }

      await dashboardService.updateCheckoutAndParticipant(
        participant.id!,
        updateData,
        repo
      );

      fetchData();

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar dados");
    }
  };

  return (
    <>
      <DialogTitle>Detalhes do Participante</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {participant?.checkout?.metadata?.manualPayment && (
          <Grid sx={{ pb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              PDV: {participant?.checkout?.metadata?.processedBy}
            </Typography>
          </Grid>
        )}
        <Grid container sx={{ pt: 1, gap: 2 }} className={styles.cardContent}>
          <Grid>
            <TextField
              fullWidth
              label="Nome"
              value={formData.participant.name}
              onChange={(e) =>
                handleInputChange("participant", "name", e.target.value)
              }
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Documento"
              value={formData.participant.document}
              onChange={(e) =>
                handleInputChange("participant", "document", e.target.value)
              }
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={formData.participant.email}
              onChange={(e) =>
                handleInputChange("participant", "email", e.target.value)
              }
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Telefone"
              value={formData.participant.phone}
              onChange={(e) =>
                handleInputChange("participant", "phone", e.target.value)
              }
            />
          </Grid>

          {participant.checkout && (
            <>
              <Grid>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.checkout.status}
                  onChange={(e) =>
                    handleInputChange("checkout", "status", e.target.value)
                  }
                  required
                >
                  <MenuItem value="approved">Aprovado</MenuItem>
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="rejected">Rejeitado</MenuItem>
                </TextField>
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  select
                  label="Método de Pagamento"
                  value={formData.checkout.paymentMethod}
                  onChange={(e) =>
                    handleInputChange(
                      "checkout",
                      "paymentMethod",
                      e.target.value
                    )
                  }
                  required
                >
                  <MenuItem value="pix">PIX</MenuItem>
                  <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                  <MenuItem value="boleto">Boleto</MenuItem>
                </TextField>
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Valor Total (R$)"
                  type="number"
                  value={formData.checkout.totalAmount}
                  onChange={(e) =>
                    handleInputChange(
                      "checkout",
                      "totalAmount",
                      Number(e.target.value)
                    )
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Informações Fixas do Checkout
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: {participant.checkout.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Desconto: R$
                  {participant.checkout.discountAmount?.toFixed(2) || "0,00"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Cupom:
                  {participant.checkout.couponCode || " Não fornecido"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Valor Original: R$
                  {participant.checkout.originalAmount?.toFixed(2) || "0,00"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Mercado Pago ID: {participant.checkout.mercadoPagoId || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Preference ID:{" "}
                  {participant.checkout.mercadoPagoPreferenceId || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pagador: {participant.checkout?.payer?.name} (
                  {participant.checkout?.payer?.document})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Criado em:{" "}
                  {new Date(participant.checkout.createdAt!).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Atualizado em:{" "}
                  {new Date(participant.checkout.updatedAt!).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Vendido por:{" "}
                  {participant.checkout.metadata?.processedBy || "N/A"}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Informações Fixas do participante
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: {participant.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Check-in: {participant.checkedIn ? "Sim" : "Não"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  QR Code: {participant.qrCode}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Evento ID: {participant.eventId}
                </Typography>
                {participant.createdAt && (
                  <Typography variant="body2" color="textSecondary">
                    Criado em:{" "}
                    {new Date(participant.createdAt).toLocaleString()}
                  </Typography>
                )}
                {participant.updatedAt && (
                  <Typography variant="body2" color="textSecondary">
                    Atualizado em:{" "}
                    {new Date(participant.updatedAt).toLocaleString()}
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  Checkout ID: {participant.checkoutId}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Deletar Checkout
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </>
  );
}
