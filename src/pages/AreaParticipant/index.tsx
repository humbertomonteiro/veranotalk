import { useState, useCallback } from "react";
import styles from "./areaParticipant.module.css";
import Title from "../../components/shared/Title";
import MainButton from "../../components/shared/MainButton";
import { type ParticipantDTO } from "../../domain/entities";
import { ToastContainer, toast } from "react-toastify";
import { RiMenu2Fill } from "react-icons/ri";
import { QRCodeCanvas } from "qrcode.react";
import debounce from "lodash.debounce";
import { config } from "../../config";
import Location from "../../components/sections/Location";
import About from "../../components/sections/About";
import Speakers from "../../components/sections/Speakers";
import jsPDF from "jspdf";

const AreaParticipante = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [documento, setDocumento] = useState<string>("");
  const [participanteData, setParticipanteData] =
    useState<ParticipantDTO | null>(null);
  const [checkoutData, setCheckoutData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ingressos");
  const [showAsideMobile, setShowAsideMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthentication = useCallback(
    debounce(async () => {
      if (!documento) {
        toast.error("Por favor, preencha o CPF");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const normalizedDocument = documento.replace(/\D/g, "");
        console.log(
          `Enviando requisição para documento: ${normalizedDocument}`,
        );
        const response = await fetch(
          `${config.baseUrl}/participant/${normalizedDocument}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Resposta do backend:", data);
        setParticipanteData({
          id: data.participant.id,
          name: data.participant.name,
          email: data.participant.email,
          phone: data.participant.phone,
          document: data.participant.document,
          ticketType: data.participant.ticketType,
          checkedIn: data.participant.checkedIn,
          qrCode: data.participant.qrCode,
        });
        setCheckoutData(data.checkout);
        setIsAuthenticated(true);
      } catch (error) {
        toast.error("Erro ao autenticar. Verifique o CPF e tente novamente.");
        console.error("Erro no handleAuthentication:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [documento],
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    setParticipanteData(null);
    setCheckoutData(null);
    setDocumento("");
  };

  const downloadQRCode = async () => {
    try {
      const canvas = document.getElementById(
        "qrCodeCanvas",
      ) as HTMLCanvasElement;
      if (
        !canvas ||
        !participanteData?.qrCode ||
        participanteData.qrCode === "••••-••••"
      ) {
        toast.error("QR Code não disponível para download.");
        return;
      }

      const qrImage = canvas.toDataURL("image/png");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Cores do tema
      const primaryColor = "#000000"; // Preto
      // const secondaryColor = "#ddd3c3"; // Bege

      // Configurações gerais
      doc.setFont("helvetica", "normal");
      doc.setTextColor(primaryColor);

      // Cabeçalho (topo da página)
      doc.setFontSize(16);
      doc.text("VERANO TALK 2026", 105, 20, { align: "center" });
      doc.setFontSize(10);
      doc.text("21 DE MARÇO | SÃO LUÍS - MA", 105, 26, { align: "center" });

      // Linha divisória do cabeçalho
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.2);
      doc.line(30, 30, 180, 30);

      // Posicionamento central do conteúdo (calculado para centralizar verticalmente)
      const startY = 70; // Posição Y onde começa o conteúdo principal

      // QR Code (lado esquerdo)
      doc.addImage(qrImage, "PNG", 35, startY, 50, 50);

      // Informações (lado direito)
      doc.setFontSize(12);
      doc.text("INGRESSO VERANO TALK - 2026", 110, startY + 5);

      doc.setFontSize(10);
      doc.text(`NOME: ${participanteData.name}`, 110, startY + 10);
      doc.text(
        `DOCUMENTO: ${participanteData.document.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4",
        )}`,
        110,
        startY + 15,
      );
      doc.text(
        `TIPO: ${participanteData.ticketType === "all" ? "Inteiro" : "Meia"}`,
        110,
        startY + 20,
      );
      doc.text(
        `STATUS: ${
          participanteData.checkedIn ? "Check-in realizado" : "Ativo"
        }`,
        110,
        startY + 25,
      );

      // Linha divisória do rodapé
      doc.line(30, 250, 180, 250);

      // Rodapé (fundo da página)
      doc.setFontSize(8);
      doc.text("© 2025 VeranoTalk - Todos os direitos reservados", 105, 260, {
        align: "center",
      });
      doc.text("suporte@veranotalk.com.br | www.veranotalk.com.br", 105, 265, {
        align: "center",
      });

      // Baixar PDF
      doc.save(`ingresso-verano-talk-2026-${participanteData.id}.pdf`);
      toast.success("Ingresso baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar o ingresso.");
      console.error("Erro no downloadQRCode:", error);
    }
  };

  if (!isAuthenticated || !participanteData) {
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
            <div className={styles.header}>
              <h3>{activeTab.toUpperCase()}</h3>
              <div className={styles.divider}></div>
            </div>
            <div className={styles.ticketsContainer}>
              <div className={styles.ticketCard}>
                <div className={styles.qrCodeContainer}>
                  {participanteData.qrCode &&
                  participanteData.qrCode !== "••••-••••" ? (
                    <QRCodeCanvas
                      id="qrCodeCanvas"
                      value={participanteData.qrCode}
                      size={128}
                    />
                  ) : (
                    <div className={styles.qrCodePlaceholder}>
                      QR Code: Não disponível
                    </div>
                  )}
                </div>

                <div className={styles.ticketInfo}>
                  <h4>
                    Ingresso{" "}
                    {participanteData.ticketType === "all" ? "Inteiro" : "Meia"}
                  </h4>
                  <p>
                    Status:{" "}
                    {participanteData.checkedIn
                      ? "Check-in realizado"
                      : "Ativo"}
                  </p>
                  <MainButton
                    data={{
                      type: "button",
                      color: "gold",
                      text: "BAIXAR INGRESSO",
                      onClick: downloadQRCode,
                      disabled:
                        !participanteData.qrCode ||
                        participanteData.qrCode === "••••-••••",
                    }}
                  />
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
            <div className={styles.header}>
              <h3>{activeTab.toUpperCase()}</h3>
              <div className={styles.divider}></div>
            </div>
            {checkoutData && checkoutData.status === "approved" ? (
              <p>Certificado disponível após o evento.</p>
            ) : (
              <p>Certificado disponível apenas para pagamentos aprovados.</p>
            )}
          </div>
        );

      case "evento":
        return (
          <div className={styles.eventInfoTab}>
            <About />
            <Speakers />
            <Location />
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
                Ingresso
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
            <div className={styles.card}>{renderTabContent()}</div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default AreaParticipante;
