import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import styles from "./filtersSection.module.css";

import { useState } from "react";

import { FilterList, Refresh } from "@mui/icons-material";

export default function FiltersSection({
  filters,
  onFilterChange,
  paymentMethods,
}: {
  filters: any;
  onFilterChange: (field: string, value: any) => void;
  paymentMethods: string[];
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Box className={styles.filtersContainer}>
      <Box className={styles.filtersHeader}>
        <Button
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          variant="outlined"
          size="small"
        >
          Filtros {showFilters ? "▲" : "▼"}
        </Button>

        <Box className={styles.headerActions}>
          <Tooltip title="Recarregar dados">
            <IconButton size="small" onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showFilters && (
        <Box className={styles.filtersGrid}>
          <TextField
            label="CPF"
            value={filters.document}
            onChange={(e) => onFilterChange("document", e.target.value)}
            className={styles.filterInput}
            size="small"
            placeholder="Buscar por CPF..."
          />

          <TextField
            label="E-mail"
            value={filters.email}
            onChange={(e) => onFilterChange("email", e.target.value)}
            className={styles.filterInput}
            size="small"
            placeholder="Buscar por e-mail..."
          />

          <FormControl className={styles.filterInput} size="small">
            <InputLabel>Método de Pagamento</InputLabel>
            <Select
              value={filters.paymentMethod}
              onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
              label="Método de Pagamento"
            >
              <MenuItem value="">Todos</MenuItem>
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method === "pix"
                    ? "PIX"
                    : method === "credit_card"
                    ? "Cartão de Crédito"
                    : method === "boleto"
                    ? "Boleto"
                    : method === "cash"
                    ? "Dinheiro"
                    : method === "transfer"
                    ? "Transferência"
                    : method === "other"
                    ? "Outros"
                    : method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={styles.filterInput} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              {["processing", "approved", "rejected", "pending"].map(
                (status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <TextField
            label="Cupom"
            value={filters.couponCode}
            onChange={(e) => onFilterChange("couponCode", e.target.value)}
            className={styles.filterInput}
            size="small"
            placeholder="Buscar cupom..."
          />

          <TextField
            label="Data Início"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
            className={styles.filterInput}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Data Fim"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
            className={styles.filterInput}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          {/* <FormControlLabel
            control={
              <Checkbox
                checked={filters.checkedIn ?? false}
                indeterminate={filters.checkedIn === undefined}
                onChange={() =>
                  onFilterChange(
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
          /> */}
        </Box>
      )}
    </Box>
  );
}
