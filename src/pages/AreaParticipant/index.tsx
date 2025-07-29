import { useState } from "react";
import styles from "./areaParticipant.module.css";
import Title from "../../components/shared/Title";
import MainButton from "../../components/shared/MainButton";
import { type Participant } from "../../types";
import { ToastContainer, toast } from "react-toastify";

import { RiMenu2Fill } from "react-icons/ri";

const AreaParticipante = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [documento, setDocumento] = useState<string>("");
  const [participanteData, setParticipanteData] = useState<Participant | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("ingressos");
  const [showAsideMobile, setShowAsideMobile] = useState(false);

  const handleAuthentication = () => {
    // Simulação de autenticação - na prática você faria uma chamada à API
    if (documento) {
      setParticipanteData({
        name: "João Silva",
        email: "joao@exemplo.com",
        phone: "(11) 99999-9999",
        tickets: { type: "Inteira", batch: "1º Lote", qrCode: "qr123456" },
        certificateAvailable: false,
      });
      setIsAuthenticated(true);
    } else {
      toast.error(
        "Documento do participante fazio! Preencha o documento do participante corretamente."
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setParticipanteData(null);
    setDocumento("");
  };

  const downloadQRCode = (qrCodeValue: string) => {
    // Implementação real viria aqui
    console.log("Download QR Code:", qrCodeValue);
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
                    text: "CESSAR ÁREA",
                    onClick: handleAuthentication,
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
                    QR Code: {participanteData.tickets.qrCode}
                  </div>
                </div>

                <div className={styles.ticketInfo}>
                  <h4>Ingresso {participanteData.tickets.type}</h4>
                  <p>Lote: {participanteData.tickets.batch}</p>
                  <p>
                    Status: <span className={styles.statusActive}>Ativo</span>
                  </p>
                  <button
                    className={styles.downloadButton}
                    onClick={() =>
                      downloadQRCode(participanteData.tickets.qrCode)
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
            {participanteData.certificateAvailable ? (
              <>
                <p>Seu certificado está disponível para download.</p>
                <button className={styles.downloadButton}>
                  Baixar Certificado
                </button>
              </>
            ) : (
              <p>
                Seu certificado estará disponível após a conclusão do evento.
              </p>
            )}
          </div>
        );

      case "evento":
        return (
          <div className={styles.eventInfoTab}>
            <p>Informações detalhadas sobre o evento.</p>
            {/* Aqui você pode reutilizar componentes da landing page */}
          </div>
        );

      //   case "dados":
      //     return (
      //       <div className={styles.dataForm}>
      //         <div className={styles.formGroup}>
      //           <label>Nome Completo</label>
      //           <input type="text" value={participanteData.name} readOnly />
      //         </div>
      //         <div className={styles.formGroup}>
      //           <label>E-mail</label>
      //           <input type="email" value={participanteData.email} readOnly />
      //         </div>
      //         <div className={styles.formGroup}>
      //           <label>Celular</label>
      //           <input type="tel" value={participanteData.phone} readOnly />
      //         </div>
      //         <button className={styles.editButton}>Editar Dados</button>
      //       </div>
      //     );

      default:
        return null;
    }
  };

  return (
    <section className={styles.section}>
      {/* <Title>Área do Participante</Title> */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Menu lateral */}
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
              {/* <button
                className={`${styles.navButton} ${
                  activeTab === "dados" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("dados");
                  setShowAsideMobile(false);
                }}
              >
                Dados Pessoais
              </button> */}
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

          {/* Conteúdo principal */}
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
