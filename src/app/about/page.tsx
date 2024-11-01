import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";
import OfficerInterest from "./OfficerInterest";
import Officers from "./Officers";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
        <CardStack />
        <Officers />
        <OfficerInterest />
      <AppFooter />
    </>
  );
};

export default Home;