import { Link } from "react-router-dom";
import AreaParticipant from "../../components/sections/AreaParticipant";
import SummaryCheckout from "../../components/sections/SummaryCheckout";
import styles from "./succesPage.module.css";

const SuccessPage = () => {
  const paymentData = {
    participants: [
      { name: "João Silva", ticketType: "inteira" },
      { name: "Maria Souza", ticketType: "meia" },
      { name: "Carlos Oliveira", ticketType: "meia" },
    ],
    paymentInfo: {
      total: 150.0,
      fullPriceTickets: 1,
      halfPriceTickets: 2,
      transactionId: "MP123456789",
    },
    eventInfo: {
      name: "Verano Talk 2025",
      date: "16 de Outubro de 2025",
      time: "09:00 às 21:00",
      address:
        "Blue Tree Towers São Luís - Av. Avicênia, 1 - Calhau, São Luís - MA",
      speakers: [
        "Dr. Ana Costa - Inteligência Artificial",
        "Prof. Marcos Lima - Blockchain",
        "Dra. Julia Fernandes - UX Design",
      ],
    },
  };

  return (
    <div className={styles.successPage}>
      <header className={styles.successHeader}>
        <h1 className={styles.title}>Pagamento Aprovado!</h1>
        <p className={styles.thankYouMessage}>
          Obrigado por sua participação no{" "}
          <strong>{paymentData.eventInfo.name}</strong>. Seu ingresso foi
          confirmado e os detalhes estão abaixo.
        </p>
        <p className={styles.thankYouMessage}>
          Para ter acesso ao seu ingresso, entre na{" "}
          <Link to="/area-participant">área do participante</Link>.
        </p>
      </header>

      <SummaryCheckout paymentData={paymentData} />
      <AreaParticipant />

      <div className={styles.additionalInfo}>
        <p>
          Qualquer dúvida, entre em contato pelo email: veranotalk@gmail.com
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
