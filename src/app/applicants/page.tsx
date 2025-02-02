import AppFooter from "@/components/AppFooter";
import AdminHeader from "@/components/AdminHeader";
import type { NextPage } from "next";
import Challenges from "./inside_applicants";
import SmoothScroll from "@/components/SmoothScroll";

const Home: NextPage = () => {
  return (
    <>
      <AdminHeader />
      <main className="mb-40 space-y-20">
        <Challenges />
      </main>
      <AdminHeader />
    </>
  );
};

export default Home;
