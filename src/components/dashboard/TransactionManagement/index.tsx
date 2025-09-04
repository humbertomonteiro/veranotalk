import styles from "./transactionManagement.module.css";
import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Grid,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Add,
  Edit,
  Delete,
  MonetizationOn,
} from "@mui/icons-material";
import { TransactionService } from "../../../services/transaction";
import FormTransaction from "../FormTransaction";
import useTransaction from "../../../hooks/useTransaction";
import useCheckout from "../../../hooks/useCheckout";
import {
  type TransactionProps,
  TransactionCategory,
} from "../../../contexts/TransactionContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatBRL } from "../../../utils/formatCurrency";
import CategoryBreakdown from "../CategoryBreakdown";

function TransactionManagement() {
  const { transactions, cashFlowSummary, setTransactions, setCashFlowSummary } =
    useTransaction();
  const { stats } = useCheckout();
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionProps | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [filterCategory, setFilterCategory] = useState<
    TransactionCategory | "all"
  >("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const transactionService = new TransactionService();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditTransaction = (transaction: TransactionProps) => {
    setEditingTransaction(transaction);
    setOpenDialog("edit");
  };

  const handleNewTransaction = () => {
    setOpenDialog("create");
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await transactionService.deleteTransaction(id);
        showSnackbar("Transação excluída com sucesso", "success");
        // Atualizar transações e resumo
        const updatedTransactions =
          await transactionService.getAllTransactions();
        setTransactions(updatedTransactions);
        const updatedSummary = await transactionService.getCashFlowSummary();
        setCashFlowSummary(updatedSummary);
      } catch (error) {
        console.error("Erro ao excluir transação:", error);
        showSnackbar("Erro ao excluir transação", "error");
      }
    }
  };

  const handleCleanedFilters = () => {
    setFilterCategory("all");
    setFilterStartDate("");
    setFilterEndDate("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const getImpactText = (transaction: TransactionProps) => {
    return transaction.type === "deposit"
      ? `+ R$ ${transaction.amount.toFixed(2)}`
      : `- R$ ${transaction.amount.toFixed(2)}`;
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Filtrar por categoria
    if (filterCategory !== "all") {
      result = result.filter(
        (transaction) => transaction.category === filterCategory
      );
    }

    // Filtrar por período
    if (filterStartDate && filterEndDate) {
      const start = new Date(filterStartDate);
      const end = new Date(filterEndDate);
      result = result.filter(
        (transaction) => transaction.date >= start && transaction.date <= end
      );
    }

    // Ordenar
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    transactions,
    filterCategory,
    filterStartDate,
    filterEndDate,
    sortBy,
    sortOrder,
  ]);

  const handleSuccess = async () => {
    showSnackbar(
      openDialog === "edit"
        ? "Transação atualizada com sucesso!"
        : "Transação criada com sucesso!",
      "success"
    );
    // Atualizar transações e resumo
    const updatedTransactions = await transactionService.getAllTransactions();
    setTransactions(updatedTransactions);
    const updatedSummary = await transactionService.getCashFlowSummary();
    setCashFlowSummary(updatedSummary);
    handleCloseDialog();
  };

  const handleApplyPeriodFilter = async () => {
    if (filterStartDate && filterEndDate) {
      try {
        const start = new Date(filterStartDate);
        const end = new Date(filterEndDate);
        const periodTransactions =
          await transactionService.getTransactionsByPeriod(start, end);
        setTransactions(periodTransactions);
      } catch (error) {
        showSnackbar("Erro ao filtrar por período", "error");
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccountBalanceWallet sx={{ mr: 1 }} />
          <Typography variant="h5">Gestão de Transações</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewTransaction}
        >
          Nova Transação
        </Button>
      </Box>

      {/* Resumo do Fluxo de Caixa */}
      {cashFlowSummary && (
        <Grid className={styles.gridContainer}>
          <Card className={styles.card}>
            <CardContent>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  color: "#2E7D32",
                  fontWeight: 600,
                  fontSize: "1.3rem",
                }}
              >
                <MonetizationOn /> Receitas
              </Box>
              <Box className={styles.textContainer}>
                <Typography
                  className={styles.value}
                  sx={{ fontSize: "1.8rem" }}
                >
                  {formatBRL(
                    cashFlowSummary.totalDeposits + stats?.totalValue!
                  )}
                </Typography>

                <Typography variant="body2" className={styles.description}>
                  Valor dos ingressos: {formatBRL(stats?.totalValue || 0)}
                </Typography>
                <Typography variant="body2" className={styles.description}>
                  Outras receitas:{" "}
                  {formatBRL(cashFlowSummary.totalDeposits || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card className={styles.card}>
            <CardContent>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  color: "#D32F2F",
                  fontWeight: 600,
                  fontSize: "1.3rem",
                }}
              >
                <MonetizationOn /> Despesas
              </Box>
              <Box className={styles.textContainer}>
                <Typography
                  className={styles.value}
                  sx={{ fontSize: "1.8rem" }}
                >
                  {formatBRL(cashFlowSummary.totalExpenses)}
                </Typography>

                <Typography variant="body2" className={styles.description}>
                  Despesas cadastradas do evento
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card className={styles.card}>
            <CardContent>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  color: "#1976D2",
                  fontWeight: 600,
                  fontSize: "1.3rem",
                }}
              >
                <MonetizationOn /> Balanço
              </Box>
              <Box className={styles.textContainer}>
                <Typography
                  className={styles.value}
                  sx={{ fontSize: "1.8rem" }}
                >
                  {formatBRL(cashFlowSummary.balance + stats?.totalValue!)}
                </Typography>

                <Typography variant="body2" className={styles.description}>
                  Balanço são as receitas menos as despenas
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      <CategoryBreakdown />

      <Card sx={{ mb: 2, gap: 2 }}>
        <Typography variant="subtitle1">Filtros</Typography>
        <CardContent sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as TransactionCategory | "all")
              }
              size="small"
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value={TransactionCategory.Sponsor}>
                Patrocínio
              </MenuItem>
              <MenuItem value={TransactionCategory.Speaker}>
                Palestrante
              </MenuItem>
              <MenuItem value={TransactionCategory.Marketing}>
                Marketing
              </MenuItem>
              <MenuItem value={TransactionCategory.Infrastructure}>
                Infraestrutura
              </MenuItem>
              <MenuItem value={TransactionCategory.Collaborators}>
                Colaboradores
              </MenuItem>
              <MenuItem value={TransactionCategory.Other}>Outros</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "amount" | "category")
              }
              size="small"
            >
              <MenuItem value="date">Data</MenuItem>
              <MenuItem value="amount">Valor</MenuItem>
              <MenuItem value="category">Categoria</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Ordem</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              size="small"
            >
              <MenuItem value="asc">Crescente</MenuItem>
              <MenuItem value="desc">Decrescente</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Data Inicial"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="Data Final"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button
            size="small"
            variant="contained"
            onClick={handleApplyPeriodFilter}
          >
            Filtrar Período
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleCleanedFilters}
          >
            Limpar filtros
          </Button>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Impacto</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(transaction.date, "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      transaction.type === "deposit" ? "Receita" : "Despesa"
                    }
                    color={transaction.type === "deposit" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{getImpactText(transaction)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTransaction(transaction.id!)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog !== null}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {openDialog === "edit" ? "Editar Transação" : "Nova Transação"}
        </DialogTitle>
        <DialogContent>
          <FormTransaction
            onClose={handleCloseDialog}
            editingTransaction={editingTransaction!}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TransactionManagement;
