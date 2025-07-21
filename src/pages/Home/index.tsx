import About from "../../components/sections/About";
import Hero from "../../components/sections/Hero";
import Location from "../../components/sections/Location";
// import Matters from "../../components/sections/Matters";
import Tickets from "../../components/sections/Tickets";
import Speakers from "../../components/sections/Speakers";
import TopBar from "../../components/template/Topbar";
import Footer from "../../components/template/Footer";

export default function Home() {
  return (
    <div>
      <TopBar />
      <Hero />
      {/* <Matters /> */}
      <About />
      <Tickets />
      <Speakers />
      <Location />
      <Footer />
    </div>
  );
}
