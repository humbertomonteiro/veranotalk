import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { TransactionService } from "../../../services/transaction";
import {
  type TransactionProps,
  TransactionCategory,
} from "../../../contexts/TransactionContext";
import useUser from "../../../hooks/useUser";

interface FormTransactionProps {
  onClose: () => void;
  onSuccess: () => void;
  editingTransaction?: TransactionProps;
}

function FormTransaction({
  onClose,
  onSuccess,
  editingTransaction,
}: FormTransactionProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<TransactionProps>({
    amount: editingTransaction?.amount || 0,
    type: editingTransaction?.type || "deposit",
    description: editingTransaction?.description || "",
    date: editingTransaction?.date || new Date(),
    category: editingTransaction?.category || TransactionCategory.Other,
    userId: user?.id,
  });
  const [loading, setLoading] = useState(false);

  const transactionService = new TransactionService();
  const isEditing = !!editingTransaction;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
      };

      if (isEditing) {
        await transactionService.updateTransaction(
          editingTransaction!.id!,
          dataToSend
        );
      } else {
        await transactionService.createTransaction(dataToSend);
      }
      onSuccess();
    } catch (error) {
      console.error(
        `Erro ao ${isEditing ? "atualizar" : "criar"} transação:`,
        error
      );
      alert(`Erro ao ${isEditing ? "atualizar" : "criar"} transação`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof TransactionProps, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange("amount", Number(e.target.value))}
            required
            inputProps={{ min: 0.01, step: 0.01 }}
          />
        </Grid>

        <Grid>
          <FormControl fullWidth required>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <MenuItem value="deposit">Receita</MenuItem>
              <MenuItem value="expense">Despesa</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Descrição"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Data"
            type="datetime-local"
            value={formData.date.toISOString().slice(0, 16)}
            onChange={(e) => handleChange("date", new Date(e.target.value))}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid>
          <FormControl fullWidth required>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) =>
                handleChange("category", e.target.value as TransactionCategory)
              }
            >
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
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading
            ? isEditing
              ? "Atualizando..."
              : "Criando..."
            : isEditing
            ? "Atualizar Transação"
            : "Criar Transação"}
        </Button>
      </Box>
    </Box>
  );
}

export default FormTransaction;
