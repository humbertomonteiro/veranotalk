// hero.jsx
import MainButton from "../../shared/MainButton";
import styles from "./hero.module.css";

import woman1 from "../../../assets/shared/woman-1.jpg";
import woman2 from "../../../assets/shared/woman-2.jpg";
import woman3 from "../../../assets/shared/woman-3.jpg";

function SubText() {
  return (
    <div className={styles.subText}>
      <h2 className={styles.mainMessage}>
        CONEXÕES QUE <span>ELEVAM</span> SEU NEGÓCIO
      </h2>
      <p className={styles.subMessage}>
        O mercado mudou, e os negócios que se destacam entenderam isso.
      </p>
      <p className={styles.subMessage}>
        Empreender vai além de vender, é sobre construir uma identidade e gerar
        presença onde as decisões de compra acontecem: na mente e no coração do
        consumidor.
      </p>
      <p className={styles.subMessage}>
        Mais do que nunca, posicionamento, inovação e atitude caminham lado a
        lado com estratégia. E visibilidade, hoje, é um ativo valioso demais
        para ser negligenciado.
      </p>
      <p className={styles.subMessage}>
        O Verano Talk nasce do olhar atento às transformações do mercado e da
        certeza de que os negócios que ousam se comunicar com autenticidade,
        crescem com consistência.
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.container}>
      <div className={styles.text}>
        <div className={styles.title}>
          <h1>VERANO TALK</h1>
          <p className={styles.tagline}>
            Um evento onde Negócios. Posicionamento, vendas e moda se encontram
            para transformar a forma como empreendemos.
          </p>
        </div>

        <div className={styles.callToAction}>
          <div className={styles.highlightBox}>
            <span>SÃO LUIS - MARANHÃO</span>
            <div className={styles.divider}></div>
            <span>16/10/2025 - Das 09 as 20 horas </span>
          </div>

          <MainButton
            data={{
              type: "link",
              link: "#tickets",
              text: "GARANTA SEU INGRESSO",
              color: "gold", // Usando o botão dourado que criamos anteriormente
            }}
          />
          <div className={styles.desktop}>
            <SubText />
          </div>
        </div>
      </div>

      <div className={styles.images}>
        <img
          src={woman2}
          alt="Modelo empreendedora"
          className={styles.mainImage}
        />
        <div className={styles.secondaryImages}>
          <img src={woman3} alt="Participantes do evento" />
          <img src={woman1} alt="Palestrante no evento" />
        </div>
      </div>

      <div className={styles.mobile}>
        <SubText />
      </div>
    </section>
  );
}
