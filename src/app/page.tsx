import AppFooter from "@/components/home/AppFooter";
import AppHeader from "@/components/home/AppHeader";
import Articles from "@/components/home/Articles";
import CallToAction from "@/components/home/CallToAction";
import HeroSection from "@/components/home/HeroSection";
import Officers from "@/components/home/Officers";
import Overview from "@/components/home/Overview";
import Travel from "@/components/home/Travel";
import { type NextPage } from "next";

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
