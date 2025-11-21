
import DesertSafariActivities from "@/Component/Landing/Activities";
import AwardsSection from "@/Component/Landing/Award";
import Banner from "@/Component/Landing/Banner";
import ExclusiveArrangements from "@/Component/Landing/Events";
import ExperiencesSection from "@/Component/Landing/ExpirencesSection";
import FAQSection from "@/Component/Landing/FAQ";
import WhyChoose from "@/Component/Landing/WhyChoose";
import { getAllEvents, getAllFaq, getAllPackage } from "@/utils/api/api";


import React from "react";

const HomePage =async () => {


const packages = await getAllPackage();
console.log("Packages:-----------><><><><><><------>", packages);

const events = await getAllEvents();


const faq = await getAllFaq();
  // const t = await getTranslations("home");
  return (
    <div>
      <Banner/>
      <AwardsSection/>
      <ExperiencesSection packages={packages}/>
      <DesertSafariActivities/>
      <ExclusiveArrangements events={events}/>
      <WhyChoose/>
      <FAQSection faq={faq}/>
    </div>
  );
};

export default HomePage;
