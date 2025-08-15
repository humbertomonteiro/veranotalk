import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";
import styles from "./about.module.css";

import anaPaula from "../../../assets/partners/ana-paula.jpeg";
import lairaDuarte from "../../../assets/partners/laira-duarte.jpeg";

interface AboutProps {
  sponsor?: boolean;
}

export default function About({ sponsor }: AboutProps) {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.backgroundOverlay}></div>
      <Title>Sobre</Title>
      <div className={styles.container}>
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
              <h3 className={styles.title}>
                AS MENTES POR TRÁS DO VERANO TALK
              </h3>
              <div className={styles.divider}></div>
            </div>

            <p className={styles.description}>
              Duas mulheres, um propósito: fomentar o empreendedorismo local.
              Com trajetórias que se encontram entre educação, saúde, moda e
              varejo, Ana Paula e Laiara Duarte unem experiências e visões para
              criar um evento que rompe padrões e abre portas para novas
              oportunidades.
            </p>

            <p className={styles.description}>
              O Verano Talk nasce da vontade de transformar conversas em
              conexões poderosas, elevando o diálogo sobre negócios, tendências
              e inovação. Um encontro que vai além do conteúdo: uma experiência
              imersiva que inspira ação, movimento e mudança real.
            </p>

            <div className={styles.ctaContainer}>
              {!sponsor && (
                <MainButton
                  data={{
                    type: "link",
                    link: "#tickets",
                    text: "QUERO FAZER PARTE",
                    color: "gold",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
