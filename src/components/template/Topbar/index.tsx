import MainButton from "../../shared/MainButton";
import styles from "./topBar.module.css";

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.content}>
        <div className={styles.message}>
          <span className={styles.alert}>ÚLTIMAS VAGAS!</span>
          <p className={styles.text}>
            Garanta seu ingresso com <strong>desconto exclusivo</strong> -
            Valores sobem em breve!
          </p>
        </div>

        {/* <div className={styles.timer}>
          <span className={styles.timeUnit}>
            <strong>03</strong>dias
          </span>
          <span className={styles.timeUnit}>
            <strong>12</strong>horas
          </span>
          <span className={styles.timeUnit}>
            <strong>45</strong>min
          </span>
        </div> */}

        <MainButton
          data={{
            type: "link",
            link: "tickets",
            text: "GARANTA SEU LUGAR",
            color: "gold",
            small: true,
          }}
        />
      </div>
    </div>
  );
}
