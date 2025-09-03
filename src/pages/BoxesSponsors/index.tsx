import Sponsors from "../../components/sections/Sponsors";
import WhatsAppButton from "../../components/shared/WhatsAppButton";
import FooterSponsor from "../../components/template/FooterSponsor";

interface BoxesSponsorsProps {
  type?: "national" | "location" | "event" | "event-local";
  phone: string;
  contactName: string;
}

export default function BoxesSponsors({
  type,
  phone,
  contactName,
}: BoxesSponsorsProps) {
  return (
    <div>
      <Sponsors type={type ? type : "location"} phone={phone} />
      <FooterSponsor sponsor={true} phone={phone} contactName={contactName} />
      <WhatsAppButton phone={phone} contactName={contactName} />
    </div>
  );
}
