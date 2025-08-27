import { useState, useEffect, useMemo } from "react";
import {
  DashboardService,
  type Participant,
  type Checkout,
} from "../../../services/dashboard";
import {
  Grid,
  Typography,
  Pagination,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ViewModule, TableChart } from "@mui/icons-material";
import Loading from "../../shared/Loading";
import styles from "./participantList.module.css";

import ParticipantCard from "../ParticipantCard";
import FiltersSection from "../FiltersSection";
import TableView from "../TableView";

// Tipo combinado para participante com todos os dados do checkout
export type EnhancedParticipant = Participant & {
  checkout?: Checkout;
};

// Componente Principal
function ParticipantList() {
  const [allParticipants, setAllParticipants] = useState<EnhancedParticipant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [filters, setFilters] = useState({
    document: "",
    email: "",
    checkedIn: undefined as boolean | undefined,
    paymentMethod: "" as string,
    couponCode: "",
    startDate: "" as string,
    endDate: "" as string,
  });
  const [page, setPage] = useState(1);
  const participantsPerPage = 6;

  const paymentMethods = ["pix", "credit_card", "boleto"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dashboardService = new DashboardService();
      const participantsData = await dashboardService.getParticipants({});
      const checkoutsData = await dashboardService.getCheckouts({});

      const checkoutMap = checkoutsData.reduce((map, checkout) => {
        map[checkout.id] = checkout;
        return map;
      }, {} as { [key: string]: Checkout });

      const enhancedParticipants: EnhancedParticipant[] = participantsData.map(
        (participant) => ({
          ...participant,
          checkout: checkoutMap[participant.checkoutId],
        })
      );

      setAllParticipants(enhancedParticipants);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = useMemo(() => {
    return allParticipants.filter((participant) => {
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
        matchesDateRange()
      );
    });
  }, [allParticipants, filters]);

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

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Lista de Participantes
        </Typography>
        <Box className={styles.viewControls}>
          <Typography variant="body2" color="textSecondary">
            {filteredParticipants.length} participantes encontrados
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
    </div>
  );
}

export default ParticipantList;
