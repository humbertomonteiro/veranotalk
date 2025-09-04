import { useState } from "react";
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
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { TransactionCategory } from "../../../contexts/TransactionContext";
import { formatBRL } from "../../../utils/formatCurrency";
import styles from "./transactionManagement.module.css";
import useTransaction from "../../../hooks/useTransaction";

function CategoryBreakdown() {
  const { cashFlowSummary } = useTransaction();
  const [open, setOpen] = useState(false);

  // Map TransactionCategory enum to human-readable labels
  const categoryLabels: Record<TransactionCategory, string> = {
    [TransactionCategory.Sponsor]: "Patrocínio",
    [TransactionCategory.Speaker]: "Palestrante",
    [TransactionCategory.Marketing]: "Marketing",
    [TransactionCategory.Infrastructure]: "Infraestrutura",
    [TransactionCategory.Collaborators]: "Colaboradores",
    [TransactionCategory.Other]: "Outros",
  };

  // Prepare data for the table
  const categoryData = cashFlowSummary
    ? Object.entries(cashFlowSummary.totalsByCategory).map(
        ([category, totals]) => ({
          category: category as TransactionCategory,
          deposits: totals.deposits,
          expenses: totals.expenses,
          balance: totals.deposits - totals.expenses,
        })
      )
    : [];

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        mb: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Button
        variant="contained"
        size="small"
        sx={{
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-end",
        }}
      >
        {/* <Typography variant="h6">Resumo por Categoria</Typography> */}
        <IconButton onClick={handleToggle} size="small">
          {open ? (
            <Typography
              sx={{ display: "flex", justifyContent: "center", color: "#fff" }}
            >
              Resumo por Categoria
              <ExpandLess />
            </Typography>
          ) : (
            <Typography
              sx={{ display: "flex", justifyContent: "center", color: "#fff" }}
            >
              Resumo por Categoria
              <ExpandMore />
            </Typography>
          )}
        </IconButton>
      </Button>
      <Collapse in={open}>
        <TableContainer component={Paper} className={styles.card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell align="right">Receitas</TableCell>
                <TableCell align="right">Despesas</TableCell>
                <TableCell align="right">Impacto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryData.length > 0 ? (
                categoryData.map(
                  ({ category, deposits, expenses, balance }) => (
                    <TableRow key={category}>
                      <TableCell>{categoryLabels[category]}</TableCell>
                      <TableCell align="right">{formatBRL(deposits)}</TableCell>
                      <TableCell align="right">{formatBRL(expenses)}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            balance < 0
                              ? "#D32F2F"
                              : balance === 0
                              ? ""
                              : "#2E7D32",
                        }}
                        align="right"
                      >
                        {formatBRL(balance)}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhuma informação de categoria disponível
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
}

export default CategoryBreakdown;
