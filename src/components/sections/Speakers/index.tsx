import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Title from "../../shared/Title";
import styles from "./speakers.module.css";
import danieleXavier from "../../../assets/speakers/daniele-xavier.jpg";
import felipeTheodoro from "../../../assets/speakers/felipe-theodoro.jpg";

// Importe os estilos do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Speakers() {
  // Dados dos palestrantes (simulando 4 palestrantes para demonstração)
  const speakers = [
    {
      id: 1,
      name: "Daniele Xavier",
      image: danieleXavier,
      title: "Comunicadora, Psicóloga, Estrategista em Comportamento Humano",
      bio: [
        `Daniele é especialista em liderança emocional e performance de equipes. 
        Há mais de 7 anos, aplica seu conhecimento em perfis 
        comportamentais para transformar gestão em resultados, 
        lideranças em influência e equipes em potência real.`,
        `Diretora do ecossistema Gue Oliveira, com cinco empresas sob sua gestão, 
        ela conecta inteligência emocional, estratégia e 
        performance para formar líderes mais conscientes, 
        comunicativos e preparados para a nova era da liderança.`,
      ],
      quote:
        "Porque vender bem não é empurrar produto... é falar a língua do perfil certo.",
      badge: "ESTRATEGISTA",
    },
    {
      id: 2,
      name: "Felipe Theodoro",
      image: felipeTheodoro,
      title: "Criador e Influenciador",
      bio: [
        `Fenômeno das redes sociais, Felipe Theodoro
conquistou o Brasil com carisma, autenticidade e muito
bom humor e hoje, são mais de 5 milhões de seguidores
acompanhando seus conteúdos."
`,
        `Com base em suas vivências no varejo, Theo
compartilha técnicas de vendas, motivação e liderança
com uma abordagem leve, criativa e altamente
conectada com o consumidor atual. No Verano Talk, ele
entrega mais que conhecimento: entrega energia,
conexão e visão estratégica para quem quer vender
mais e se destacar no digital.`,
      ],
      // quote: "@theodoro",
      badge: "ESTRELA",
    },
    {
      id: 3,
      name: "Mariana Silva",
      image: danieleXavier, // Usando a mesma imagem para demonstração
      title: "Consultora de Varejo e Moda",
      bio: [
        "Mariana revolucionou o varejo físico com suas estratégias de experiência do cliente. Com passagem por grandes redes nacionais, traz um olhar único para o varejo moderno.",
        "Autora do best-seller 'Varejo que Encanta', é considerada uma das 30 profissionais mais influentes do varejo brasileiro.",
      ],
      quote: "O cliente não compra produtos, compra experiências e soluções.",
      badge: "ESTRELA",
    },
    {
      id: 4,
      name: "Ricardo Almeida",
      image: danieleXavier, // Usando a mesma imagem para demonstração
      title: "Especialista em Vendas e Negociação",
      bio: [
        "Ricardo já treinou mais de 5.000 profissionais de vendas em todo o país. Sua metodologia 'Venda Consultiva' é aplicada nas maiores empresas do setor de serviços.",
        "Campeão nacional de vendas por 3 anos consecutivos, compartilha técnicas comprovadas para fechar mais negócios.",
      ],
      quote: "Vender é sobre criar valor, não sobre pressionar o cliente.",
      badge: "TOP",
    },
  ];

  return (
    <section id="speakers" className={styles.section}>
      <Title>Palestrantes</Title>
      <div className={styles.container}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            1024: {
              slidesPerView: 2,
            },
          }}
          autoplay={{ delay: 10000 }}
          navigation
          pagination={{ clickable: true }}
          className={styles.speakersSwiper}
        >
          {speakers.map((speaker) => (
            <SwiperSlide key={speaker.id} className={styles.speakerSlide}>
              <div className={styles.speakerCard}>
                <div
                  className={styles.speakerBackground}
                  style={{ backgroundImage: `url(${speaker.image})` }}
                ></div>

                <div className={styles.speakerContent}>
                  <div className={styles.speakerImageContainer}>
                    <img
                      src={speaker.image}
                      alt={`Palestrante ${speaker.name}`}
                      className={styles.speakerImage}
                    />
                    <div className={styles.speakerBadge}>{speaker.badge}</div>
                  </div>

                  <div className={styles.speakerInfo}>
                    <div className={styles.speakerHeader}>
                      <h3 className={styles.speakerName}>{speaker.name}</h3>
                      <p className={styles.speakerTitle}>{speaker.title}</p>
                      <div className={styles.divider}></div>
                    </div>

                    <div className={styles.speakerBio}>
                      {speaker.bio.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {speaker.quote && (
                      <div className={styles.speakerQuote}>
                        <blockquote>"{speaker.quote}"</blockquote>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
