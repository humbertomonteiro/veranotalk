import { useState, useEffect, useMemo } from "react";
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
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  LocalOffer,
  Add,
  Edit,
  Delete,
  ContentCopy,
  Check,
  Close,
} from "@mui/icons-material";
import { CouponService, type CouponProps } from "../../../services/coupon";
import FormNewCoupon from "../FormCoupon";
import { useCoupon } from "../../../contexts/CouponContext";

function CouponManagement() {
  const { coupons, loadCoupons, isLoading } = useCoupon();
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<CouponProps | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<
    "code" | "uses" | "discountValue" | "expiresAt"
  >("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const couponService = new CouponService();

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditCoupon = (coupon: CouponProps) => {
    setEditingCoupon(coupon);
    setOpenDialog("edit");
  };

  const handleNewCoupon = () => {
    setOpenDialog("create");
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cupom?")) {
      try {
        await couponService.deleteCoupon(id);
        showSnackbar("Cupom excluído com sucesso", "success");
        loadCoupons();
      } catch (error) {
        console.error("Erro ao excluir cupom:", error);
        showSnackbar("Erro ao excluir cupom", "error");
      }
    }
  };

  const handleCopyLink = (code: string) => {
    const link = `https://veranotalk.com.br/checkout/${code}`;
    navigator.clipboard.writeText(link);
    showSnackbar("Link copiado para a área de transferência!", "success");
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Não expira";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getDiscountText = (coupon: CouponProps) => {
    if (coupon.discountType === "fixed") {
      return `R$ ${coupon.discountValue.toFixed(2)}`;
    }
    return `${coupon.discountValue}%`;
  };

  const isExpired = (expiresAt?: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getUsesText = (coupon: CouponProps) => {
    if (coupon.maxUses === null || coupon.maxUses === undefined) {
      return `${coupon.uses || 0} usos`;
    }
    return `${coupon.uses || 0}/${coupon.maxUses} usos`;
  };

  const filteredAndSortedCoupons = useMemo(() => {
    let result = [...coupons];

    // Filtrar por nome (code)
    if (filter) {
      result = result.filter((coupon) =>
        coupon.code.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Ordenar
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "code":
          comparison = a.code.localeCompare(b.code);
          break;
        case "uses":
          comparison = (b.uses || 0) - (a.uses || 0);
          break;
        case "discountValue":
          comparison = a.discountValue - b.discountValue;
          break;
        case "expiresAt":
          const dateA = a.expiresAt
            ? new Date(a.expiresAt).getTime()
            : Infinity;
          const dateB = b.expiresAt
            ? new Date(b.expiresAt).getTime()
            : Infinity;
          comparison = dateA - dateB;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [coupons, filter, sortBy, sortOrder]);

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
          <LocalOffer sx={{ mr: 1 }} />
          <Typography variant="h5">Gestão de Cupons</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewCoupon}
          disabled={isLoading}
        >
          Novo Cupom
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Filtrar por código"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "code"
                  | "uses"
                  | "discountValue"
                  | "expiresAt"
              )
            }
            size="small"
          >
            <MenuItem value="code">Código</MenuItem>
            <MenuItem value="uses">Quantidade de Usos</MenuItem>
            <MenuItem value="discountValue">Valor do Desconto</MenuItem>
            <MenuItem value="expiresAt">Data de Expiração</MenuItem>
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
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Desconto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Usos</TableCell>
              <TableCell>Expira em</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Link</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <Chip label={coupon.code} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    {getDiscountText(coupon)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      coupon.discountType === "fixed" ? "Fixo" : "Percentual"
                    }
                    color={
                      coupon.discountType === "fixed" ? "primary" : "secondary"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{getUsesText(coupon)}</TableCell>
                <TableCell>{formatDate(coupon.expiresAt)}</TableCell>
                <TableCell>
                  {isExpired(coupon.expiresAt) ? (
                    <Chip
                      icon={<Close />}
                      label="Expirado"
                      color="error"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<Check />}
                      label="Ativo"
                      color="success"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyLink(coupon.code)}
                    title="Copiar link do cupom"
                  >
                    <ContentCopy />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEditCoupon(coupon)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCoupon(coupon.id!)}
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
          {openDialog === "edit" ? "Editar Cupom" : "Novo Cupom"}
        </DialogTitle>
        <DialogContent>
          <FormNewCoupon
            onClose={handleCloseDialog}
            editingCoupon={editingCoupon!}
            onSuccess={() => {
              showSnackbar(
                openDialog === "edit"
                  ? "Cupom atualizado com sucesso!"
                  : "Cupom criado com sucesso!",
                "success"
              );
              loadCoupons();
              handleCloseDialog();
            }}
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

export default CouponManagement;
