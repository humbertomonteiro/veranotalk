import Sponsors from "../../components/sections/Sponsors";
import Footer from "../../components/template/Footer";

interface BoxesSponsorsProps {
  type?: "national" | "location";
}

export default function BoxesSponsors({ type }: BoxesSponsorsProps) {
  return (
    <div>
      <Sponsors type={type ? type : "location"} />
      <Footer sponsor={true} />
    </div>
  );
}
