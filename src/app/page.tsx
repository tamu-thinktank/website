import AppFooter from "@/components/home/AppFooter";
import AppHeader from "@/components/home/AppHeader";
import Blog from "@/components/home/Blog";
import CallToAction from "@/components/home/CallToAction";
import Features from "@/components/home/Features";
import HeroSection from "@/components/home/HeroSection";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import { type NextPage } from "next";
import Carousel from "./_components/home/Carousel";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
      <main className="mb-40 space-y-40">
        <HeroSection />
        <Features />
        <Carousel />
        <Stats />
        <Testimonials />
        <CallToAction />
        <Blog />
      </main>
      <AppFooter />
    </>
  );
};

export default Home;
