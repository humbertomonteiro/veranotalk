import styles from "./loading.module.css";

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Carregando...</p>
    </div>
  );
}

export default Loading;
