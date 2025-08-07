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
        "Presença de profissionais renomados de  diversas áreas, para ampliar sua visão de negócio.",
    },
    {
      id: 2,
      icon: <FaChartLine className={styles.icon} />,
      title: "Estratégias de Vendas",
      description:
        "Técnicas comprovadas para aumentar suas conversões e dominar o mercado de moda com abordagens inovadoras.",
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
        <div className={styles.header}>
          <p className={styles.subtitle}>
            Descubra o que torna o Verano Talk uma experiência única
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <div key={benefit.id} className={styles.benefitCard}>
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
