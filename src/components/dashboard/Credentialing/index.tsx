import { useState, useEffect, useRef, useCallback } from "react";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  TextField,
  InputAdornment,
  Tooltip,
  LinearProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Badge,
  CheckCircle,
  ErrorOutline,
  QrCodeScanner,
  History,
  Search,
  WarningAmber,
  WifiOff,
  Wifi,
  Sync,
  CloudDone,
  PersonSearch,
  HowToReg,
} from "@mui/icons-material";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { config } from "../../../config";
import useUser from "../../../hooks/useUser";
import {
  saveAllParticipants,
  findParticipantByQrCode,
  markCheckedInLocally,
  enqueueCheckIn,
  getPendingQueue,
  markQueueItemSynced,
  getAllCheckedIn,
  countParticipants,
  searchParticipants,
  type OfflineParticipant,
} from "../../../services/Offlinedb";

const SlideUp = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ScanStatus =
  | "idle"
  | "scanning"
  | "loading"
  | "success"
  | "already"
  | "error";
type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface CheckInResult {
  participant: OfflineParticipant;
  alreadyCheckedIn: boolean;
}

interface ScanRecord {
  participantId: string;
  name: string;
  document: string;
  ticketType: string;
  scannedAt: Date;
  scannedByName: string;
  alreadyCheckedIn: boolean;
}

