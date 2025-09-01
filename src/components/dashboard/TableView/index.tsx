import styles from "./tableView.module.css";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from "@mui/material";

import { type EnhancedParticipant } from "../ParticipantList";

export default function TableView({
  participants,
}: {
  participants: EnhancedParticipant[];
}) {
  const getPaymentMethodLabel = (method?: string | null) => {
    const labels: { [key: string]: string } = {
      pix: "PIX",
      credit_card: "Cartão",
      boleto: "Boleto",
    };
    return labels[method || ""] || method || "N/A";
  };

  return (
    <Paper elevation={1} className={styles.tablePaper}>
      <Table>
        <TableHead>
          <TableRow className={styles.tableHeader}>
            <TableCell>Nome</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Pagamento</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id} className={styles.tableRow}>
              <TableCell>
                <Typography variant="subtitle2">{participant.name}</Typography>
              </TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>{participant.document}</TableCell>
              <TableCell>
                <Chip
                  label={`R$ ${
                    participant.checkout?.totalAmount?.toFixed(2) || "0,00"
                  }`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={participant.checkout?.status || "N/A"}
                  size="small"
                  color={
                    participant.checkout?.status === "approved"
                      ? "success"
                      : participant.checkout?.status === "pending"
                      ? "warning"
                      : "default"
                  }
                />
              </TableCell>
              <TableCell>
                {getPaymentMethodLabel(participant.checkout?.paymentMethod)}
              </TableCell>
              <TableCell>
                <Chip
                  label={participant.checkedIn ? "✓" : "✗"}
                  color={participant.checkedIn ? "success" : "error"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {participant.checkout?.createdAt
                  ? new Date(
                      participant.checkout.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
