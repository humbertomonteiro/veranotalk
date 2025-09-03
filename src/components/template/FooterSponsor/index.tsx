import styles from "./footer.module.css";
import { Link } from "react-router-dom";

interface FooterProps {
  sponsor?: boolean;
  phone: string;
  contactName: string;
}

export default function FooterSponsor({
  sponsor,
  phone,
  contactName,
}: FooterProps) {
  const toTop = () => {
    scrollTo(0, 0);
  };

  function formatPhoneNumber(phone: string) {
    // Remove tudo que não for dígito
    const digits = phone.replace(/\D/g, "");

    // Remove o código do país (55)
    const withoutCountry = digits.startsWith("55") ? digits.slice(2) : digits;

    // Extrai partes do número
    const ddd = withoutCountry.slice(0, 2);
    const firstDigit = withoutCountry.slice(2, 3); // geralmente o 9
    const part1 = withoutCountry.slice(3, 7);
    const part2 = withoutCountry.slice(7);

    // Retorna formatado
    return `(${ddd}) ${firstDigit} ${part1} ${part2}`;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.title}>
        <Link onClick={toTop} to={sponsor ? "/apoiar" : "/"}>
          VERANO TALK
        </Link>
      </div>
      <div className={styles.content}>
        <p>
          <strong>Comercial Executivo:</strong> {contactName}{" "}
        </p>
        <p>
          <strong>Contatato:</strong>{" "}
          <a
            href={`https://wa.me/${phone}?text=Olá,%20gostaria%20de%20ser%20um%20apoiador%20do%20evento%20Verano%20Talk.%20Poderia%20me%20ajudar?`}
            target="_blank"
          >
            {formatPhoneNumber(phone)}
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
