import { useState, useEffect, useMemo } from "react";
import {
  DashboardService,
  type Participant,
  type Checkout,
} from "../../../services/dashboard";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Loading from "../../shared/Loading";
import styles from "./participantList.module.css";

// Tipo combinado para participante com todos os dados do checkout
type EnhancedParticipant = Participant & {
  checkout?: Checkout;
};

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
  const participantsPerPage = 12;

  // Opções de métodos de pagamento (ajuste conforme os valores reais no Firestore)
  const paymentMethods = ["pix", "credit_card", "boleto"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando todos os participantes e checkouts...");
        const dashboardService = new DashboardService();
        const participantsData = await dashboardService.getParticipants({});
        const checkoutsData = await dashboardService.getCheckouts({});

        const checkoutMap = checkoutsData.reduce((map, checkout) => {
          map[checkout.id] = checkout;
          return map;
        }, {} as { [key: string]: Checkout });

        const enhancedParticipants: EnhancedParticipant[] =
          participantsData.map((participant) => ({
            ...participant,
            checkout: checkoutMap[participant.checkoutId],
          }));

        setAllParticipants(enhancedParticipants);
        console.log(
          "Participantes com checkouts completos:",
          enhancedParticipants
        );
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredParticipants = useMemo(() => {
    console.log("Aplicando filtros:", filters);
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
      <Typography variant="h5" gutterBottom>
        Lista de Participantes
      </Typography>
      <div className={styles.filters}>
        <TextField
          label="CPF"
          value={filters.document}
          onChange={(e) => handleFilterChange("document", e.target.value)}
          className={styles.filterInput}
          size="small"
        />
        <TextField
          label="E-mail"
          value={filters.email}
          onChange={(e) => handleFilterChange("email", e.target.value)}
          className={styles.filterInput}
          size="small"
        />
        <FormControl className={styles.filterInput} size="small">
          <InputLabel>Método de Pagamento</InputLabel>
          <Select
            value={filters.paymentMethod}
            onChange={(e) =>
              handleFilterChange("paymentMethod", e.target.value)
            }
            label="Método de Pagamento"
          >
            <MenuItem value="">Todos</MenuItem>
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Cupom"
          value={filters.couponCode}
          onChange={(e) => handleFilterChange("couponCode", e.target.value)}
          className={styles.filterInput}
          size="small"
        />
        <TextField
          label="Data Início"
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          className={styles.filterInput}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data Fim"
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          className={styles.filterInput}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.checkedIn ?? false}
              indeterminate={filters.checkedIn === undefined}
              onChange={() =>
                handleFilterChange(
                  "checkedIn",
                  filters.checkedIn === undefined
                    ? true
                    : filters.checkedIn
                    ? false
                    : undefined
                )
              }
            />
          }
          label="Check-in Realizado"
        />
        <Button
          variant="outlined"
          onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
        >
          {viewMode === "cards" ? "Ver em Tabela" : "Ver em Cards"}
        </Button>
      </div>

      {viewMode === "cards" ? (
        <Grid container spacing={2}>
          {paginatedParticipants.length === 0 ? (
            <Typography variant="body1" className={styles.noResults}>
              Nenhum participante encontrado.
            </Typography>
          ) : (
            paginatedParticipants.map((participant) => (
              <Grid key={participant.id} component="div">
                <Card className={styles.card}>
                  <CardContent>
                    <Typography variant="h6">{participant.name}</Typography>
                    <Typography color="textSecondary">
                      E-mail: {participant.email}
                    </Typography>
                    <Typography color="textSecondary">
                      CPF: {participant.document}
                    </Typography>

                    <Typography color="textSecondary">
                      Valor Total: R${" "}
                      {participant.checkout?.totalAmount?.toFixed(2) || "N/A"}
                    </Typography>
                    <Typography color="textSecondary">
                      Status: {participant.checkout?.status || "N/A"}
                    </Typography>
                    <Typography color="textSecondary">
                      Cupom: {participant.checkout?.couponCode || "N/A"}
                    </Typography>
                    <Typography color="textSecondary">
                      Método de Pagamento:{" "}
                      {participant.checkout?.paymentMethod || "N/A"}
                    </Typography>
                    {participant.checkout && (
                      <Typography
                        color="textSecondary"
                        className={styles.showMore}
                        onClick={() =>
                          alert(JSON.stringify(participant.checkout, null, 2))
                        }
                      >
                        Ver mais detalhes do checkout
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cupom</TableCell>
              <TableCell>Método de Pagamento</TableCell>
              <TableCell>Data Criação (Checkout)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <Typography variant="body1" align="center">
                    Nenhum participante encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.document}</TableCell>
                  <TableCell>{participant.phone}</TableCell>
                  <TableCell>
                    R$ {participant.checkout?.totalAmount?.toFixed(2) || "N/A"}
                  </TableCell>
                  <TableCell>{participant.checkout?.status || "N/A"}</TableCell>
                  <TableCell>
                    {participant.checkout?.couponCode || "N/A"}
                  </TableCell>
                  <TableCell>
                    {participant.checkout?.paymentMethod || "N/A"}
                  </TableCell>
                  <TableCell>
                    {participant.checkout?.createdAt || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <Pagination
        count={Math.ceil(filteredParticipants.length / participantsPerPage)}
        page={page}
        onChange={handlePageChange}
        className={styles.pagination}
      />
    </div>
  );
}

export default ParticipantList;
