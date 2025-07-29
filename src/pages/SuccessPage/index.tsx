import { Link } from "react-router-dom";
import AreaParticipant from "../../components/sections/AreaParticipant";
import SummaryCheckout from "../../components/sections/SummaryCheckout";
import styles from "./succesPage.module.css";
import { useCheckout } from "../../hooks/useCheckout";
import { useEffect, useState } from "react";
import { Checkout } from "../../domain/entities";

const SuccessPage = () => {
  const { checkout, setCheckout } = useCheckout();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckout = async () => {
      const checkoutId = localStorage.getItem("checkoutId");
      if (!checkoutId) {
        setError("ID do checkout não encontrado");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://veranotalk-backend.onrender.com/checkout/${checkoutId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar checkout");
        }

        const data: Checkout = await response.json();
        setCheckout(data);
        setIsLoading(false);
      } catch (err) {
        setError("Falha ao carregar os dados do checkout");
        setIsLoading(false);
        console.error(err);
      }
    };

    if (!checkout) {
      fetchCheckout();
    } else {
      setIsLoading(false);
    }
  }, [checkout, setCheckout]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error || !checkout) {
    return (
      <div className={styles.notFounded}>
        Erro: {error || "Checkout não encontrado"}
      </div>
    );
  }

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

      <SummaryCheckout checkout={checkout} />
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
