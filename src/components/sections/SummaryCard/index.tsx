import type { Participant } from "../../../pages/Checkout";
import styles from "./summarryCard.module.css";
import MainButton from "../../shared/MainButton";
import type { FormEvent } from "react";
import { useCheckout } from "../../../hooks/useCheckout";
import { Checkout } from "../../../domain/entities";

interface SummaryCardProps {
  totalTickets: number;
  halfTickets: number;
  fullTickets: number;
  totalAmount: number;
  participants: Participant[];
}

export type CheckoutStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "refunded"
  | "cancelled"
  | "failed";

interface ResponseOutput {
  checkoutId: string;
  paymentUrl: string;
  status: CheckoutStatus;
  dataCheckout: Checkout;
}

export default function SummaryCard({
  totalAmount,
  totalTickets,
  fullTickets,
  halfTickets,
  participants,
}: SummaryCardProps) {
  const { setCheckout } = useCheckout();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (participants.length !== totalTickets) {
      alert(
        `Por favor, adicione informações para todos os ${totalTickets} participantes`
      );
      return;
    }

    const checkoutData = {
      participants: participants.map((p) => ({
        ...p,
        ticketType: p.ticketType === "all" ? "all" : "half",
      })),
      checkout: {
        totalAmount,
        metadata: {
          eventId: "verano-talk-2025",
        },
      },
    };

    try {
      const response = await fetch(
        "https://veranotalk-backend.onrender.com/checkout",
        // "http://localhost:3000/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkoutData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao processar checkout");
      }

      const data: ResponseOutput = await response.json();

      // alert("Redirecionando para o Mercado Pago...");
      setCheckout(data.dataCheckout);
      localStorage.setItem("checkoutId-verano-talk", data.checkoutId);
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Ocorreu um erro ao processar seu pagamento");
    }
  };

  return (
    <div className={styles.summaryCard}>
      <h4>Resumo do Pedido</h4>

      {totalTickets > 0 ? (
        <>
          <div className={styles.summaryItem}>
            <span>Ingressos Inteiros</span>
            <span>{fullTickets} x R$ 499,00</span>
          </div>

          {halfTickets > 0 && (
            <div className={styles.summaryItem}>
              <span>Ingressos Meia</span>
              <span>{halfTickets} x R$ 249,90</span>
            </div>
          )}

          <div className={styles.divider}></div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>R$ {totalAmount.toFixed(2)}</span>
          </div>

          {participants.length === totalTickets ? (
            // <div onClick={handleSubmit}>
            <MainButton
              data={{
                type: "button",
                text: "IR PARA O PAGAMENTO",
                color: "gold",
                onClick: handleSubmit,
              }}
            />
          ) : (
            // </div>
            <p className={styles.completeInfoMessage}>
              Complete as informações de todos os participantes para finalizar
            </p>
          )}
        </>
      ) : (
        <p>Selecione a quantidade de ingressos</p>
      )}
    </div>
  );
}
