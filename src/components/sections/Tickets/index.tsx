// tickets.jsx
import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";
import styles from "./tickets.module.css";

import { FaCreditCard } from "react-icons/fa";

export default function Tickets() {
  return (
    <section id="tickets" className={styles.section}>
      <Title>Ingresso</Title>
      <div className={styles.backgroundOverlay}></div>
      <h3>
        Garanta seu PASSAPORTE agora com o <strong>menor valor</strong>
      </h3>

      {/* Informação de parcelamento destacada */}
      <div className={styles.paymentInfo}>
        <div className={styles.paymentIcon}>
          <FaCreditCard />
        </div>
        <p>
          Parcelamos em até <strong>12x</strong> no cartão |{" "}
          <strong>6x sem juros</strong>
        </p>
      </div>

      <div className={styles.container}>
        {/* Ticket 1 - Primeiro Lote */}
        <div className={`${styles.ticket} ${styles.highlight}`}>
          {/* <div className={styles.ribbon}>MENOR PREÇO</div> */}
          <div className={styles.ticketHeader}>
            <span className={styles.lote}>Ingresso</span>
            <div className={styles.price}>
              <span className={styles.installmentRegular}>12x de </span>
              <span className={styles.value}>
                <div className={styles.real}>R$</div> 48
                <span className={styles.cents}>,70</span>
              </span>
            </div>
            <div className={styles.installmentInfo}>
              <span className={styles.installmentHighlight}>
                Ou 6x sem juros de R$ 83,16
              </span>
            </div>
            <span className={styles.fullPrice}>À vista: R$ 499,00</span>
          </div>
          <ul className={styles.benefits}>
            <li>✓ Menor preço</li>
            <li>✓ Acesso a todas as palestras</li>
            <li>✓ Material exclusivo em PDF</li>
            <li>✓ Certificado digital</li>
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
        <div className={`${styles.ticket} ${styles.highlight}`}>
          <div className={styles.ribbon}>Casadinha (Mínimo 2)</div>
          <div className={styles.ticketHeader}>
            <span className={styles.lote}>Igresso - Casadinha</span>
            <div className={styles.price}>
              <span className={styles.installmentRegular}>12x de </span>

              <span className={styles.value}>
                <span className={styles.cents}>R$</span> 35
                <span className={styles.cents}>,52</span>
              </span>
              <span className={styles.installmentRegular}>(cada)</span>
            </div>
            <div className={styles.installmentInfo}>
              <span className={styles.installmentHighlight}>
                Ou 6x sem juros de R$ 58,18 (cada)
              </span>
            </div>
            <span className={styles.fullPrice}>À vista: R$ 349,00 (cada)</span>
          </div>
          <ul className={styles.benefits}>
            <li>✓ Desconto especial para duplas (mínimo 2 ingressos)</li>
            <li>✓ Acesso a todas as palestras</li>
            <li>✓ Material exclusivo em PDF</li>
            <li>✓ Certificado digital</li>
          </ul>
          <MainButton
            data={{
              type: "link",
              link: "/checkout/2",
              text: "COMPRAR AGORA",
              color: "white",
              disabled: true,
            }}
          />
        </div>

        {/* Ticket 3 - Grupo */}
        <div className={`${styles.ticket} ${styles.highlight}`}>
          <div className={styles.ribbon}>GRUPO (MÍNIMO 5)</div>
          <div className={styles.ticketHeader}>
            <span className={styles.lote}>Ingresso - GRUPO</span>
            <div className={styles.price}>
              <span className={styles.installmentRegular}>12x de </span>

              <span className={styles.value}>
                <span className={styles.cents}>R$</span> 30
                <span className={styles.cents}>,43</span>
              </span>
              <span className={styles.installmentRegular}>(cada)</span>
            </div>
            <div className={styles.installmentInfo}>
              <span className={styles.installmentHighlight}>
                Ou 6x sem juros de R$ 49,84 (cada)
              </span>
            </div>
            <span className={styles.fullPrice}>À vista: R$ 299,00 (cada)</span>
          </div>
          <ul className={styles.benefits}>
            <li>✓ Desconto especial para grupos (mínimo 5 ingressos)</li>
            <li>✓ Acesso a todas as palestras</li>
            <li>✓ Material exclusivo em PDF</li>
            <li>✓ Certificado digital</li>
          </ul>
          <MainButton
            data={{
              type: "link",
              link: "/checkout/3",
              text: "COMPRAR AGORA",
              color: "gold",
            }}
          />
        </div>
      </div>
    </section>
  );
}
