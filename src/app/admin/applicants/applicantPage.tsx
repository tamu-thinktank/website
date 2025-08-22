"use client";

import * as React from "react";
import { FilterButton } from "./filterButton";
import { TableHeader } from "./tableHeader";
import type { ApplicantData, FilterState } from "./types";
import { ApplicantDetailsModal } from "@/components/ApplicantDetailsModal";
import { Button } from "@/components/ui/button";

export const ApplicantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("OFFICER");
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
  const [autoSchedulingIds, setAutoSchedulingIds] = React.useState<Set<string>>(new Set());

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
  const autoScheduleApplicant = async (applicantId: string, applicantName: string) => {
    if (autoSchedulingIds.has(applicantId)) return; // Prevent double-clicking

    setAutoSchedulingIds(prev => new Set([...prev, applicantId]));

    try {
      // First, get the applicant's details to determine team preferences
      const applicantResponse = await fetch(`/api/applicant/${applicantId}`);
      if (!applicantResponse.ok) {
        throw new Error('Failed to fetch applicant details');
      }

      const applicant = await applicantResponse.json();
      
      // Extract team preferences based on application type
      let preferredTeams: string[] = [];
      
      if (applicant.applicationType === "OFFICER" && applicant.preferredPositions) {
        preferredTeams = applicant.preferredPositions.map((pos: any) => pos.position);
      } else if (applicant.applicationType === "MATEROV" && applicant.subteamPreferences) {
        preferredTeams = applicant.subteamPreferences.map((sub: any) => sub.name);
      } else if (applicant.preferredTeams) {
        preferredTeams = applicant.preferredTeams.map((team: any) => team.teamId);
      }

      // Generate available time slots for the next 2 weeks (business hours)
      const availableSlots = [];
      const now = new Date();
      const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      for (let date = new Date(now); date <= twoWeeksFromNow; date.setDate(date.getDate() + 1)) {
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Business hours: 8 AM to 10 PM in 15-minute increments
        for (let hour = 8; hour < 22; hour++) {
          for (let minute = 0; minute < 60; minute += 15) {
            availableSlots.push({
              hour,
              minute,
              date: date.toISOString(),
            });
          }
        }
      }

      // Call auto-scheduler API
      const response = await fetch('/api/auto-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intervieweeId: applicantId,
          preferredTeams,
          availableSlots,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to auto-schedule interview');
      }

      const result = await response.json();

      if (result.success && result.suggestedSlot) {
        const { interviewer, slot } = result.suggestedSlot;
        
        // Schedule the interview immediately
        const scheduleResponse = await fetch('/api/schedule-interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicantId: applicantId,
            interviewerId: interviewer.interviewerId,
            time: new Date(slot.date).toISOString(),
            location: 'To be determined',
            teamId: preferredTeams[0] || null,
          }),
        });

        if (!scheduleResponse.ok) {
          throw new Error('Failed to schedule the interview');
        }

        // If the applicant was PENDING, update their status to INTERVIEWING
        if (applicant.status === 'PENDING') {
          try {
            const updateStatusResponse = await fetch(`/api/applicant/${applicantId}/status`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'INTERVIEWING'
              }),
            });

            if (!updateStatusResponse.ok) {
              console.warn('Failed to update applicant status to INTERVIEWING');
            }
          } catch (statusError) {
            console.warn('Error updating applicant status:', statusError);
          }
        }

        // Success notification
        alert(`✅ Auto-scheduled interview for ${applicantName} with ${interviewer.name} on ${new Date(slot.date).toLocaleDateString()} at ${slot.hour}:${slot.minute.toString().padStart(2, '0')}`);
        
        // Refresh applicant data
        void fetchApplicantData();
      } else {
        // Show available matches but couldn't auto-schedule
        if (result.matches && result.matches.length > 0) {
          alert(`⚠️ Found ${result.matches.length} potential interviewer(s) for ${applicantName}, but couldn't auto-schedule. Please use manual scheduling.`);
        } else {
          alert(`❌ No available interviewers found for ${applicantName}'s team preferences.`);
        }
      }
    } catch (error) {
      console.error('Error auto-scheduling:', error);
      alert(`❌ Failed to auto-schedule interview for ${applicantName}. Please try manual scheduling.`);
    } finally {
      setAutoSchedulingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicantId);
        return newSet;
      });
    }
  };

  const tableHeaders = [
    "Name",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
    "Status",
  ];

  const officerheaders = [
    "Name",
    "Position Preference",
    "Major",
    "Year",
    "Status",
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

  const teamOptions = ["Team A", "Team B", "Team C", "Reset"];
  const ratingOptions = ["High", "Medium", "Low", "Reset"];
  const interestOptions = ["AI", "Robotics", "Web Development", "Reset"];
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

  const handleTransfer = async () => {
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
      const matchesTeam =
        selectedCategory === "OFFICER"
          ? !filters.team ||
            applicant.officerpos.some((pos) => pos.position === filters.team)
          : !filters.team ||
            applicant.subTeam.some((team) => team.name === filters.team);
      const matchesStatus =
        !filters.status || applicant.rating === filters.status;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMajor &&
        matchesInterests &&
        matchesTeam &&
        matchesStatus
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
              onClick={() => setSelectedCategory("OFFICER")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[37px_0px_0px_37px] py-2.5 pl-20 pr-5 text-center transition-colors max-md:max-w-full max-md:pl-5 ${
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
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[0px_37px_37px_0px] py-2.5 pl-20 pr-5 text-center transition-colors max-md:max-w-full max-md:pl-5 ${
                selectedCategory === "MATEROV"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              MATE ROV
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
              label={selectedCategory === "OFFICER" ? "Position" : "Sub-Team"}
              options={
                selectedCategory === "OFFICER"
                  ? officerpositions
                  : materovsubteams
              }
              onOptionSelect={handleFilterChange("team")}
              selected={filters.team ?? "Team"}
            />
            {selectedCategory === "MATEROV" && (
              <FilterButton
                label="Interests"
                options={mateinterests}
                onOptionSelect={handleFilterChange("interests")}
                selected={filters.interests ?? "Interests"}
              />
            )}
            <FilterButton
              label="Major"
              options={majorOptions}
              onOptionSelect={handleFilterChange("major")}
              selected={filters.major ?? "Major"}
            />
            <FilterButton
              label="Status"
              options={statusOptions}
              onOptionSelect={handleFilterChange("status")}
              selected={filters.status ?? "Status"}
            />
          </div>

          <div className="mt-7 flex w-full flex-col rounded-[48px] border border-solid border-neutral-200 tracking-wide max-md:max-w-full max-md:pb-24">
            <TableHeader
              headers={
                selectedCategory === "OFFICER" ? officerheaders : tableHeaders
              }
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
                      <div>
                        {applicant.interests && applicant.interests.length > 0
                          ? applicant.interests.map((pref) => (
                              <div
                                className="flex-1 text-center"
                                key={pref.area}
                              >
                                {pref.area} ({pref.interest.toLowerCase()})
                              </div>
                            ))
                          : null}
                      </div>
                      <div>
                        {applicant.subTeam && applicant.subTeam.length > 0
                          ? applicant.subTeam.map((pref) => (
                              <div
                                className="flex-1 text-center"
                                key={pref.name}
                              >
                                {pref.name} ({pref.interest.toLowerCase()})
                              </div>
                            ))
                          : null}
                      </div>
                      <div>
                        {applicant.officerpos && applicant.officerpos.length > 0
                          ? applicant.officerpos.map((pref) => (
                              <div
                                className="flex-1 text-center"
                                key={pref.position}
                              >
                                {pref.position} ({pref.interest.toLowerCase()})
                              </div>
                            ))
                          : null}
                      </div>
                      <div className="flex-1 text-center">
                        {applicant.major}
                      </div>
                      <div className="flex-1 text-center">{applicant.year}</div>
                      <div className="flex flex-1 items-center justify-center gap-2">
                        <div
                          className={`text-center ${getStatusColor(applicant.rating)}`}
                        >
                          {applicant.rating}
                        </div>
                        {(applicant.rating === "PENDING" || applicant.rating === "INTERVIEWING") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              void autoScheduleApplicant(applicant.id, applicant.name);
                            }}
                            disabled={autoSchedulingIds.has(applicant.id)}
                            title={
                              applicant.rating === "PENDING"
                                ? "Auto-schedule interview for pending applicant"
                                : "Auto-schedule interview"
                            }
                          >
                            {autoSchedulingIds.has(applicant.id) ? "Scheduling..." : "Auto-Schedule"}
                          </Button>
                        )}
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
