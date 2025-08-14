import styles from "./location.module.css";
import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";

interface LocationProps {
  sponsor?: boolean;
}

export default function Location({ sponsor }: LocationProps) {
  return (
    <section id="location" className={styles.section}>
      <Title>Localização</Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.header}>
              <h3>O PALCO DO VERANO TALK 2025</h3>
              <div className={styles.divider}></div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>ONDE</span>
                <span className={styles.highlightValue}>
                  Blue Tree Towers São Luís
                </span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>QUANDO</span>
                <span className={styles.highlightValue}>16 de Outubro</span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>HORÁRIO</span>
                <span className={styles.highlightValue}>09h às 20h</span>
              </div>
            </div>

            <p className={styles.description}>
              Um dos mais sofisticados hotéis de São Luís, com localização
              privilegiada à beira da praia do Calhau. O espaço une conforto,
              estrutura moderna e atmosfera elegante - perfeito para inspirar
              transformação.
            </p>

            <address className={styles.address}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Av. Avicênia, 1 - Calhau, São Luís - MA, 65071-370
            </address>

            <MainButton
              data={{
                type: "link",
                link: sponsor ? "/apoiar-categorias" : "#tickets",
                text: sponsor ? "QUERO APOIAR" : "GARANTA SEU LUGAR",
                color: "gold",
              }}
            />
          </div>

          <div className={styles.visualContent} data-aos-delay="200">
            <div className={styles.imageWrapper}>
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/8518894.jpg?k=de0518435df2f627c46a1c74c6d1775bb1700db00ef3ee96caa9e6ad017abdcf&o="
                alt="Blue Tree Towers São Luís"
                className={styles.hotelImage}
              />
              <div className={styles.imageOverlay}></div>
            </div>

            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13407.466542561542!2d-44.27104643299819!3d-2.4858844935808104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68dec9ad1c7f7%3A0x519b649773b06026!2sBlue%20Tree%20Towers!5e0!3m2!1sen!2sbr!4v1752926331872!5m2!1sen!2sbr"
                loading="lazy"
                allowFullScreen
                className={styles.map}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
