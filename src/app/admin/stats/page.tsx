"use client";

//import Nav from "../../../components/AdminTopFooter";
//import { TeamToggler } from "../../../components/AdminToggler";
import { StatisticsVisualizer } from "../../../components/TeamVisual";
//import ApplicantsTable from "../admin/applicants-table";
//import { AdminHeader } from "../admin/admin-header";

export default function Home() {
  return (
    <>
      <div className="bg-[#0C0D0E]">
        <StatisticsVisualizer />
      </div>
    </>
  );
}
