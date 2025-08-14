// hero.jsx
import MainButton from "../../shared/MainButton";
import styles from "./hero.module.css";

import felipeTheodoro from "../../../assets/speakers/felipe-theodoro.jpeg";
import woman1 from "../../../assets/speakers/andressa-leao.jpeg";
import woman2 from "../../../assets/speakers/daniele-xavier.jpeg";
import woman3 from "../../../assets/speakers/joy-alano.jpeg";

interface HeroProps {
  sponsor?: boolean;
}

function SubText() {
  return (
    <div className={styles.subText}>
      <h2 className={styles.mainMessage}>
        CONECTE-SE AO QUE <span>ELEVA</span> O SEU NEGÓCIO
      </h2>
      <p className={styles.subMessage}>
        O encontro que vai redefinir como você vê marcas, negócios e pessoas.
      </p>
      <p className={styles.subMessage}>
        Um dia, um palco e mentes brilhantes reunidas para potencializar o seu
        jeito de pensar, criar e se posicionar.
      </p>
    </div>
  );
}

export default function Hero({ sponsor }: HeroProps) {
  return (
    <section className={styles.container}>
      <div className={styles.text}>
        <div className={styles.title}>
          <h1>VERANO TALK</h1>
          <p className={styles.tagline}>
            Um evento onde Negócios. Posicionamento, vendas e metas se encontram
            para transformar a forma como empreendemos.
          </p>
        </div>

        <div className={styles.callToAction} data-aos-delay="200">
          <div className={styles.highlightBox}>
            <span>SÃO LUIS - MARANHÃO</span>
            <div className={styles.divider}></div>
            <span>16/10/2025 - Das 09 as 20 horas </span>
          </div>

          <MainButton
            data={{
              type: "link",
              link: sponsor ? "/apoiar-categorias" : "#tickets",
              text: sponsor ? "SEJA UM APOIADOR" : "GARANTA SEU INGRESSO",
              color: "gold",
            }}
          />
          <div className={styles.desktop}>
            <SubText />
          </div>
        </div>
      </div>

      <div className={styles.images}>
        <div className={styles.mainImage}>
          <div className={styles.img}>
            <img src={felipeTheodoro} alt="Modelo empreendedora" />
            <div className={styles.imgOverlay}>
              <div className={styles.imgContent}>
                <h3>Felipe Theodoro</h3>
                <p>#Metas</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.secondaryGrid} data-aos-dalay="200">
          {/* <div className={styles.secondaryImages} > */}
          <div className={styles.img}>
            <img src={woman1} alt="Participantes do evento" />
            <div className={styles.imgOverlay}>
              <div className={styles.imgContent}>
                <h3>Andressa Leão</h3>
                <p>#Posicionamento</p>
              </div>
            </div>
          </div>
          <div className={styles.img}>
            <img src={woman2} alt="Palestrante no evento" />
            <div className={styles.imgOverlay}>
              <div className={styles.imgContent}>
                <h3>Daniele Xavier</h3>
                <p>#Liderança</p>
              </div>
            </div>
          </div>
          {/* </div> */}

          {/* <div className={styles.secondaryImages}> */}
          <div className={styles.img}>
            <img src={woman3} alt="Participantes do evento" />
            <div className={styles.imgOverlay}>
              <div className={styles.imgContent}>
                <h3>Joy Alano</h3>
                <p>#Varejo</p>
              </div>
            </div>
          </div>
          <div className={styles.img}>
            <img
              src="https://media.istockphoto.com/id/514326952/pt/foto/silhueta-de-mulher-jovem.jpg?s=612x612&w=0&k=20&c=nEI8F03poUXFFREfJEwKU6QXFXseI-NtRjhvpf64V6k="
              alt="Palestrante no evento"
            />
            <div className={styles.imgOverlay}>
              <div className={styles.imgContent}>
                <h3>EM BREVE</h3>
                <p>#Surpresa</p>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>

      <div className={styles.mobile}>
        <SubText />
      </div>
    </section>
  );
}
