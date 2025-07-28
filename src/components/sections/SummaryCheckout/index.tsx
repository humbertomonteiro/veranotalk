import styles from "./summaryCheckout.module.css";
import Title from "../../shared/Title";

export default function SummaryCheckout({ paymentData }: any) {
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
                <span className={styles.highlightValue}>
                  {paymentData.eventInfo.name}
                </span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>TOTAL</span>
                <span className={styles.highlightValue}>
                  R$ {paymentData.paymentInfo.total.toFixed(2)}
                </span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>TRANSACTION ID</span>
                <span className={styles.highlightValue}>
                  {paymentData.paymentInfo.transactionId}
                </span>
              </div>
            </div>

            <div className={styles.participantsSection}>
              <h4 className={styles.sectionTitle}>PARTICIPANTES</h4>
              <ul className={styles.participantsList}>
                {paymentData.participants.map(
                  (participant: any, index: number) => (
                    <li key={index} className={styles.participantItem}>
                      <span className={styles.participantName}>
                        {participant.name}
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
            </div>

            <div className={styles.ticketsSummary}>
              <div className={styles.ticketCount}>
                <span>Ingressos Inteira:</span>
                <span>{paymentData.paymentInfo.fullPriceTickets}</span>
              </div>
              <div className={styles.ticketCount}>
                <span>Ingressos Meia:</span>
                <span>{paymentData.paymentInfo.halfPriceTickets}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
