import MainButton from "../../shared/MainButton";
import styles from "./topBar.module.css";

interface TopBarProps {
  sponsor?: boolean;
}

export default function TopBar({ sponsor }: TopBarProps) {
  return (
    <div className={styles.topBar} data-aos="fade-down">
      {sponsor ? (
        <div className={styles.content}>
          <div className={styles.message}>
            <span className={styles.alert}>Seja um apoiador!</span>
            {/* <p className={styles.text}>Seja um apoiador!</p> */}
          </div>

          <MainButton
            data={{
              type: "link",
              link: "/apoiar-categorias",
              text: "Quero Apoiar",
              color: "gold",
              small: true,
            }}
          />
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.message}>
            <span className={styles.alert}>ÚLTIMAS VAGAS!</span>
            <p className={styles.text}>
              Garanta seu ingresso com <strong>desconto exclusivo</strong> -
              Valores sobem em breve!
            </p>
          </div>

          <MainButton
            data={{
              type: "link",
              link: "#tickets",
              text: "GARANTA SEU LUGAR",
              color: "gold",
              small: true,
            }}
          />
        </div>
      )}
    </div>
  );
}
