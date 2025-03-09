"use client";

import Nav from "../../components/AdminTopFooter";
import { TeamToggler } from "../../components/AdminToggler";
import { StatisticsVisualizer } from "../../components/TeamVisual";
//import ApplicantsTable from "../admin/applicants-table";
//import { AdminHeader } from "../admin/admin-header";

export default function Home() {
  return (
    <>
      <div className="bg-[#0C0D0E]">
        <Nav />
        <TeamToggler />
        <StatisticsVisualizer />
      </div>
    </>
  );
}

// "use client";

// import { useEffect, useState } from "react";

// interface ApplicantsResponse {
//   applicants: { fullName: string }[];
// } // Define expected response type

// export default function Home() {
//   const [count, setCount] = useState<number | null>(null);

//   useEffect(() => {
//     fetch("/api/test")
//       .then((res) => res.json() as Promise<ApplicantsResponse>) // Cast response to expected type
//       .then((data) => setCount(data.applicants.length)) // No more TypeScript error!
//       .catch((error) => console.error("Error fetching name count:", error));
//   }, []);

//   return (
//     <>
//       <div className="flex min-h-screen flex-col items-center justify-center bg-[#0C0D0E] text-white">
//         <div className="mt-8 text-4xl font-bold">
//           {count !== null ? `Total Applicants: ${count}` : "Loading..."}
//         </div>
//       </div>
//     </>
//   );
// }
