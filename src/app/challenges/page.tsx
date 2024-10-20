import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import Challenges from "./Challenges";

const Home: NextPage = () => {
  return (
    <>
      <main className="mb-40 space-y-20">
        <AppHeader />

        <Challenges />
      </main>
      <AppFooter />
    </>
  );
};

export default Home;
