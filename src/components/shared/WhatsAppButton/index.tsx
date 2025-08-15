import { FaWhatsapp } from "react-icons/fa";
import styles from "./whatsAppButton.module.css";

export default function WhatsAppButton() {
  const phoneNumber = "5598984735273";
  const contactName = "Thayana Vieira";
  const message =
    "Olá, gostaria de informações sobre patrocínios para o Verano Talk!";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className={styles.container}>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
      >
        <FaWhatsapp className={styles.icon} />
        <span className={styles.tooltip}>{contactName}</span>
      </a>
    </div>
  );
}
