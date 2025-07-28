import styles from "./timeline.module.css";
import Title from "../../shared/Title";

export default function Timeline() {
  return (
    <section className={styles.section}>
      <Title>Cronograma</Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h3>PROGRAMAÇÃO DO EVENTO</h3>
              <div className={styles.divider}></div>
            </div>

            <div className={styles.message}>
              <p>O cronograma completo será divulgado em breve.</p>
              <p>Fique atento às nossas redes sociais para mais informações.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
