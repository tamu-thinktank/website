import AppFooter from "@/components/home/AppFooter";
import AppHeader from "@/components/home/AppHeader";
import Articles from "@/app/_components/home/Articles";
import CallToAction from "@/components/home/CallToAction";
import Overview from "@/app/_components/home/Overview";
import HeroSection from "@/components/home/HeroSection";
import Travel from "@/app/_components/home/Travel";
import Offciers from "@/app/_components/home/Officers";
import { type NextPage } from "next";
import Carousel from "./_components/home/Carousel";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
      <main className="mb-40 space-y-20">
        <HeroSection />
        <Overview />
        <Carousel />
        <Travel />
        <Offciers />
        <CallToAction />
        <Articles />
      </main>
      <AppFooter />
    </>
  );
};

export default Home;
