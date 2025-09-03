"use client";

import * as React from "react";
import { FilterButton } from "./filterButton";
import { TableHeader } from "./tableHeader";
import type { ApplicantData, FilterState } from "./membertypes";
import { ApplicantDetailsModal } from "@/components/ApplicantDetailsModal";

export const MembersPage: React.FC = () => {
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
  const [selectedApplicantId, setSelectedApplicantId] = React.useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/members");

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = (await response.json()) as ApplicantData[];
        setApplicantData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load member data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    void fetchMemberData();
  }, []);

  const dcMemberHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
  ];

  const officerHeaders = [
    "Name",
    "Position Preferences",
    "Team Rankings",
    "Major",
    "Year",
  ];

  const materovHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
  ];

  const miniDcHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
  ];

  const dcMemberTeams = ["TSGC", "AIAA", "Reset"];

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

  const materovsubteams = [
    "COMPUTATION_COMMUNICATIONS",
    "ELECTRICAL_POWER",
    "FLUIDS_PROPULSION",
    "GNC",
    "THERMAL_MECHANISMS_STRUCTURES",
    "MATE_ROV_LEADERSHIP",
    "Reset",
  ];

  const miniDcTeams = ["MINI_DC_TEAM_1", "MINI_DC_TEAM_2", "Reset"];

  const mateinterests = [
    "SOFTWARE",
    "CAD",
    "POWER",
    "FLUIDS",
    "GNC",
    "OTHER",
    "Reset",
  ];

  const _teamOptions = ["Team A", "Team B", "Team C", "Reset"];
  const _ratingOptions = ["1/5", "2/5", "3/5", "4/5", "5/5", "Reset"];
  const _interestOptions = ["AI", "Robotics", "Web Development", "Reset"];
  const majorOptions = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Reset",
  ];

  const openApplicantDetails = (id: string) => {
    setSelectedApplicantId(id);
    setIsModalOpen(true);
  };

  const filteredMembers = React.useMemo(() => {
    return applicantData.filter((applicant) => {
      const matchesCategory = applicant.category === selectedCategory;
      const matchesSearch = applicant.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMajor = !filters.major || applicant.major === filters.major;
      const matchesInterests =
        !filters.interests ||
        applicant.interests.some((interest) => interest === filters.interests);
      const matchesTeam = (() => {
        if (!filters.team) return true;

        switch (selectedCategory) {
          case "OFFICER":
            return (
              ((applicant as Record<string, unknown>).officerpos as unknown[] | undefined)?.some(
                (pos) => (pos as Record<string, unknown>).position === filters.team,
              ) ?? false
            );
          case "MATEROV":
            return (
              ((applicant as Record<string, unknown>).subTeam as unknown[] | undefined)?.some(
                (team) => (team as Record<string, unknown>).name === filters.team,
              ) ?? false
            );
          case "DCMEMBER":
          case "MINIDC":
            return (
              ((applicant as Record<string, unknown>).subTeam as unknown[] | undefined)?.some(
                (team) => (team as Record<string, unknown>).name === filters.team,
              ) ?? false
            );
          default:
            return true;
        }
      })();
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
            Members
          </div>

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
                Loading member data...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500">{error}</div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-10 text-center text-neutral-200">
                No members found matching your criteria.
              </div>
            ) : (
              <>
                {filteredMembers.map((applicant, index) => (
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
                            applicant.interests.length > 0
                          ) {
                            const displayItems = applicant.interests.slice(
                              0,
                              2,
                            );
                            const remainingCount =
                              applicant.interests.length - 2;
                            return (
                              <div className="space-y-1">
                                {displayItems.map((interest, idx) => (
                                  <div
                                    key={`${interest}-${idx}`}
                                    className="text-xs"
                                  >
                                    {interest}
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
                            applicant.teamRankings.length > 0
                          ) {
                            const displayItems = applicant.teamRankings.slice(
                              0,
                              2,
                            );
                            const remainingCount =
                              applicant.teamRankings.length - 2;
                            return (
                              <div className="space-y-1">
                                {displayItems.map((team, idx) => (
                                  <div
                                    key={`${team}-${idx}`}
                                    className="text-xs"
                                  >
                                    {team}
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
                    </div>
                    {index < filteredMembers.length - 1 && (
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
        onClose={() => setIsModalOpen(false)}
        applicantId={selectedApplicantId ?? undefined}
      />
    </div>
  );
};

export default MembersPage;
