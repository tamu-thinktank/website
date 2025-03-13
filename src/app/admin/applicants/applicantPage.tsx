"use client";

import * as React from "react";
import { FilterButton } from "./filterButton";
import { TableHeader } from "./tableHeader";
import type { ApplicantData, FilterState } from "./types";
import { BsFillUnlockFill, BsLockFill } from "react-icons/bs";

export const ApplicantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("DCMEMBER");
  const [filters, setFilters] = React.useState<FilterState>({
    team: "",
    rating: "",
    interests: "",
    major: "",
  });
  const [applicantData, setApplicantData] = React.useState<ApplicantData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lockStatus, setLockStatus] = React.useState<Record<string, boolean>>(
    {},
  );
  const [transferStatus, setTransferStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [transferMessage, setTransferMessage] = React.useState("");

  const fetchApplicantData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/applicants");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch applicants: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as ApplicantData[];
      console.log("Fetched applicant data:", data.length, "records");
      setApplicantData(data);

      // Initialize lock status for each applicant
      const initialLockState = data.reduce(
        (acc, applicant) => {
          acc[applicant.id] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      setLockStatus(initialLockState);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        `Failed to load applicant data: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchApplicantData();
  }, []);

  const tableHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Lock",
  ];

  const teamOptions = ["Team A", "Team B", "Team C", "Reset"];
  const ratingOptions = ["High", "Medium", "Low", "Reset"];
  const interestOptions = ["AI", "Robotics", "Web Development", "Reset"];
  const majorOptions = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Reset",
  ];

  const toggleLock = (id: string) => {
    setLockStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  const handleTransfer = async () => {
    const lockedApplicants = applicantData.filter(
      (applicant) => lockStatus[applicant.id],
    );

    if (lockedApplicants.length === 0) {
      alert("No applicants are locked for transfer");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to transfer ${lockedApplicants.length} applicant(s) to the interview stage?`,
    );

    if (isConfirmed) {
      try {
        setTransferStatus("loading");
        setTransferMessage("Transferring applicants...");

        console.log(
          "Transferring applicants:",
          lockedApplicants.map((app) => app.id),
        );

        const response = await fetch("/api/transfer-to-interviewee", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicantIds: lockedApplicants.map((app) => app.id),
          }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(result.error || "Transfer failed");
        }

        console.log("Transfer response:", result);
        setTransferStatus("success");
        setTransferMessage(
          `Transfer complete. ${lockedApplicants.length} applicant(s) transferred to interview stage.`,
        );
        alert(
          `Transfer complete. ${lockedApplicants.length} applicant(s) transferred to interview stage.`,
        );
        void fetchApplicantData(); // Refresh the list
      } catch (error) {
        console.error("Error transferring applicants:", error);
        setTransferStatus("error");
        setTransferMessage(
          `Error transferring applicants: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        alert(
          `Error transferring applicants: ${error instanceof Error ? error.message : "Please try again."}`,
        );
      } finally {
        setTimeout(() => {
          setTransferStatus("idle");
          setTransferMessage("");
        }, 5000);
      }
    }
  };

  const filteredApplicants = React.useMemo(() => {
    return applicantData.filter((applicant) => {
      const matchesCategory = applicant.category === selectedCategory;
      const matchesSearch = applicant.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMajor = !filters.major || applicant.major === filters.major;
      const matchesInterests =
        !filters.interests || applicant.interests.includes(filters.interests);
      const matchesTeam =
        !filters.team || applicant.teamRankings.includes(filters.team);
      const matchesRating =
        !filters.rating || applicant.rating === filters.rating;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMajor &&
        matchesInterests &&
        matchesTeam &&
        matchesRating
      );
    });
  }, [searchQuery, filters, applicantData, selectedCategory]);

  const handleFilterChange =
    (filterType: keyof FilterState) => (value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value === "Reset" ? "" : value,
      }));
    };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col overflow-hidden bg-neutral-950 text-xl font-medium shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div className="mt-1 flex w-full flex-col items-center overflow-hidden px-20 pb-96 pt-11 max-md:max-w-full max-md:px-5 max-md:pb-24">
        <div className="mb-0 flex w-full max-w-[1537px] flex-col max-md:mb-2.5 max-md:max-w-full">
          <div className="self-start pb-10 pt-20 text-center text-5xl font-semibold max-md:text-4xl">
            Applicants
          </div>

          {transferStatus !== "idle" && (
            <div
              className={`mb-4 rounded-md p-4 ${
                transferStatus === "loading"
                  ? "bg-blue-500/20 text-blue-200"
                  : transferStatus === "success"
                    ? "bg-green-500/20 text-green-200"
                    : "bg-red-500/20 text-red-200"
              }`}
            >
              {transferMessage}
            </div>
          )}

          <div className="flex w-full overflow-hidden rounded-[48px] border border-solid border-neutral-200">
            <div
              onClick={() => setSelectedCategory("DCMEMBER")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[37px_0px_0px_37px] py-2.5 pl-20 pr-5 transition-colors max-md:max-w-full max-md:pl-5 ${
                selectedCategory === "DCMEMBER"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              DC
            </div>
            <div className="w-[1.5px] bg-neutral-200"></div>
            <div
              onClick={() => setSelectedCategory("MATE ROV")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[0px_37px_37px_0px] py-2.5 pl-20 pr-5 transition-colors max-md:max-w-full max-md:pl-5 ${
                selectedCategory === "MATE ROV"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              MATE ROV
            </div>
          </div>

          <div className="mt-9 h-px w-full shrink-0 border border-solid border-neutral-200" />

          <div className="ml-7 mt-8 flex w-auto max-w-full items-center justify-start gap-10 self-stretch px-0 py-0 text-sm tracking-wide text-neutral-200 max-md:flex-col">
            <input
              type="text"
              placeholder="Search by Name or UIN"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-[500px] rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-4 max-md:w-full max-md:max-w-[500px] max-md:px-5"
            />
            <div className="h-12 w-[1px] bg-neutral-400"></div>
            <FilterButton
              label="Team"
              options={teamOptions}
              onOptionSelect={handleFilterChange("team")}
              selected={filters.team || "Team"}
            />
            <FilterButton
              label="Rating"
              options={ratingOptions}
              onOptionSelect={handleFilterChange("rating")}
              selected={filters.rating || "Rating"}
            />
            <FilterButton
              label="Interests"
              options={interestOptions}
              onOptionSelect={handleFilterChange("interests")}
              selected={filters.interests || "Interests"}
            />
            <FilterButton
              label="Major"
              options={majorOptions}
              onOptionSelect={handleFilterChange("major")}
              selected={filters.major || "Major"}
            />
            <button
              className="rounded-[48px] border border-solid bg-stone-600 px-6 py-3 text-white transition-colors hover:bg-stone-500 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleTransfer}
              disabled={transferStatus === "loading"}
            >
              {transferStatus === "loading"
                ? "Transferring..."
                : "Transfer to Interview"}
            </button>
          </div>

          <div className="mt-7 flex w-full flex-col rounded-[48px] border border-solid border-neutral-200 tracking-wide max-md:max-w-full max-md:pb-24">
            <TableHeader headers={tableHeaders} />
            {loading ? (
              <div className="py-10 text-center text-neutral-200">
                Loading applicant data...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500">{error}</div>
            ) : filteredApplicants.length === 0 ? (
              <div className="py-10 text-center text-neutral-200">
                No applicants found matching your criteria.
              </div>
            ) : (
              <>
                {filteredApplicants.map((applicant, index) => (
                  <React.Fragment key={applicant.id}>
                    <div className="flex w-full items-center justify-center gap-10 px-5 py-4 text-sm transition-colors hover:bg-neutral-800">
                      <div className="flex-1 text-center">{applicant.name}</div>
                      <div className="flex-1 text-center">
                        {applicant.interests.join(", ")}
                      </div>
                      <div className="flex-1 text-center">
                        {applicant.teamRankings.join(", ")}
                      </div>
                      <div className="flex-1 text-center">
                        {applicant.major}
                      </div>
                      <div className="flex-1 text-center">{applicant.year}</div>
                      <div className="flex-1 text-center">
                        <button
                          onClick={() => toggleLock(applicant.id)}
                          className="h-5 w-5 cursor-pointer"
                        >
                          {lockStatus[applicant.id] ? (
                            <BsLockFill className="text-green-400" size={25} />
                          ) : (
                            <BsFillUnlockFill
                              className="text-red-600"
                              size={25}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    {index < filteredApplicants.length - 1 && (
                      <div className="w-full shrink-0 border border-solid border-neutral-200" />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
