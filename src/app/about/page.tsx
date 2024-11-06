import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";
import OfficerInterest from "./OfficerInterest";
import Officers from "./Officers";
import ImageCarousel from "./ImageCarousel";
import FAQ from "./FAQ";
import ApplyBanner from "@/components/ApplyBanner";

const Home: NextPage = () => {
  return (
    <>
      <ApplyBanner />
      <AppHeader />
      <main className="bg-[#0C0D0E]">
      <div className="pt-20">
        <ImageCarousel />
        <CardStack />
        <Officers />
        <OfficerInterest />
        <FAQ />
      </div>
      <AppFooter />
      </main>
    </>
  );
};

export default Home;