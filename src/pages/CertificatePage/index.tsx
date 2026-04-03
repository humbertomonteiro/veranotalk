import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import MainButton from "../../components/shared/MainButton";
import Title from "../../components/shared/Title";
import TopBar from "../../components/template/Topbar";
import Footer from "../../components/template/Footer";
import { config } from "../../config";
import {
  loadCertificateConfig,
  renderCertificateCanvas,
  downloadCertificatePDF,
} from "../../utils/generateCertificate";
import styles from "./certificatePage.module.css";

type PageState = "form" | "loading" | "ready" | "error";

interface ParticipantInfo {
  id: string;
  name: string;
  document: string;
}

export default function CertificatePage() {
  const [cpf, setCpf] = useState("");
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [participant, setParticipant] = useState<ParticipantInfo | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Formata CPF enquanto digita: 000.000.000-00
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    const formatted = digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(formatted);
  };

  const handleSubmit = async () => {
    const digits = cpf.replace(/\D/g, "");

    if (digits.length !== 11) {
      toast.error("CPF inválido. Digite os 11 dígitos.");
      return;
    }

    setPageState("loading");
    setErrorMsg("");

    try {
      // Busca participante pelo CPF
      const res = await fetch(`${config.baseUrl}/participant/${digits}`);

      if (!res.ok) {
        if (res.status === 404) {
          setErrorMsg("CPF não encontrado. Verifique e tente novamente.");
        } else {
          setErrorMsg("Erro ao buscar dados. Tente novamente em instantes.");
        }
        setPageState("error");
        return;
      }

      const data = await res.json();
      const p = data.participant;
      const checkout = data.checkout;

      // Verifica se o checkout foi aprovado
      if (!checkout || checkout.status !== "approved") {
        setErrorMsg(
          "Não encontramos um pagamento aprovado para este CPF. Se acredita que houve um erro, entre em contato com o suporte."
        );
        setPageState("error");
        return;
      }

      // Carrega config do certificado
      const cfg = await loadCertificateConfig();
      if (!cfg.imageBase64) {
        setErrorMsg(
          "O certificado ainda não está disponível. Tente novamente em breve."
        );
        setPageState("error");
        return;
      }

      // Gera o canvas com o nome
      const canvas = await renderCertificateCanvas(
        p.name,
        cfg,
        cfg.imageBase64
      );

      // Cria URL de preview (JPEG para exibir na tela)
      const previewUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCertificateUrl(previewUrl);
      setParticipant({ id: p.id, name: p.name, document: p.document });
      setPageState("ready");
    } catch {
      setErrorMsg("Erro de conexão. Verifique sua internet e tente novamente.");
      setPageState("error");
    }
  };

  const handleDownload = async () => {
    if (!participant || !certificateUrl) return;
    setDownloading(true);
    try {
      const cfg = await loadCertificateConfig();
      if (!cfg.imageBase64) {
        toast.error("Certificado indisponível.");
        return;
      }

      // Tenta download automático via jsPDF
      await downloadCertificatePDF(
        participant.name,
        cfg,
        cfg.imageBase64,
        `certificado-verano-talk-${participant.id}`
      );
    } catch {
      // Fallback: abre a imagem numa nova aba para salvar manualmente
      if (downloadLinkRef.current && certificateUrl) {
        downloadLinkRef.current.href = certificateUrl;
        downloadLinkRef.current.download = `certificado-verano-talk.jpg`;
        downloadLinkRef.current.click();
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleReset = () => {
    setCpf("");
    setPageState("form");
    setParticipant(null);
    setCertificateUrl(null);
    setErrorMsg("");
  };

  return (
    <div className={styles.page}>
      <TopBar />
      <ToastContainer />

      <section className={styles.section}>
        <Title>Emita seu Certificado</Title>

        <div className={styles.container}>
          {/* ── Formulário ── */}
          {pageState === "form" && (
            <div className={styles.card}>
              <div className={styles.header}>
                <h3>CERTIFICADO DE PARTICIPAÇÃO</h3>
                <div className={styles.divider} />
              </div>
              <p className={styles.description}>
                Digite seu CPF para buscar e baixar seu certificado do Verano
                Talk 2026.
              </p>
              <div className={styles.form}>
                <label htmlFor="cpf" className={styles.label}>
                  Seu CPF:
                </label>
                <input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <div className={styles.buttonWrapper}>
                  <MainButton
                    data={{
                      type: "button",
                      color: "gold",
                      text: "BUSCAR CERTIFICADO",
                      onClick: handleSubmit,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {pageState === "loading" && (
            <div className={styles.card}>
              <div className={styles.loadingWrapper}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Gerando seu certificado...</p>
              </div>
            </div>
          )}

          {/* ── Erro ── */}
          {pageState === "error" && (
            <div className={styles.card}>
              <div className={styles.header}>
                <h3>NÃO FOI POSSÍVEL GERAR</h3>
                <div className={styles.divider} />
              </div>
              <p className={styles.errorMsg}>{errorMsg}</p>
              <div className={styles.buttonWrapper}>
                <MainButton
                  data={{
                    type: "button",
                    color: "gold",
                    text: "TENTAR NOVAMENTE",
                    onClick: handleReset,
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Certificado pronto ── */}
          {pageState === "ready" && participant && certificateUrl && (
            <div className={styles.readyWrapper}>
              <div className={styles.successBadge}>
                ✓ Certificado gerado com sucesso!
              </div>

              <p className={styles.participantName}>{participant.name}</p>

              {/* Preview do certificado */}
              <div className={styles.previewWrapper}>
                <img
                  src={certificateUrl}
                  alt="Preview do certificado"
                  className={styles.preview}
                />
              </div>

              {/* Botões de ação */}
              <div className={styles.actions}>
                <MainButton
                  data={{
                    type: "button",
                    color: "gold",
                    text: downloading
                      ? "BAIXANDO..."
                      : "BAIXAR CERTIFICADO (PDF)",
                    onClick: handleDownload,
                    disabled: downloading,
                  }}
                />
                {/* Link oculto — fallback se o PDF não abrir */}
                <a
                  ref={downloadLinkRef}
                  style={{ display: "none" }}
                  href={certificateUrl}
                  download="certificado-verano-talk.jpg"
                >
                  fallback
                </a>
                <p className={styles.fallbackHint}>
                  Se o download não iniciar automaticamente, pressione e segure
                  a imagem acima e escolha "Salvar imagem".
                </p>
              </div>

              <button className={styles.resetBtn} onClick={handleReset}>
                Buscar outro CPF
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
