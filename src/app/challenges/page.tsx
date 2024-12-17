import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import Challenges from "./Challenges";
import SmoothScroll from "@/components/SmoothScroll";
import ChallengesHeader from "./ChallengesHeader";
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
