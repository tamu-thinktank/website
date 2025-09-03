"use client";

import * as React from "react";
import { FilterButton } from "./filterButton";
import { TableHeader } from "./tableHeader";
import type { ApplicantData, FilterState } from "./intervieweetypes";
import { BsFillUnlockFill, BsLockFill } from "react-icons/bs";
import { ApplicantDetailsModal } from "@/components/ApplicantDetailsModal";

export const IntervieweesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("DCMEMBER");
  const [filters, setFilters] = React.useState<FilterState>({
    team: "",
    rating: "",
    interests: "",
    major: "",
    status: "",
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
  const [selectedApplicantId, setSelectedApplicantId] = React.useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchIntervieweeData = async () => {
    try {
      setLoading(true);
      console.log("Fetching interviewee data...");
      const response = await fetch("/api/interviewees");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch interviewees: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as ApplicantData[];
      console.log("Fetched interviewee data:", data.length, "records");
      setApplicantData(data);

      // Initialize lock status
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
        `Failed to load interviewee data: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchIntervieweeData();
  }, []);

  const dcMemberHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Lock",
  ];

  const officerHeaders = [
    "Name",
    "Position Preferences",
    "Team Rankings",
    "Major",
    "Year",
    "Lock",
  ];

  const materovHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Lock",
  ];

  const miniDcHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Lock",
  ];

  const officerpositions = [
    "VICE_PRESIDENT",
    "PROJECT_MANAGER",
    "MARKETING_SPECIALIST",
    "GRAPHIC_DESIGNER",
    "WEB_DEV_LEAD",
    "TREASURER",
    "DC_PROGRAM_MANAGER",
    "Reset",
  ];

  const _teamOptions = ["Team A", "Team B", "Team C", "Reset"];
  const _ratingOptions = ["High", "Medium", "Low", "Reset"];
  const _interestOptions = ["AI", "Robotics", "Web Development", "Reset"];
  const dcMemberTeams = ["TSGC", "AIAA", "Reset"];
  const miniDcTeams = ["MINI_DC_TEAM_1", "MINI_DC_TEAM_2", "Reset"];
  const materovsubteams = [
    "COMPUTATION_COMMUNICATIONS",
    "ELECTRICAL_POWER",
    "FLUIDS_PROPULSION",
    "GNC",
    "THERMAL_MECHANISMS_STRUCTURES",
    "MATE_ROV_LEADERSHIP",
    "Reset",
  ];
  const mateinterests = [
    "SOFTWARE",
    "CAD",
    "POWER",
    "FLUIDS",
    "GNC",
    "OTHER",
    "Reset",
  ];
  const majorOptions = [
    "ENGR",
    "OPEN",
    "AERO",
    "BAEN",
    "BMEN",
    "CHEN",
    "CPEN",
    "CSCE",
    "CVEN",
    "ELEN",
    "EVEN",
    "ETID",
    "ISEN",
    "MSEN",
    "MEEN",
    "MMET",
    "MXET",
    "NUEN",
    "OCEN",
    "PETE",
    "OTHER",
    "Reset",
  ];

  const _statusOptions = [
    "PENDING",
    "INTERVIEWING",
    "ACCEPTED",
    "REJECTED",
    "REJECTED_APP",
    "Reset",
  ];

  const _getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-orange-400";
      case "INTERVIEWING":
        return "text-blue-400";
      case "ACCEPTED":
        return "text-green-400";
      case "REJECTED_INT":
        return "text-red-400";
      case "REJECTED_APP":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicantId(null);
    void fetchIntervieweeData();
  };

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
      alert("No interviewees are locked for transfer");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to transfer ${lockedApplicants.length} interviewee(s) to member status?`,
    );

    if (isConfirmed) {
      try {
        setTransferStatus("loading");
        setTransferMessage("Transferring interviewees...");

        console.log(
          "Transferring interviewees:",
          lockedApplicants.map((app) => app.id),
        );

        const response = await fetch("/api/transfer-to-member", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicantIds: lockedApplicants.map((app) => app.id),
          }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "Transfer failed");
        }

        console.log("Transfer response:", result);
        setTransferStatus("success");
        setTransferMessage(
          `Transfer complete. ${lockedApplicants.length} interviewee(s) transferred to member status.`,
        );
        alert(
          `Transfer complete. ${lockedApplicants.length} interviewee(s) transferred to member status.`,
        );
        void fetchIntervieweeData(); // Refresh the list
      } catch (error) {
        console.error("Error transferring interviewees:", error);
        setTransferStatus("error");
        setTransferMessage(
          `Error transferring interviewees: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        alert(
          `Error transferring interviewees: ${error instanceof Error ? error.message : "Please try again."}`,
        );
      } finally {
        setTimeout(() => {
          setTransferStatus("idle");
          setTransferMessage("");
        }, 5000);
      }
    }
  };

  const openApplicantDetails = (id: string) => {
    setSelectedApplicantId(id);
    setIsModalOpen(true);
  };

  const filteredInterviewees = React.useMemo(() => {
    return applicantData.filter((applicant) => {
      const matchesCategory = applicant.category === selectedCategory;
      const matchesSearch = applicant.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMajor = !filters.major || applicant.major === filters.major;
      const matchesInterests =
        !filters.interests ||
        applicant.interests.some(
          (interest) => interest.area === filters.interests,
        );
      const matchesTeam = (() => {
        if (!filters.team) return true;

        switch (selectedCategory) {
          case "OFFICER":
            return applicant.officerpos.some(
              (pos) => pos.position === filters.team,
            );
          case "MATEROV":
            return applicant.subTeam.some((team) => team.name === filters.team);
          case "DCMEMBER":
          case "MINIDC":
            return applicant.subTeam.some((team) => team.name === filters.team);
          default:
            return true;
        }
      })();

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMajor &&
        matchesInterests &&
        matchesTeam
      );
    });
  }, [searchQuery, filters, applicantData, selectedCategory]);

  const handleFilterChange =
    (filterType: keyof FilterState) => (value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value === prev[filterType] ? "" : value,
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
            Interviewees
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
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[37px_0px_0px_0px] px-4 py-2.5 text-center text-sm transition-colors ${
                selectedCategory === "DCMEMBER"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              DC MEMBER
            </div>
            <div className="w-[1.5px] bg-neutral-200"></div>
            <div
              onClick={() => setSelectedCategory("OFFICER")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap px-4 py-2.5 text-center text-sm transition-colors ${
                selectedCategory === "OFFICER"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              OFFICER
            </div>
            <div className="w-[1.5px] bg-neutral-200"></div>
            <div
              onClick={() => setSelectedCategory("MATEROV")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap px-4 py-2.5 text-center text-sm transition-colors ${
                selectedCategory === "MATEROV"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              MATE ROV
            </div>
            <div className="w-[1.5px] bg-neutral-200"></div>
            <div
              onClick={() => setSelectedCategory("MINIDC")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[0px_37px_37px_0px] px-4 py-2.5 text-center text-sm transition-colors ${
                selectedCategory === "MINIDC"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              MINI DC
            </div>
          </div>

          <div className="mt-9 h-px w-full shrink-0 border border-solid border-neutral-200" />

          <div className="ml-7 mt-8 flex w-auto max-w-full items-center justify-start gap-5 self-stretch px-0 py-0 text-sm tracking-wide text-neutral-200 max-md:flex-col">
            <input
              type="text"
              placeholder="Search by Name or UIN"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-[400px] rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-4 max-md:w-full max-md:max-w-[500px] max-md:px-5"
            />
            <div className="h-12 w-[1px] bg-neutral-400"></div>
            <FilterButton
              label={(() => {
                switch (selectedCategory) {
                  case "OFFICER":
                    return "Position";
                  case "MATEROV":
                    return "Sub-Team";
                  case "DCMEMBER":
                    return "Team";
                  case "MINIDC":
                    return "Team";
                  default:
                    return "Team";
                }
              })()}
              options={(() => {
                switch (selectedCategory) {
                  case "OFFICER":
                    return officerpositions;
                  case "MATEROV":
                    return materovsubteams;
                  case "DCMEMBER":
                    return dcMemberTeams;
                  case "MINIDC":
                    return miniDcTeams;
                  default:
                    return dcMemberTeams;
                }
              })()}
              onOptionSelect={handleFilterChange("team")}
              selected={filters.team || "Team"}
            />
            {selectedCategory === "MATEROV" && (
              <FilterButton
                label="Interests"
                options={mateinterests}
                onOptionSelect={handleFilterChange("interests")}
                selected={filters.interests || "Interests"}
              />
            )}
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
                : "Transfer to Member"}
            </button>
          </div>

          <div className="mt-7 flex w-full flex-col rounded-[48px] border border-solid border-neutral-200 tracking-wide max-md:max-w-full max-md:pb-24">
            <TableHeader
              headers={(() => {
                switch (selectedCategory) {
                  case "OFFICER":
                    return officerHeaders;
                  case "MATEROV":
                    return materovHeaders;
                  case "DCMEMBER":
                    return dcMemberHeaders;
                  case "MINIDC":
                    return miniDcHeaders;
                  default:
                    return dcMemberHeaders;
                }
              })()}
            />
            {loading ? (
              <div className="py-10 text-center text-neutral-200">
                Loading interviewee data...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500">{error}</div>
            ) : filteredInterviewees.length === 0 ? (
              <div className="py-10 text-center text-neutral-200">
                No interviewees found matching your criteria.
              </div>
            ) : (
              <>
                {filteredInterviewees.map((applicant, index) => (
                  <React.Fragment key={applicant.id}>
                    <div className="flex w-full items-center justify-center gap-10 px-5 py-4 text-sm transition-colors hover:bg-neutral-800">
                      <div
                        className="flex-1 cursor-pointer text-center hover:text-blue-400 hover:underline"
                        onClick={() => openApplicantDetails(applicant.id)}
                      >
                        {applicant.name}
                      </div>
                      <div className="flex-1 text-center">
                        {/* Research Interests Display */}
                        {(() => {
                          if (
                            selectedCategory === "OFFICER" &&
                            applicant.officerpos.length > 0
                          ) {
                            // For officer applications, show position preferences
                            const displayItems = applicant.officerpos.slice(
                              0,
                              2,
                            );
                            const remainingCount =
                              applicant.officerpos.length - 2;
                            return (
                              <div className="space-y-1">
                                {displayItems.map((pref, idx) => (
                                  <div
                                    key={`${pref.position}-${idx}`}
                                    className="text-xs"
                                  >
                                    {pref.position} (
                                    {pref.interest.toLowerCase()})
                                  </div>
                                ))}
                                {remainingCount > 0 && (
                                  <div className="text-xs text-neutral-400">
                                    +{remainingCount} more
                                  </div>
                                )}
                              </div>
                            );
                          } else if (
                            applicant.interests.length > 0
                          ) {
                            // For other applications, show research interests
                            const displayItems = applicant.interests.slice(
                              0,
                              2,
                            );
                            const remainingCount =
                              applicant.interests.length - 2;
                            return (
                              <div className="space-y-1">
                                {displayItems.map((pref, idx) => (
                                  <div
                                    key={`${pref.area}-${idx}`}
                                    className="text-xs"
                                  >
                                    {pref.area} ({pref.interest.toLowerCase()})
                                  </div>
                                ))}
                                {remainingCount > 0 && (
                                  <div className="text-xs text-neutral-400">
                                    +{remainingCount} more
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return <div className="text-neutral-500">N/A</div>;
                        })()}
                      </div>
                      <div className="flex-1 text-center">
                        {/* Team Rankings Display */}
                        {(() => {
                          if (
                            applicant.subTeam.length > 0
                          ) {
                            const displayItems = applicant.subTeam.slice(0, 2);
                            const remainingCount = applicant.subTeam.length - 2;
                            return (
                              <div className="space-y-1">
                                {displayItems.map((pref, idx) => (
                                  <div
                                    key={`${pref.name}-${idx}`}
                                    className="text-xs"
                                  >
                                    {pref.name} ({pref.interest.toLowerCase()})
                                  </div>
                                ))}
                                {remainingCount > 0 && (
                                  <div className="text-xs text-neutral-400">
                                    +{remainingCount} more
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return <div className="text-neutral-500">N/A</div>;
                        })()}
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
                            <BsLockFill className="text-green-400" size={20} />
                          ) : (
                            <BsFillUnlockFill
                              className="text-red-600"
                              size={20}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    {index < filteredInterviewees.length - 1 && (
                      <div className="w-full shrink-0 border border-solid border-neutral-200" />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <ApplicantDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        applicantId={selectedApplicantId ?? undefined}
      />
    </div>
  );
};

export default IntervieweesPage;
