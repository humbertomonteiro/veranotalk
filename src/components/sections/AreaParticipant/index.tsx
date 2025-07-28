import styles from "./areaParticipante.module.css";
import Title from "../../shared/Title";
import MainButton from "../../shared/MainButton";

export default function AreaParticipant() {
  return (
    <section className={styles.section}>
      <Title>Área do Participante</Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h3>ACESSO EXCLUSIVO</h3>
              <div className={styles.divider}></div>
            </div>

            <div className={styles.message}>
              <p>
                Esta área você terá acesso a tudo relacionado ao evento, como qr
                code de autenticação para entrar no evento, certificado de
                participação, cronograma do envento, informações inportantes,
                etc...
              </p>
            </div>

            <div className={styles.buttonWrapper}>
              <MainButton
                data={{
                  text: "ACESSAR ÁREA DO PARTICIPANTE",
                  color: "gold",
                  type: "link",
                  link: "/area-participant",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
