import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Divider,
  Chip,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  Upload,
  Download,
  FormatBold,
  FormatItalic,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  CardMembership,
  RestartAlt,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";
import {
  type CertificateConfig,
  DEFAULT_CONFIG,
  saveCertificateConfig,
  loadCertificateConfig,
  uploadCertificateImage,
  renderCertificateCanvas,
  downloadCertificatePDF,
} from "../../../utils/generateCertificate";

const PREVIEW_NAME = "Maria da Silva Santos";

export default function CertificateConfigPanel() {
  const [config, setConfig] = useState<CertificateConfig>(DEFAULT_CONFIG);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dragging, setDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega config do Firestore ao montar
  useEffect(() => {
    loadCertificateConfig().then((cfg) => {
      setConfig(cfg);
      if (cfg.imageUrl) setImageUrl(cfg.imageUrl);
      setLoading(false);
    });
  }, []);

  // Re-renderiza preview
  const renderPreview = useCallback(async () => {
    if (!imageUrl || !canvasRef.current) return;
    const canvas = await renderCertificateCanvas(
      PREVIEW_NAME,
      config,
      imageUrl
    );
    const ctx = canvasRef.current.getContext("2d")!;
    canvasRef.current.width = canvas.width;
    canvasRef.current.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);
  }, [config, imageUrl]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setUploading(true);
    setUploadProgress(30);

    try {
      // Preview local imediato enquanto faz upload
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      setUploadProgress(60);

      const publicUrl = await uploadCertificateImage(file);
      setImageUrl(publicUrl);
      setConfig((prev) => ({ ...prev, imageUrl: publicUrl }));
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch {
      alert("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCertificateConfig({
        ...config,
        imageUrl: imageUrl ?? undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Erro ao salvar configuração.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setConfig(DEFAULT_CONFIG);

  const handleTestDownload = async () => {
    if (!imageUrl) return;
    setGenerating(true);
    try {
      await downloadCertificatePDF(
        PREVIEW_NAME,
        config,
        imageUrl,
        "certificado-teste"
      );
    } finally {
      setGenerating(false);
    }
  };

  // Drag no canvas para posicionar o nome
  const moveMarker = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setConfig((prev) => ({
      ...prev,
      xPercent: Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      ),
      yPercent: Math.max(
        0,
        Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
      ),
    }));
  };

  const update = (field: keyof CertificateConfig, value: any) =>
    setConfig((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <CardMembership />
        <Typography variant="h5">Configurar Certificado</Typography>
      </Box>

      {saved && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
          Configuração salva! Todos os participantes já podem baixar o
          certificado.
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
        }}
      >
        {/* ── Controles ── */}
        <Paper sx={{ p: 3, flex: 1, minWidth: 280 }}>
          <Typography variant="h6" gutterBottom>
            Configurações
          </Typography>

          {/* Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Arte do Certificado
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={handleImageUpload}
            />
            <Button
              variant="outlined"
              fullWidth
              startIcon={
                uploading ? <CircularProgress size={16} /> : <CloudUpload />
              }
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? "Enviando..."
                : imageUrl
                ? "Trocar imagem"
                : "Fazer upload"}
            </Button>
            {uploading && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mt: 1, borderRadius: 1 }}
              />
            )}
            {!imageUrl && !uploading && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                PNG ou JPG — imagem vai para o Firebase Storage
              </Typography>
            )}
            {imageUrl && !uploading && (
              <Typography
                variant="caption"
                color="success.main"
                sx={{ display: "block", mt: 0.5 }}
              >
                ✓ Imagem disponível para todos os participantes
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Posição */}
          <Typography variant="subtitle2" gutterBottom>
            Posição do nome
            <Chip label="Arraste no preview →" size="small" sx={{ ml: 1 }} />
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption">
              Horizontal: {config.xPercent.toFixed(1)}%
            </Typography>
            <Slider
              value={config.xPercent}
              onChange={(_, v) => update("xPercent", v)}
              min={0}
              max={100}
              step={0.5}
              size="small"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption">
              Vertical: {config.yPercent.toFixed(1)}%
            </Typography>
            <Slider
              value={config.yPercent}
              onChange={(_, v) => update("yPercent", v)}
              min={0}
              max={100}
              step={0.5}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Estilo */}
          <Typography variant="subtitle2" gutterBottom>
            Texto
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Fonte</InputLabel>
            <Select
              value={config.fontFamily}
              onChange={(e) => update("fontFamily", e.target.value)}
              label="Fonte"
            >
              <MenuItem value="helvetica">Helvetica / Arial</MenuItem>
              <MenuItem value="times">Times New Roman</MenuItem>
              <MenuItem value="Georgia, serif">Georgia</MenuItem>
              <MenuItem value="'Courier New', monospace">Courier New</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption">
              Tamanho: {config.fontSize}px
            </Typography>
            <Slider
              value={config.fontSize}
              onChange={(_, v) => update("fontSize", v)}
              min={16}
              max={200}
              step={2}
              size="small"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Cor"
              type="color"
              value={config.color}
              onChange={(e) => update("color", e.target.value)}
              size="small"
              sx={{ width: 90 }}
              InputLabelProps={{ shrink: true }}
            />
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="bold"
                selected={config.bold}
                onChange={() => update("bold", !config.bold)}
              >
                <FormatBold />
              </ToggleButton>
              <ToggleButton
                value="italic"
                selected={config.italic}
                onChange={() => update("italic", !config.italic)}
              >
                <FormatItalic />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={config.align}
              onChange={(_, v) => {
                if (v) update("align", v);
              }}
            >
              <ToggleButton value="left">
                <FormatAlignLeft />
              </ToggleButton>
              <ToggleButton value="center">
                <FormatAlignCenter />
              </ToggleButton>
              <ToggleButton value="right">
                <FormatAlignRight />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Ações */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={!imageUrl || saving}
              startIcon={saving ? <CircularProgress size={16} /> : undefined}
            >
              {saving ? "Salvando..." : "Salvar configuração"}
            </Button>
            <Button
              variant="outlined"
              startIcon={
                generating ? <CircularProgress size={16} /> : <Download />
              }
              onClick={handleTestDownload}
              disabled={!imageUrl || generating}
            >
              Baixar certificado de teste
            </Button>
            <Button
              variant="text"
              startIcon={<RestartAlt />}
              onClick={handleReset}
              size="small"
              color="warning"
            >
              Restaurar padrões de texto
            </Button>
          </Box>
        </Paper>

        {/* ── Preview ── */}
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview — clique e arraste para posicionar o nome
            </Typography>
            {imageUrl ? (
              <Box
                sx={{
                  position: "relative",
                  cursor: dragging ? "grabbing" : "crosshair",
                  userSelect: "none",
                }}
                onMouseLeave={() => setDragging(false)}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: 8,
                  }}
                  onMouseDown={(e) => {
                    setDragging(true);
                    moveMarker(e);
                  }}
                  onMouseMove={(e) => {
                    if (dragging) moveMarker(e);
                  }}
                  onMouseUp={() => setDragging(false)}
                />
                {/* Marcador */}
                <Box
                  sx={{
                    position: "absolute",
                    left: `${config.xPercent}%`,
                    top: `${config.yPercent}%`,
                    transform: "translate(-50%, -50%)",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    background: "rgba(255,80,80,0.85)",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CardMembership sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography color="text.secondary">
                  Faça upload da arte para ver o preview
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Fazer upload
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
