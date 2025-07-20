// hero.jsx
import MainButton from "../../shared/MainButton";
import styles from "./hero.module.css";

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
            Um evento onde moda, vendas, posicionamento e inovação se encontram
            para transformar a forma como empreendemos.
          </p>
        </div>

        <div className={styles.callToAction}>
          <div className={styles.highlightBox}>
            <span>SÃO LUIS - MARANHÃO</span>
            <div className={styles.divider}></div>
            <span>16/10/2025 - Das 09 as 21 horas </span>
          </div>

          <div className={styles.desktop}>
            <SubText />
          </div>
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

      <div className={styles.mobile}>
        <SubText />
      </div>
    </section>
  );
}
