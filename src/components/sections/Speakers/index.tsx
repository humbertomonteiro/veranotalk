import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Title from "../../shared/Title";
import styles from "./speakers.module.css";
import danieleXavier from "../../../assets/speakers/daniele-xavier.jpeg";
import felipeTheodoro from "../../../assets/speakers/felipe-theodoro.jpeg";
import joyAlano from "../../../assets/speakers/joy-alano.jpeg";
import andressaLeao from "../../../assets/speakers/andressa-leao.jpeg";

// Importe os estilos do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Speakers() {
  // Dados dos palestrantes (simulando 4 palestrantes para demonstração)
  const speakers = [
    {
      id: 1,
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
      badge: "METAS",
    },

    {
      id: 2,
      name: "Joy Elano",
      image: joyAlano,
      title: "Palestrante, estilista e mentora de lojistas",
      bio: [
        `Criadora do Provador Fashion, Joy Alano é referência
        nacional quando o assunto é moda, posicionamento
        digital e estratégias de vendas.`,
        `Com mais de 20 anos de experiência no mercado, ela
        já impactou milhares de empreendedoras e ajudou
        marcas de todo o país a se destacarem no digital.`,
        `
        Sua palestra no Verano Talk promete ser um encontro
        direto com o que realmente funciona: método
        validado, visão de futuro e estratégias que
        transformam negócios de moda em marcas
        relevantes e lucrativas.`,
      ],
      // quote:
      //   "Porque vender bem não é empurrar produto... é falar a língua do perfil certo.",
      badge: "VAREJO",
    },
    {
      id: 3,
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
      badge: "LIDERANÇA",
    },
    {
      id: 4,
      name: "Andressa Leão",
      image: andressaLeao,
      title: "Empresaria e Mentora",
      bio: [
        `Proprietária da Andressa Leão Store, com mais de
        100 mil seguidoras no Instagram, Andressa construiu
        uma identidade sólida no varejo de moda por meio de
        curadoria cuidadosa e posicionamento autêntico.`,
        `Com anos de experiência em gestão de loja física, ecommerce
        e lives de vendas, ela combina expertise
        comercial com conexão genuína ao público. No
        Verano Talk, vai compartilhar como integrar estilo,
        presença digital e estratégias de
        vendas para transformar um negócio
        de moda em uma marca relevante
        e lucrativa.
        `,
      ],
      // quote:
      //   "Porque vender bem não é empurrar produto... é falar a língua do perfil certo.",
      badge: "POSICIONAMENTO",
    },
  ];

  return (
    <section id="speakers" className={styles.section}>
      <Title>Palestrantes</Title>
      <div className={styles.backgroundOverlay}></div>
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
