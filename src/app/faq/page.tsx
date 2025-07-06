import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import FAQHeader from "./faqHeader";
import DCfaq from "./DCfaq";
import MateRovFaq from "./MATEROVfaq";
const Home: NextPage = () => {
  return (
    <>
      <SmoothScroll>
        <div className="bg-[#0C0D0E]">
          <AppHeader />
          <main className="bg mb-40 pt-20">
            <FAQHeader />
            <DCfaq />
            <MateRovFaq />
          </main>
          <AppFooter />
        </div>
      </SmoothScroll>
    </>
  );
};

export default Home;
