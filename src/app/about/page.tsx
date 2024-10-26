import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";
import Challenges from "./Challenges";
import OfficerInterest from "./OfficerInterest";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
        <Challenges />
        <CardStack />
        <OfficerInterest />
      <AppFooter />
    </>
  );
};

export default Home;