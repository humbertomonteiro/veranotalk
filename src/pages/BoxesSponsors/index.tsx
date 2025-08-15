import Sponsors from "../../components/sections/Sponsors";
import FooterTitarPrint from "../../components/template/FooterTirarPrint";

interface BoxesSponsorsProps {
  type?: "national" | "location";
}

export default function BoxesSponsors({ type }: BoxesSponsorsProps) {
  return (
    <div>
      <Sponsors type={type ? type : "location"} />
      <FooterTitarPrint sponsor={true} />
    </div>
  );
}
