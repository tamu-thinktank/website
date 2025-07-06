import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import Subteams from "./Subteams";
import SmoothScroll from "@/components/SmoothScroll";
import MATEROVHeader from "./MATEROVHeader";
const Home: NextPage = () => {
  return (
    <>
      <SmoothScroll>
        <div className="bg-[#0C0D0E]">
          <AppHeader />
          <main className="bg mb-40 pt-20">
            <MATEROVHeader />
            <Subteams />
          </main>
          <AppFooter />
        </div>
      </SmoothScroll>
    </>
  );
};

export default Home;
