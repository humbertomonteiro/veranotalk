import styles from "./footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.title}>
        <Link to={"/"}>VERANO TALK</Link>
      </div>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Verano Talk. Todos os direitos
          reservados.
        </p>
        <Link to={"/privacy-policy"} className={styles.policy}>
          Politica de privacidade
        </Link>
        <p className={styles.credits}>
          Feito por <span className={styles.humdev}>HumDev</span> com 🤍
        </p>
      </div>
    </footer>
  );
}
