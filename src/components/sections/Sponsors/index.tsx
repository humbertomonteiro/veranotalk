import MainButton from "../../shared/MainButton";
import Title from "../../shared/Title";
import styles from "./sponsors.module.css";
import { FaCrown, FaMedal, FaAward, FaGem } from "react-icons/fa";

interface SponsorsProps {
  type?: "national" | "location" | "ana-top" | "ana-basic";
  phone: string;
}

export default function Sponsors({ type, phone }: SponsorsProps) {
  const sponsorships = [
    {
      id: 1,
      title: "Patrocinador Master",
      category: "Diamante",
      priceNational: "R$ 60.000",
      priceLocation: "R$ 25.000",
      priceAnaTop: "R$ 15.000",
      priceAnaBasic: "R$ 5.000",
      icon: <FaGem className={styles.icon} />,
      benefits: [
        "Exclusividade como patrocinador master (máx. 1 cota).",
        "Logomarca em destaque no palco, telão, painéis e toda comunicação visual do evento.",
        "Citação especial na abertura e no encerramento do evento.",
        "Presença de representante na abertura para discurso de até 3 minutos.",
        "Espaço premium para estande/ativação de marca (área nobre do evento).",
        "Logomarca com maior destaque no site e redes sociais do evento.",
        "Inserção de material promocional nos kits dos participantes.",
        "8 convites VIP para o evento.",
        "Direito de realizar ação exclusiva durante o evento (ex.: sorteio, desfile, experiência sensorial).",
      ],
      highlight: true,
    },
    {
      id: 2,
      title: "Patrocinador Oficial",
      category: "Ouro",
      priceNational: "R$ 40.000",
      priceLocation: "R$ 15.000",
      priceAnaTop: "R$ 10.000",
      priceAnaBasic: "R$ 3.000",
      icon: <FaCrown className={styles.icon} />,
      benefits: [
        "Logomarca em destaque em todos os materiais de divulgação (digital e físico).",
        "Espaço para estande em área estratégica.",
        "Inserção de material promocional nos kits dos participantes.",
        "Citação na abertura e no encerramento do evento.",
        "6 convites VIP para o evento.",
        "Postagem dedicada da marca nas redes sociais do evento.",
      ],
      highlight: true,
    },
    {
      id: 3,
      title: "Patrocinador de Apoio",
      category: "Prata",
      priceNational: "R$ 20.000",
      priceLocation: "R$ 8.000",
      priceAnaTop: "R$ 5.000",
      priceAnaBasic: "R$ 1.500",
      icon: <FaMedal className={styles.icon} />,
      benefits: [
        "Logomarca nos materiais digitais e físicos do evento.",
        "Inserção de brindes ou flyers nos kits dos participantes.",
        "4 convites VIP para o evento.",
        "Menção como patrocinador de apoio no site e redes sociais do evento.",
      ],
      highlight: true,
    },
    {
      id: 4,
      title: "Amigo do Evento",
      category: "Bronze",
      priceNational: "R$ 10.000",
      priceLocation: "R$ 4.000",
      priceAnaTop: "R$ 2.000",
      icon: <FaAward className={styles.icon} />,
      benefits: [
        "Logomarca no site e nas redes sociais do evento.",
        "Inserção de brindes ou flyers nos kits dos participantes.",
        "2 convites VIP para o evento.",
      ],
      highlight: true,
    },
  ];

  return (
    <>
      <section id="sponsors" className={styles.section}>
        <Title>Patrocínios</Title>
        <div className={styles.backgroundOverlay}></div>
        <div className={styles.container}>
          <p className={styles.subtitle}>
            Faça parte da transformação do empreendedorismo maranhense
          </p>
          {/* Primeira linha - Diamante e Ouro */}
          <div className={styles.sponsorRow}>
            {sponsorships.slice(0, 2).map((sponsor) => (
              <div
                key={sponsor.id}
                className={`${styles.sponsorCard} ${
                  sponsor.highlight ? styles.highlight : ""
                }`}
              >
                {sponsor.highlight && (
                  <div className={styles.ribbon}>EXCLUSIVIDADE</div>
                )}
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>{sponsor.icon}</div>
                  <h3>{sponsor.title}</h3>
                  <span className={styles.category}>{sponsor.category}</span>
                  <div className={styles.price}>
                    {type === "national"
                      ? sponsor.priceNational
                      : type === "location"
                      ? sponsor.priceLocation
                      : type === "ana-top"
                      ? sponsor.priceAnaTop
                      : type === "ana-basic"
                      ? sponsor.priceAnaBasic
                      : sponsor.priceLocation}
                  </div>
                </div>
                <ul className={styles.benefits}>
                  {sponsor.benefits.map((benefit, index) => (
                    <li key={index}>✓ {benefit}</li>
                  ))}
                </ul>
                <div className={styles.contact}>
                  <MainButton
                    data={{
                      type: "link",
                      link: `https://wa.me/${phone}?text=Olá,%20gostaria%20de%20ser%20um%20apoiador%20do%20evento%20Verano%20Talk%20na%20categoria%20${
                        sponsor.category
                      }%20${
                        type === "national"
                          ? "Nacional"
                          : type === "location"
                          ? "Local"
                          : "."
                      }%20Poderia%20me%20ajudar?`,
                      text: "QUERO PATROCINAR",
                      color: sponsor.highlight ? "gold" : "white",
                    }}
                    target={"_blank"}
                  />
                  {/* <p className={styles.contactText}>
                      Produção Comercial:
                      <br />
                      <strong>Thayana Vieira</strong>
                    </p> */}
                </div>
              </div>
            ))}
          </div>
          {/* Segunda linha - Prata e Bronze */}
          <div className={styles.sponsorRow}>
            {sponsorships
              .slice(2, 4)
              .filter((sponsor) => !(type === "ana-basic" && sponsor.id === 4))
              .map((sponsor) => (
                <div key={sponsor.id} className={styles.sponsorCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconContainer}>{sponsor.icon}</div>
                    <h3>{sponsor.title}</h3>
                    <span className={styles.category}>{sponsor.category}</span>
                    <div className={styles.price}>
                      {type === "national"
                        ? sponsor.priceNational
                        : type === "location"
                        ? sponsor.priceLocation
                        : type === "ana-top"
                        ? sponsor.priceAnaTop
                        : type === "ana-basic"
                        ? sponsor.priceAnaBasic
                        : sponsor.priceLocation}
                    </div>
                  </div>
                  <ul className={styles.benefits}>
                    {sponsor.benefits.map((benefit, index) => (
                      <li key={index}>✓ {benefit}</li>
                    ))}
                  </ul>
                  <div className={styles.contact}>
                    <MainButton
                      data={{
                        type: "link",
                        link: `https://wa.me/${phone}?text=Olá,%20gostaria%20de%20ser%20um%20apoiador%20do%20evento%20Verano%20Talk%20na%20categoria%20${sponsor.category}.%20Poderia%20me%20ajudar?`,
                        text: "QUERO PATROCINAR",
                        color: sponsor.highlight ? "gold" : "white",
                      }}
                      target={"_blank"}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
