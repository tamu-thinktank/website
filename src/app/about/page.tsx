import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";
import OfficerInterest from "./OfficerInterest";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
        <CardStack />
        <OfficerInterest />
      <AppFooter />
    </>
  );
};

export default Home;