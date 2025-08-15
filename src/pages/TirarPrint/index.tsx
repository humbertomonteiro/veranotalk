import About from "../../components/sections/About";
import Hero from "../../components/sections/Hero";
import Highlights from "../../components/sections/Highlights";
import Location from "../../components/sections/Location";
import styles from "./tirarPrint.module.css";
import FooterTitarPrint from "../../components/template/FooterTirarPrint";

export default function TirarPrint() {
  return (
    <div className={styles.container}>
      <Hero sponsor={true} />
      <Highlights />
      <About sponsor={true} />
      <Location sponsor={true} />
      <FooterTitarPrint />
    </div>
  );
}
