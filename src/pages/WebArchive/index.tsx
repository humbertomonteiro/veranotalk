import About from "../../components/sections/About";
import Location from "../../components/sections/Location";
import Highlights from "../../components/sections/Highlights";
import Hero from "../../components/sections/Hero";
import FooterSponsor from "../../components/template/FooterSponsor";
import Schedule from "../../components/sections/Schedule";
import BoxesSponsors from "../BoxesSponsors";

export default function WebArchive({
  phone,
  contactName,
}: {
  phone: string;
  contactName: string;
}) {
  console.log(phone, contactName);
  return (
    <div>
      <Hero sponsor={true} />
      <Highlights />
      <About sponsor={true} />
      <Schedule />
      <Location sponsor={true} />
      <BoxesSponsors
        phone="5598981644714"
        contactName="Ana Paula"
        type="ana-top"
        showFooter={false}
      />
      {/* <FooterSponsor  sponsor={true} phone={phone} contactName={contactName} /> */}
      <FooterSponsor
        sponsor={true}
        phone={"5598981894412"}
        contactName="Leonardo Aragão"
      />
    </div>
  );
}
