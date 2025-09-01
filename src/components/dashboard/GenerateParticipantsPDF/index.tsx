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
} from "@mui/material";
import { Description } from "@mui/icons-material";
import useCheckout from "../../../hooks/useCheckout";

interface GenerateParticipantsPDFProps {
  onClose: () => void;
}

function GenerateParticipantsPDF({ onClose }: GenerateParticipantsPDFProps) {
  const { generateParticipantsPDF, loading } = useCheckout();
  const [selectedFields, setSelectedFields] = useState({
    nome: true,
    documento: true,
    email: true,
    celular: true,
    cupom: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const handleFieldChange = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleGeneratePDF = async () => {
    const fields = Object.keys(selectedFields).filter(
      (field) => selectedFields[field as keyof typeof selectedFields]
    );
    if (fields.length === 0) {
      setSnackbar({
        open: true,
        message: "Selecione pelo menos um campo",
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
      await generateParticipantsPDF(fields);
      setSnackbar({
        open: true,
        message: "PDF gerado com sucesso!",
        severity: "success",
      });
      onClose(); // Fechar o diálogo após sucesso
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
          Selecionar Campos
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {["nome", "documento", "email", "celular", "cupom"].map((field) => (
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
