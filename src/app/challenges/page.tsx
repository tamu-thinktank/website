import AppFooter from "@/app/_home/AppFooter";
import AppHeader from "@/app/_home/AppHeader";
import Challenges from "@/app/challenges/Challenges";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <AppHeader />
      <main className="mb-40 space-y-20">
        <Challenges />
      </main>
      <AppFooter />
    </>
  );
};

export default Home;
