import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import Challenges from "./Challenges";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
      <main className="mb-40 space-y-20 bg-[#0C0D0E]">
        <Challenges />
      </main>
      <AppFooter />
    </>
  );
};

export default Home;
