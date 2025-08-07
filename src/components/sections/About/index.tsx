import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";
import styles from "./about.module.css";

import anaPaula from "../../../assets/partners/ana-paula.jpeg";
import lairaDuarte from "../../../assets/partners/laira-duarte.jpeg";

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <Title>Sobre</Title>
      <div className={styles.container}>
        <div className={styles.backgroundOverlay}></div>

        <div className={styles.content}>
          <div className={styles.founders}>
            <div className={styles.founderCard}>
              <div className={styles.imageContainer}>
                <img
                  src={anaPaula}
                  alt="Ana Paula, Organizadora"
                  className={styles.founderImage}
                />
                <div className={styles.imageBorder}></div>
              </div>
              <div className={styles.founderInfo}>
                <h4 className={styles.founderName}>Ana Paula</h4>
                <p className={styles.founderBio}>
                  Empresária na área da Saúde e educação, e agora da Moda.
                  Acredita no poder da comunicação como uma ferramenta de
                  transformação social .
                </p>
                <span className={styles.founderTag}>
                  #Educação #Saúde #Moda
                </span>
              </div>
            </div>

            <div className={styles.founderCard}>
              <div className={styles.imageContainer}>
                <img
                  src={lairaDuarte}
                  alt="Laira Duarte, Organizadora"
                  className={styles.founderImage}
                />
                <div className={styles.imageBorder}></div>
              </div>
              <div className={styles.founderInfo}>
                <h4 className={styles.founderName}>Laiara Duarte</h4>
                <p className={styles.founderBio}>
                  Profissional da saúde e visionária, fez uma transição de
                  carreira para o empreendedorismo no ramo da moda.
                </p>
                <span className={styles.founderTag}>
                  #Varejo #RedesSociais #Conexões
                </span>
              </div>
            </div>
          </div>

          <div className={styles.aboutText}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.title}>AS VISIONÁRIAS DO VERANO TALK</h3>
              <div className={styles.divider}></div>
            </div>

            <p className={styles.description}>
              Duas mulheres, um propósito:{" "}
              <strong>transformar o ecossistema empreendedor</strong> do
              Maranhão. Com backgrounds complementares em educação, saúde, moda
              e varejo, Ana Paula e Laiara Duarte uniram suas expertises para
              criar um evento que vai muito além do convencional.
            </p>

            <p className={styles.description}>
              O Verano Talk nasce da{" "}
              <strong>vontade de elevar o diálogo</strong> sobre
              empreendedorismo, trazendo conteúdo relevante, conexões valiosas e
              uma experiência imersiva que inspira ação e mudança.
            </p>

            <div className={styles.ctaContainer}>
              <MainButton
                data={{
                  type: "link",
                  link: "#tickets",
                  text: "QUERO FAZER PARTE",
                  color: "gold",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
