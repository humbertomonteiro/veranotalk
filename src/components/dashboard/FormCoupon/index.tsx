import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { CouponService, type CouponProps } from "../../../services/coupon";

interface FormCouponProps {
  onClose: () => void;
  onSuccess: () => void;
  editingCoupon?: CouponProps;
}

function FormCoupon({ onClose, onSuccess, editingCoupon }: FormCouponProps) {
  const [formData, setFormData] = useState<CouponProps>({
    code: editingCoupon?.code.toLowerCase() || "",
    discountType: editingCoupon?.discountType || "fixed",
    discountValue: editingCoupon?.discountValue || 0,
    maxUses: editingCoupon?.maxUses || undefined,
    expiresAt: editingCoupon?.expiresAt || undefined,
    eventId: "verano-talk-2025",
  });
  const [hasExpiration, setHasExpiration] = useState(false);
  const [loading, setLoading] = useState(false);

  const couponService = new CouponService();
  const isEditing = !!editingCoupon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        expiresAt: hasExpiration ? formData.expiresAt : null,
        maxUses: formData.maxUses || null,
      };

      if (isEditing) {
        await couponService.updateCoupon(editingCoupon!.id!, dataToSend);
      } else {
        await couponService.createCoupon(dataToSend);
      }
      onSuccess();
    } catch (error) {
      console.error(
        `Erro ao ${isEditing ? "atualizar" : "criar"} cupom:`,
        error
      );
      alert(`Erro ao ${isEditing ? "atualizar" : "criar"} cupom`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CouponProps, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            fullWidth
            label="Código do Cupom"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            select
            label="Tipo de Desconto"
            value={formData.discountType}
            onChange={(e) =>
              handleChange(
                "discountType",
                e.target.value as "fixed" | "percentage"
              )
            }
            required
          >
            <MenuItem value="fixed">Valor Fixo (R$)</MenuItem>
            <MenuItem value="percentage">Percentual (%)</MenuItem>
          </TextField>
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label={
              formData.discountType === "fixed"
                ? "Valor do Desconto (R$)"
                : "Percentual de Desconto (%)"
            }
            type="number"
            value={formData.discountValue}
            onChange={(e) =>
              handleChange("discountValue", Number(e.target.value))
            }
            required
            inputProps={{
              min: 0,
              step: formData.discountType === "percentage" ? 1 : 0.01,
            }}
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Máximo de Usos (opcional)"
            type="number"
            value={formData.maxUses || ""}
            onChange={(e) =>
              handleChange(
                "maxUses",
                e.target.value ? Number(e.target.value) : null
              )
            }
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={
              <Switch
                checked={hasExpiration}
                onChange={(e) => setHasExpiration(e.target.checked)}
              />
            }
            label="Definir data de expiração"
          />
        </Grid>

        {hasExpiration && (
          <Grid>
            <TextField
              fullWidth
              label="Data de Expiração"
              type="datetime-local"
              value={formData.expiresAt || ""}
              onChange={(e) => handleChange("expiresAt", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading
            ? isEditing
              ? "Atualizando..."
              : "Criando..."
            : isEditing
            ? "Atualizar Cupom"
            : "Criar Cupom"}
        </Button>
      </Box>
    </Box>
  );
}

export default FormCoupon;
