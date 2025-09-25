import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { PointOfSale, Add, Remove, Delete } from "@mui/icons-material";
import { CheckoutService } from "../../../services/checkout";
import useCheckout from "../../../hooks/useCheckout";
import useUser from "../../../hooks/useUser";
import { config } from "../../../config";
import { ToastContainer, toast } from "react-toastify";
import UserTransfers from "../UserTransfers";
import ParticipantList from "../ParticipantList";

export interface Participant {
  name: string;
  email: string;
  phone: string;
  document: string;
  ticketType: "all";
}

const TICKET_PRICE = 499;

function ManualCheckout() {
  const { fetchData } = useCheckout();
  const { user } = useUser();
  const [totalTickets, setTotalTickets] = useState(1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant>({
    name: "",
    email: "",
    phone: "",
    document: "",
    ticketType: "all",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    | "pix"
    | "credit_card"
    | "boleto"
    | "debit_card"
    | "cash"
    | "transfer"
    | "other"
  >("credit_card");
  const [installments, setInstallments] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState({});
  const [discountTypeCoupon, setDiscountTypeCoupon] = useState<
    "fixed" | "percentage"
  >("fixed");
  const [discountValueCoupon, setDiscountValueCoupon] = useState(0);

  const subtotal = totalTickets * TICKET_PRICE;
  const hasCoupon = Object.keys(coupon).length > 0;
  const discountAmount = hasCoupon
    ? discountTypeCoupon === "fixed"
      ? discountValueCoupon * totalTickets
      : subtotal * (discountValueCoupon / 100)
    : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleTicketChange = (value: number) => {
    const newValue = Math.max(1, Math.min(50, value));
    setTotalTickets(Math.max(participants.length, newValue));
  };

  const handleIncrement = () => {
    handleTicketChange(totalTickets + 1);
  };

  const handleDecrement = () => {
    handleTicketChange(totalTickets - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleTicketChange(value);
  };

  const handleParticipantChange = (field: keyof Participant, value: string) => {
    setCurrentParticipant({
      ...currentParticipant,
      [field]: value,
    });
  };

  const handleAddParticipant = () => {
    if (
      currentParticipant.name &&
      currentParticipant.email &&
      currentParticipant.phone &&
      currentParticipant.document
    ) {
      setParticipants([...participants, currentParticipant]);
      setCurrentParticipant({
        name: "",
        email: "",
        phone: "",
        document: "",
        ticketType: "all",
      });
    } else {
      showSnackbar("Preencha todos os dados do participante", "error");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    setTotalTickets(Math.max(1, newParticipants.length));
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const handleClearCoupon = () => {
    setCouponCode("");
    setCoupon({});
    setDiscountTypeCoupon("fixed");
    setDiscountValueCoupon(0);
    toast.info("Cupom removido");
  };

  const handleApplyCoupon = async (
    code: string = couponCode,
    silent = false
  ) => {
    try {
      // const codeLowerCase = code.toLowerCase();
      const response = await fetch(`${config.baseUrl}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (!silent) toast.error(errorData.error || "Erro ao validar cupom");
        return;
      }

      const data = await response.json();
      setCoupon(data.coupon);
      setDiscountTypeCoupon(data.coupon.discountType);
      setDiscountValueCoupon(data.coupon.discountValue);
      if (!silent) toast.success(`Cupom ${code} aplicado com sucesso`);
    } catch (error) {
      console.log(error);
      if (!silent) toast.error("Erro ao conectar com o servidor");
    }
  };

  const handleSubmit = async () => {
    if (participants.length !== totalTickets) {
      showSnackbar(
        `Adicione informações para todos os ${totalTickets} participantes`,
        "error"
      );
      return;
    }

    if (paymentMethod === "credit_card" && installments < 1) {
      showSnackbar("Selecione o número de parcelas", "error");
      return;
    }

    setSubmitting(true);

    try {
      const checkoutData = {
        participants: participants.map((participant) => ({
          name: participant.name,
          email: participant.email,
          phone: participant.phone,
          document: participant.document,
          ticketType: "all" as const,
        })),
        checkout: {
          fullTickets: totalTickets,
          halfTickets: 0,
          paymentMethod: paymentMethod,
          installments: paymentMethod === "credit_card" ? installments : 1,
          totalAmount: totalAmount,
          couponCode: couponCode || undefined,
          discountAmount: discountAmount || undefined,
          metadata: {
            eventId: "verano-talk-2025",
            manualPayment: true,
            processedBy: `${user?.name} - ${user?.email}`,
          },
        },
        userId: user?.id,
      };

      const checkoutService = new CheckoutService();
      const result = await checkoutService.createManualCheckout(checkoutData);

      console.log(result);
      showSnackbar(
        `Checkout criado com sucesso! ${totalTickets} ingresso(s) - R$ ${totalAmount.toFixed(
          2
        )}`,
        "success"
      );

      fetchData();
      setParticipants([]);
      setTotalTickets(1);
      setPaymentMethod("credit_card");
      setInstallments(1);
      setCouponCode("");
      setCoupon({});
      setDiscountTypeCoupon("fixed");
      setDiscountValueCoupon(0);
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Erro ao criar checkout. Tente novamente.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 0 }}>
      <ToastContainer />
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <PointOfSale sx={{ mr: 1 }} />
        <Typography variant="h5">Checkout Manual</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quantidade de Ingressos
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <IconButton
                onClick={handleDecrement}
                disabled={totalTickets <= participants.length}
                size="large"
              >
                <Remove />
              </IconButton>

              <TextField
                value={totalTickets}
                onChange={handleInputChange}
                inputProps={{
                  min: participants.length,
                  max: 50,
                  style: { textAlign: "center", width: 60 },
                }}
                variant="outlined"
                size="small"
                sx={{ mx: 2 }}
              />

              <IconButton
                onClick={handleIncrement}
                disabled={totalTickets >= 50}
                size="large"
              >
                <Add />
              </IconButton>

              <Typography variant="body1" sx={{ ml: 2 }}>
                × R$ 499,00 = R$ {subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cupom de Desconto
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  fullWidth
                  label="Código do Cupom"
                  value={couponCode}
                  onChange={handleCouponChange}
                  placeholder="Insira o código do cupom"
                />
                <Button
                  variant="outlined"
                  onClick={() => handleApplyCoupon()}
                  disabled={!couponCode}
                >
                  Aplicar
                </Button>
                {couponCode && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearCoupon}
                  >
                    Limpar
                  </Button>
                )}
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Informações dos Participantes ({participants.length}/
              {totalTickets})
            </Typography>

            {participants.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {participants.map((participant, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2">
                            {participant.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {participant.email} • {participant.phone}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveParticipant(index)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {participants.length < totalTickets && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Adicionar Participante {participants.length + 1}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Nome Completo*"
                    value={currentParticipant.name}
                    onChange={(e) =>
                      handleParticipantChange("name", e.target.value)
                    }
                    required
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="E-mail*"
                      type="email"
                      value={currentParticipant.email}
                      onChange={(e) =>
                        handleParticipantChange("email", e.target.value)
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label="Telefone*"
                      value={currentParticipant.phone}
                      onChange={(e) =>
                        handleParticipantChange("phone", e.target.value)
                      }
                      required
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="CPF*"
                    value={currentParticipant.document}
                    onChange={(e) =>
                      handleParticipantChange("document", e.target.value)
                    }
                    required
                  />

                  <Button
                    variant="contained"
                    onClick={handleAddParticipant}
                    disabled={
                      !currentParticipant.name ||
                      !currentParticipant.email ||
                      !currentParticipant.phone ||
                      !currentParticipant.document
                    }
                    sx={{ height: 48, "& .MuiInputBase-root": { height: 48 } }}
                  >
                    Adicionar Participante
                  </Button>
                </Box>
              </Paper>
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Ingressos:</Typography>
                <Typography>{totalTickets} × R$ 499,00</Typography>
              </Box>
              {discountAmount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Desconto:</Typography>
                  <Typography>- R$ {discountAmount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1">
                  R$ {totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Método de Pagamento
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Método</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                label="Método"
              >
                <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                <MenuItem value="debit_card">Cartão de Débito</MenuItem>
                <MenuItem value="pix">PIX</MenuItem>
                <MenuItem value="boleto">Boleto</MenuItem>
                <MenuItem value="cash">Dinheiro</MenuItem>
                <MenuItem value="transfer">Transferência</MenuItem>
                <MenuItem value="other">Outros</MenuItem>
              </Select>
            </FormControl>

            {paymentMethod === "credit_card" && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Parcelas</InputLabel>
                <Select
                  value={installments}
                  onChange={(e) =>
                    setInstallments(parseInt(`${e.target.value}`))
                  }
                  label="Parcelas"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}x {num > 1 ? "parcelas" : "parcela"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {paymentMethod === "credit_card" && installments > 1 && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {installments} parcelas de R${" "}
                {(totalAmount / installments).toFixed(2)}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={submitting || participants.length !== totalTickets}
              startIcon={submitting ? <></> : <PointOfSale />}
            >
              {submitting ? (
                <>Processando...</>
              ) : (
                <>Criar Checkout - R$ {totalAmount.toFixed(2)}</>
              )}
            </Button>
          </Paper>
        </Box>
      </Box>

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

      <UserTransfers />

      <ParticipantList filtersPDVs={`${user?.name} - ${user?.email}`} />
    </Box>
  );
}

export default ManualCheckout;
