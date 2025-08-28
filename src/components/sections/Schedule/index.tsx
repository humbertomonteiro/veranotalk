import styles from "./schedule.module.css";

// Importando imagens (ajuste os caminhos conforme necessário)
import daniXavier from "../../../assets/speakers/daniele-xavier.jpeg";
import joyAlano from "../../../assets/speakers/joy-alano.jpeg";
import andressaLeao from "../../../assets/speakers/andressa-leao.jpeg";
import felipeTheodoro from "../../../assets/speakers/felipe-theodoro.jpeg";
// import genericSpeaker from "../../../assets/speakers/generic-speaker.jpg";

interface ScheduleItem {
  time: string;
  title?: string;
  speaker?: string;
  theme?: string;
  image?: string;
  type?: "talk" | "roundtable" | "break" | "opening" | "checkin";
}

interface ScheduleProps {
  id?: string;
}

export default function Schedule({ id }: ScheduleProps) {
  const scheduleData: ScheduleItem[] = [
    {
      time: "07:30 - 09:00",
      title: "Credenciamento",
      type: "checkin",
    },
    {
      time: "09:00 - 09:30",
      title: "Abertura do Evento",
      type: "opening",
    },
    {
      time: "09:30 - 10:30",
      speaker: "Dani Xavier",
      theme:
        "Decifre Pessoas, Potencialize Resultados: A Nova Era da Liderança Emocional e Estratégica",
      image: daniXavier,
      type: "talk",
    },
    {
      time: "10:30 - 11:30",
      title: "Empreendedorismo Real",
      theme: "Da ideia ao Impacto",
      type: "roundtable",
    },
    {
      time: "11:30 - 12:30",
      title: "Empreendedorismo Real",
      theme: "Histórias que movem negócios",
      type: "roundtable",
    },
    {
      time: "12:30 - 14:00",
      title: "Intervalo para Almoço",
      type: "break",
    },
    {
      time: "14:00 - 15:00",
      speaker: "Joy Alano",
      theme:
        "Varejo que Vende: Estratégias Práticas para Lojistas Ampliarem seu Faturamento",
      image: joyAlano,
      type: "talk",
    },
    {
      time: "15:00 - 16:00",
      speaker: "Andresa Leão",
      theme: "Como o Posicionamento Impulsiona Seus Negócios",
      image: andressaLeao,
      type: "talk",
    },
    {
      time: "16:00 - 16:30",
      title: "Intervalo",
      type: "break",
    },
    {
      time: "16:30 - 17:30",
      title: "Empreendedorismo Real",
      theme: "Fortalecendo a presença feminina na medicina e nos negócios",
      type: "roundtable",
    },
    {
      time: "17:30 - 18:30",
      speaker: "Theodoro",
      theme: "Vamos Bater Meta",
      image: felipeTheodoro,
      type: "talk",
    },
  ];

  return (
    <section id={id || "programacao"} className={styles.container}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.header}>
        <h2 className={styles.title}>PROGRAMAÇÃO</h2>
        <div className={styles.divider}></div>
        <p className={styles.subtitle}>
          Um dia de conexões e aprendizado para transformar seus negócios
        </p>
      </div>

      <div className={styles.timeline}>
        {scheduleData.map((item, index) => (
          <div
            key={index}
            className={`${styles.timelineItem} ${styles[item.type || "talk"]}`}
          >
            <div className={styles.timelineContent}>
              <div className={styles.time}>{item.time}</div>

              <div className={styles.itemMain}>
                {item.image && (
                  <div className={styles.speakerImage}>
                    <img src={item.image} alt={item.speaker} />
                  </div>
                )}

                <div className={styles.itemText}>
                  <h3 className={styles.itemTitle}>
                    {item.speaker || item.title}
                  </h3>

                  {item.speaker && item.title !== "Roda de Conversa" && (
                    <p className={styles.itemSubtitle}>{item.title}</p>
                  )}

                  {item.theme && <p className={styles.theme}>{item.theme}</p>}
                </div>
              </div>

              <div className={styles.timelineMarker}>
                <div className={styles.markerDot}></div>
                {index < scheduleData.length - 1 && (
                  <div className={styles.markerLine}></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
