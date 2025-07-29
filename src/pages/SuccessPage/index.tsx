import { Link } from "react-router-dom";
import AreaParticipant from "../../components/sections/AreaParticipant";
import SummaryCheckout from "../../components/sections/SummaryCheckout";
import styles from "./succesPage.module.css";
import { useCheckout } from "../../hooks/useCheckout";

const SuccessPage = () => {
  const { checkout } = useCheckout();

  return (
    <div className={styles.successPage}>
      <header className={styles.successHeader}>
        <h1 className={styles.title}>Pagamento Aprovado!</h1>
        <p className={styles.thankYouMessage}>
          Obrigado por sua participação no <strong>Verano Talk</strong>. Seu
          ingresso foi confirmado e os detalhes estão abaixo.
        </p>
        <p className={styles.thankYouMessage}>
          Para ter acesso ao seu ingresso, entre na{" "}
          <Link to="/area-participant">área do participante</Link>.
        </p>
      </header>

      <SummaryCheckout paymentData={checkout} />
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
