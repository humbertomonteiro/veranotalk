import Sponsors from "../../components/sections/Sponsors";
import WhatsAppButton from "../../components/shared/WhatsAppButton";
import FooterSponsor from "../../components/template/FooterSponsor";

interface BoxesSponsorsProps {
  type?: "national" | "location" | "ana-top" | "ana-basic";
  phone: string;
  contactName: string;
  showFooter?: boolean;
}

export default function BoxesSponsors({
  type,
  phone,
  contactName,
  showFooter,
}: BoxesSponsorsProps) {
  return (
    <div>
      <Sponsors type={type ? type : "location"} phone={phone} />
      {showFooter && (
        <FooterSponsor sponsor={true} phone={phone} contactName={contactName} />
      )}
      {showFooter && <WhatsAppButton phone={phone} contactName={contactName} />}
    </div>
  );
}
