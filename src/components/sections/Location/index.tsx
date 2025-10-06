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
                  Hotel Resort Rio Poty
                </span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>QUANDO</span>
                <span className={styles.highlightValue}>01 de Novembro</span>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>HORÁRIO</span>
                <span className={styles.highlightValue}>09h às 20h</span>
              </div>
            </div>

            <p className={styles.description}>
              Um dos mais sofisticados hotéis de São Luís, com localização
              privilegiada. O espaço une conforto, estrutura moderna e atmosfera
              elegante - perfeito para inspirar transformação.
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
              Av. dos Holandeses, 2/5 - Quadra 32 - Ponta D'areia, São Luís -
              MA, 65071-380
            </address>

            {!sponsor && (
              <MainButton
                data={{
                  type: "link",
                  link: "#tickets",
                  text: "GARANTA SEU LUGAR",
                  color: "gold",
                }}
              />
            )}
          </div>

          <div className={styles.visualContent} data-aos-delay="200">
            <div className={styles.imageWrapper}>
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/430493440.jpg?k=e4b5eed7a3bc025a5cdfba4508fd3b568751eadf07d35b45f236d63bc0e80b76&o="
                alt="Hotel Resort Rio Poty"
                className={styles.hotelImage}
              />
              <div className={styles.imageOverlay}></div>
            </div>

            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3986.057632761173!2d-44.3059667328186!3d-2.487876494220485!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68c403d478bd7%3A0xe27d5a9d33498f48!2sRio%20Poty%20Hotel%20%26%20Resort!5e0!3m2!1spt-BR!2sbr!4v1757696305245!5m2!1spt-BR!2sbr"
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
