import styles from "./matters.module.css";
import { HiArrowDownRight } from "react-icons/hi2";

export default function Matters() {
  return (
    <section className={styles.container}>
      <ul>
        <li>
          O QUE É O VERANO TALK? <HiArrowDownRight />
        </li>
        <li>
          PARA QUEM É O VERANO TALK? <HiArrowDownRight />
        </li>
        <li>
          QUEM ESTÁ POR TRÁS? <HiArrowDownRight />
        </li>
        <li>
          ONDE E QUANDO ACONTECERÁ? <HiArrowDownRight />
        </li>
        <li>
          PALESTRANTES CONFIRMADOS <HiArrowDownRight />
        </li>
      </ul>
    </section>
  );
}
