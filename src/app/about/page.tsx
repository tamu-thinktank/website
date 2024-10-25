import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import CardStack from "./CardStack";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
        <CardStack />
      <AppFooter />
    </>
  );
};

export default Home;