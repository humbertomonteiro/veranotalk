import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Verano Talk. Todos os direitos
          reservados.
        </p>
        <p className={styles.credits}>
          Feito por <span className={styles.humdev}>HumDev</span> com 🤍
        </p>
      </div>
    </footer>
  );
}
