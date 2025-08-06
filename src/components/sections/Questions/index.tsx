import styles from "./questions.module.css";
import Title from "../../shared/Title";
import { useState } from "react";
import { Link } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "Estou começando agora. Esse evento é pra mim?",
    response: `Sim! O Verano Talk é para empresários em qualquer fase da jornada empresarial, seja você iniciante ou já faturando alto. Aqui, você terá o caminho certo para crescer.`,
    link: "",
  },
  {
    id: 2,
    question: "Qual o formato do evento?",
    response: `O Verano Talk é um evento presencial com palestras inspiradoras, cases de sucesso e networking de alta qualidade. Teremos 6 horas de conteúdo transformador.`,
    link: "",
  },
  {
    id: 3,
    question: "Onde pego meu ingresso?",
    response: `O ingresso está na sua `,
    link: (
      <Link to={"/area-participant"}>
        <strong>Área do participante</strong>, Clique aqui para entrar com seu
        cpf.
      </Link>
    ),
  },
  {
    id: 4,
    question: "O pagamento é seguro?",
    response: `Sim! Utilizamos plataformas seguras e reconhecidas no mercado, garantindo a proteção dos seus dados.`,
    link: "",
  },
  {
    id: 5,
    question: "Já efetuei o pagamento, qual o próximo passo?",
    response: `Após a confirmação do pagamento, você receberá por e-mail seu passaporte digital e todas as instruções sobre o evento e também terá o contato do nosso time.`,
    link: "",
  },
  {
    id: 6,
    question: "E se eu não puder ir? Posso pedir reembolso?",
    response: `O reembolso é garantido até 7 dias após a compra. Mas você pode transferir sua vaga para outra pessoa após esse prazo. Basta comunicar a organização de no mínimo 30 dias.`,
    link: "",
  },
  // Adicione mais perguntas conforme necessário
];

export default function Questions() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className={styles.section}>
      <Title>FAQ - DÚVIDAS FREQUENTES</Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            {/* <h3>DÚVIDAS FREQUENTES</h3> */}
            {/* <div className={styles.divider}></div> */}
            <p className={styles.subtitle}>
              Separamos as principais dúvidas sobre o evento
            </p>
          </div>

          <div className={styles.questionsContainer}>
            {questions.map((item) => (
              <div
                key={item.id}
                className={`${styles.questionItem} ${
                  activeId === item.id ? styles.active : ""
                }`}
                onClick={() => toggleQuestion(item.id)}
              >
                <div className={styles.questionHeader}>
                  <h4>{item.question}</h4>
                  <span className={styles.arrowIcon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </div>

                {activeId === item.id && (
                  <div className={styles.response}>
                    <p>
                      {item.response}
                      {item?.link}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
