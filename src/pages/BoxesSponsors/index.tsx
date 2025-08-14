import Sponsors from "../../components/sections/Sponsors";
import Footer from "../../components/template/Footer";

export default function BoxesSponsors() {
  return (
    <div>
      <Sponsors />
      <Footer sponsor={true} />
    </div>
  );
}
