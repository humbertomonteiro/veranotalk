import About from "../../components/sections/About";
import Location from "../../components/sections/Location";
import Speakers from "../../components/sections/Speakers";
import Questions from "../../components/sections/Questions";
import Highlights from "../../components/sections/Highlights";
import VideosSpeakers from "../../components/sections/VideosSpeakers";
import Hero from "../../components/sections/Hero";
import WhatsAppButton from "../../components/shared/WhatsAppButton";
import FooterSponsor from "../../components/template/FooterSponsor";

export default function Sponsor() {
  return (
    <div>
      <Hero sponsor={true} />
      <Highlights />
      <About sponsor={true} />
      <Speakers />
      <VideosSpeakers />
      <Location sponsor={true} />
      <Questions sponsor={true} />
      <FooterSponsor sponsor={true} />
      <WhatsAppButton />
    </div>
  );
}
