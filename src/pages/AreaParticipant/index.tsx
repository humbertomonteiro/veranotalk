import { useState } from "react";
import styles from "./areaParticipant.module.css";
import Title from "../../components/shared/Title";
import MainButton from "../../components/shared/MainButton";
import { type ParticipantDTO } from "../../domain/entities";
import { ToastContainer, toast } from "react-toastify";
import { RiMenu2Fill } from "react-icons/ri";

const AreaParticipante = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [documento, setDocumento] = useState<string>("");
  const [participanteData, setParticipanteData] =
    useState<ParticipantDTO | null>(null);
  const [checkoutData, setCheckoutData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ingressos");
  const [showAsideMobile, setShowAsideMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthentication = async () => {
    if (!documento) {
      toast.error("Por favor, preencha o CPF");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://veranotalk-backend.onrender.com/participant/${documento}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar participante");
      }

      const data = await response.json();
      setParticipanteData({
        id: data.participant.id,
        name: data.participant.name,
        email: data.participant.email,
        phone: data.participant.phone,
        document: data.participant.document,
        ticketType: data.participant.ticketType,
        checkedIn: data.participant.chekcedIn,
      });
      setCheckoutData(data.checkout);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error("Erro ao autenticar. Verifique o CPF e tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setParticipanteData(null);
    setCheckoutData(null);
    setDocumento("");
  };

  const downloadQRCode = async (qrCode: string) => {
    try {
      const response = await fetch(
        `https://veranotalk-backend.onrender.com/participant/validate-qr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: participanteData?.id,
            qrCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao validar QR code");
      }

      const data = await response.json();
      if (data.isValid) {
        toast.success("QR Code válido! Download iniciado.");
        // Implementar download real (ex.: gerar imagem ou PDF)
        console.log("Download QR Code:", qrCode);
      } else {
        toast.error("QR Code inválido.");
      }
    } catch (error) {
      toast.error("Erro ao validar QR Code.");
      console.error(error);
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await fetch(
        `https://veranotalk-backend.onrender.com/participant/${participanteData?.id}/certificate`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar certificado");
      }

      const data = await response.json();
      if (data.available) {
        toast.success("Certificado disponível! Download iniciado.");
        window.location.href = data.url;
      } else {
        toast.info("Certificado ainda não disponível.");
      }
    } catch (error) {
      toast.error("Erro ao buscar certificado.");
      console.error(error);
    }
  };

  if (!isAuthenticated || !participanteData || !checkoutData) {
    return (
      <section className={styles.section}>
        <Title>Acesso do Participante</Title>
        <ToastContainer />
        <div className={styles.container}>
          <div className={styles.authCard}>
            <div className={styles.header}>
              <h3>ACESSO RESTRITO</h3>
              <div className={styles.divider}></div>
            </div>

            <div className={styles.authForm}>
              <label htmlFor="documento" className={styles.label}>
                Digite seu CPF:
              </label>
              <input
                type="text"
                id="documento"
                className={styles.input}
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="000.000.000-00"
              />

              <div className={styles.buttonWrapper}>
                <MainButton
                  data={{
                    type: "button",
                    color: "gold",
                    text: isLoading ? "CARREGANDO..." : "ACESSAR ÁREA",
                    onClick: handleAuthentication,
                    disabled: isLoading,
                  }}
                />
              </div>

              <p className={styles.helpText}>
                Caso tenha dificuldades, entre em contato com nosso suporte.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "ingressos":
        return (
          <>
            <div className={styles.ticketsContainer}>
              <div className={styles.ticketCard}>
                <div className={styles.qrCodeContainer}>
                  <div className={styles.qrCodePlaceholder}>
                    QR Code: {checkoutData.metadata?.qrCode || "N/A"}
                  </div>
                </div>

                <div className={styles.ticketInfo}>
                  <h4>Ingresso {participanteData.ticketType}</h4>
                  {/* <p>Lote: {checkoutData.metadata?.batch || "1º Lote"}</p>
                  <p>
                    Status:{" "}
                    <span className={styles.statusActive}>
                      {participanteData.status || "Ativo"}
                    </span>
                  </p> */}
                  <button
                    className={styles.downloadButton}
                    onClick={() =>
                      downloadQRCode(checkoutData.metadata?.qrCode || "")
                    }
                  >
                    Baixar QR Code
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.eventInfoSection}>
              <h4 className={styles.sectionTitle}>INFORMAÇÕES IMPORTANTES</h4>
              <ul className={styles.infoList}>
                <li>Chegar com 1h de antecedência</li>
                <li>Levar documento com foto</li>
                <li>
                  Não será permitida a entrada após o início das palestras
                </li>
              </ul>
            </div>
          </>
        );

      case "certificado":
        return (
          <div className={styles.certificateContainer}>
            {checkoutData.status === "approved" ? (
              <>
                <p>Verificando disponibilidade do certificado...</p>
                <button
                  className={styles.downloadButton}
                  onClick={downloadCertificate}
                >
                  Baixar Certificado
                </button>
              </>
            ) : (
              <p>Certificado disponível apenas para pagamentos aprovados.</p>
            )}
          </div>
        );

      case "evento":
        return (
          <div className={styles.eventInfoTab}>
            <p>
              Informações detalhadas sobre o evento:{" "}
              {checkoutData.metadata?.eventId}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div
            className={styles.burguer}
            onClick={() => setShowAsideMobile(!showAsideMobile)}
          >
            <RiMenu2Fill />
          </div>
          <aside
            className={styles.sidebar}
            data-show-aside-mobile={showAsideMobile}
          >
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {participanteData.name.charAt(0)}
              </div>
              <div className="">
                <h4 className={styles.userName}>{participanteData.name}</h4>
                <p className={styles.userEmail}>{participanteData.email}</p>
              </div>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.navButton} ${
                  activeTab === "ingressos" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("ingressos");
                  setShowAsideMobile(false);
                }}
              >
                Meus Ingressos
              </button>
              <button
                className={`${styles.navButton} ${
                  activeTab === "certificado" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("certificado");
                  setShowAsideMobile(false);
                }}
              >
                Certificado
              </button>
              <button
                className={`${styles.navButton} ${
                  activeTab === "evento" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("evento");
                  setShowAsideMobile(false);
                }}
              >
                Informações do Evento
              </button>
            </nav>

            <button className={styles.logoutButton} onClick={handleLogout}>
              Sair da Conta
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setShowAsideMobile(false)}
            >
              Fechar
            </button>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.card}>
              <div className={styles.header}>
                <h3>{activeTab.toUpperCase()}</h3>
                <div className={styles.divider}></div>
              </div>

              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default AreaParticipante;
