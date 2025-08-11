import About from "../../components/sections/About";
import Location from "../../components/sections/Location";
import Speakers from "../../components/sections/Speakers";
import TopBar from "../../components/template/Topbar";
import Footer from "../../components/template/Footer";
import Questions from "../../components/sections/Questions";
import Highlights from "../../components/sections/Highlights";
import VideosSpeakers from "../../components/sections/VideosSpeakers";
import Hero from "../../components/sections/Hero";

export default function Sponsor() {
  return (
    <div>
      <TopBar sponsor={true} />
      <Hero sponsor={true} />
      <Highlights />
      <About sponsor={true} />
      <Speakers />
      <VideosSpeakers />
      <Location sponsor={true} />
      <Questions sponsor={true} />
      <Footer sponsor={true} />
    </div>
  );
}
