import styles from "./participantCard.module.css";
import {
  Card,
  CardContent,
  Typography,
  // Button,
  Box,
  Chip,
  // Tooltip,
} from "@mui/material";

// import { Info } from "@mui/icons-material";

import { type EnhancedParticipant } from "../ParticipantList";

export default function ParticipantCard({
  participant,
}: {
  participant: EnhancedParticipant;
}) {
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

  return (
    <Card className={styles.card} elevation={2}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.cardHeader}>
          <Typography variant="h6" className={styles.participantName}>
            {participant.name}
          </Typography>
          {/* <Chip
            label={participant.checkedIn ? "Check-in OK" : ""}
            color={participant.checkedIn ? "success" : "warning"}
            size="small"
          /> */}
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
                {new Date(participant.checkout.createdAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        )}

        {/* <Tooltip title={JSON.stringify(participant.checkout, null, 2)}>
          <Button
            size="small"
            startIcon={<Info />}
            className={styles.detailsButton}
          >
            Detalhes
          </Button>
        </Tooltip> */}
      </CardContent>
    </Card>
  );
}
