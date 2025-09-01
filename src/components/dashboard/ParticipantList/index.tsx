import { useState, useMemo } from "react";
import { type Participant, type Checkout } from "../../../services/dashboard";
import {
  Grid,
  Typography,
  Pagination,
  Box,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ViewModule, TableChart, Description } from "@mui/icons-material";
import Loading from "../../shared/Loading";
import styles from "./participantList.module.css";

import ParticipantCard from "../ParticipantCard";
import FiltersSection from "../FiltersSection";
import TableView from "../TableView";
import GenerateParticipantsPDF from "../GenerateParticipantsPDF";

import useCheckout from "../../../hooks/useCheckout";

// Tipo combinado para participante com todos os dados do checkout
export type EnhancedParticipant = Participant & {
  checkout?: Checkout;
};

// Componente Principal
function ParticipantList() {
  const { checkouts, loading } = useCheckout();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openPDFDialog, setOpenPDFDialog] = useState(false);
  const [filters, setFilters] = useState({
    document: "",
    email: "",
    checkedIn: undefined as boolean | undefined,
    paymentMethod: "" as string,
    couponCode: "",
    startDate: "" as string,
    endDate: "" as string,
    status: "" as string,
  });
  const [page, setPage] = useState(1);
  const participantsPerPage = 6;

  const paymentMethods = [
    "pix",
    "credit_card",
    "boleto",
    "cash",
    "transfer",
    "other",
  ];

  const filteredParticipants = useMemo(() => {
    return checkouts.filter((participant) => {
      const matchesDocument = filters.document
        ? participant.document
            .toLowerCase()
            .includes(filters.document.toLowerCase())
        : true;
      const matchesEmail = filters.email
        ? participant.email.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const matchesCheckedIn =
        filters.checkedIn !== undefined
          ? participant.checkedIn === filters.checkedIn
          : true;
      const matchesPaymentMethod = filters.paymentMethod
        ? participant.checkout?.paymentMethod === filters.paymentMethod
        : true;
      const matchesStatus = filters.status
        ? participant.checkout?.status === filters.status
        : true;
      const matchesCouponCode = filters.couponCode
        ? participant.checkout?.couponCode
            ?.toLowerCase()
            .includes(filters.couponCode.toLowerCase())
        : true;
      const matchesDateRange = () => {
        if (!filters.startDate && !filters.endDate) return true;
        const createdAt = participant.checkout?.createdAt
          ? new Date(participant.checkout.createdAt)
          : null;
        if (!createdAt) return false;
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        return (
          (!start || createdAt >= start) &&
          (!end || createdAt <= new Date(end.setHours(23, 59, 59, 999)))
        );
      };

      return (
        matchesDocument &&
        matchesEmail &&
        matchesCheckedIn &&
        matchesPaymentMethod &&
        matchesCouponCode &&
        matchesStatus &&
        matchesDateRange()
      );
    });
  }, [checkouts, filters]);

  const paginatedParticipants = filteredParticipants.slice(
    (page - 1) * participantsPerPage,
    page * participantsPerPage
  );

  const handleFilterChange = (
    field: string,
    value: string | boolean | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    console.log(event);
    setPage(value);
  };

  const handleOpenPDFDialog = () => {
    setOpenPDFDialog(true);
  };

  const handleClosePDFDialog = () => {
    setOpenPDFDialog(false);
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Lista de Participantes
        </Typography>
        <Box className={styles.viewControls}>
          <Typography variant="body2" color="textSecondary">
            {filteredParticipants.length} participantes
          </Typography>
          <Tooltip
            title={
              viewMode === "cards"
                ? "Visualização em tabela"
                : "Visualização em cards"
            }
          >
            <IconButton
              onClick={() =>
                setViewMode(viewMode === "cards" ? "table" : "cards")
              }
              color="primary"
            >
              {viewMode === "cards" ? <TableChart /> : <ViewModule />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Description />}
            onClick={handleOpenPDFDialog}
          >
            Gerar PDF
          </Button>
        </Box>
      </Box>

      <FiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        paymentMethods={paymentMethods}
      />

      {filteredParticipants.length === 0 ? (
        <Box className={styles.emptyState}>
          <Typography variant="h6" color="textSecondary">
            Nenhum participante encontrado
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tente ajustar os filtros ou recarregar os dados
          </Typography>
        </Box>
      ) : viewMode === "cards" ? (
        <Grid className={styles.cardsContainer}>
          {paginatedParticipants.map((participant) => (
            <Grid key={participant.id}>
              <ParticipantCard participant={participant} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableView participants={paginatedParticipants} />
      )}

      {filteredParticipants.length > 0 && (
        <Box className={styles.paginationContainer}>
          <Pagination
            count={Math.ceil(filteredParticipants.length / participantsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Dialog open={openPDFDialog} onClose={handleClosePDFDialog} maxWidth="md">
        <DialogContent>
          <GenerateParticipantsPDF onClose={handleClosePDFDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ParticipantList;
