// import { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Grid,
//   FormControlLabel,
//   Switch,
// } from "@mui/material";
// import { CouponService, type CouponProps } from "../../../services/coupon";

// interface FormCouponProps {
//   onClose: () => void;
//   onSuccess: () => void;
//   editingCoupon?: CouponProps;
// }

// function FormCoupon({ onClose, onSuccess, editingCoupon }: FormCouponProps) {
//   const [formData, setFormData] = useState<CouponProps>({
//     code: editingCoupon?.code.toLowerCase() || "",
//     discountType: editingCoupon?.discountType || "fixed",
//     discountValue: editingCoupon?.discountValue || 0,
//     maxUses: editingCoupon?.maxUses || undefined,
//     expiresAt: editingCoupon?.expiresAt || undefined,
//     eventId: "verano-talk-2025",
//   });
//   const [hasExpiration, setHasExpiration] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const couponService = new CouponService();
//   const isEditing = !!editingCoupon;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const dataToSend = {
//         ...formData,
//         expiresAt: hasExpiration ? formData.expiresAt : null,
//         maxUses: formData.maxUses || null,
//       };

//       if (isEditing) {
//         await couponService.updateCoupon(editingCoupon!.id!, dataToSend);
//       } else {
//         await couponService.createCoupon(dataToSend);
//       }
//       onSuccess();
//     } catch (error) {
//       console.error(
//         `Erro ao ${isEditing ? "atualizar" : "criar"} cupom:`,
//         error
//       );
//       alert(`Erro ao ${isEditing ? "atualizar" : "criar"} cupom`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field: keyof CouponProps, value: any) => {
//     setFormData((prev: any) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//       <Grid container spacing={2}>
//         <Grid>
//           <TextField
//             fullWidth
//             label="Código do Cupom"
//             value={formData.code}
//             onChange={(e) => handleChange("code", e.target.value)}
//             required
//           />
//         </Grid>

//         <Grid>
//           <TextField
//             fullWidth
//             select
//             label="Tipo de Desconto"
//             value={formData.discountType}
//             onChange={(e) =>
//               handleChange(
//                 "discountType",
//                 e.target.value as "fixed" | "percentage"
//               )
//             }
//             required
//           >
//             <MenuItem value="fixed">Valor Fixo (R$)</MenuItem>
//             <MenuItem value="percentage">Percentual (%)</MenuItem>
//           </TextField>
//         </Grid>

//         <Grid>
//           <TextField
//             fullWidth
//             label={
//               formData.discountType === "fixed"
//                 ? "Valor do Desconto (R$)"
//                 : "Percentual de Desconto (%)"
//             }
//             type="number"
//             value={formData.discountValue}
//             onChange={(e) =>
//               handleChange("discountValue", Number(e.target.value))
//             }
//             required
//             inputProps={{
//               min: 0,
//               step: formData.discountType === "percentage" ? 1 : 0.01,
//             }}
//           />
//         </Grid>

//         <Grid>
//           <TextField
//             fullWidth
//             label="Máximo de Usos (opcional)"
//             type="number"
//             value={formData.maxUses || ""}
//             onChange={(e) =>
//               handleChange(
//                 "maxUses",
//                 e.target.value ? Number(e.target.value) : null
//               )
//             }
//             inputProps={{ min: 1 }}
//           />
//         </Grid>

//         <Grid>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={hasExpiration}
//                 onChange={(e) => setHasExpiration(e.target.checked)}
//               />
//             }
//             label="Definir data de expiração"
//           />
//         </Grid>

//         {hasExpiration && (
//           <Grid>
//             <TextField
//               fullWidth
//               label="Data de Expiração"
//               type="datetime-local"
//               value={formData.expiresAt || ""}
//               onChange={(e) => handleChange("expiresAt", e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//         )}
//       </Grid>

//       <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
//         <Button onClick={onClose}>Cancelar</Button>
//         <Button type="submit" variant="contained" disabled={loading}>
//           {loading
//             ? isEditing
//               ? "Atualizando..."
//               : "Criando..."
//             : isEditing
//             ? "Atualizar Cupom"
//             : "Criar Cupom"}
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// export default FormCoupon;
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  Collapse,
  Divider,
  Typography,
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
    isCommissioned: editingCoupon?.isCommissioned || false,
    commissionValue: editingCoupon?.commissionValue || undefined,
    commissionedTo: editingCoupon?.commissionedTo || "",
  });
  const [hasExpiration, setHasExpiration] = useState(false);
  const [loading, setLoading] = useState(false);

  const couponService = new CouponService();
  const isEditing = !!editingCoupon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend: CouponProps = {
        ...formData,
        expiresAt: hasExpiration ? formData.expiresAt : null,
        maxUses: formData.maxUses || null,
        // Limpa campos de comissão se não for comissionado
        commissionValue: formData.isCommissioned
          ? formData.commissionValue
          : undefined,
        commissionedTo: formData.isCommissioned
          ? formData.commissionedTo
          : undefined,
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
        error,
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
        {/* ── Campos existentes ── */}
        <Grid size={12}>
          <TextField
            fullWidth
            label="Código do Cupom"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value.toLowerCase())}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            select
            label="Tipo de Desconto"
            value={formData.discountType}
            onChange={(e) =>
              handleChange(
                "discountType",
                e.target.value as "fixed" | "percentage",
              )
            }
            required
          >
            <MenuItem value="fixed">Valor Fixo (R$)</MenuItem>
            <MenuItem value="percentage">Percentual (%)</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Máximo de Usos (opcional)"
            type="number"
            value={formData.maxUses || ""}
            onChange={(e) =>
              handleChange(
                "maxUses",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
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

        <Collapse in={hasExpiration} style={{ width: "100%", paddingLeft: 16 }}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Data de Expiração"
              type="datetime-local"
              value={formData.expiresAt || ""}
              onChange={(e) => handleChange("expiresAt", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Collapse>

        {/* ── Seção de comissionamento ── */}
        <Grid size={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Comissionamento
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isCommissioned || false}
                onChange={(e) =>
                  handleChange("isCommissioned", e.target.checked)
                }
              />
            }
            label="Este cupom gera comissão para um vendedor"
          />
        </Grid>

        <Collapse
          in={formData.isCommissioned}
          style={{ width: "100%", paddingLeft: 16 }}
        >
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Comissão do Vendedor (%)"
                type="number"
                value={formData.commissionValue || ""}
                onChange={(e) =>
                  handleChange("commissionValue", Number(e.target.value))
                }
                required={formData.isCommissioned}
                inputProps={{ min: 1, max: 100, step: 1 }}
                helperText="Percentual sobre o valor original do ingresso"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Vendedor (nome ou ID)"
                value={formData.commissionedTo || ""}
                onChange={(e) => handleChange("commissionedTo", e.target.value)}
                helperText="Identifica quem receberá a comissão"
              />
            </Grid>
          </Grid>
        </Collapse>
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
