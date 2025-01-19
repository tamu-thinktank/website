import Articles from "@/app/_home/Articles";
import Benefits from "@/app/_home/Benefits";
import HeroSection from "@/app/_home/HeroSection";
//import Officers from "@/app/_home/Officers";
import Overview from "@/app/_home/Overview";
import ChallengeSection from "@/app/_home/Travel";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import SmoothScroll from "@/components/SmoothScroll";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <SmoothScroll>
      <div className="bg-[#0C0D0E]">
        <AppHeader />

        <HeroSection />
        <Overview />
        <Benefits />

        <ChallengeSection />
        <Articles />

        <AppFooter />
      </div>
    </SmoothScroll>
  );
};

export default Home;