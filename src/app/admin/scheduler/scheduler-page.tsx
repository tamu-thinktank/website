"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  Check,
  X,
  Calendar,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWeekend,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Challenge, OfficerPosition } from "@prisma/client";
import type { ApplicationStatus } from "@prisma/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TableHeader } from "./tableHeader";
import { ApplicantDetailsModal } from "@/components/ApplicantDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
// import { SchedulerCache } from "@/lib/redis"; // Unused

// Types
type Availability = "available" | "busy" | "filled";

interface Applicant {
  id: string;
  name: string;
  email?: string;
  status?: ApplicationStatus;
  interests?: string[];
  teamRankings?: string[];
  major?: string;
  year?: string;
  rating?: string;
  category?: string;
}

interface Interview {
  id: string;
  applicantName: string;
  applicantId?: string;
  startTime: Date;
  endTime: Date;
  teamId?: string;
  location: string;
  interviewerId?: string;
  isPlaceholder?: boolean;
}

interface TeamPriority {
  teamId: OfficerPosition;
  priority: number;
}

interface Interviewer {
  id: string;
  name: string;
  email?: string;
  priorityTeams: TeamPriority[];
  interviews: Interview[];
  openCalendar?: boolean;
}

type ViewMode = "day" | "week";

interface TimeSlot {
  hour: number;
  minute: number;
  formatted: string;
}

// interface SelectedTimeRange {
//   startDate: Date;
//   startTimeSlot: TimeSlot;
//   endDate?: Date;
//   endTimeSlot?: TimeSlot;
// } // Unused

interface InterviewerResponse {
  id: string;
  name: string;
  email?: string;
  targetTeams?: string[];
  interviews?: any[];
}

interface InterviewResponse {
  id: string;
  applicantId?: string;
  interviewerId: string;
  startTime: string;
  endTime: string;
  teamId?: string;
  location: string;
  isPlaceholder?: boolean;
  placeholderName?: string;
  applicant?: {
    fullName: string;
  };
}

