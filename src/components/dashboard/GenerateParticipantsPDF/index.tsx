import { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { Description } from "@mui/icons-material";
import useCheckout from "../../../hooks/useCheckout";

interface GenerateParticipantsPDFProps {
  onClose: () => void;
}

function GenerateParticipantsPDF({ onClose }: GenerateParticipantsPDFProps) {
  const { generateParticipantsExcel, loading } = useCheckout();
  const [selectedStatus, setSelectedStatus] = useState
   < "all" | "approved" | "rejected" | "processing"
  >("all");
  const [selectedFields, setSelectedFields] = useState({
    nome: true,
    documento: true,
    email: true,
    celular: true,
    cupom: true,
  });
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });
  const [sortBy, setSortBy] = useState<"nome" | "data">("nome");

  const handleFieldChange = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePDF = async () => {
    const fields = Object.keys(selectedFields).filter(
      (field) => selectedFields[field as keyof typeof selectedFields],
    );
    if (fields.length === 0) {
      setSnackbar({
        open: true,
        message: "Selecione pelo menos um campo",
        severity: "error",
      });
      return;
    }

    if (dateRange.startDate && dateRange.endDate && dateRange.startDate > dateRange.endDate) {
      setSnackbar({
        open: true,
        message: "A data de início não pode ser maior que a data final",
        severity: "error",
      });
      return;
    }

    setSnackbar({
      open: true,
      message: "Gerando PDF...",
      severity: "info",
    });

    try {
      await generateParticipantsExcel(fields, selectedStatus, dateRange, sortBy);
      setSnackbar({
        open: true,
        message: "PDF gerado com sucesso!",
        severity: "success",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setSnackbar({
        open: true,
        message: "Erro ao gerar PDF",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 0, mx: "auto", maxWidth: "500px" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Description sx={{ mr: 1 }} />
        <Typography variant="h5">Gerar Relatório de Participantes</Typography>
      </Box>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecionar Status
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {["all", "approved", "rejected", "processing"].map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={selectedStatus === status}
                  onChange={() =>
                    setSelectedStatus(
                      status as "all" | "approved" | "rejected" | "processing",
                    )
                  }
                />
              }
              label={status.charAt(0).toUpperCase() + status.slice(1)}
            />
          ))}
        </Box>
      </FormControl>

      {/* Filtro de Data */}
      <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
        <Typography variant="subtitle1" gutterBottom>
          Filtrar por Data
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Data de Início"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            inputProps={{
              max: dateRange.endDate || undefined,
            }}
          />
          <TextField
            label="Data Final"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            inputProps={{
              min: dateRange.startDate || undefined,
            }}
          />
        </Box>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecionar Campos
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {[
            "nome",
            "documento",
            "email",
            "celular",
            "cupom",
            "valor",
            "data",
            "status",
          ].map((field) => (
            <FormControlLabel
              key={field}
              control={
                <Checkbox
                  checked={selectedFields[field as keyof typeof selectedFields]}
                  onChange={() =>
                    handleFieldChange(field as keyof typeof selectedFields)
                  }
                />
              }
              label={
                field.charAt(0).toUpperCase() +
                field.slice(1).replace("cupom", "Cupom")
              }
            />
          ))}
        </Box>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
  <Typography variant="subtitle1" gutterBottom>
    Ordenar por
  </Typography>
  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
    {[
      { value: "nome", label: "Nome (A-Z)" },
      { value: "data", label: "Data" },
    ].map((option) => (
      <FormControlLabel
        key={option.value}
        control={
          <Checkbox
            checked={sortBy === option.value}
            onChange={() => setSortBy(option.value as "nome" | "data")}
          />
        }
        label={option.label}
      />
    ))}
  </Box>
</FormControl>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          startIcon={<Description />}
          onClick={handleGeneratePDF}
          disabled={loading}
        >
          {loading ? "Gerando..." : "Gerar PDF"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GenerateParticipantsPDF;