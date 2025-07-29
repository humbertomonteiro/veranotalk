import styles from "./summaryCheckout.module.css";
import Title from "../../shared/Title";
import { Checkout } from "../../../domain/entities";

interface SummaryCheckoutProps {
  checkout: { props: Checkout | undefined };
}

export default function SummaryCheckout({ checkout }: SummaryCheckoutProps) {
  return (
    <section className={styles.section}>
      <Title>Resumo da Compra</Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h3>DETALHES DA SUA COMPRA</h3>
              <div className={styles.divider}></div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>EVENTO</span>
                <span className={styles.highlightValue}>Verano Talk</span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>TOTAL</span>
                <span className={styles.highlightValue}>
                  R$ {checkout?.props?.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>TRANSACTION ID</span>
                <span className={styles.highlightValue}>
                  {checkout?.props?.mercadoPagoId}
                </span>
              </div>
            </div>

            {/* <div className={styles.participantsSection}>
              <h4 className={styles.sectionTitle}>PARTICIPANTES</h4>
              <ul className={styles.participantsList}>
                {checkout.metadata?.participantIds?.map(
                  (participant: any, index: number) => (
                    <li key={index} className={styles.participantItem}>
                      <span className={styles.participantName}>
                        {participant}
                      </span>
                      <span className={styles.ticketType}>
                        {participant.ticketType === "inteira"
                          ? "Inteira"
                          : "Meia"}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div> */}

            {/* <div className={styles.ticketsSummary}>
              <div className={styles.ticketCount}>
                <span>Ingressos Inteira:</span>
                <span>{paymentData.paymentInfo.fullPriceTickets}</span>
              </div>
              <div className={styles.ticketCount}>
                <span>Ingressos Meia:</span>
                <span>{paymentData.paymentInfo.halfPriceTickets}</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
