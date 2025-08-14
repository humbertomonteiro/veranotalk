import About from "../../components/sections/About";
import Hero from "../../components/sections/Hero";
import Highlights from "../../components/sections/Highlights";
import Location from "../../components/sections/Location";
// import Questions from "../../components/sections/Questions";
import Sponsors from "../../components/sections/Sponsors";
import styles from "./tirarPrint.module.css";

export default function TirarPrint() {
  return (
    <div className={styles.container}>
      <Hero sponsor={true} />
      <Highlights />
      <Sponsors />
      <About sponsor={true} />

      <Location sponsor={true} />
      {/* <Questions sponsor={true} /> */}
    </div>
  );
}
