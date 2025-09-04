"use client";

import * as React from "react";
import { FilterButton } from "./filterButton";
import { TableHeader } from "./tableHeader";
import type { ApplicantData, FilterState } from "./types";
import { ApplicantDetailsModal } from "@/components/ApplicantDetailsModal";

export const ApplicantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("DCMEMBER");
  const [filters, setFilters] = React.useState<FilterState>({
    team: "",
    position: "",
    rating: "",
    interests: "",
    major: "",
    status: "", // Initialize status filter
  });
  const [applicantData, setApplicantData] = React.useState<ApplicantData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [transferStatus, setTransferStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [transferMessage, setTransferMessage] = React.useState("");
  const [selectedApplicantId, setSelectedApplicantId] = React.useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [autoSchedulingIds, setAutoSchedulingIds] = React.useState<Set<string>>(
    new Set(),
  );

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
      data.forEach((app) => console.log(`Applicant ${app.name} status:`, app));
      setApplicantData(data);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicantId(null);
    void fetchApplicantData();
  };

  // Auto-schedule an applicant
  const _autoScheduleApplicant = async (
    applicantId: string,
    applicantName: string,
  ) => {
    if (autoSchedulingIds.has(applicantId)) return; // Prevent double-clicking

    setAutoSchedulingIds((prev) => new Set([...prev, applicantId]));

    try {
      // First, get the applicant's details to determine team preferences
      const applicantResponse = await fetch(`/api/applicant/${applicantId}`);
      if (!applicantResponse.ok) {
        throw new Error("Failed to fetch applicant details");
      }

      const applicant = (await applicantResponse.json()) as Record<
        string,
        unknown
      >;

      // Extract team preferences based on application type
      let preferredTeams: string[] = [];

      if (
        applicant.applicationType === "OFFICER" &&
        applicant.preferredPositions
      ) {
        preferredTeams =
          ((applicant?.preferredPositions as unknown[]) || []).map(
            (pos) => (pos as Record<string, unknown>)?.position as string,
          ) || [];
      } else if (
        applicant.applicationType === "MATEROV" &&
        applicant.subteamPreferences
      ) {
        preferredTeams =
          ((applicant?.subteamPreferences as unknown[]) || []).map(
            (sub) => (sub as Record<string, unknown>)?.name as string,
          ) || [];
      } else if (applicant.preferredTeams) {
        preferredTeams =
          ((applicant?.preferredTeams as unknown[]) || []).map(
            (team) => (team as Record<string, unknown>)?.teamId as string,
          ) || [];
      }

      // Generate available time slots for the next 1 week (business hours)
      const availableSlots = [];
      const now = new Date();

      // Start from tomorrow to avoid past date issues
      const startDate = new Date(now);
      startDate.setDate(now.getDate() + 1);
      startDate.setHours(0, 0, 0, 0); // Reset to start of day

      const oneWeekFromNow = new Date(
        startDate.getTime() + 7 * 24 * 60 * 60 * 1000,
      );

      for (
        let currentDate = new Date(startDate);
        currentDate <= oneWeekFromNow;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

        // Business hours: 8 AM to 10 PM in 15-minute increments
        for (let hour = 8; hour < 22; hour++) {
          for (let minute = 0; minute < 60; minute += 15) {
            const slotDateTime = new Date(currentDate);
            slotDateTime.setHours(hour, minute, 0, 0);

            // Only include slots that are in the future
            if (slotDateTime > now) {
              availableSlots.push({
                hour,
                minute,
                date: slotDateTime.toISOString(),
              });
            }
          }
        }
      }

      // Call auto-scheduler API
      const response = await fetch("/api/auto-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intervieweeId: applicantId,
          preferredTeams,
          availableSlots,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to auto-schedule interview");
      }

      const result = (await response.json()) as Record<string, unknown>;

      if (result.success && result.suggestedSlot) {
        const suggestedSlot = result?.suggestedSlot as Record<string, unknown>;
        const interviewer = suggestedSlot?.interviewer as Record<
          string,
          unknown
        >;
        const slot = suggestedSlot?.slot as Record<string, unknown>;

        // Schedule the interview immediately
        const scheduleResponse = await fetch("/api/schedule-interview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicantId: applicantId,
            interviewerId: interviewer?.interviewerId as string,
            time: new Date(slot?.date as string).toISOString(),
            location: "To be determined",
            teamId: preferredTeams[0] ?? null,
          }),
        });

        if (!scheduleResponse.ok) {
          throw new Error("Failed to schedule the interview");
        }

        // If the applicant was PENDING, update their status to INTERVIEWING
        if (applicant?.status === "PENDING") {
          try {
            const updateStatusResponse = await fetch(
              `/api/applicant/${applicantId}/status`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "INTERVIEWING",
                }),
              },
            );

            if (!updateStatusResponse.ok) {
              console.warn("Failed to update applicant status to INTERVIEWING");
            }
          } catch (statusError) {
            console.warn("Error updating applicant status:", statusError);
          }
        }

        // Success notification
        alert(
          `✅ Auto-scheduled interview for ${applicantName} with ${interviewer.name as string} on ${new Date(slot.date as string).toLocaleDateString()} at ${slot.hour as number}:${(slot.minute as number).toString().padStart(2, "0")}`,
        );

        // Refresh applicant data with a slight delay to ensure DB update is propagated
        setTimeout(() => {
          void fetchApplicantData();
        }, 1000);
      } else {
        // Show available matches but couldn't auto-schedule
        const matches = result?.matches as unknown[];
        if (matches?.length > 0) {
          alert(
            `⚠️ Found ${matches?.length} potential interviewer(s) for ${applicantName}, but couldn't auto-schedule. Please use manual scheduling.`,
          );
        } else {
          alert(
            `❌ No available interviewers found for ${applicantName}'s team preferences.`,
          );
        }
      }
    } catch (error) {
      console.error("Error auto-scheduling:", error);
      alert(
        `❌ Failed to auto-schedule interview for ${applicantName}. Please try manual scheduling.`,
      );
    } finally {
      setAutoSchedulingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicantId);
        return newSet;
      });
    }
  };

  const dcMemberHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Status",
    "Rating",
  ];

  const officerHeaders = [
    "Name",
    "Position Preferences",
    "Team Rankings",
    "Major",
    "Year",
    "Status",
    "Rating",
  ];

  const materovHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Status",
    "Rating",
  ];

  const miniDcHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Status",
    "Rating",
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

  // Team options for each application type
  const dcMemberTeams = ["TSGC", "AIAA", "No Preference", "Reset"];
  const miniDcTeams = [
    "TSGC",
    "AIAA",
    "Project Team A",
    "Project Team B",
    "Reset",
  ];
  const ratingOptions = ["1", "2", "3", "4", "5", "Unrated", "Reset"];

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

  const statusOptions = [
    "PENDING",
    "INTERVIEWING",
    "ACCEPTED",
    "REJECTED",
    "REJECTED_APP",
    "Reset",
  ];

  const _handleTransfer = async () => {
    // Get applicants with PENDING status to transfer
    const applicantsToTransfer = applicantData.filter(
      (applicant) => applicant.status === "PENDING",
    );

    if (applicantsToTransfer.length === 0) {
      alert("No pending applicants to transfer");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to transfer ${applicantsToTransfer.length} pending applicant(s) to the interview stage?`,
    );

    if (isConfirmed) {
      try {
        setTransferStatus("loading");
        setTransferMessage("Transferring applicants...");

        console.log(
          "Transferring applicants:",
          applicantsToTransfer.map((app) => app.id),
        );

        const response = await fetch("/api/transfer-to-interviewee", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicantIds: applicantsToTransfer.map((app) => app.id),
          }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "Transfer failed");
        }

        console.log("Transfer response:", result);
        setTransferStatus("success");
        setTransferMessage(
          `Transfer complete. ${applicantsToTransfer.length} applicant(s) transferred to interview stage.`,
        );
        alert(
          `Transfer complete. ${applicantsToTransfer.length} applicant(s) transferred to interview stage.`,
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
    return applicantData
      .filter((applicant) => {
        const matchesCategory = applicant.category === selectedCategory;
        const matchesSearch = applicant.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesMajor =
          !filters.major || applicant.major === filters.major;
        const matchesInterests =
          !filters.interests ||
          applicant.interests.some(
            (interest) => interest.area === filters.interests,
          );

        // Team filtering logic for different application types
        const matchesTeam = (() => {
          if (!filters.team) return true;

          switch (selectedCategory) {
            case "OFFICER":
              return applicant.officerpos.some(
                (pos) => pos.position === filters.team,
              );
            case "MATEROV":
              return applicant.subTeam.some(
                (team) => team.name === filters.team,
              );
            case "DCMEMBER":
            case "MINIDC":
              return applicant.subTeam.some(
                (team) => team.name === filters.team,
              );
            default:
              return true;
          }
        })();

        const matchesStatus =
          !filters.status || applicant.status === filters.status;

        // Rating filter - handle both numeric ratings and "Unrated"
        const matchesRating = (() => {
          if (!filters.rating) return true;
          if (filters.rating === "Unrated") {
            return applicant.rating == null;
          }
          return applicant.rating?.toString() === filters.rating;
        })();

        return (
          matchesCategory &&
          matchesSearch &&
          matchesMajor &&
          matchesInterests &&
          matchesTeam &&
          matchesStatus &&
          matchesRating
        );
      })
      .sort((a, b) => {
        // Sort by rating: rated applicants first (highest to lowest), then unrated
        const aRating = a.rating ?? 0;
        const bRating = b.rating ?? 0;

        // If both have ratings, sort highest to lowest
        if (aRating > 0 && bRating > 0) {
          return bRating - aRating;
        }

        // If only one has a rating, put the rated one first
        if (aRating > 0 && bRating === 0) {
          return -1;
        }
        if (aRating === 0 && bRating > 0) {
          return 1;
        }

        // If neither has a rating, maintain original order
        return 0;
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

  const openApplicantDetails = (id: string) => {
    setSelectedApplicantId(id);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-orange-400";
      case "INTERVIEWING":
        return "text-blue-400";
      case "ACCEPTED":
        return "text-green-400";
      case "REJECTED":
        return "text-red-400";
      case "REJECTED_APP":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
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
            <FilterButton
              label="Status"
              options={statusOptions}
              onOptionSelect={handleFilterChange("status")}
              selected={filters.status || "Status"}
            />
            <FilterButton
              label="Rating"
              options={ratingOptions}
              onOptionSelect={handleFilterChange("rating")}
              selected={filters.rating || "Rating"}
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
                            applicant.officerpos?.length > 0
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
                          } else if (applicant.interests?.length > 0) {
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
                          if (applicant.subTeam?.length > 0) {
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
                        <div className={getStatusColor(applicant.status)}>
                          {applicant.status}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        {applicant.rating
                          ? `⭐ ${applicant.rating}/5`
                          : "Unrated"}
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

      <ApplicantDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        applicantId={selectedApplicantId ?? undefined}
      />
    </div>
  );
};

export default ApplicantsPage;
