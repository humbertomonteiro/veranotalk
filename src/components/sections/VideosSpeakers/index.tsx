import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import Title from "../../shared/Title";
import styles from "./videosSpeakers.module.css";

export default function VideosSpeakers() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      const script = document.querySelector(
        'script[src="https://www.instagram.com/embed.js"]'
      );
      if (script) document.body.removeChild(script);
    };
  }, []);

  const videos = [
    {
      url: "https://www.instagram.com/reel/DJ422_MSTGq/",
      instagramUser: "theodoro",
    },
    {
      url: "https://www.instagram.com/reel/DL0oMNJpI7z/",
      instagramUser: "joyalano_",
    },
    {
      url: "https://www.instagram.com/reel/DJra3eExxQr/",
      instagramUser: "euandressaleao",
    },
    {
      url: "https://www.instagram.com/reel/DKuF_rdOJgE/",
      instagramUser: "danixaviier",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.backgroundOverlay}></div>
      <Title>Mais sobre nossos palestrantes</Title>
      <p className={styles.subtitle}>
        Veja uma palhinha dos palestranstes já confirmados.
      </p>

      <div className={styles.videosContainer}>
        {videos.map((video, index) => (
          <div key={index} className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <div className={styles.instagramEmbedContainer}>
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={video.url}
                  data-instgrm-version="14"
                ></blockquote>
              </div>

              {!loaded && (
                <div className={styles.videoPlaceholder}>
                  <div className={styles.instagramIcon}>
                    <FaInstagram size={32} />
                  </div>
                  <div className={styles.videoTitle}>{video.instagramUser}</div>
                </div>
              )}

              <div className={styles.platformIndicator}>
                <FaInstagram size={14} />
                <span>{video.instagramUser}</span>
              </div>
            </div>
            {/* <h3 className={styles.videoTitle}>{video.title}</h3>     */}
          </div>
        ))}
      </div>
    </section>
  );
}
