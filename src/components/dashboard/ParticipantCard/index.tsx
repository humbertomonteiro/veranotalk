import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
} from "@mui/material";
import styles from "./participantCard.module.css";
import { type EnhancedParticipant } from "../ParticipantList";
import ParticipantDetailsForm from "../ParticipantDetailsForm";
import useUser from "../../../hooks/useUser";

export default function ParticipantCard({
  participant,
}: {
  participant: EnhancedParticipant;
}) {
  const { user } = useUser();
  const [openDetails, setOpenDetails] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    const labels: { [key: string]: string } = {
      pix: "PIX",
      credit_card: "Cartão de Crédito",
      boleto: "Boleto",
    };
    return labels[method || ""] || method || "N/A";
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return (
    <>
      <Card className={styles.card} elevation={2} sx={{ p: 0 }}>
        <CardContent className={styles.cardContent}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.participantName}>
              {participant.name}
            </Typography>
            {user?.permissions.includes("details_checkout") && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenDetails}
              >
                Detalhes
              </Button>
            )}
          </Box>

          <Box className={styles.cardInfo}>
            <Typography variant="body2" color="textSecondary">
              📧 {participant.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              🆔 {participant.document}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              📞 {participant.phone || "Não informado"}
            </Typography>
          </Box>

          {participant.checkout && (
            <Box className={styles.checkoutInfo}>
              <Box className={styles.amountRow}>
                <Typography variant="subtitle2">
                  Valor: R${" "}
                  {participant.checkout.totalAmount?.toFixed(2) || "0,00"}
                </Typography>
                <Chip
                  label={participant.checkout.status || "N/A"}
                  color={getStatusColor(participant.checkout.status)}
                  size="small"
                />
              </Box>

              <Box className={styles.paymentRow}>
                <Typography variant="body2">
                  💳 {getPaymentMethodLabel(participant.checkout.paymentMethod)}
                </Typography>
                {participant.checkout.couponCode && (
                  <Chip
                    label={`Cupom: ${participant.checkout.couponCode}`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              {participant.checkout.createdAt && (
                <Typography variant="caption" color="textSecondary">
                  📅{" "}
                  {new Date(
                    participant.checkout.createdAt
                  ).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <ParticipantDetailsForm
          participant={participant}
          onClose={handleCloseDetails}
        />
      </Dialog>
    </>
  );
}
