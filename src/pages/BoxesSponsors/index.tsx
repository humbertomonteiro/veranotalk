import Sponsors from "../../components/sections/Sponsors";
import WhatsAppButton from "../../components/shared/WhatsAppButton";
import FooterSponsor from "../../components/template/FooterSponsor";

interface BoxesSponsorsProps {
  type?: "national" | "location";
}

export default function BoxesSponsors({ type }: BoxesSponsorsProps) {
  return (
    <div>
      <Sponsors type={type ? type : "location"} />
      <FooterSponsor sponsor={true} />
      <WhatsAppButton />
    </div>
  );
}
