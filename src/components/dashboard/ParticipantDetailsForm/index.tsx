import { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  MenuItem,
  Dialog,
  DialogContentText,
} from "@mui/material";
import { DashboardService } from "../../../services/dashboard";
import { CheckoutService } from "../../../services/checkout";
import { type EnhancedParticipant } from "../ParticipantList";
import styles from "./participantCard.module.css";
import useCheckout from "../../../hooks/useCheckout";

// Types
interface ParticipantFormData {
  name: string;
  document: string;
  email: string;
  phone: string;
}

interface CheckoutFormData {
  status: string;
  paymentMethod: string;
  totalAmount: number;
}

interface FormData {
  participant: ParticipantFormData;
  checkout: CheckoutFormData;
}

interface ParticipantDetailsFormProps {
  participant: EnhancedParticipant;
  onClose: () => void;
}

// Constants
const PAYMENT_STATUS_OPTIONS = [
  { value: "approved", label: "Aprovado" },
  { value: "pending", label: "Pendente" },
  { value: "rejected", label: "Rejeitado" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "pix", label: "PIX" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "boleto", label: "Boleto" },
];

export default function ParticipantDetailsForm({
  participant,
  onClose,
}: ParticipantDetailsFormProps) {
  const { fetchData } = useCheckout();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dashboardService = new DashboardService();
  const checkoutService = new CheckoutService();

  const initialFormData: FormData = {
    participant: {
      name: participant?.name || "",
      document: participant?.document || "",
      email: participant?.email || "",
      phone: participant?.phone || "",
    },
    checkout: {
      status: participant.checkout?.status || "pending",
      paymentMethod: participant.checkout?.paymentMethod || "pix",
      totalAmount: participant.checkout?.totalAmount || 0,
    },
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    if (!formData.participant.name.trim()) {
      setError("Por favor, insira um nome.");
      return false;
    }

    if (!formData.participant.email) {
      setError("Por favor, insira um e-mail.");
      return false;
    }

    if (!validateEmail(formData.participant.email)) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }

    if (!formData.checkout.status) {
      setError("Por favor, selecione um status.");
      return false;
    }

    if (!formData.checkout.paymentMethod) {
      setError("Por favor, selecione um método de pagamento.");
      return false;
    }

    if (formData.checkout.totalAmount < 0) {
      setError("O valor total não pode ser negativo.");
      return false;
    }

    return true;
  };

  // Change detection
  const hasParticipantChanged = (): boolean => {
    return (
      formData.participant.name !== initialFormData.participant.name ||
      formData.participant.email !== initialFormData.participant.email ||
      formData.participant.phone !== initialFormData.participant.phone ||
      formData.participant.document !== initialFormData.participant.document
    );
  };

  const hasCheckoutChanged = (): boolean => {
    return (
      formData.checkout.status !== initialFormData.checkout.status ||
      formData.checkout.paymentMethod !==
        initialFormData.checkout.paymentMethod ||
      formData.checkout.totalAmount !== initialFormData.checkout.totalAmount
    );
  };

  const prepareUpdateData = () => {
    const participantChanged = hasParticipantChanged();
    const checkoutChanged = hasCheckoutChanged();

    let repo: "participant" | "checkout" | "both";
    if (participantChanged && checkoutChanged) {
      repo = "both";
    } else if (participantChanged) {
      repo = "participant";
    } else if (checkoutChanged) {
      repo = "checkout";
    } else {
      return null;
    }

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

    return { updateData, repo };
  };

  // Event handlers
  const handleInputChange = (
    section: "participant" | "checkout",
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialogOpen(false);
      await checkoutService.deleteCheckout(participant.checkoutId);
      await fetchData();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar checkout");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const updateData = prepareUpdateData();
    if (!updateData) {
      setError("Nenhum campo foi alterado.");
      return;
    }

    try {
      await dashboardService.updateCheckoutAndParticipant(
        participant.id!,
        updateData.updateData,
        updateData.repo
      );

      await fetchData();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar dados");
    }
  };

  // Render helpers
  const renderParticipantFields = () => (
    <>
      <TextField
        fullWidth
        label="Nome"
        value={formData.participant.name}
        onChange={(e) =>
          handleInputChange("participant", "name", e.target.value)
        }
        required
      />

      <TextField
        fullWidth
        label="Documento"
        value={formData.participant.document}
        onChange={(e) =>
          handleInputChange("participant", "document", e.target.value)
        }
        required
      />

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

      <TextField
        fullWidth
        label="Telefone"
        value={formData.participant.phone}
        onChange={(e) =>
          handleInputChange("participant", "phone", e.target.value)
        }
      />
    </>
  );

  const renderCheckoutFields = () => (
    <>
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
        {PAYMENT_STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Método de Pagamento"
        value={formData.checkout.paymentMethod}
        onChange={(e) =>
          handleInputChange("checkout", "paymentMethod", e.target.value)
        }
        required
      >
        {PAYMENT_METHOD_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Valor Total (R$)"
        type="number"
        value={formData.checkout.totalAmount}
        onChange={(e) =>
          handleInputChange("checkout", "totalAmount", Number(e.target.value))
        }
        inputProps={{ min: 0, step: 0.01 }}
      />
    </>
  );

  const renderFixedInfo = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Informações Fixas do Checkout
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ID: {participant.checkout?.id}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Desconto: R${" "}
          {participant.checkout?.discountAmount?.toFixed(2) || "0,00"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Cupom: {participant.checkout?.couponCode || "Não fornecido"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Valor Original: R${" "}
          {participant.checkout?.originalAmount?.toFixed(2) || "0,00"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Cortesia:
          {participant.checkout?.metadata?.courtesy ? "Sim" : "Não"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Mercado Pago ID: {participant.checkout?.mercadoPagoId || "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Preference ID:{" "}
          {participant.checkout?.mercadoPagoPreferenceId || "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Pagador: {participant.checkout?.payer?.name} (
          {participant.checkout?.payer?.document})
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Criado em:{" "}
          {participant.checkout?.createdAt
            ? new Date(participant.checkout.createdAt).toLocaleString()
            : "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Atualizado em:{" "}
          {participant.checkout?.updatedAt
            ? new Date(participant.checkout.updatedAt).toLocaleString()
            : "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Vendido por: {participant.checkout?.metadata?.processedBy || "N/A"}
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Informações Fixas do Participante
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
            Criado em: {new Date(participant.createdAt).toLocaleString()}
          </Typography>
        )}
        {participant.updatedAt && (
          <Typography variant="body2" color="textSecondary">
            Atualizado em: {new Date(participant.updatedAt).toLocaleString()}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          Checkout ID: {participant.checkoutId}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <DialogTitle>Detalhes do Participante</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {participant?.checkout?.metadata?.manualPayment && (
          <Alert severity="info" sx={{ mb: 2 }}>
            PDV: {participant?.checkout?.metadata?.processedBy}
          </Alert>
        )}

        <Box
          sx={{
            pt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          className={styles.cardContent}
        >
          <Typography variant="h6" gutterBottom>
            Dados do Participante
          </Typography>
          {renderParticipantFields()}

          {participant.checkout && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Dados do Pagamento
              </Typography>
              {renderCheckoutFields()}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Informações Adicionais
              </Typography>
              {renderFixedInfo()}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {participant.checkout && (
          <Button variant="contained" color="error" onClick={handleDeleteClick}>
            Deletar Checkout
          </Button>
        )}
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja deletar este checkout? Esta ação não pode ser
            desfeita. Todos os dados de pagamento deste participante serão
            permanentemente removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Sim, deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
