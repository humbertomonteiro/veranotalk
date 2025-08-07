// tickets.jsx
import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";
import styles from "./tickets.module.css";

export default function Tickets() {
  return (
    <section id="tickets" className={styles.section}>
      <Title>Ingresso</Title>
      <h3>
        Garanta seu PASSAPORTE agora com o <strong>menor valor</strong>
      </h3>
      <div className={styles.container}>
        {/* Ticket 1 - Primeiro Lote */}
        <div className={`${styles.ticket} ${styles.highlight}`}>
          <div className={styles.ribbon}>MENOR PREÇO</div>
          <div className={styles.ticketHeader}>
            <span className={styles.lote}>PRIMEIRO LOTE</span>
            <div className={styles.price}>
              <span className={styles.installment}>10x de R$</span>
              <span className={styles.value}>50</span>
              <span className={styles.cents}>,78</span>
            </div>
            <span className={styles.fullPrice}>ou R$ 499,00 à vista</span>
          </div>
          <ul className={styles.benefits}>
            <li>✓ Menor preço</li>
            <li>✓ Acesso a todas as palestras</li>
            <li>✓ Material exclusivo em PDF</li>
            {/* <li>✓ Coffee break premium</li> */}
            <li>✓ Certificado digital</li>
            {/* <li>✓ Brinde especial</li> */}
          </ul>
          <MainButton
            data={{
              type: "link",
              link: "/checkout/1",
              text: "COMPRAR AGORA",
              color: "gold",
            }}
          />
        </div>

        {/* Ticket 2 - Segundo Lote */}
        <div className={styles.ticket}>
          <div className={styles.ticketHeader}>
            <span className={styles.lote}>SEGUNDO LOTE</span>
            <div className={styles.price}>
              <span className={styles.installment}>12x de R$</span>
              <span className={styles.value}>60</span>
              <span className={styles.cents}>,95</span>
            </div>
            <span className={styles.fullPrice}>ou R$ 599,00 à vista</span>
          </div>
          <ul className={styles.benefits}>
            <li>✓ Acesso a todas as palestras</li>
            <li>✓ Material exclusivo em PDF</li>
            {/* <li>✓ Coffee break premium</li> */}
            <li>✓ Certificado digital</li>
          </ul>
          <MainButton
            data={{
              type: "link",
              link: "/checkout/2",
              text: "COMPRAR AGORA",
              color: "white",
            }}
          />
        </div>

        {/* Ticket 3 - Terceiro Lote */}
        <div className={styles.ticket}>
          <div className={styles.ticketHeader}>
            <span className={styles.lote}>TERCEIRO LOTE</span>
            <div className={styles.price}>
              <span className={styles.installment}>12x de R$</span>
              <span className={styles.value}>81</span>
              <span className={styles.cents}>,30</span>
            </div>
            <span className={styles.fullPrice}>ou R$ 799,00 à vista</span>
          </div>
          <ul className={styles.benefits}>
            <li>✓ Acesso a todas as palestras</li>
            <li>✓ Material exclusivo em PDF</li>
            <li>✓ Certificado digital</li>
            {/* <li>✓ Coffee break premium</li> */}
          </ul>
          <MainButton
            data={{
              type: "link",
              link: "/checkout/3",
              text: "COMPRAR AGORA",
              color: "white",
            }}
          />
        </div>
      </div>
    </section>
  );
}
