import AppFooter from "@/app/_home/AppFooter";
import AppHeader from "@/app/_home/AppHeader";
import Articles from "@/app/_home/Articles";
import CallToAction from "@/app/_home/CallToAction";
import HeroSection from "@/app/_home/HeroSection";
import Officers from "@/app/_home/Officers";
import Overview from "@/app/_home/Overview";
import Travel from "@/app/_home/Travel";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
      <main className="mb-40 space-y-20">
        <HeroSection />
        <Overview />
        <Travel />
        <Officers />
        <CallToAction />
        <Articles />
      </main>
      <AppFooter />
    </>
  );
};

export default Home;