function Credentialing() {
  const { user } = useUser();

  // ─── Conexão e cache ───────────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheCount, setCacheCount] = useState(0);
  const [cacheLoading, setCacheLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [pendingCount, setPendingCount] = useState(0);

  // ─── Scanner ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Busca manual ─────────────────────────────────────────────────────────
  const [manualTerm, setManualTerm] = useState("");
  const [manualResults, setManualResults] = useState<OfflineParticipant[]>([]);
  const [manualSearching, setManualSearching] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<OfflineParticipant | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  // ─── Histórico ────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef(false);
  const manualDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Online/offline ────────────────────────────────────────────────────────
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // ─── Sync fila ─────────────────────────────────────────────────────────────
  const syncQueue = useCallback(async () => {
    const queue = await getPendingQueue();
    if (!queue.length) return;
    setSyncStatus("syncing");
    let allOk = true;
    for (const item of queue) {
      try {
        const res = await fetch(`${config.baseUrl}/participant/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrCode: item.qrCode, userId: item.userId }),
        });
        if (res.ok) {
          // Sucesso — sincronizado
          await markQueueItemSynced(item.id);
        } else if (res.status === 404 || res.status === 400) {
          // Participante não existe mais ou dado inválido — descarta da fila
          console.warn(
            `Check-in descartado (${res.status}) para QR ${item.qrCode}`
          );
          await markQueueItemSynced(item.id);
        } else {
          // Erro temporário (500, etc) — mantém na fila para tentar depois
          allOk = false;
        }
      } catch {
        // Falha de rede — mantém na fila
        allOk = false;
      }
    }
    setSyncStatus(allOk ? "synced" : "error");
    const remaining = await getPendingQueue();
    setPendingCount(remaining.length);
    setTimeout(() => setSyncStatus("idle"), 3000);
  }, []);

  // ─── Atualiza cache ─────────────────────────────────────────────────────────
  const refreshCache = useCallback(async () => {
    setCacheLoading(true);
    try {
      const res = await fetch(
        `${config.baseUrl}/participant/all?eventId=verano-talk-2025`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      await saveAllParticipants(data.participants);
      setCacheCount(data.participants.length);
    } catch {
      const count = await countParticipants();
      setCacheCount(count);
    } finally {
      setCacheLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncQueue();
      refreshCache();
    }
  }, [isOnline]);

  // ─── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const count = await countParticipants();
      setCacheCount(count);
      const checkedIn = await getAllCheckedIn();
      const records: ScanRecord[] = checkedIn.map((p) => ({
        participantId: p.id,
        name: p.name,
        document: p.document,
        ticketType: p.ticketType,
        scannedAt: p.checkedInAt ? new Date(p.checkedInAt) : new Date(),
        scannedByName: p.checkedInBy ?? "—",
        alreadyCheckedIn: false,
      }));
      records.sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime());
      setHistory(records);
      setHistoryLoading(false);
      const pending = await getPendingQueue();
      setPendingCount(pending.length);
      if (navigator.onLine) {
        await refreshCache();
        await syncQueue();
      }
    };
    init();
  }, []);

  // ─── Scanner ────────────────────────────────────────────────────────────────
  const stopScanner = () => {
    if (readerRef.current) readerRef.current.reset();
    scanningRef.current = false;
  };

  const startScanner = async () => {
    setCameraError("");
    setStatus("scanning");
    setResult(null);
    setErrorMsg("");
    setModalOpen(false);
    scanningRef.current = true;
    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      const devices = await reader.listVideoInputDevices();
      if (!devices.length) {
        setCameraError("Nenhuma câmera encontrada.");
        setStatus("idle");
        return;
      }
      const cam =
        devices.find((d: MediaDeviceInfo) =>
          /back|rear|environment/i.test(d.label)
        ) || devices[devices.length - 1];
      await reader.decodeFromVideoDevice(
        cam.deviceId,
        videoRef.current!,
        async (scanResult, err) => {
          if (!scanningRef.current) return;
          if (err instanceof NotFoundException || err || !scanResult) return;
          const qrCode = scanResult.getText();
          if (!qrCode.startsWith("PART-")) return;
          scanningRef.current = false;
          stopScanner();
          setStatus("loading");
          await handleCheckIn(qrCode);
        }
      );
    } catch (err: any) {
      setCameraError(
        err?.name === "NotAllowedError"
          ? "Permissão de câmera negada. Habilite nas configurações do navegador."
          : "Não foi possível acessar a câmera."
      );
      setStatus("idle");
    }
  };

  // ─── Check-in (online/offline) ──────────────────────────────────────────────
  const handleCheckIn = async (qrCode: string, participantId?: string) => {
    if (navigator.onLine) {
      try {
        const body: any = { qrCode, userId: user?.id ?? null };
        const response = await fetch(`${config.baseUrl}/participant/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          setErrorMsg(data.error || "Erro ao realizar check-in.");
          setStatus("error");
          setModalOpen(true);
          return;
        }
        await markCheckedInLocally(
          data.participant.id,
          user?.id ?? null,
          data.participant.checkedInAt ?? new Date().toISOString()
        );
        finalizeCheckIn({
          participant: data.participant,
          alreadyCheckedIn: data.alreadyCheckedIn,
        });
        return;
      } catch {
        /* fallback offline */
      }
    }
    // Offline
    const participant = participantId
      ? await (async () => {
          const db = await import("../../../services/Offlinedb");
          const all = await db.getAllCheckedIn();
          return (
            all.find((p) => p.id === participantId) ??
            (await findParticipantByQrCode(qrCode))
          );
        })()
      : await findParticipantByQrCode(qrCode);
    if (!participant) {
      setErrorMsg("Participante não encontrado.");
      setStatus("error");
      setModalOpen(true);
      return;
    }
    const alreadyCheckedIn = participant.checkedIn;
    const checkedInAt = alreadyCheckedIn
      ? participant.checkedInAt ?? new Date().toISOString()
      : new Date().toISOString();
    if (!alreadyCheckedIn) {
      await markCheckedInLocally(participant.id, user?.id ?? null, checkedInAt);
      await enqueueCheckIn({
        id: participant.id,
        qrCode,
        userId: user?.id ?? null,
        queuedAt: checkedInAt,
        synced: false,
      });
      setPendingCount((n) => n + 1);
    }
    finalizeCheckIn({
      participant: { ...participant, checkedIn: true, checkedInAt },
      alreadyCheckedIn,
    });
  };

  const finalizeCheckIn = (res: CheckInResult) => {
    setResult(res);
    setStatus(res.alreadyCheckedIn ? "already" : "success");
    setModalOpen(true);
    setHistory((prev) => {
      if (prev.some((r) => r.participantId === res.participant.id)) return prev;
      return [
        {
          participantId: res.participant.id,
          name: res.participant.name,
          document: res.participant.document,
          ticketType: res.participant.ticketType,
          scannedAt: res.participant.checkedInAt
            ? new Date(res.participant.checkedInAt)
            : new Date(),
          scannedByName: user?.name ?? "—",
          alreadyCheckedIn: res.alreadyCheckedIn,
        },
        ...prev,
      ];
    });
  };

  const handleScanNext = () => {
    setModalOpen(false);
    setResult(null);
    setErrorMsg("");
    setTimeout(() => startScanner(), 300);
  };

  useEffect(() => () => stopScanner(), []);

  // ─── Busca manual ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (manualDebounce.current) clearTimeout(manualDebounce.current);
    if (!manualTerm.trim()) {
      setManualResults([]);
      return;
    }
    manualDebounce.current = setTimeout(async () => {
      setManualSearching(true);
      const results = await searchParticipants(manualTerm);
      setManualResults(results);
      setManualSearching(false);
    }, 300);
  }, [manualTerm]);

  const handleManualCheckIn = async () => {
    if (!confirmTarget) return;
    setManualLoading(true);
    setConfirmOpen(false);
    setStatus("loading");
    await handleCheckIn(confirmTarget.qrCode ?? "", confirmTarget.id);
    setManualLoading(false);
    setManualTerm("");
    setManualResults([]);
    setConfirmTarget(null);
  };

  // ─── Formatação ─────────────────────────────────────────────────────────────
  const ticketLabel = (t: string) =>
    ({ all: "Inteiro", half: "Meia", vip: "VIP" }[t] ?? t);
  const formatTime = (d: Date | string) =>
    (typeof d === "string" ? new Date(d) : d).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  const formatCPF = (doc: string) => {
    const d = doc.replace(/\D/g, "");
    return d.length === 11
      ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : doc;
  };

  const filteredHistory = history.filter((r) => {
    const term = searchTerm.trim();
    if (!term) return true;
    const digits = term.replace(/\D/g, "");
    return (
      r.name.toLowerCase().includes(term.toLowerCase()) ||
      (digits && r.document.replace(/\D/g, "").includes(digits))
    );
  });

  const noCache = !isOnline && cacheCount === 0;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge />
          <Typography variant="h5">Credenciamento</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {pendingCount > 0 && (
            <Tooltip
              title={`${pendingCount} check-in(s) aguardando sincronização`}
            >
              <Chip
                icon={<Sync fontSize="small" />}
                label={pendingCount}
                color="warning"
                size="small"
              />
            </Tooltip>
          )}
          {syncStatus === "syncing" && (
            <Chip
              icon={<Sync fontSize="small" />}
              label="Sincronizando..."
              size="small"
            />
          )}
          {syncStatus === "synced" && (
            <Chip
              icon={<CloudDone fontSize="small" />}
              label="Sincronizado"
              color="success"
              size="small"
            />
          )}
          <Chip
            icon={
              isOnline ? (
                <Wifi fontSize="small" />
              ) : (
                <WifiOff fontSize="small" />
              )
            }
            label={isOnline ? "Online" : "Offline"}
            color={isOnline ? "success" : "warning"}
            size="small"
          />
        </Box>
      </Box>

      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Modo offline.</strong> Check-ins serão sincronizados quando a
          internet voltar.
          {cacheCount > 0
            ? ` Cache: ${cacheCount} participantes.`
            : " Sem dados em cache."}
        </Alert>
      )}

      {/* Painel principal */}
      <Paper sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 2,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => {
              setActiveTab(v);
              stopScanner();
              setStatus("idle");
            }}
          >
            <Tab
              icon={<QrCodeScanner fontSize="small" />}
              iconPosition="start"
              label="Scanner QR"
            />
            <Tab
              icon={<PersonSearch fontSize="small" />}
              iconPosition="start"
              label="Busca Manual"
            />
          </Tabs>
          {cacheLoading ? (
            <Typography variant="caption" color="text.secondary">
              Atualizando cache...
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary">
              {cacheCount} em cache
            </Typography>
          )}
        </Box>
        {cacheLoading && <LinearProgress sx={{ mx: 3, borderRadius: 1 }} />}
        <Divider />

        <Box sx={{ p: 3 }}>
          {/* ── Aba Scanner ── */}
          {activeTab === 0 && (
            <>
              {cameraError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {cameraError}
                </Alert>
              )}

              <Box
                sx={{
                  display: status === "scanning" ? "flex" : "none",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 360,
                    aspectRatio: "1",
                    borderRadius: 2,
                    overflow: "hidden",
                    background: "#000",
                    border: "3px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <video
                    ref={videoRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    autoPlay
                    playsInline
                    muted
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: 180,
                        height: 180,
                        border: "2px solid rgba(255,255,255,0.85)",
                        borderRadius: 2,
                        boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
                      }}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  Aponte para o QR Code do ingresso
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    stopScanner();
                    setStatus("idle");
                  }}
                >
                  Cancelar
                </Button>
              </Box>

              {status === "loading" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 4,
                    gap: 2,
                  }}
                >
                  <CircularProgress size={52} />
                  <Typography color="text.secondary">
                    Verificando ingresso...
                  </Typography>
                </Box>
              )}

              {(status === "idle" ||
                status === "success" ||
                status === "already" ||
                status === "error") && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<QrCodeScanner />}
                  onClick={startScanner}
                  fullWidth
                  disabled={noCache}
                >
                  {status === "idle" ? "Iniciar Scanner" : "Escanear Próximo"}
                </Button>
              )}
              {noCache && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  Conecte-se à internet para baixar os dados antes de usar
                  offline.
                </Typography>
              )}
            </>
          )}

          {/* ── Aba Busca Manual ── */}
          {activeTab === 1 && (
            <>
              <TextField
                fullWidth
                autoFocus
                label="Buscar por nome, e-mail ou CPF"
                placeholder="Digite para buscar..."
                value={manualTerm}
                onChange={(e) => setManualTerm(e.target.value)}
                disabled={noCache}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {manualSearching ? (
                        <CircularProgress size={18} />
                      ) : (
                        <Search fontSize="small" />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              {noCache && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Sem dados em cache. Conecte-se à internet para habilitar a
                  busca.
                </Alert>
              )}

              {manualResults.length > 0 && (
                <List disablePadding sx={{ mt: 2 }}>
                  {manualResults.map((p, i) => (
                    <Box key={p.id}>
                      <ListItem
                        disablePadding
                        sx={{ py: 1.5 }}
                        secondaryAction={
                          p.checkedIn ? (
                            <Chip
                              icon={<CheckCircle fontSize="small" />}
                              label="Já credenciado"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<HowToReg fontSize="small" />}
                              onClick={() => {
                                setConfirmTarget(p);
                                setConfirmOpen(true);
                              }}
                              disabled={manualLoading}
                            >
                              Credenciar
                            </Button>
                          )
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography fontWeight={500}>{p.name}</Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
                              {formatCPF(p.document)}
                              {p.email ? ` · ${p.email}` : ""}
                              {" · "}
                              {ticketLabel(p.ticketType)}
                              {p.checkedIn && p.checkedInAt ? (
                                <>
                                  {" "}
                                  ·{" "}
                                  <strong>
                                    Entrada: {formatTime(p.checkedInAt)}
                                  </strong>
                                </>
                              ) : (
                                ""
                              )}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {i < manualResults.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}

              {manualTerm.trim() &&
                !manualSearching &&
                manualResults.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    Nenhum participante encontrado para "{manualTerm}".
                  </Typography>
                )}
            </>
          )}
        </Box>
      </Paper>

      {/* ── Modal de confirmação (busca manual) ── */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <HowToReg sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h6" fontWeight={700} textAlign="center">
              Confirmar credenciamento
            </Typography>
          </Box>
          {confirmTarget && (
            <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2, mt: 1 }}>
              <Typography fontWeight={600}>{confirmTarget.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCPF(confirmTarget.document)}
              </Typography>
              {confirmTarget.email && (
                <Typography variant="body2" color="text.secondary">
                  {confirmTarget.email}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Ingresso: {ticketLabel(confirmTarget.ticketType)}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Tem certeza? Esta ação registrará a entrada do participante.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: "column" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<HowToReg />}
            onClick={handleManualCheckIn}
          >
            Sim, credenciar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setConfirmOpen(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal resultado (scanner + manual) ── */}
      <Dialog
        open={modalOpen}
        TransitionComponent={SlideUp}
        keepMounted={false}
        onClose={() => {}}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: 420,
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              py: 4,
              px: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              bgcolor:
                status === "success"
                  ? "success.main"
                  : status === "already"
                  ? "warning.main"
                  : "error.main",
              color: "#fff",
            }}
          >
            {status === "success" && (
              <>
                <CheckCircle sx={{ fontSize: 64 }} />
                <Typography variant="h5" fontWeight={700} textAlign="center">
                  ENTRADA LIBERADA
                </Typography>
              </>
            )}
            {status === "already" && (
              <>
                <WarningAmber sx={{ fontSize: 64 }} />
                <Typography variant="h5" fontWeight={700} textAlign="center">
                  JÁ CREDENCIADO
                </Typography>
              </>
            )}
            {status === "error" && (
              <>
                <ErrorOutline sx={{ fontSize: 64 }} />
                <Typography variant="h5" fontWeight={700} textAlign="center">
                  ACESSO NEGADO
                </Typography>
              </>
            )}
            {!isOnline && (
              <Chip
                icon={<WifiOff fontSize="small" />}
                label="Registrado offline"
                size="small"
                sx={{ bgcolor: "rgba(0,0,0,0.2)", color: "#fff" }}
              />
            )}
          </Box>

          <Box sx={{ px: 3, pt: 3, pb: 1 }}>
            {status === "error" ? (
              <Typography color="error.main" textAlign="center">
                {errorMsg}
              </Typography>
            ) : result ? (
              <>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {result.participant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CPF: {formatCPF(result.participant.document)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresso: {ticketLabel(result.participant.ticketType)}
                </Typography>
                {status === "already" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {result.participant.checkedInAt ? (
                      <>
                        Entrada registrada às{" "}
                        <strong>
                          {formatTime(result.participant.checkedInAt)}
                        </strong>
                        . Este ingresso não pode ser reutilizado.
                      </>
                    ) : (
                      "Este ingresso já foi utilizado anteriormente."
                    )}
                  </Alert>
                )}
              </>
            ) : null}
          </Box>

          <Box
            sx={{
              px: 3,
              pb: 3,
              pt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {activeTab === 0 && (
              <Button
                variant="contained"
                size="large"
                startIcon={<QrCodeScanner />}
                onClick={handleScanNext}
                fullWidth
                color={
                  status === "success"
                    ? "success"
                    : status === "already"
                    ? "warning"
                    : "error"
                }
              >
                Escanear Próximo
              </Button>
            )}
            <Button
              variant="text"
              size="small"
              onClick={() => setModalOpen(false)}
              fullWidth
              sx={{ color: "text.secondary" }}
            >
              Fechar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── Histórico ── */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <History fontSize="small" />
          <Typography variant="h6">
            Check-ins de hoje
            {!historyLoading && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                ({history.length} total
                {searchTerm && ` · ${filteredHistory.length} exibidos`})
              </Typography>
            )}
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Divider sx={{ mb: 1 }} />

        {historyLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : filteredHistory.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 2, textAlign: "center" }}
          >
            {searchTerm
              ? `Nenhum resultado para "${searchTerm}"`
              : "Nenhum check-in registrado hoje."}
          </Typography>
        ) : (
          <List disablePadding>
            {filteredHistory.map((record, i) => (
              <Box key={`${record.participantId}-${i}`}>
                <ListItem
                  disablePadding
                  sx={{ py: 1.5 }}
                  secondaryAction={
                    <Chip
                      label={record.alreadyCheckedIn ? "DUPLICADO" : "OK"}
                      color={record.alreadyCheckedIn ? "warning" : "success"}
                      size="small"
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={500}>
                        {record.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {formatCPF(record.document)} ·{" "}
                        {ticketLabel(record.ticketType)} ·{" "}
                        {formatTime(record.scannedAt)} · por{" "}
                        <strong>{record.scannedByName}</strong>
                      </Typography>
                    }
                  />
                </ListItem>
                {i < filteredHistory.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default Credentialing;
