import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";
import OfficerInterest from "./OfficerInterest";
import Officers from "./Officers";
import ImageCarousel from "./ImageCarousel";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
      <div className="pt-20">
        <ImageCarousel />
        <CardStack />
        <Officers />
        <OfficerInterest />
        </div>  
      <AppFooter />
    </>
  );
};

export default Home;