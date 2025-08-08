import styles from "./highlights.module.css";
import Title from "../../shared/Title";
import { FaUsers, FaChartLine, FaHandshake, FaStar } from "react-icons/fa";
// import {
//   MdHealthAndSafety,
//   MdOutlineConnectWithoutContact,
// } from "react-icons/md";
// import { GiClothes } from "react-icons/gi";

export default function Highlights() {
  const benefits = [
    {
      id: 1,
      icon: <FaUsers className={styles.icon} />,
      title: "Diversidade Profissional",
      description:
        "Conecte-se com profissionais de destaque em diferentes áreas e descubra novas perspectivas para impulsionar sua atuação no mercado.",
    },
    {
      id: 2,
      icon: <FaChartLine className={styles.icon} />,
      title: "Estratégias de Vendas",
      description:
        "Aprenda métodos validados para aumentar suas conversões e conquistar espaço, aplicando estratégias utilizadas por especialistas que dominam o mercado.",
    },
    {
      id: 3,
      icon: <FaHandshake className={styles.icon} />,
      title: "Networking Estratégico",
      description:
        "Networking com propósito. Conexões reais que fortalecem sua jornada.",
    },
    {
      id: 4,
      icon: <FaStar className={styles.icon} />,
      title: "Experiências Únicas",
      description:
        "Experiências interativas e personalizadas. Momentos que inspiram, geram valor e marcam o evento.",
    },
  ];

  return (
    <section id="highlights" className={styles.section}>
      <Title>O Que Você Vai Viver</Title>
      <div className={styles.container}>
        <div className={styles.header} data-aos="zoom-in">
          <p className={styles.subtitle}>
            Entenda por que o Verano Talk é mais do que um evento
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={styles.benefitCard}
              data-aos="zoom-in"
            >
              <div className={styles.iconContainer}>{benefit.icon}</div>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
