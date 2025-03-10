import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";
import OfficerInterest from "./OfficerInterest";
import Officers from "./Officers";
import ImageCarousel from "./ImageCarousel";
import AboutHeader from "./AboutHeader";
import SmoothScroll from "@/components/SmoothScroll";

const Home: NextPage = () => {
  return (
    <>
      <SmoothScroll>
        <AppHeader />
        <main className="bg-[#0C0D0E]">
          <div className="pt-20">
            <AboutHeader />
            <ImageCarousel />
            <CardStack />
            <Officers />
            <OfficerInterest />
          </div>
          <AppFooter />
        </main>
      </SmoothScroll>
    </>
  );
};

export default Home;
