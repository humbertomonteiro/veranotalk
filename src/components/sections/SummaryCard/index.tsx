import type { Participant } from "../../../pages/Checkout";
import styles from "./summarryCard.module.css";
import MainButton from "../../shared/MainButton";
import type { FormEvent } from "react";
import { useCheckout } from "../../../hooks/useCheckout";
import { Checkout } from "../../../domain/entities";
import { config } from "../../../config";
import { useState } from "react";
import { toast } from "react-toastify";

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
  totalTickets,
  fullTickets,
  halfTickets,
  totalAmount,
  participants,
}: SummaryCardProps) {
  const { setCheckout } = useCheckout();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (participants.length !== totalTickets) {
      toast.error(
        `Por favor, adicione informações para todos os ${totalTickets} participantes`
      );
      return;
    }

    if (loading) return; // Evita múltiplos cliques enquanto está carregando

    const checkoutData = {
      participants: participants.map((p) => ({
        ...p,
        ticketType: p.ticketType === "all" ? "all" : "half",
      })),
      checkout: {
        fullTickets,
        halfTickets,
        metadata: {
          eventId: "verano-talk-2025",
        },
      },
    };

    try {
      setLoading(true);
      toast.info("Processando seu pagamento...", { autoClose: false });

      const response = await fetch(`${config.baseUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar checkout");
      }

      const data: ResponseOutput = await response.json();

      setCheckout(data.dataCheckout);
      localStorage.setItem("checkoutId-verano-talk", data.checkoutId);
      toast.dismiss(); // Fecha o toast de "Processando..."
      toast.success("Redirecionando para o Mercado Pago...");
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.dismiss();
      toast.error(
        "Ocorreu um erro ao processar seu pagamento. Tente novamente."
      );
    } finally {
      setLoading(false);
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
              <span>{halfTickets} x R$ 249,50</span>
            </div>
          )}

          <div className={styles.divider}></div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>R$ {totalAmount.toFixed(2)}</span>
          </div>

          {participants.length === totalTickets ? (
            <MainButton
              data={{
                type: "button",
                text: loading ? "Processando..." : "IR PARA O PAGAMENTO",
                color: "gold",
                onClick: handleSubmit,
                disabled: loading,
              }}
            />
          ) : (
            <p className={styles.completeInfoMessage}>
              Complete as informações de todos os participantes para finalizar
              <MainButton
                data={{
                  type: "link",
                  text: "Adicione os participantes",
                  color: "black",
                  link: "#formParticipant",
                }}
              />
            </p>
          )}
        </>
      ) : (
        <p>Selecione a quantidade de ingressos</p>
      )}
    </div>
  );
}
