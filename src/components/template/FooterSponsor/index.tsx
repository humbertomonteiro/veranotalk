import styles from "./footer.module.css";
import { Link } from "react-router-dom";

interface FooterProps {
  sponsor?: boolean;
}

export default function FooterSponsor({ sponsor }: FooterProps) {
  const toTop = () => {
    scrollTo(0, 0);
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.title}>
        <Link onClick={toTop} to={sponsor ? "/apoiar" : "/"}>
          VERANO TALK
        </Link>
      </div>
      <div className={styles.content}>
        <p>
          <strong>Comercial Executivo:</strong> Thayana Vieira{" "}
        </p>
        <p>
          <strong>Contatato:</strong>{" "}
          <a
            href={`https://wa.me/5598984735273?text=Olá,%20gostaria%20de%20ser%20um%20apoiador%20do%20evento%20Verano%20Talk.%20Poderia%20me%20ajudar?`}
            target="_blank"
          >
            98 9 84735273
          </a>
        </p>
      </div>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Verano Talk. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