const Scheduler: React.FC = () => {
  const { toast } = useToast();
  const [interviewers, setInterviewers] = React.useState<Interviewer[]>([]);
  const [isLoadingInterviewers, setIsLoadingInterviewers] =
    React.useState(true);

  // State for applicants
  const [applicants, setApplicants] = React.useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = React.useState<
    Applicant[]
  >([]);
  const [applicantSearch, setApplicantSearch] = React.useState("");
  const [isLoadingApplicants, setIsLoadingApplicants] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState("OFFICER");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [viewMode, setViewMode] = React.useState<ViewMode>("week");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = React.useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = React.useState<
    string | null
  >(null);
  const [selectedInterviewer, setSelectedInterviewer] = React.useState<
    string | null
  >(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<{
    date: Date;
    timeSlot: TimeSlot;
  } | null>(null);
  const [selectedInterview, setSelectedInterview] =
    React.useState<Interview | null>(null);
  const [isEditingInterview, setIsEditingInterview] = React.useState(false);
  const [editedInterview, setEditedInterview] = React.useState<{
    location: string;
    teamId: string;
    applicantId?: string;
    applicantName?: string;
  }>({ location: "", teamId: "" });

  // State for multi-select time slots
  const [isMultiSelectMode, setIsMultiSelectMode] = React.useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = React.useState<
    { date: Date; timeSlot: TimeSlot }[]
  >([]);

  // Selection state for column-based selection
  const [selectedInterviewerForSelection, setSelectedInterviewerForSelection] =
    React.useState<string | null>(null);

  // Per-interviewer selected slots for individual controls
  const [perInterviewerSelections, setPerInterviewerSelections] =
    React.useState<Record<string, { date: Date; timeSlot: TimeSlot }[]>>({});

  const [isProcessingBusyUpdate, setIsProcessingBusyUpdate] =
    React.useState(false);

  // State for busy times
  const [busyTimes, setBusyTimes] = React.useState<
    Record<
      string,
      { id: string; startTime: Date; endTime: Date; reason?: string }[]
    >
  >({});
  const [_isLoadingBusyTimes, setIsLoadingBusyTimes] = React.useState(false);
  const [isUpdatingTeamPriority, setIsUpdatingTeamPriority] = React.useState<
    string | null
  >(null);

  const [newInterview, setNewInterview] = React.useState({
    applicantId: "",
    applicantName: "",
    location: "",
    teamId: "",
    isPlaceholder: false,
  });

  // For real-time updates
  const [_lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  // Team options
  const teams = [
    { id: OfficerPosition.VICE_PRESIDENT, name: "VICE_PRESIDENT" },
    { id: OfficerPosition.PROJECT_MANAGER, name: "PROJECT_MANAGER" },
    { id: OfficerPosition.MARKETING_SPECIALIST, name: "MARKETING_SPECIALIST" },
    { id: OfficerPosition.GRAPHIC_DESIGNER, name: "GRAPHIC_DESIGNER" },
    { id: OfficerPosition.WEB_DEV_LEAD, name: "WEB_DEV_LEAD" },
    { id: OfficerPosition.TREASURER, name: "TREASURER" },
    { id: OfficerPosition.DC_PROGRAM_MANAGER, name: "DC_PROGRAM_MANAGER" },
    { id: "COMPUTATION_COMMUNICATIONS", name: "COMPUTATION_COMMUNICATIONS" },
    { id: "ELECTRICAL_POWER", name: "ELECTRICAL_POWER" },
    { id: "FLUIDS_PROPULSION", name: "FLUIDS_PROPULSION" },
    { id: "GNC", name: "GNC" },
    {
      id: "THERMAL_MECHANISMS_STRUCTURES",
      name: "THERMAL_MECHANISMS_STRUCTURES",
    },
    { id: "MATE_ROV_LEADERSHIP", name: "MATE_ROV_LEADERSHIP" },
    { id: "Reset", name: "Reset" },
  ];

  // Fetch data from the database
  React.useEffect(() => {
    void fetchInterviewers();
    void fetchInterviews();
    void fetchApplicants();
    void fetchBusyTimes();

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      void fetchInterviews();
      void fetchBusyTimes();
    }, 30000); // Poll every 30 seconds instead of 10 to reduce spam

    return () => clearInterval(intervalId);
  }, []);

  // Refetch busy times when view changes
  React.useEffect(() => {
    void fetchBusyTimes();
  }, [currentDate, viewMode]);

  // Fetch interviewers from the database
  const fetchInterviewers = async () => {
    setIsLoadingInterviewers(true);
    try {
      const response = await fetch("/api/interviewers");
      if (!response.ok) {
        throw new Error("Failed to fetch interviewers");
      }

      const data = (await response.json()) as InterviewerResponse[];

      // Transform the data to match our Interviewer interface
      const formattedInterviewers: Interviewer[] = data.map((interviewer) => {
        // Process interviews if they exist
        const interviewsData = interviewer.interviews || [];
        const interviews = interviewsData.map((interview: any) => ({
          id: interview.id,
          applicantName: interview.isPlaceholder
            ? interview.placeholderName || "Reserved Slot"
            : interview.applicant?.fullName || "Unknown",
          applicantId: interview.applicantId,
          startTime: new Date(interview.startTime),
          endTime: new Date(interview.endTime),
          teamId: interview.teamId,
          location: interview.location,
          interviewerId: interview.interviewerId,
          isPlaceholder: interview.isPlaceholder || false,
        }));

        return {
          id: interviewer.id,
          name: interviewer.name,
          email: interviewer.email,
          priorityTeams:
            interviewer.targetTeams?.map((teamId: string, index: number) => ({
              teamId: teamId as OfficerPosition,
              priority: index + 1,
            })) || [],
          interviews: interviews,
          openCalendar: false,
        };
      });

      setInterviewers(formattedInterviewers);
    } catch (error) {
      console.error("Error fetching interviewers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch interviewers. Using default data.",
        variant: "destructive",
      });

      // Set default interviewers if fetch fails
      setInterviewers([
        {
          id: "1",
          name: "John Doe",
          priorityTeams: [
            { teamId: OfficerPosition.VICE_PRESIDENT, priority: 1 },
            { teamId: OfficerPosition.MARKETING_SPECIALIST, priority: 2 },
          ],
          interviews: [],
          openCalendar: false,
        },
        {
          id: "2",
          name: "Jane Smith",
          priorityTeams: [
            { teamId: OfficerPosition.PROJECT_MANAGER, priority: 1 },
          ],
          interviews: [],
          openCalendar: false,
        },
        {
          id: "3",
          name: "Alex Chen",
          priorityTeams: [
            { teamId: OfficerPosition.WEB_DEV_LEAD, priority: 1 },
          ],
          interviews: [],
          openCalendar: false,
        },
      ]);
    } finally {
      setIsLoadingInterviewers(false);
    }
  };

  // Fetch interviews from the database
  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews");

      if (!response.ok) {
        throw new Error("Failed to fetch interviews");
      }

      const data = (await response.json()) as InterviewResponse[];

      // Process and update the interviews state while preserving all existing interviewer data
      setInterviewers((prevInterviewers) => {
        return prevInterviewers.map((interviewer) => {
          const interviewerInterviews = data.filter(
            (interview) => interview.interviewerId === interviewer.id,
          );

          return {
            ...interviewer,
            // Preserve all existing state (openCalendar, priorityTeams, etc.)
            interviews: interviewerInterviews.map((interview) => ({
              id: interview.id,
              applicantName: interview.isPlaceholder
                ? (interview.placeholderName ?? "Reserved Slot")
                : (interview.applicant?.fullName ?? "Unknown"),
              applicantId: interview.applicantId,
              startTime: new Date(interview.startTime),
              endTime: new Date(interview.endTime),
              teamId: interview.teamId,
              location: interview.location,
              interviewerId: interview.interviewerId,
              isPlaceholder: interview.isPlaceholder ?? false,
            })),
          };
        });
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching interviews:", error);
      // Don't show toast on every error to prevent spam
    }
  };

  // bad infinite loop
  // React.useEffect(() => {
  //   // Create an event listener for interview updates
  //   const handleInterviewUpdate = () => {
  //     void fetchInterviews();
  //   };

  //   // Listen for fetch requests to the interviews endpoint
  //   const originalFetch = window.fetch;
  //   window.fetch = async (input, init) => {
  //     const response = await originalFetch(input, init);

  //     // If this was a request to the interviews endpoint, refresh our data
  //     if (
  //       typeof input === "string" &&
  //       (input.includes("/api/interviews") ||
  //         input.includes("/api/schedule-interview"))
  //     ) {
  //       handleInterviewUpdate();
  //     }

  //     return response;
  //   };

  //   // Cleanup function to restore original fetch
  //   return () => {
  //     window.fetch = originalFetch;
  //   };
  // }, []);

  // Fetch applicants from the database
  const fetchApplicants = async () => {
    setIsLoadingApplicants(true);
    try {
      console.log("Fetching applicants with INTERVIEWING status");
      const response = await fetch("/api/applicants?status=INTERVIEWING");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch applicants: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as Applicant[];
      console.log(`Received ${data.length} applicants:`, data);

      setApplicants(data);
      setFilteredApplicants(data);

      if (data.length === 0) {
        toast({
          title: "No Applicants",
          description: "No applicants with INTERVIEWING status found.",
        });
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast({
        title: "Error",
        description: `Failed to fetch applicants: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      // Set empty arrays on error
      setApplicants([]);
      setFilteredApplicants([]);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  // Fetch busy times from the database
  const fetchBusyTimes = async () => {
    setIsLoadingBusyTimes(true);
    try {
      // Get busy times for the current view range
      const startDate = viewDates[0];
      const endDate = viewDates[viewDates.length - 1];

      if (!startDate || !endDate) {
        console.warn("No view dates available for fetching busy times");
        setIsLoadingBusyTimes(false);
        return;
      }

      const response = await fetch(
        `/api/interviewer-busy-times?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch busy times");
      }

      const data = (await response.json()) as {
        id: string;
        interviewerId: string;
        startTime: string;
        endTime: string;
        reason?: string;
      }[];

      // Group busy times by interviewer ID
      const groupedBusyTimes: Record<
        string,
        { id: string; startTime: Date; endTime: Date; reason?: string }[]
      > = {};

      data.forEach((busyTime: any) => {
        if (!groupedBusyTimes[busyTime.interviewerId]) {
          groupedBusyTimes[busyTime.interviewerId] = [];
        }
        groupedBusyTimes[busyTime.interviewerId]!.push({
          id: busyTime.id,
          startTime: new Date(busyTime.startTime),
          endTime: new Date(busyTime.endTime),
          reason: busyTime.reason,
        });
      });

      setBusyTimes(groupedBusyTimes);
    } catch (error) {
      console.error("Error fetching busy times:", error);
      // Don't show toast on every error to prevent spam
    } finally {
      setIsLoadingBusyTimes(false);
    }
  };

  // Save interview to the database
  const saveInterview = async (interview: Interview, interviewerId: string) => {
    try {
      const response = await fetch("/api/schedule-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicantId: interview.applicantId,
          interviewerId,
          time: interview.startTime.toISOString(),
          location: interview.location,
          teamId: interview.teamId,
          isPlaceholder: interview.isPlaceholder || false,
          applicantName: interview.applicantName,
        }),
      });

      if (!response.ok) {
        // Try to get the detailed error message from the API response
        let errorMessage = "Failed to schedule interview. Please try again.";
        try {
          const errorData = (await response.json()) as any;
          if (errorData?.error) {
            errorMessage = errorData.error;
            // If there are conflicting interviews, show specific details
            if (
              errorData?.conflictingInterviews &&
              errorData.conflictingInterviews.length > 0
            ) {
              const conflicts = errorData.conflictingInterviews;
              const conflictDetails = conflicts
                .map(
                  (conflict: any) =>
                    `${conflict.applicantName || "Reserved"} at ${new Date(conflict.startTime).toLocaleString()}`,
                )
                .join(", ");
              errorMessage = `${errorMessage}. Conflicts with: ${conflictDetails}`;
            }
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          // Fall back to generic message if we can't parse the response
        }

        toast({
          title: "Scheduling Error",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      const savedInterview = await response.json();

      toast({
        title: "Success",
        description: interview.isPlaceholder
          ? "Time slot reserved successfully."
          : "Interview scheduled successfully.",
      });

      // Trigger a refresh to get the latest data
      void fetchInterviews();

      return savedInterview;
    } catch (error) {
      console.error("Error saving interview:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update an existing interview
  const updateInterview = async (
    interviewId: string,
    updates: {
      location?: string;
      teamId?: string;
      applicantId?: string;
      applicantName?: string;
    },
  ) => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update interview");
      }

      toast({
        title: "Success",
        description: "Interview updated successfully.",
      });

      // Trigger a refresh to get the latest data
      void fetchInterviews();

      return true;
    } catch (error) {
      console.error("Error updating interview:", error);
      toast({
        title: "Error",
        description: "Failed to update interview. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete an interview
  const deleteInterview = async (interviewId: string) => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete interview");
      }

      toast({
        title: "Success",
        description: "Interview deleted successfully.",
      });

      // Trigger a refresh to get the latest data
      void fetchInterviews();

      return true;
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast({
        title: "Error",
        description: "Failed to delete interview. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Filter applicants based on search
  React.useEffect(() => {
    if (applicantSearch.trim() === "") {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter((applicant) =>
        applicant.name.toLowerCase().includes(applicantSearch.toLowerCase()),
      );
      setFilteredApplicants(filtered);
    }
  }, [applicantSearch, applicants]);

  // Calculate availability based on interviews
  const getAvailability = (
    interviewer: Interviewer,
    date: Date,
  ): Availability => {
    const isWeekendDay = isWeekend(date);
    const maxInterviews = isWeekendDay ? 6 : 4;

    // Count interviews for this date
    const interviewsOnDate = interviewer.interviews.filter(
      (interview) =>
        interview.startTime && isSameDay(interview.startTime, date),
    ).length;

    if (interviewsOnDate >= maxInterviews) {
      return "filled";
    } else if (interviewsOnDate > 0) {
      return "busy";
    }
    return "available";
  };

  // Add this function to check for conflicts
  const hasTimeConflict = (
    interviewer: Interviewer,
    startTime: Date,
    endTime: Date,
  ): boolean => {
    return interviewer.interviews.some((interview) => {
      const interviewStart = new Date(interview.startTime);
      const interviewEnd = new Date(interview.endTime);

      // Check if the new interview overlaps with an existing one
      // Overlap occurs if new interview starts before existing ends AND ends after existing starts
      return (
        isSameDay(interviewStart, startTime) &&
        startTime < interviewEnd &&
        endTime > interviewStart
      );
    });
  };

  // Add a new interview (45 minutes = 3 x 15-minute slots)
  const addInterview = async () => {
    if (!selectedInterviewer || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select an interviewer and time slot.",
        variant: "destructive",
      });
      return;
    }

    // For placeholder bookings, we don't need an applicant
    if (!newInterview.isPlaceholder && !newInterview.applicantId) {
      toast({
        title: "Missing Information",
        description: "Please select an applicant or mark as a reserved slot.",
        variant: "destructive",
      });
      return;
    }

    const { date, timeSlot } = selectedTimeSlot;
    const startTime = new Date(date);
    startTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
    
    // Ensure we're working with the intended local time
    console.log('Creating interview for:', {
      date: date.toDateString(),
      timeSlot: `${timeSlot.hour}:${timeSlot.minute.toString().padStart(2, '0')}`,
      constructedStartTime: startTime.toLocaleString(),
      isoString: startTime.toISOString()
    });

    // Set end time to 45 minutes after start time (3 x 15-minute slots)
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 45);

    // Check for time conflicts across all 3 slots
    const interviewer = interviewers.find((i) => i.id === selectedInterviewer);
    if (interviewer) {
      // Check each 15-minute segment of the 45-minute block
      for (let i = 0; i < 3; i++) {
        const segmentStart = new Date(startTime);
        segmentStart.setMinutes(segmentStart.getMinutes() + i * 15);
        const segmentEnd = new Date(segmentStart);
        segmentEnd.setMinutes(segmentEnd.getMinutes() + 15);

        if (hasTimeConflict(interviewer, segmentStart, segmentEnd)) {
          toast({
            title: "Time Conflict",
            description: `There is already an interview scheduled during the ${format(segmentStart, "h:mm a")} - ${format(segmentEnd, "h:mm a")} time slot.`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Find the selected applicant if not a placeholder
    let applicantName = newInterview.isPlaceholder
      ? newInterview.location || "Reserved Slot"
      : "";
    if (!newInterview.isPlaceholder) {
      const selectedApplicant = applicants.find(
        (a) => a.id === newInterview.applicantId,
      );
      if (!selectedApplicant) {
        toast({
          title: "Error",
          description: "Selected applicant not found or no longer available.",
          variant: "destructive",
        });
        return;
      }
      applicantName = selectedApplicant.name;
    }

    // Create a single interview record for the 45-minute block
    const interview: Interview = {
      id: Math.random().toString(36).substring(2, 9),
      applicantName: newInterview.isPlaceholder
        ? newInterview.location || "Reserved Slot"
        : applicantName,
      applicantId: newInterview.isPlaceholder
        ? undefined
        : newInterview.applicantId,
      startTime,
      endTime,
      teamId: newInterview.teamId || undefined,
      location: newInterview.isPlaceholder
        ? newInterview.location || "Reserved"
        : newInterview.location || "TBD",
      interviewerId: selectedInterviewer,
      isPlaceholder: newInterview.isPlaceholder,
    };

    // Save to database
    const success = await saveInterview(interview, selectedInterviewer);

    if (success) {
      // Update local state
      setInterviewers((prev) =>
        prev.map((interviewer) =>
          interviewer.id === selectedInterviewer
            ? {
                ...interviewer,
                interviews: [...interviewer.interviews, interview],
              }
            : interviewer,
        ),
      );

      // Reset form and close modal
      setNewInterview({
        applicantId: "",
        applicantName: "",
        location: "",
        teamId: "",
        isPlaceholder: false,
      });
      setApplicantSearch("");
      setSelectedTimeSlot(null);
      setSelectedInterviewer(null);
      setIsScheduleModalOpen(false);
    }
  };

  // Add multiple 45-minute interviews or reserved slots
  const addMultipleInterviews = async () => {
    if (!selectedInterviewer || selectedTimeSlots.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select an interviewer and at least one time slot.",
        variant: "destructive",
      });
      return;
    }

    // For placeholder bookings, we don't need an applicant
    if (!newInterview.isPlaceholder && !newInterview.applicantId) {
      toast({
        title: "Missing Information",
        description: "Please select an applicant or mark as a reserved slot.",
        variant: "destructive",
      });
      return;
    }

    // Find the selected applicant if not a placeholder
    let applicantName = newInterview.isPlaceholder
      ? newInterview.location || "Reserved Slot"
      : "";
    let applicantId = undefined;
    if (!newInterview.isPlaceholder) {
      const selectedApplicant = applicants.find(
        (a) => a.id === newInterview.applicantId,
      );
      if (!selectedApplicant) {
        toast({
          title: "Error",
          description: "Selected applicant not found or no longer available.",
          variant: "destructive",
        });
        return;
      }
      applicantName = selectedApplicant.name;
      applicantId = selectedApplicant.id;
    }

    let successCount = 0;
    let failCount = 0;
    const interviewer = interviewers.find((i) => i.id === selectedInterviewer);

    // Process time slots in groups of 3 (for 45-minute blocks)
    for (let i = 0; i < selectedTimeSlots.length; i += 3) {
      const slotGroup = selectedTimeSlots.slice(i, i + 3);

      // Skip incomplete groups (less than 3 slots)
      if (slotGroup.length < 3) {
        failCount += slotGroup.length;
        continue;
      }

      // Verify slots are consecutive
      const firstSlot = slotGroup[0];
      if (!firstSlot) {
        failCount += 3;
        continue;
      }

      const firstStartTime = new Date(firstSlot.date);
      firstStartTime.setHours(
        firstSlot.timeSlot.hour,
        firstSlot.timeSlot.minute,
        0,
        0,
      );

      const expectedEndTime = new Date(firstStartTime);
      expectedEndTime.setMinutes(expectedEndTime.getMinutes() + 45);

      const lastSlot = slotGroup[2];
      if (!lastSlot) {
        failCount += 3;
        continue;
      }

      const actualEndTime = new Date(lastSlot.date);
      actualEndTime.setHours(
        lastSlot.timeSlot.hour,
        lastSlot.timeSlot.minute + 15,
        0,
        0,
      );

      if (actualEndTime.getTime() !== expectedEndTime.getTime()) {
        failCount += 3;
        continue;
      }

      // Check for conflicts in the 45-minute block
      if (interviewer) {
        let hasConflict = false;
        for (let j = 0; j < 3; j++) {
          const slot = slotGroup[j];
          if (!slot) {
            hasConflict = true;
            break;
          }

          const segmentStart = new Date(slot.date);
          segmentStart.setHours(slot.timeSlot.hour, slot.timeSlot.minute, 0, 0);
          const segmentEnd = new Date(segmentStart);
          segmentEnd.setMinutes(segmentEnd.getMinutes() + 15);

          if (hasTimeConflict(interviewer, segmentStart, segmentEnd)) {
            hasConflict = true;
            break;
          }
        }

        if (hasConflict) {
          failCount += 3;
          continue;
        }
      }

      // Create a single interview for the 45-minute block
      const startTime = new Date(firstSlot.date);
      startTime.setHours(
        firstSlot.timeSlot.hour,
        firstSlot.timeSlot.minute,
        0,
        0,
      );

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 45);

      const interview: Interview = {
        id: Math.random().toString(36).substring(2, 9),
        applicantName: newInterview.isPlaceholder
          ? newInterview.location || "Reserved Slot"
          : applicantName,
        applicantId: newInterview.isPlaceholder ? undefined : applicantId,
        startTime,
        endTime,
        teamId: newInterview.teamId || undefined,
        location: newInterview.location || "TBD",
        interviewerId: selectedInterviewer,
        isPlaceholder: newInterview.isPlaceholder,
      };

      // Save to database
      const success = await saveInterview(interview, selectedInterviewer);

      if (success) {
        successCount++;
        // Update local state
        setInterviewers((prev) =>
          prev.map((interviewer) =>
            interviewer.id === selectedInterviewer
              ? {
                  ...interviewer,
                  interviews: [...interviewer.interviews, interview],
                }
              : interviewer,
          ),
        );
      } else {
        failCount++;
      }
    }

    // Show summary toast
    if (successCount > 0) {
      toast({
        title: "Success",
        description: `Scheduled ${successCount} ${newInterview.isPlaceholder ? "reserved slots" : "interviews"} successfully${failCount > 0 ? ` (${failCount} failed)` : ""}.`,
      });
    } else if (failCount > 0) {
      toast({
        title: "Error",
        description: `Failed to schedule ${failCount} ${newInterview.isPlaceholder ? "reserved slots" : "interviews"}.`,
      });
    }

    // Reset form and close modal
    setNewInterview({
      applicantId: "",
      applicantName: "",
      location: "",
      teamId: "",
      isPlaceholder: false,
    });
    setApplicantSearch("");
    setSelectedTimeSlots([]);
    setSelectedInterviewer(null);
    setIsMultiSelectMode(false);
    setIsScheduleModalOpen(false);
  };

  // Toggle calendar open/close
  const toggleCalendar = (interviewerId: string) => {
    setInterviewers((prev) =>
      prev.map((interviewer) =>
        interviewer.id === interviewerId
          ? { ...interviewer, openCalendar: !interviewer.openCalendar }
          : interviewer,
      ),
    );
  };

  // Update team priorities with optimistic updates
  const updateTeamPriority = async (
    interviewerId: string,
    teamId: string,
    priority: number,
  ) => {
    // Set loading state for this specific team update
    setIsUpdatingTeamPriority(`${interviewerId}-${teamId}`);

    try {
      // Get current interviewer state
      const interviewer = interviewers.find((i) => i.id === interviewerId);
      if (!interviewer) return;

      // Build the updated priorities
      const existingIndex = interviewer.priorityTeams.findIndex(
        (pt) => pt.teamId === teamId,
      );
      const updatedPriorities = [...interviewer.priorityTeams];

      if (existingIndex >= 0) {
        // Update existing priority
        updatedPriorities[existingIndex] = {
          teamId: updatedPriorities[existingIndex]!.teamId,
          priority,
        };
      } else {
        // Add new priority - ensure teamId is a valid OfficerPosition
        if (
          Object.values(OfficerPosition).includes(teamId as OfficerPosition)
        ) {
          updatedPriorities.push({
            teamId: teamId as OfficerPosition,
            priority,
          });
        }
      }

      // OPTIMISTIC UPDATE: Update UI immediately for better UX
      setInterviewers((prev) =>
        prev.map((int) => {
          if (int.id === interviewerId) {
            return { ...int, priorityTeams: updatedPriorities };
          }
          return int;
        }),
      );

      // Get teams in priority order for database update
      const sortedTeams = updatedPriorities
        .sort((a, b) => a.priority - b.priority)
        .map((pt) => pt.teamId);

      // Update the database
      const response = await fetch("/api/interviewers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewerId,
          targetTeams: sortedTeams,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        const originalInterviewer = interviewers.find(
          (i) => i.id === interviewerId,
        );
        if (originalInterviewer) {
          setInterviewers((prev) =>
            prev.map((int) => {
              if (int.id === interviewerId) {
                return originalInterviewer;
              }
              return int;
            }),
          );
        }
        throw new Error("Failed to update team priorities");
      }

      // Success - the optimistic update was correct, no need to update again

      // Success feedback
      const teamName = teams.find((t) => t.id === teamId)?.name || teamId;
      toast({
        title: "Success",
        description: `Updated priority for ${teamName}`,
        variant: "default",
      });

      console.log(
        `Updated team priorities for interviewer ${interviewerId}:`,
        sortedTeams,
      );
    } catch (error) {
      console.error("Error updating team priorities:", error);
      toast({
        title: "Error",
        description: "Failed to update team priorities. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear loading state
      setIsUpdatingTeamPriority(null);
    }
  };

  // Remove a team priority with optimistic updates
  const removeTeamPriority = async (interviewerId: string, teamId: string) => {
    // Set loading state for this specific team removal
    setIsUpdatingTeamPriority(`${interviewerId}-${teamId}`);

    try {
      const interviewer = interviewers.find((i) => i.id === interviewerId);
      if (!interviewer) return;

      // Get all current team priorities except the one to remove
      const updatedPriorities = interviewer.priorityTeams.filter(
        (pt) => pt.teamId !== teamId,
      );

      // OPTIMISTIC UPDATE: Update UI immediately
      setInterviewers((prev) =>
        prev.map((int) => {
          if (int.id === interviewerId) {
            return {
              ...int,
              priorityTeams: updatedPriorities,
            };
          }
          return int;
        }),
      );

      // Get teams in priority order for database update
      const sortedTeams = updatedPriorities
        .sort((a, b) => a.priority - b.priority)
        .map((pt) => pt.teamId);

      // Update the database
      const response = await fetch("/api/interviewers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewerId,
          targetTeams: sortedTeams,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        const originalInterviewer = interviewers.find(
          (i) => i.id === interviewerId,
        );
        if (originalInterviewer) {
          setInterviewers((prev) =>
            prev.map((int) => {
              if (int.id === interviewerId) {
                return originalInterviewer;
              }
              return int;
            }),
          );
        }
        throw new Error("Failed to remove team priority");
      }

      // Success - optimistic update was correct

      // Success feedback
      const teamName = teams.find((t) => t.id === teamId)?.name || teamId;
      toast({
        title: "Success",
        description: `Removed ${teamName} from priorities`,
        variant: "default",
      });

      console.log(
        `Removed team priority for interviewer ${interviewerId}:`,
        teamId,
      );
    } catch (error) {
      console.error("Error removing team priority:", error);
      toast({
        title: "Error",
        description: "Failed to remove team priority. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear loading state
      setIsUpdatingTeamPriority(null);
    }
  };

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    if (viewMode === "day") {
      setCurrentDate((prev) => addDays(prev, -1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "day") {
      setCurrentDate((prev) => addDays(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  // Memoized dates array to prevent recalculation during re-renders
  const currentWeekDates = React.useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Get current view dates using memoized values
  const getCurrentViewDates = () => {
    if (viewMode === "day") {
      return [currentDate];
    } else {
      return currentWeekDates;
    }
  };

  const viewDates = getCurrentViewDates();

  // Memoized time slots to prevent recalculation during re-renders (8am-10pm)
  const timeSlots = React.useMemo(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 22; hour++) {
      // 8am to 9:45pm (last slot before 10pm)
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push({ hour, minute, formatted: "" });
      }
    }
    return slots;
  }, []);

  // Generate formatted time slots for header display (memoized)
  const _formattedTimeSlots = React.useMemo(() => {
    return timeSlots.map((slot) => {
      const formattedHour = slot.hour % 12 === 0 ? 12 : slot.hour % 12;
      const period = slot.hour < 12 ? "AM" : "PM";
      return {
        ...slot,
        formatted: `${formattedHour}:${slot.minute === 0 ? "00" : slot.minute} ${period}`,
      };
    });
  }, [timeSlots]);

  // Helper function to format time slots
  const formatTimeSlot = React.useCallback((timeSlot: TimeSlot) => {
    const formattedHour = timeSlot.hour % 12 === 0 ? 12 : timeSlot.hour % 12;
    const period = timeSlot.hour < 12 ? "AM" : "PM";
    return `${formattedHour}:${timeSlot.minute === 0 ? "00" : timeSlot.minute} ${period}`;
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const tableHeaders = ["Name", "Availability", "Priority Teams", "Calendar"];

  // Column selection utilities for day-based selection

  const selectAllSlotsInColumn = (interviewerId: string, date: Date) => {
    const slotsInColumn = timeSlots.map((timeSlot) => ({ date, timeSlot }));
    const currentSlots = perInterviewerSelections[interviewerId] || [];

    // Check if any slots in this column are already selected
    const hasSelectedSlots = slotsInColumn.some((slot) =>
      currentSlots.some(
        (selected) =>
          isSameDay(selected.date, slot.date) &&
          selected.timeSlot.hour === slot.timeSlot.hour &&
          selected.timeSlot.minute === slot.timeSlot.minute,
      ),
    );

    if (hasSelectedSlots) {
      // Deselect all slots in this column
      setPerInterviewerSelections((prev) => ({
        ...prev,
        [interviewerId]: currentSlots.filter(
          (selected) =>
            !slotsInColumn.some(
              (slot) =>
                isSameDay(selected.date, slot.date) &&
                selected.timeSlot.hour === slot.timeSlot.hour &&
                selected.timeSlot.minute === slot.timeSlot.minute,
            ),
        ),
      }));
    } else {
      // Select all slots in this column
      setPerInterviewerSelections((prev) => {
        const existing = prev[interviewerId] || [];
        const newSlots = slotsInColumn.filter(
          (slot) =>
            !existing.some(
              (selected) =>
                isSameDay(selected.date, slot.date) &&
                selected.timeSlot.hour === slot.timeSlot.hour &&
                selected.timeSlot.minute === slot.timeSlot.minute,
            ),
        );

        return {
          ...prev,
          [interviewerId]: [...existing, ...newSlots],
        };
      });
    }
  };

  // Handle per-interviewer time slot selection
  const handlePerInterviewerSlotSelect = (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    const newSlot = { date, timeSlot };

    setPerInterviewerSelections((prev) => {
      const currentSlots = prev[interviewerId] || [];
      const isAlreadySelected = currentSlots.some(
        (slot) =>
          isSameDay(slot.date, date) &&
          slot.timeSlot.hour === timeSlot.hour &&
          slot.timeSlot.minute === timeSlot.minute,
      );

      if (isAlreadySelected) {
        // Remove from selection
        return {
          ...prev,
          [interviewerId]: currentSlots.filter(
            (slot) =>
              !(
                isSameDay(slot.date, date) &&
                slot.timeSlot.hour === timeSlot.hour &&
                slot.timeSlot.minute === timeSlot.minute
              ),
          ),
        };
      } else {
        // Add to selection
        return {
          ...prev,
          [interviewerId]: [...currentSlots, newSlot],
        };
      }
    });
  };

  // Check if a slot is selected for a specific interviewer
  const _isPerInterviewerSlotSelected = (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    const slots = perInterviewerSelections[interviewerId] || [];
    return slots.some(
      (slot) =>
        isSameDay(slot.date, date) &&
        slot.timeSlot.hour === timeSlot.hour &&
        slot.timeSlot.minute === timeSlot.minute,
    );
  };

  // Check if a slot is selected for this interviewer
  const isSlotSelected = (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    const slots = perInterviewerSelections[interviewerId] || [];
    return slots.some(
      (slot) =>
        isSameDay(slot.date, date) &&
        slot.timeSlot.hour === timeSlot.hour &&
        slot.timeSlot.minute === timeSlot.minute,
    );
  };

  // Toggle busy status for a single slot with immediate feedback
  const toggleSingleSlotBusy = async (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
    markAsBusy: boolean,
  ) => {
    try {
      const slotTime = new Date(date);
      slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);

      // Optimistic update - update UI immediately
      setBusyTimes((prev) => {
        const interviewerBusyTimes = prev[interviewerId] || [];
        const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);

        if (markAsBusy) {
          // Add busy time
          return {
            ...prev,
            [interviewerId]: [
              ...interviewerBusyTimes,
              {
                id: `temp-${Date.now()}`,
                startTime: slotTime,
                endTime: slotEndTime,
                reason: "Busy",
              },
            ],
          };
        } else {
          // Remove busy time
          return {
            ...prev,
            [interviewerId]: interviewerBusyTimes.filter(
              (bt) => !(bt.startTime <= slotTime && bt.endTime > slotTime),
            ),
          };
        }
      });

      // API call to persist the change
      const response = await fetch("/api/interviewer-busy-times-batch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewerId,
          timeSlots: [
            {
              date: slotTime.toISOString(),
              hour: timeSlot.hour,
              minute: timeSlot.minute,
            },
          ],
          markAsBusy,
          reason: markAsBusy ? "Busy" : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update busy status");
      }

      // Refresh data to ensure consistency
      await fetchBusyTimes();
    } catch (error) {
      console.error("Error updating single slot busy status:", error);
      toast({
        title: "Error",
        description: "Failed to update busy status. Please try again.",
        variant: "destructive",
      });

      // Revert optimistic update on error
      await fetchBusyTimes();
    }
  };

  // Toggle busy status for a specific interviewer's selected slots using efficient batch API
  const toggleBusyForInterviewer = async (interviewerId: string) => {
    const slots = perInterviewerSelections[interviewerId] || [];
    if (slots.length === 0 || isProcessingBusyUpdate) return;

    setIsProcessingBusyUpdate(true);

    try {
      // Check if any slots are currently busy to determine the toggle direction
      const interviewerBusyTimes = busyTimes[interviewerId] || [];
      let hasBusySlots = false;

      for (const { date, timeSlot } of slots) {
        const slotTime = new Date(date);
        slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
        const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);

        const existingBusy = interviewerBusyTimes.find((busyTime) => {
          const busyStart = new Date(busyTime.startTime);
          const busyEnd = new Date(busyTime.endTime);
          return slotTime < busyEnd && slotEndTime > busyStart;
        });

        if (existingBusy) {
          hasBusySlots = true;
          break;
        }
      }

      const markAsBusy = !hasBusySlots;

      // Optimistic update - update UI immediately for better perceived performance
      setBusyTimes((prev) => {
        const currentBusyTimes = prev[interviewerId] || [];

        if (markAsBusy) {
          // Add all slots as busy
          const newBusyTimes = slots.map(({ date, timeSlot }) => {
            const slotTime = new Date(date);
            slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
            return {
              id: `temp-${Date.now()}-${timeSlot.hour}-${timeSlot.minute}`,
              startTime: slotTime,
              endTime: new Date(slotTime.getTime() + 15 * 60 * 1000),
              reason: "Busy",
            };
          });

          return {
            ...prev,
            [interviewerId]: [...currentBusyTimes, ...newBusyTimes],
          };
        } else {
          // Remove busy times that overlap with selected slots
          const filteredBusyTimes = currentBusyTimes.filter((busyTime) => {
            const busyStart = new Date(busyTime.startTime);
            const busyEnd = new Date(busyTime.endTime);

            return !slots.some(({ date, timeSlot }) => {
              const slotTime = new Date(date);
              slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
              const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);
              return slotTime < busyEnd && slotEndTime > busyStart;
            });
          });

          return {
            ...prev,
            [interviewerId]: filteredBusyTimes,
          };
        }
      });

      // Prepare time slots for batch API (using smaller batches for better performance)
      const timeSlots = slots.map(({ date, timeSlot }) => ({
        date: date.toISOString(),
        hour: timeSlot.hour,
        minute: timeSlot.minute,
      }));

      // Prepare request payload
      const requestPayload = {
        interviewerId,
        timeSlots,
        markAsBusy: markAsBusy,
        reason: markAsBusy ? "Marked as busy" : undefined,
      };

      console.log("Batch API request payload:", requestPayload);

      // Use batch API to toggle busy status
      const response = await fetch("/api/interviewer-busy-times-batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok) {
        const result = await response.json();

        // Invalidate cache for this interviewer's busy times
        try {
          await fetch("/api/cache/invalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "busyTimes",
              interviewerId,
              dates: slots.map((slot) => slot.date.toISOString().split("T")[0]),
            }),
          });
        } catch (cacheError) {
          console.warn("Cache invalidation failed:", cacheError);
        }

        // Clear selection for this interviewer
        setPerInterviewerSelections((prev) => ({
          ...prev,
          [interviewerId]: [],
        }));

        // Show enhanced success toast with progress indicator
        toast({
          title: "✅ Bulk update completed",
          description: `${markAsBusy ? "Marked as busy" : "Marked as available"}: ${(result as any)?.processed || 0} time slot${((result as any)?.processed || 0) > 1 ? "s" : ""}`,
        });

        // Refresh busy times to ensure consistency
        await fetchBusyTimes();
      } else {
        const error = await response.json();
        console.error("Batch API error response:", error);
        console.error("Response status:", response.status);
        throw new Error((error as any)?.error || "Failed to update busy times");
      }
    } catch (error) {
      console.error("Error toggling busy status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update busy times. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingBusyUpdate(false);
    }
  };

  // Handle time slot selection - now shows context menu instead of immediate action
  const handleTimeSlotSelect = (
    event: React.MouseEvent,
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    // If this interviewer is in selection mode, add/remove slots
    if (selectedInterviewerForSelection === interviewerId) {
      handlePerInterviewerSlotSelect(interviewerId, date, timeSlot);
      return;
    }

    // If in multi-select mode, handle selection
    if (isMultiSelectMode) {
      const newSlot = { date, timeSlot };

      // Check if this slot is already selected
      const isAlreadySelected = selectedTimeSlots.some(
        (slot) =>
          isSameDay(slot.date, date) &&
          slot.timeSlot.hour === timeSlot.hour &&
          slot.timeSlot.minute === timeSlot.minute,
      );

      if (isAlreadySelected) {
        // If already selected, remove it
        setSelectedTimeSlots((prev) =>
          prev.filter(
            (slot) =>
              !(
                isSameDay(slot.date, date) &&
                slot.timeSlot.hour === timeSlot.hour &&
                slot.timeSlot.minute === timeSlot.minute
              ),
          ),
        );
      } else {
        // If not selected, add it
        setSelectedTimeSlots((prev) => [...prev, newSlot]);
      }

      // Set the interviewer if not already set
      if (!selectedInterviewer) {
        setSelectedInterviewer(interviewerId);
      }
      return;
    }

    // Single click - show context menu
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    const interview = getInterviewForSlot(interviewerId, date, timeSlot);

    // Show context menu
    setContextMenu({
      x,
      y,
      interviewerId,
      date,
      timeSlot,
      interview: interview || undefined,
    });
  };

  // Toggle busy status for selected time slots
  const toggleBusySlots = async () => {
    if (
      selectedTimeSlots.length === 0 ||
      !selectedInterviewer ||
      isProcessingBusyUpdate
    )
      return;

    setIsProcessingBusyUpdate(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      // Process each selected time slot individually
      for (const { date, timeSlot } of selectedTimeSlots) {
        const slotTime = new Date(date);
        slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
        const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000); // 15 minutes later

        // Check if this slot is already marked as busy
        const interviewerBusyTimes = busyTimes[selectedInterviewer] || [];
        const existingBusy = interviewerBusyTimes.find((busyTime) => {
          const busyStart = new Date(busyTime.startTime);
          const busyEnd = new Date(busyTime.endTime);

          // Check if our 15-minute slot overlaps with existing busy time
          return slotTime < busyEnd && slotEndTime > busyStart;
        });

        if (existingBusy) {
          // If already busy, delete the busy time
          const response = await fetch(
            `/api/interviewer-busy-times/${existingBusy.id}`,
            {
              method: "DELETE",
            },
          );

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } else {
          // If not busy, create a new 15-minute busy time
          const response = await fetch("/api/interviewer-busy-times", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              interviewerId: selectedInterviewer,
              startTime: slotTime.toISOString(),
              endTime: slotEndTime.toISOString(),
              reason: "Marked as busy via scheduler",
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        }
      }

      // Show summary toast
      if (successCount > 0) {
        toast({
          title: "Busy times updated",
          description: `Updated ${successCount} time slot${successCount > 1 ? "s" : ""}${errorCount > 0 ? ` (${errorCount} failed)` : ""}`,
        });
      } else if (errorCount > 0) {
        toast({
          title: "Error",
          description: `Failed to update ${errorCount} time slot${errorCount > 1 ? "s" : ""}`,
          variant: "destructive",
        });
      }

      // Refresh busy times and clear selection
      await fetchBusyTimes();
      setSelectedTimeSlots([]);
    } catch (error) {
      console.error("Error toggling busy status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update busy status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingBusyUpdate(false);
    }
  };

  // Open the schedule modal with multiple selected time slots
  const openMultiSelectModal = () => {
    if (selectedTimeSlots.length === 0 || !selectedInterviewer) {
      toast({
        title: "No Time Slots Selected",
        description: "Please select at least one time slot before scheduling.",
        variant: "destructive",
      });
      return;
    }

    setIsScheduleModalOpen(true);
  };

  // Open schedule modal
  const openScheduleModal = (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    // Check if there's already an interview at this time slot
    const interviewer = interviewers.find((i) => i.id === interviewerId);
    if (!interviewer) return;

    const existingInterview = interviewer.interviews.find((interview) => {
      const interviewStart = new Date(interview.startTime);
      return (
        isSameDay(interviewStart, date) &&
        interviewStart.getHours() === timeSlot.hour &&
        interviewStart.getMinutes() === timeSlot.minute
      );
    });

    if (existingInterview) {
      // If there's an existing interview, open the view modal instead
      setSelectedInterview(existingInterview);
      setEditedInterview({
        location: existingInterview.location,
        teamId: existingInterview.teamId ?? "",
        applicantId: existingInterview.applicantId,
        applicantName: existingInterview.applicantName,
      });
      setIsEditingInterview(false);
      setIsViewModalOpen(true);
      return;
    }

    // Otherwise, open the schedule modal
    setSelectedInterviewer(interviewerId);
    setSelectedTimeSlot({ date, timeSlot });

    // Set default team based on interviewer's first priority team
    if (interviewer && interviewer.priorityTeams.length > 0) {
      setNewInterview((prev) => ({
        ...prev,
        teamId: interviewer.priorityTeams[0]!.teamId,
      }));
    }

    setIsScheduleModalOpen(true);
  };

  // Handle saving edited interview
  const handleSaveEditedInterview = async () => {
    if (!selectedInterview) return;

    const updates: {
      location?: string;
      teamId?: string;
      applicantId?: string;
      applicantName?: string;
    } = {};

    if (editedInterview.location) updates.location = editedInterview.location;
    if (editedInterview.teamId) updates.teamId = editedInterview.teamId;
    if (editedInterview.applicantId)
      updates.applicantId = editedInterview.applicantId;

    const success = await updateInterview(selectedInterview.id, updates);

    if (success) {
      // Update local state
      setInterviewers((prev) =>
        prev.map((interviewer) => {
          if (interviewer.id === selectedInterview.interviewerId) {
            return {
              ...interviewer,
              interviews: interviewer.interviews.map((interview) =>
                interview.id === selectedInterview.id
                  ? {
                      ...interview,
                      ...updates,
                      applicantName:
                        editedInterview.applicantName ||
                        interview.applicantName,
                    }
                  : interview,
              ),
            };
          }
          return interviewer;
        }),
      );

      setIsEditingInterview(false);
      setIsViewModalOpen(false);
    }
  };

  // Handle deleting an interview
  const handleDeleteInterview = async () => {
    if (!selectedInterview) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete this ${selectedInterview.isPlaceholder ? "reserved slot" : "interview"} with ${selectedInterview.applicantName}?`,
    );

    if (confirmed) {
      const success = await deleteInterview(selectedInterview.id);

      if (success) {
        // Update local state
        setInterviewers((prev) =>
          prev.map((interviewer) => {
            if (interviewer.id === selectedInterview.interviewerId) {
              return {
                ...interviewer,
                interviews: interviewer.interviews.filter(
                  (interview) => interview.id !== selectedInterview.id,
                ),
              };
            }
            return interviewer;
          }),
        );

        setIsViewModalOpen(false);
      }
    }
  };

  // Context menu functionality
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    interviewerId: string;
    date: Date;
    timeSlot: TimeSlot;
    interview?: Interview;
  } | null>(null);

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;

    const { interviewerId, date, timeSlot, interview } = contextMenu;

    switch (action) {
      case "mark-busy":
        handleSingleSlotUpdate(interviewerId, date, timeSlot, true);
        break;
      case "mark-available":
        if (interview) {
          // Handle removing interview or busy time
          setSelectedInterview(interview);
          handleDeleteInterview();
        } else {
          handleSingleSlotUpdate(interviewerId, date, timeSlot, false);
        }
        break;
      case "schedule-interview":
        setSelectedInterviewer(interviewerId);
        setSelectedTimeSlot({ date, timeSlot });
        setSelectedTimeSlots([
          {
            date,
            timeSlot,
          },
        ]);
        setIsScheduleModalOpen(true);
        break;
      case "view-interview":
        if (interview) {
          setSelectedInterview(interview);
          setIsViewModalOpen(true);
        }
        break;
      case "edit-interview":
        if (interview) {
          setSelectedInterview(interview);
          setIsEditingInterview(true);
          setIsViewModalOpen(true);
        }
        break;
    }

    setContextMenu(null);
  };

  // Handle single slot update for marking busy/available
  const handleSingleSlotUpdate = async (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
    markAsBusy: boolean,
  ) => {
    try {
      setIsProcessingBusyUpdate(true);

      const slotTime = new Date(date);
      slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
      const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);

      const response = await fetch("/api/interviewer-busy-times-batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewerId,
          timeSlots: [
            {
              date: slotTime.toISOString(),
              hour: timeSlot.hour,
              minute: timeSlot.minute,
            },
          ],
          markAsBusy,
          reason: markAsBusy ? "Busy" : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update busy status");
      }

      // Refresh data
      await fetchBusyTimes();

      toast({
        title: "Success",
        description: `Time slot marked as ${markAsBusy ? "busy" : "available"}`,
      });
    } catch (error) {
      console.error("Error updating slot:", error);
      toast({
        title: "Error",
        description: "Failed to update time slot",
        variant: "destructive",
      });
    } finally {
      setIsProcessingBusyUpdate(false);
    }
  };

  // Click outside to close context menu
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu]);

  // Check if a time slot is selected in multi-select mode
  const isTimeSlotSelected = (date: Date, timeSlot: TimeSlot) => {
    return selectedTimeSlots.some(
      (slot) =>
        isSameDay(slot.date, date) &&
        slot.timeSlot.hour === timeSlot.hour &&
        slot.timeSlot.minute === timeSlot.minute,
    );
  };

  // Helper function to create unique slot key
  const _getSlotKey = (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    return `${interviewerId}-${format(date, "yyyy-MM-dd")}-${timeSlot.hour}-${timeSlot.minute}`;
  };

  // New selection system functions will be added here

  // Memoized busy slot checker to avoid recalculation
  // Get interview for a specific slot
  const getInterviewForSlot = React.useCallback(
    (
      interviewerId: string,
      date: Date,
      timeSlot: TimeSlot,
    ): Interview | null => {
      const slotTime = new Date(date);
      slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
      const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);

      // Find interviews for this interviewer
      const interviewerInterviews =
        interviewers.find((i) => i.id === interviewerId)?.interviews || [];

      // Check if any interview overlaps with this time slot
      const overlappingInterview = interviewerInterviews.find((interview) => {
        const interviewStart = new Date(interview.startTime);
        const interviewEnd = new Date(interview.endTime);

        // Check if there's any overlap
        return interviewStart < slotEndTime && interviewEnd > slotTime;
      });

      return overlappingInterview || null;
    },
    [interviewers],
  );

  const isBusySlot = React.useCallback(
    (interviewerId: string, date: Date, timeSlot: TimeSlot) => {
      const slotTime = new Date(date);
      slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
      const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000); // 15 minutes later

      const interviewerBusyTimes = busyTimes[interviewerId] || [];

      return interviewerBusyTimes.some((busyTime) => {
        const busyStart = new Date(busyTime.startTime);
        const busyEnd = new Date(busyTime.endTime);

        // Check if the 15-minute slot overlaps with any busy time
        return slotTime < busyEnd && slotEndTime > busyStart;
      });
    },
    [busyTimes],
  );

  // Memoized TimeSlot component to prevent unnecessary re-renders
  const TimeSlotComponent = React.memo(
    ({
      timeSlot,
      timeIndex,
      interviewer,
      viewDates,
    }: {
      timeSlot: TimeSlot;
      timeIndex: number;
      interviewer: Interviewer;
      viewDates: Date[];
    }) => {
      return (
        <div
          key={timeIndex}
          className="grid grid-cols-[100px_1fr] border-b border-neutral-700"
        >
          <div className="flex items-center justify-center border-r border-neutral-700 bg-neutral-800 p-2 text-xs font-medium">
            {`${timeSlot.hour}:${timeSlot.minute.toString().padStart(2, "0")}`}
          </div>
          <div className="grid grid-cols-7">
            {viewDates.map((date, dateIndex) => {
              const slotInterviews = interviewer.interviews.filter(
                (interview) => {
                  const interviewStart = new Date(interview.startTime);
                  const interviewEnd = new Date(interview.endTime);

                  // Create current slot time range
                  const slotStart = new Date(date);
                  slotStart.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
                  const slotEnd = new Date(
                    slotStart.getTime() + 15 * 60 * 1000,
                  ); // 15 minutes later

                  // Check if the interview overlaps with this 15-minute slot
                  return (
                    isSameDay(interviewStart, date) &&
                    interviewStart < slotEnd &&
                    interviewEnd > slotStart
                  );
                },
              );

              const hasInterview = slotInterviews.length > 0;
              const isSelected =
                isMultiSelectMode && isTimeSlotSelected(date, timeSlot);
              const isPerInterviewerSelected =
                !isMultiSelectMode &&
                isSlotSelected(interviewer.id, date, timeSlot);
              const isBusy = isBusySlot(interviewer.id, date, timeSlot);

              return (
                <div
                  key={dateIndex}
                  className={cn(
                    "relative cursor-pointer select-none border-l border-neutral-700 p-1 hover:bg-neutral-800",
                    isWeekend(date) && "bg-neutral-800/50",
                    hasInterview && "bg-stone-700/50",
                    isSelected && "bg-blue-900/30 ring-2 ring-blue-500",
                    isPerInterviewerSelected &&
                      "bg-green-900/30 ring-2 ring-green-500",
                    isMultiSelectMode &&
                      !hasInterview &&
                      !isBusy &&
                      "hover:bg-blue-900/30",
                    !isMultiSelectMode &&
                      !hasInterview &&
                      !isBusy &&
                      "hover:bg-green-900/30",
                    isBusy &&
                      !isSelected &&
                      !isPerInterviewerSelected &&
                      "bg-yellow-900/30 hover:bg-yellow-800/40",
                  )}
                  onClick={(e) =>
                    handleTimeSlotSelect(e, interviewer.id, date, timeSlot)
                  }
                >
                  {isBusy ? (
                    <div className="absolute inset-0 m-1 overflow-hidden rounded bg-yellow-600/80 p-1">
                      <div className="truncate text-xs font-medium">Busy</div>
                    </div>
                  ) : hasInterview ? (
                    slotInterviews.map((interview, i) => (
                      <div
                        key={i}
                        className={cn(
                          "absolute inset-0 m-1 cursor-pointer overflow-hidden rounded p-1 transition-opacity hover:opacity-80",
                          interview.isPlaceholder
                            ? "bg-blue-600"
                            : "bg-stone-600",
                        )}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the slot click handler
                          setSelectedInterview(interview);
                          setIsViewModalOpen(true);
                        }}
                        title="Click to view/edit interview"
                      >
                        <div className="truncate text-xs font-medium">
                          {interview.applicantName}
                        </div>
                        <div className="truncate text-[10px] text-neutral-300">
                          📍 {interview.location}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full w-full items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                      <Plus className="h-4 w-4 text-neutral-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col overflow-hidden bg-neutral-950 text-xl font-medium shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        <div className="flex w-full flex-col items-center justify-center whitespace-nowrap bg-neutral-950 px-16 py-5 tracking-wide text-neutral-200 text-opacity-80 max-md:mr-2 max-md:max-w-full max-md:px-5">
          {/* Header content would go here */}
        </div>

        <div className="mt-1 flex w-full flex-col items-center overflow-hidden px-20 pb-96 pt-11 max-md:max-w-full max-md:px-5 max-md:pb-24">
          <div className="mb-0 flex w-full max-w-[1537px] flex-col max-md:mb-2.5 max-md:max-w-full">
            <div className="self-start pb-5 text-center text-5xl font-semibold max-md:text-4xl">
              Scheduler
            </div>

            <div className="mt-9 h-px w-full shrink-0 border border-solid border-neutral-200" />

            <div className="ml-7 mt-8 flex w-auto max-w-full items-center justify-start gap-10 self-stretch px-0 py-0 text-sm tracking-wide text-neutral-200 max-md:flex-col">
              <input
                type="text"
                placeholder="Search by Name or UIN"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-[350px] rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-4 max-md:w-full max-md:max-w-[500px] max-md:px-5"
              />
              <div className="h-12 w-[1px] bg-neutral-400"></div>

              <div className="flex items-center gap-4">
                <button
                  onClick={goToToday}
                  className="rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-3 text-white transition-colors hover:bg-stone-800"
                >
                  Today
                </button>
                <button
                  onClick={goToPrevious}
                  className="rounded-full border border-solid border-neutral-200 bg-transparent p-2 text-white transition-colors hover:bg-stone-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="rounded-full border border-solid border-neutral-200 bg-transparent p-2 text-white transition-colors hover:bg-stone-800"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="text-lg font-medium">
                  {viewMode === "day"
                    ? format(currentDate, "MMMM d, yyyy")
                    : `${format(viewDates[0]!, "MMM d")} - ${format(viewDates[viewDates.length - 1]!, "MMM d, yyyy")}`}
                </span>
              </div>

              <div className="h-12 w-[1px] bg-neutral-400"></div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode("day")}
                  className={`rounded-[48px] border border-solid px-6 py-3 transition-colors ${
                    viewMode === "day"
                      ? "border-stone-600 bg-stone-600 text-white"
                      : "border-neutral-200 bg-transparent text-white hover:bg-stone-800"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`rounded-[48px] border border-solid px-6 py-3 transition-colors ${
                    viewMode === "week"
                      ? "border-stone-600 bg-stone-600 text-white"
                      : "border-neutral-200 bg-transparent text-white hover:bg-stone-800"
                  }`}
                >
                  Week
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="multi-select"
                      checked={isMultiSelectMode}
                      onCheckedChange={(checked) => {
                        setIsMultiSelectMode(!!checked);
                        setSelectedTimeSlots([]);
                      }}
                    />
                    <Label htmlFor="multi-select" className="cursor-pointer">
                      Multi-select mode
                    </Label>
                  </div>

                  {isMultiSelectMode && selectedTimeSlots.length > 0 && (
                    <>
                      <Button
                        onClick={openMultiSelectModal}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Schedule {selectedTimeSlots.length} Slots
                      </Button>
                      <Button
                        onClick={toggleBusySlots}
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-600 hover:text-white"
                        disabled={isProcessingBusyUpdate}
                      >
                        {isProcessingBusyUpdate
                          ? "Updating..."
                          : selectedTimeSlots.some(
                                (slot) =>
                                  selectedInterviewer &&
                                  isBusySlot(
                                    selectedInterviewer,
                                    slot.date,
                                    slot.timeSlot,
                                  ),
                              )
                            ? "Mark as Available"
                            : "Mark as Busy"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isLoadingInterviewers ? (
              <div className="mt-7 flex w-full items-center justify-center p-10 text-neutral-200">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-600 border-t-white"></div>
                <span className="ml-3">Loading interviewers...</span>
              </div>
            ) : (
              <div className="mt-7 flex w-full flex-col overflow-hidden rounded-[48px] border border-solid border-neutral-200 tracking-wide max-md:max-w-full">
                <div className="overflow-hidden rounded-t-[48px]">
                  <TableHeader headers={tableHeaders} />
                </div>

                {interviewers.map((interviewer, index) => (
                  <React.Fragment key={interviewer.id}>
                    <div className="flex w-full items-center justify-center gap-10 px-5 py-4 text-sm transition-colors hover:bg-neutral-800">
                      <div className="flex-1 text-center">
                        {interviewer.name}
                      </div>

                      <div className="flex-1 text-center">
                        {viewDates.map((date, i) => {
                          const availability = getAvailability(
                            interviewer,
                            date,
                          );
                          const color =
                            availability === "available"
                              ? "text-green-400"
                              : availability === "busy"
                                ? "text-yellow-400"
                                : "text-red-400";

                          return (
                            <span key={i} className="mx-1">
                              <span className={color}>●</span>
                              <span className="ml-1 text-xs">
                                {format(date, "E")}
                              </span>
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex-1 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {interviewer.priorityTeams
                            .sort((a, b) => a.priority - b.priority)
                            .map((teamPriority, i) => {
                              const team = teams.find(
                                (t) => t.id === teamPriority.teamId,
                              );
                              const isUpdating =
                                isUpdatingTeamPriority ===
                                `${interviewer.id}-${teamPriority.teamId}`;
                              return (
                                <div
                                  key={i}
                                  className={`inline-flex h-8 items-center rounded-full px-3 py-1 text-xs backdrop-blur-sm transition-opacity ${
                                    isUpdating
                                      ? "bg-blue-700/80 opacity-75"
                                      : "bg-stone-700/80"
                                  }`}
                                >
                                  {isUpdating && (
                                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                                  )}
                                  <span>
                                    {team?.name ?? "Unknown"} (#
                                    {teamPriority.priority})
                                  </span>
                                  <button
                                    className="ml-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                                    onClick={() =>
                                      removeTeamPriority(
                                        interviewer.id,
                                        teamPriority.teamId,
                                      )
                                    }
                                    disabled={isUpdating}
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="inline-flex h-8 items-center rounded-full bg-stone-800 px-2 py-1 text-xs hover:bg-stone-700">
                                <Plus className="h-3 w-3" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-neutral-700 bg-neutral-900 text-white">
                              {teams
                                .filter(
                                  (team) =>
                                    !interviewer.priorityTeams.some(
                                      (pt) => pt.teamId === team.id,
                                    ),
                                )
                                .map((team, i) => {
                                  const isUpdating =
                                    isUpdatingTeamPriority ===
                                    `${interviewer.id}-${team.id}`;
                                  return (
                                    <DropdownMenuItem
                                      key={i}
                                      className="hover:bg-stone-800 focus:bg-stone-800"
                                      onClick={() =>
                                        updateTeamPriority(
                                          interviewer.id,
                                          team.id,
                                          interviewer.priorityTeams.length + 1,
                                        )
                                      }
                                      disabled={isUpdating}
                                    >
                                      <div className="flex items-center">
                                        {isUpdating && (
                                          <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                                        )}
                                        {team.name}
                                      </div>
                                    </DropdownMenuItem>
                                  );
                                })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex-1 text-center">
                        <button
                          className="rounded-[48px] border border-solid bg-stone-600 px-6 py-2 text-white transition-colors hover:bg-stone-500"
                          onClick={() => toggleCalendar(interviewer.id)}
                        >
                          {interviewer.openCalendar
                            ? "Close Calendar"
                            : "Open Calendar"}
                        </button>
                      </div>
                    </div>

                    {interviewer.openCalendar && (
                      <div className="border-t border-neutral-200 bg-neutral-900/50 p-4">
                        {/* Per-interviewer floating controls */}
                        {(perInterviewerSelections[interviewer.id]?.length ||
                          0) > 0 && (
                          <div className="mb-4 flex items-center justify-between rounded-lg border border-green-600/30 bg-green-900/20 p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-green-400">
                                {perInterviewerSelections[interviewer.id]
                                  ?.length || 0}{" "}
                                slot
                                {(perInterviewerSelections[interviewer.id]
                                  ?.length || 0) > 1
                                  ? "s"
                                  : ""}{" "}
                                selected
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  toggleBusyForInterviewer(interviewer.id)
                                }
                                className="bg-yellow-600 text-xs hover:bg-yellow-700"
                                disabled={isProcessingBusyUpdate}
                              >
                                {isProcessingBusyUpdate
                                  ? "Updating..."
                                  : perInterviewerSelections[
                                        interviewer.id
                                      ]?.some((slot) =>
                                        isBusySlot(
                                          interviewer.id,
                                          slot.date,
                                          slot.timeSlot,
                                        ),
                                      )
                                    ? "Mark Available"
                                    : "Mark Busy"}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  openScheduleModal(
                                    interviewer.id,
                                    perInterviewerSelections[
                                      interviewer.id
                                    ]?.[0]?.date!,
                                    perInterviewerSelections[
                                      interviewer.id
                                    ]?.[0]?.timeSlot!,
                                  )
                                }
                                className="bg-blue-600 text-xs hover:bg-blue-700"
                              >
                                Schedule Interview
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setPerInterviewerSelections((prev) => ({
                                    ...prev,
                                    [interviewer.id]: [],
                                  }))
                                }
                                className="border-neutral-700 bg-neutral-800 text-xs hover:bg-neutral-700"
                              >
                                Clear Selection
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Lasso selection tool toggle */}
                        <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800 p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-300">
                              Lasso Selection:
                            </span>
                            <button
                              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                                selectedInterviewerForSelection ===
                                interviewer.id
                                  ? "bg-green-600 text-white"
                                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                              }`}
                              onClick={() => {
                                setSelectedInterviewerForSelection(
                                  selectedInterviewerForSelection ===
                                    interviewer.id
                                    ? null
                                    : interviewer.id,
                                );
                                // setSelectionMode('select'); // TODO: implement setSelectionMode function
                              }}
                            >
                              {selectedInterviewerForSelection ===
                              interviewer.id
                                ? "Disable"
                                : "Enable"}
                            </button>
                          </div>
                          {selectedInterviewerForSelection ===
                            interviewer.id && (
                            <div className="text-xs text-green-400">
                              Click and drag to select multiple time slots
                            </div>
                          )}
                        </div>

                        <div className="overflow-visible">
                          <div className="min-w-[800px]">
                            {/* Calendar Header */}
                            <div className="grid grid-cols-[100px_1fr] rounded-t-lg border border-neutral-700 bg-neutral-800">
                              <div className="p-2 text-center text-neutral-400">
                                Time
                              </div>
                              <div
                                className={`grid ${viewMode === "day" ? "grid-cols-1" : "grid-cols-7"}`}
                              >
                                {viewDates.map((date, i) => {
                                  // Check if any slots in this column are selected
                                  const slotsInColumn = timeSlots.map(
                                    (timeSlot) => ({ date, timeSlot }),
                                  );
                                  const currentSlots =
                                    perInterviewerSelections[interviewer.id] ||
                                    [];
                                  const selectedSlotsInColumn =
                                    slotsInColumn.filter((slot) =>
                                      currentSlots.some(
                                        (selected) =>
                                          isSameDay(selected.date, slot.date) &&
                                          selected.timeSlot.hour ===
                                            slot.timeSlot.hour &&
                                          selected.timeSlot.minute ===
                                            slot.timeSlot.minute,
                                      ),
                                    );

                                  const hasAnySelected =
                                    selectedSlotsInColumn.length > 0;
                                  const allSelected =
                                    selectedSlotsInColumn.length ===
                                    slotsInColumn.length;

                                  return (
                                    <div
                                      key={i}
                                      className={cn(
                                        "cursor-pointer border-l border-neutral-700 p-2 text-center font-medium transition-colors",
                                        isWeekend(date) && "bg-neutral-800",
                                        hasAnySelected &&
                                          allSelected &&
                                          "border-green-400 bg-green-600/30",
                                        hasAnySelected &&
                                          !allSelected &&
                                          "border-yellow-400 bg-yellow-600/30",
                                        selectedInterviewerForSelection ===
                                          interviewer.id &&
                                          "hover:bg-blue-500/20",
                                      )}
                                      onClick={() => {
                                        if (
                                          selectedInterviewerForSelection ===
                                          interviewer.id
                                        ) {
                                          selectAllSlotsInColumn(
                                            interviewer.id,
                                            date,
                                          );
                                        }
                                      }}
                                      title={
                                        selectedInterviewerForSelection ===
                                        interviewer.id
                                          ? hasAnySelected
                                            ? `Click to deselect ${selectedSlotsInColumn.length}/${slotsInColumn.length} slots for ${format(date, "EEE MMM d")}`
                                            : `Click to select all time slots for ${format(date, "EEE MMM d")}`
                                          : format(date, "EEE MMM d")
                                      }
                                    >
                                      <div>{format(date, "EEE")}</div>
                                      <div className="text-lg">
                                        {format(date, "d")}
                                      </div>
                                      {hasAnySelected && (
                                        <div
                                          className={cn(
                                            "mt-1 text-xs",
                                            allSelected
                                              ? "text-green-300"
                                              : "text-yellow-300",
                                          )}
                                        >
                                          {selectedSlotsInColumn.length}/
                                          {slotsInColumn.length}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Time Slots - Column selection enabled */}
                            <div className="relative rounded-b-lg border-x border-b border-neutral-700">
                              {timeSlots.map((timeSlot, timeIndex) => (
                                <TimeSlotComponent
                                  key={timeIndex}
                                  timeSlot={timeSlot}
                                  timeIndex={timeIndex}
                                  interviewer={interviewer}
                                  viewDates={viewDates}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {index < interviewers.length - 1 && (
                      <div className="w-full shrink-0 border border-solid border-neutral-200" />
                    )}
                  </React.Fragment>
                ))}

                {/* Add padding at the end of the table */}
                <div className="border-t border-neutral-200 py-4"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="border-neutral-700 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isMultiSelectMode && selectedTimeSlots.length > 0
                ? `Schedule ${selectedTimeSlots.length} Interviews`
                : "Schedule Interview"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date & Time
              </Label>
              <div className="col-span-3">
                {isMultiSelectMode && selectedTimeSlots.length > 0 ? (
                  <div className="text-neutral-200">
                    {selectedTimeSlots.length} time slots selected
                    {selectedTimeSlots.length <= 3 && (
                      <div className="mt-1 text-sm">
                        {selectedTimeSlots.map((slot, i) => (
                          <div key={i}>
                            {format(slot.date, "MMMM d, yyyy")} at{" "}
                            {formatTimeSlot(slot.timeSlot)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedTimeSlot ? (
                  <div className="text-neutral-200">
                    {format(selectedTimeSlot.date, "MMMM d, yyyy")} at{" "}
                    {formatTimeSlot(selectedTimeSlot.timeSlot)}
                  </div>
                ) : (
                  <div className="text-neutral-400">No time selected</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Reserve Only</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="reserve-only"
                  checked={newInterview.isPlaceholder}
                  onCheckedChange={(checked) => {
                    setNewInterview({
                      ...newInterview,
                      isPlaceholder: !!checked,
                    });
                  }}
                />
                <Label htmlFor="reserve-only" className="cursor-pointer">
                  Book as reserved slot (no applicant)
                </Label>
              </div>
            </div>

            {!newInterview.isPlaceholder && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicantName" className="text-right">
                  Applicant
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                      placeholder="Search applicants..."
                      value={applicantSearch}
                      onChange={(e) => setApplicantSearch(e.target.value)}
                      className="border-neutral-700 bg-neutral-800 pl-8"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 p-1">
                    {isLoadingApplicants ? (
                      <div className="px-2 py-1 text-sm text-neutral-500">
                        Loading applicants...
                      </div>
                    ) : filteredApplicants.length > 0 ? (
                      filteredApplicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className={cn(
                            "cursor-pointer rounded-sm px-2 py-1 text-sm",
                            newInterview.applicantId === applicant.id
                              ? "bg-stone-600 text-white"
                              : "hover:bg-neutral-700",
                          )}
                          onClick={() =>
                            setNewInterview({
                              ...newInterview,
                              applicantId: applicant.id,
                              applicantName: applicant.name,
                            })
                          }
                        >
                          {applicant.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-neutral-500">
                        No applicants with INTERVIEWING status found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={newInterview.location}
                onChange={(e) =>
                  setNewInterview({ ...newInterview, location: e.target.value })
                }
                className="col-span-3 border-neutral-700 bg-neutral-800"
                placeholder="Zach 420, Zoom, etc."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Team
              </Label>
              <Select
                value={newInterview.teamId}
                onValueChange={(value) =>
                  setNewInterview({ ...newInterview, teamId: value })
                }
              >
                <SelectTrigger className="col-span-3 border-neutral-700 bg-neutral-800">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent className="border-neutral-700 bg-neutral-800">
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsScheduleModalOpen(false);
                if (isMultiSelectMode) {
                  setSelectedTimeSlots([]);
                } else {
                  setSelectedTimeSlot(null);
                }
                setNewInterview({
                  applicantId: "",
                  applicantName: "",
                  location: "",
                  teamId: "",
                  isPlaceholder: false,
                });
              }}
              className="border-neutral-600 bg-transparent hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={
                isMultiSelectMode && selectedTimeSlots.length > 0
                  ? addMultipleInterviews
                  : addInterview
              }
              className="bg-stone-600 hover:bg-stone-500"
            >
              {newInterview.isPlaceholder
                ? isMultiSelectMode && selectedTimeSlots.length > 0
                  ? "Reserve Multiple"
                  : "Reserve Slot"
                : isMultiSelectMode && selectedTimeSlots.length > 0
                  ? "Schedule Multiple"
                  : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Interview Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="border-neutral-700 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditingInterview
                ? selectedInterview?.isPlaceholder
                  ? "Edit Reserved Slot"
                  : "Edit Interview"
                : selectedInterview?.isPlaceholder
                  ? "Reserved Slot Details"
                  : "Interview Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedInterview && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Date & Time</Label>
                <div className="col-span-3 text-neutral-200">
                  {selectedInterview && selectedInterview.startTime && (
                    <>
                      {format(selectedInterview.startTime, "MMMM d, yyyy")} at{" "}
                      {selectedInterview.startTime &&
                        format(selectedInterview.startTime, "h:mm a")}{" "}
                      -
                      {selectedInterview.endTime &&
                        format(selectedInterview.endTime, "h:mm a")}
                    </>
                  )}
                </div>
              </div>

              {!selectedInterview.isPlaceholder && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Applicant</Label>
                  <div className="col-span-3 text-neutral-200">
                    {selectedInterview.applicantId ? (
                      <button
                        onClick={() => {
                          setSelectedApplicantId(
                            selectedInterview.applicantId || null,
                          );
                          setIsApplicantModalOpen(true);
                        }}
                        className="cursor-pointer text-blue-400 underline transition-colors hover:text-blue-300"
                        title="Click to view applicant details"
                      >
                        {selectedInterview.applicantName}
                      </button>
                    ) : (
                      selectedInterview.applicantName
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Location</Label>
                {isEditingInterview ? (
                  <Input
                    value={editedInterview.location}
                    onChange={(e) =>
                      setEditedInterview({
                        ...editedInterview,
                        location: e.target.value,
                      })
                    }
                    className="col-span-3 border-neutral-700 bg-neutral-800"
                  />
                ) : (
                  <div className="col-span-3 text-neutral-200">
                    {selectedInterview.location}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Team</Label>
                {isEditingInterview ? (
                  <Select
                    value={editedInterview.teamId}
                    onValueChange={(value) =>
                      setEditedInterview({ ...editedInterview, teamId: value })
                    }
                  >
                    <SelectTrigger className="col-span-3 border-neutral-700 bg-neutral-800">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent className="border-neutral-700 bg-neutral-800">
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="col-span-3 text-neutral-200">
                    {teams.find((t) => t.id === selectedInterview.teamId)
                      ?.name ?? "No team assigned"}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {isEditingInterview ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingInterview(false)}
                  className="border-neutral-600 bg-transparent hover:bg-neutral-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEditedInterview}
                  className="bg-stone-600 hover:bg-stone-500"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-1 justify-start">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteInterview}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                  className="border-neutral-600 bg-transparent hover:bg-neutral-800 hover:text-white"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setIsEditingInterview(true)}
                  className="bg-stone-600 hover:bg-stone-500"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-48 rounded-md border border-neutral-600 bg-neutral-800 shadow-lg"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {contextMenu.interview ? (
              // Options for slots with interviews
              <>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("view-interview")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Interview
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("edit-interview")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Interview
                </button>
                <hr className="my-1 border-neutral-600" />
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("mark-available")}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Interview
                </button>
              </>
            ) : isBusySlot(
                contextMenu.interviewerId,
                contextMenu.date,
                contextMenu.timeSlot,
              ) ? (
              // Options for busy slots without interviews
              <>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("mark-available")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark Available
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("schedule-interview")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </button>
              </>
            ) : (
              // Options for available slots
              <>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("mark-busy")}
                >
                  <X className="mr-2 h-4 w-4" />
                  Mark Busy
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
                  onClick={() => handleContextMenuAction("schedule-interview")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        isOpen={isApplicantModalOpen}
        onClose={() => {
          setIsApplicantModalOpen(false);
          setSelectedApplicantId(null);
        }}
        applicantId={selectedApplicantId ?? undefined}
      />
    </DndProvider>
  );
};

export default Scheduler;
