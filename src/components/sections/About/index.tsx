import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";
import styles from "./about.module.css";

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
                  src="https://images.pexels.com/photos/31938035/pexels-photo-31938035.jpeg"
                  alt="Ana Paula, Organizadora"
                  className={styles.founderImage}
                />
                <div className={styles.imageBorder}></div>
              </div>
              <div className={styles.founderInfo}>
                <h4 className={styles.founderName}>Ana Paula</h4>
                <p className={styles.founderBio}>
                  Especialista em educação e saúde com transição para o
                  empreendedorismo na moda. Acredita no poder da comunicação
                  como ferramenta de transformação social.
                </p>
                <span className={styles.founderTag}>
                  #Educação #Saúde #Moda
                </span>
              </div>
            </div>

            <div className={styles.founderCard}>
              <div className={styles.imageContainer}>
                <img
                  src="https://images.pexels.com/photos/18243765/pexels-photo-18243765.jpeg"
                  alt="Laira Duarte, Organizadora"
                  className={styles.founderImage}
                />
                <div className={styles.imageBorder}></div>
              </div>
              <div className={styles.founderInfo}>
                <h4 className={styles.founderName}>Laira Duarte</h4>
                <p className={styles.founderBio}>
                  Empreendedora serial com experiência em varejo e redes
                  sociais. Expert em criar conexões que transformam negócios e
                  carreiras.
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
              e varejo, Ana Paula e Laira Duarte uniram suas expertises para
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
