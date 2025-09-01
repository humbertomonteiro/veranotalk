import styles from "./paymentInfo.module.css";

export default function PaymentInfo() {
  return (
    <div className={styles.paymentInfo}>
      <h5>Pagamento seguro com</h5>
      <div className={styles.paymentLogo}>
        <img
          src="https://vitalgrafica.com.br/wp-content/uploads/2024/04/mercado-pago.png"
          alt="Mercado Pago"
        />
      </div>
      <p className={styles.securityInfo}>
        Seus dados estão protegidos com criptografia de ponta a ponta
      </p>
    </div>
  );
}
