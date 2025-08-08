import styles from "./footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const toTop = () => {
    scrollTo(0, 0);
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.title}>
        <Link onClick={toTop} to={"/"}>
          VERANO TALK
        </Link>
      </div>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Verano Talk. Todos os direitos
          reservados.
        </p>
        <Link onClick={toTop} to={"/privacy-policy"} className={styles.policy}>
          Politica de privacidade
        </Link>
        <p className={styles.credits}>
          Feito por{" "}
          <a
            href="https://portfolio-three-bay-73.vercel.app/"
            target="_blank"
            className={styles.humdev}
          >
            HumDev
          </a>{" "}
          com 🤍
        </p>
      </div>
    </footer>
  );
}
