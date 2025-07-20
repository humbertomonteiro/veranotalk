import Title from "../../shared/Title";
import styles from "./speakers.module.css";

export default function Speakers() {
  return (
    <>
      <Title>Palestrantes</Title>
      <section className={styles.container}>
        <div className={styles.box}>
          <div className={styles.imageBg}>
            <img
              src="https://www.curtindosalvador.com.br/wp-content/uploads/2025/07/IMG_7045-990x1485.jpeg"
              alt=""
            />
          </div>
          <div className={styles.speaker}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgpoIn7LxodOayF0vKmuHUvaP90DpCGvC2NQ&s"
              alt=""
            />
          </div>
        </div>
      </section>
    </>
  );
}
