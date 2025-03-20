import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import type { NextPage } from "next";
import Challenges from "./LinkCollectionPage";
import SmoothScroll from "@/components/SmoothScroll";
import ChallengesHeader from "./header";
const Home: NextPage = () => {
    return (
        <>
            <SmoothScroll>
                <div className="bg-[#0C0D0E]">
                    <main className="bg mb-40 space-y-20">
                        <ChallengesHeader />
                        <AppHeader />
                        <Challenges />
                    </main>
                    <AppFooter />
                </div>
            </SmoothScroll>
        </>
    );
};

export default Home;
