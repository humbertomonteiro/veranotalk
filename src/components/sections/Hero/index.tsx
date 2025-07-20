// hero.jsx
import MainButton from "../../shared/MainButton";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.container}>
      <div className={styles.text}>
        <div className={styles.title}>
          <h1>VERANO TALK</h1>
          <p className={styles.tagline}>
            O EVENTO QUE VAI TRANSFORMAR SUA FORMA DE EMPREENDER
          </p>
        </div>

        <div className={styles.callToAction}>
          <div className={styles.highlightBox}>
            <span>SÃO LUIS - MARANHÃO</span>
            <div className={styles.divider}></div>
            <span>19-21 DE JULHO 2024</span>
          </div>

          <h2 className={styles.mainMessage}>
            CONEXÕES QUE <span>ELEVAM</span> SEU NEGÓCIO
          </h2>

          <p className={styles.subMessage}>
            Palestras, networking e insights transformadores com os maiores
            especialistas em comunicação, vendas e empreendedorismo do Brasil.
          </p>
        </div>

        <MainButton
          data={{
            type: "link",
            link: "#tickets",
            text: "GARANTA SEU INGRESSO",
            color: "gold", // Usando o botão dourado que criamos anteriormente
          }}
        />
      </div>

      <div className={styles.images}>
        <img
          src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg"
          alt="Modelo empreendedora"
          className={styles.mainImage}
        />
        <div className={styles.secondaryImages}>
          <img
            src="https://images.pexels.com/photos/4352249/pexels-photo-4352249.jpeg"
            alt="Participantes do evento"
          />
          <img
            src="https://images.pexels.com/photos/32935727/pexels-photo-32935727.jpeg"
            alt="Palestrante no evento"
          />
        </div>
      </div>
    </section>
  );
}
