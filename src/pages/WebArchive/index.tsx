import About from "../../components/sections/About";
import Location from "../../components/sections/Location";
import Highlights from "../../components/sections/Highlights";
import Hero from "../../components/sections/Hero";
import FooterSponsor from "../../components/template/FooterSponsor";
import Schedule from "../../components/sections/Schedule";

export default function WebArchive() {
  return (
    <div>
      <Hero sponsor={true} />
      <Highlights />
      <About sponsor={true} />
      <Schedule />
      <Location sponsor={true} />
      <FooterSponsor sponsor={true} />
    </div>
  );
}
