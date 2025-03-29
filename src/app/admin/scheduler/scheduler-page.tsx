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
import { Challenge } from "@prisma/client";
import type { ApplicationStatus } from "@prisma/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TableHeader } from "./tableHeader";
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
  applicantId: string;
  startTime: Date;
  endTime: Date;
  teamId?: string;
  location: string;
  interviewerId?: string;
}

interface TeamPriority {
  teamId: Challenge;
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

interface SelectedTimeRange {
  startDate: Date;
  startTimeSlot: TimeSlot;
  endDate?: Date;
  endTimeSlot?: TimeSlot;
}

interface InterviewerResponse {
  id: string;
  name: string;
  email?: string;
  targetTeams?: string[];
}

interface InterviewResponse {
  id: string;
  applicantId: string;
  interviewerId: string;
  startTime: string;
  endTime: string;
  teamId?: string;
  location: string;
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
  }>({ location: "", teamId: "" });

  // State for multi-select time slots
  const [isMultiSelectMode, setIsMultiSelectMode] = React.useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = React.useState<
    { date: Date; timeSlot: TimeSlot }[]
  >([]);

  const [newInterview, setNewInterview] = React.useState({
    applicantId: "",
    applicantName: "",
    location: "",
    teamId: "",
  });

  // For real-time updates
  const [_lastUpdate, _setLastUpdate] = React.useState<Date>(new Date());

  // Team options
  const teams = [
    { id: Challenge.TSGC, name: "Team 1" },
    { id: Challenge.AIAA, name: "Team 2" },
    { id: "TEAM3", name: "Team 3" },
    { id: "TEAM4", name: "Team 4" },
    { id: "TEAM5", name: "Team 5" },
    { id: "TEAM6", name: "Team 6" },
  ];

  // Fetch data from the database
  React.useEffect(() => {
    void fetchInterviewers();
    void fetchInterviews();
    void fetchApplicants();

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      void fetchInterviews();
    }, 30000); // Poll every 30 seconds instead of 10 to reduce spam

    return () => clearInterval(intervalId);
  }, []);

  // Fetch interviewers from the database
  const fetchInterviewers = async () => {
    setIsLoadingInterviewers(true);
    try {
      const response = await fetch("/api/interviewers");
      if (!response.ok) {
        throw new Error("Failed to fetch interviewers");
      }

      const data = (await response.json()) as InterviewerResponse[];

      // Add a dummy interviewer for testing
      const dummyInterviewer: Interviewer = {
        id: "dummy-interviewer",
        name: "Test Interviewer",
        email: "test@example.com",
        priorityTeams: [
          { teamId: Challenge.TSGC, priority: 1 },
          { teamId: Challenge.AIAA, priority: 2 },
        ],
        interviews: [],
        openCalendar: false,
      };

      // Transform the data to match our Interviewer interface
      const formattedInterviewers: Interviewer[] = data.map((interviewer) => ({
        id: interviewer.id,
        name: interviewer.name,
        email: interviewer.email,
        priorityTeams:
          interviewer.targetTeams?.map((teamId, index) => ({
            teamId: teamId as Challenge,
            priority: index + 1,
          })) ?? [],
        interviews: [],
        openCalendar: false,
      }));

      // Add the dummy interviewer
      formattedInterviewers.push(dummyInterviewer);

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
            { teamId: Challenge.TSGC, priority: 1 },
            { teamId: Challenge.AIAA, priority: 2 },
          ],
          interviews: [],
          openCalendar: false,
        },
        {
          id: "2",
          name: "Jane Smith",
          priorityTeams: [{ teamId: Challenge.AIAA, priority: 1 }],
          interviews: [],
          openCalendar: false,
        },
        {
          id: "3",
          name: "Alex Chen",
          priorityTeams: [{ teamId: Challenge.TSGC, priority: 1 }],
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

      // Process and update the interviews state while preserving openCalendar state
      setInterviewers((prevInterviewers) => {
        return prevInterviewers.map((interviewer) => {
          const interviewerInterviews = data.filter(
            (interview) => interview.interviewerId === interviewer.id,
          );

          return {
            ...interviewer,
            // Preserve the openCalendar state
            openCalendar: interviewer.openCalendar,
            interviews: interviewerInterviews.map((interview) => ({
              id: interview.id,
              applicantName: interview.applicant?.fullName ?? "Unknown",
              applicantId: interview.applicantId,
              startTime: new Date(interview.startTime),
              endTime: new Date(interview.endTime),
              teamId: interview.teamId,
              location: interview.location ?? "TBD",
              interviewerId: interview.interviewerId,
            })),
          };
        });
      });
    } catch (error) {
      console.error("Error fetching interviews:", error);
      // Don't show toast on every error to prevent spam
    }
  };

  // Refresh interviews when the lock button is clicked in the ApplicantDetailsModal
  React.useEffect(() => {
    // Create an event listener for interview updates
    const handleInterviewUpdate = () => {
      void fetchInterviews();
    };

    // Listen for fetch requests to the interviews endpoint
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const response = await originalFetch(input, init);

      // If this was a request to the interviews endpoint, refresh our data
      if (typeof input === "string" && input.includes("/api/interviews")) {
        handleInterviewUpdate();
      }

      return response;
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

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
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save interview");
      }

      toast({
        title: "Success",
        description: "Interview scheduled successfully.",
      });

      // Trigger a refresh to get the latest data
      void fetchInterviews();

      return true;
    } catch (error) {
      console.error("Error saving interview:", error);
      toast({
        title: "Error",
        description: "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update an existing interview
  const updateInterview = async (
    interviewId: string,
    updates: { location?: string; teamId?: string },
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

  // Add a new interview
  const addInterview = async () => {
    if (
      !selectedInterviewer ||
      !selectedTimeSlot ||
      !newInterview.applicantId
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const { date, timeSlot } = selectedTimeSlot;
    const startTime = new Date(date);
    startTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 15); // 15 minute interview

    // Find the selected applicant
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

    const interview: Interview = {
      id: Math.random().toString(36).substring(2, 9),
      applicantName: selectedApplicant.name,
      applicantId: selectedApplicant.id,
      startTime,
      endTime,
      teamId: newInterview.teamId || undefined,
      location: newInterview.location || "TBD",
      interviewerId: selectedInterviewer,
    };

    // Save to database first
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
      });
      setApplicantSearch("");
      setSelectedTimeSlot(null);
      setSelectedInterviewer(null);
      setIsScheduleModalOpen(false);
    }
  };

  // Add multiple interviews for selected time slots
  const addMultipleInterviews = async () => {
    if (
      !selectedInterviewer ||
      selectedTimeSlots.length === 0 ||
      !newInterview.applicantId
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please select an interviewer, applicant, and at least one time slot.",
        variant: "destructive",
      });
      return;
    }

    // Find the selected applicant
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

    let successCount = 0;
    let failCount = 0;

    // Create and save an interview for each selected time slot
    for (const slot of selectedTimeSlots) {
      const startTime = new Date(slot.date);
      startTime.setHours(slot.timeSlot.hour, slot.timeSlot.minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 15);

      const interview: Interview = {
        id: Math.random().toString(36).substring(2, 9),
        applicantName: selectedApplicant.name,
        applicantId: selectedApplicant.id,
        startTime,
        endTime,
        teamId: newInterview.teamId || undefined,
        location: newInterview.location || "TBD",
        interviewerId: selectedInterviewer,
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
        description: `Scheduled ${successCount} interviews successfully${failCount > 0 ? ` (${failCount} failed)` : ""}.`,
      });
    } else if (failCount > 0) {
      toast({
        title: "Error",
        description: `Failed to schedule ${failCount} interviews.`,
      });
    }

    // Reset form and close modal
    setNewInterview({
      applicantId: "",
      applicantName: "",
      location: "",
      teamId: "",
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

  // Update team priorities
  const updateTeamPriority = (
    interviewerId: string,
    teamId: string,
    priority: number,
  ) => {
    setInterviewers((prev) =>
      prev.map((interviewer) => {
        if (interviewer.id === interviewerId) {
          // Check if team already exists in priorities
          const existingIndex = interviewer.priorityTeams.findIndex(
            (pt) => pt.teamId === teamId,
          );

          if (existingIndex >= 0) {
            // Update existing priority
            const updatedPriorities = [...interviewer.priorityTeams];
            updatedPriorities[existingIndex] = {
              ...updatedPriorities[existingIndex],
              priority,
            };
            return { ...interviewer, priorityTeams: updatedPriorities };
          } else {
            // Add new priority - ensure teamId is a valid Challenge
            if (Object.values(Challenge).includes(teamId as Challenge)) {
              return {
                ...interviewer,
                priorityTeams: [
                  ...interviewer.priorityTeams,
                  { teamId: teamId as Challenge, priority },
                ],
              };
            }
            return interviewer;
          }
        }
        return interviewer;
      }),
    );
  };

  // Remove a team priority
  const removeTeamPriority = (interviewerId: string, teamId: string) => {
    setInterviewers((prev) =>
      prev.map((interviewer) => {
        if (interviewer.id === interviewerId) {
          return {
            ...interviewer,
            priorityTeams: interviewer.priorityTeams.filter(
              (pt) => pt.teamId !== teamId,
            ),
          };
        }
        return interviewer;
      }),
    );
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

  // Get current view dates
  const getCurrentViewDates = () => {
    if (viewMode === "day") {
      return [currentDate];
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    }
  };

  const viewDates = getCurrentViewDates();

  // Generate time slots from 8am to 10pm in 15-minute increments
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hourr = 8; hourr <= 22; hourr++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hourr % 12 === 0 ? 12 : hourr % 12;
        const period = hourr < 12 ? "AM" : "PM";
        slots.push({
          hour: hourr,
          minute,
          formatted: `${formattedHour}:${minute === 0 ? "00" : minute} ${period}`,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const tableHeaders = ["Name", "Availability", "Priority Teams", "Calendar"];

  // Handle time slot selection for multi-select mode
  const handleTimeSlotSelect = (
    interviewerId: string,
    date: Date,
    timeSlot: TimeSlot,
  ) => {
    if (isMultiSelectMode) {
      // If we're in multi-select mode, add this slot to our selected slots
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
    } else {
      // Regular single slot selection
      openScheduleModal(interviewerId, date, timeSlot);
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
      });
      setIsEditingInterview(false);
      setIsViewModalOpen(true);
      return;
    }

    // Otherwise, open the schedule modal
    setSelectedInterviewer(interviewerId);
    setSelectedTimeSlot({ date, timeSlot });

    // Set default team based on interviewer's first priority team
    if (interviewer.priorityTeams.length > 0) {
      setNewInterview((prev) => ({
        ...prev,
        teamId: interviewer.priorityTeams[0].teamId,
      }));
    }

    setIsScheduleModalOpen(true);
  };

  // Handle saving edited interview
  const handleSaveEditedInterview = async () => {
    if (!selectedInterview) return;

    const success = await updateInterview(selectedInterview.id, {
      location: editedInterview.location,
      teamId: editedInterview.teamId,
    });

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
                      location: editedInterview.location,
                      teamId: editedInterview.teamId,
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
      `Are you sure you want to delete this interview with ${selectedInterview.applicantName}?`,
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

  // Check if a time slot is selected in multi-select mode
  const isTimeSlotSelected = (date: Date, timeSlot: TimeSlot) => {
    return selectedTimeSlots.some(
      (slot) =>
        isSameDay(slot.date, date) &&
        slot.timeSlot.hour === timeSlot.hour &&
        slot.timeSlot.minute === timeSlot.minute,
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col overflow-hidden bg-neutral-950 text-xl font-medium shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        <div className="flex w-full flex-col items-center justify-center whitespace-nowrap bg-neutral-950 px-16 py-5 tracking-wide text-neutral-200 text-opacity-80 max-md:mr-2 max-md:max-w-full max-md:px-5">
          {/* Header content would go here */}
        </div>

        <div className="mt-1 flex w-full flex-col items-center overflow-hidden px-20 pb-96 pt-11 max-md:max-w-full max-md:px-5 max-md:pb-24">
          <div className="mb-0 flex w-full max-w-[1537px] flex-col max-md:mb-2.5 max-md:max-w-full">
            <div className="self-start pb-10 text-center text-5xl font-semibold max-md:text-4xl">
              Scheduler
            </div>

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
                onClick={() => setSelectedCategory("MATE ROV")}
                className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[0px_37px_37px_0px] py-2.5 pl-20 pr-5 text-center transition-colors max-md:max-w-full max-md:pl-5 ${
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
                    : `${format(viewDates[0], "MMM d")} - ${format(viewDates[viewDates.length - 1], "MMM d, yyyy")}`}
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
                <div className="ml-4 flex items-center gap-2">
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
                  <Button
                    onClick={openMultiSelectModal}
                    className="ml-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Schedule {selectedTimeSlots.length} Slots
                  </Button>
                )}
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
                              return (
                                <div
                                  key={i}
                                  className="inline-flex h-8 items-center rounded-full bg-stone-700/80 px-3 py-1 text-xs backdrop-blur-sm"
                                >
                                  <span>
                                    {team?.name ?? "Unknown"} (#
                                    {teamPriority.priority})
                                  </span>
                                  <button
                                    className="ml-2 text-red-400 hover:text-red-300"
                                    onClick={() =>
                                      removeTeamPriority(
                                        interviewer.id,
                                        teamPriority.teamId,
                                      )
                                    }
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
                                .map((team, i) => (
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
                                  >
                                    {team.name}
                                  </DropdownMenuItem>
                                ))}
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
                                {viewDates.map((date, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "border-l border-neutral-700 p-2 text-center font-medium",
                                      isWeekend(date) && "bg-neutral-800",
                                    )}
                                  >
                                    <div>{format(date, "EEE")}</div>
                                    <div className="text-lg">
                                      {format(date, "d")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Time Slots - No scrollbar, all expanded */}
                            <div className="rounded-b-lg border-x border-b border-neutral-700">
                              {timeSlots.map((timeSlot, timeIndex) => (
                                <div
                                  key={timeIndex}
                                  className="grid grid-cols-[100px_1fr] border-b border-neutral-700"
                                >
                                  <div className="border-r border-neutral-700 p-2 text-center text-sm text-neutral-400">
                                    {timeSlot.formatted}
                                  </div>
                                  <div
                                    className={`grid ${viewMode === "day" ? "grid-cols-1" : "grid-cols-7"} h-16`}
                                  >
                                    {viewDates.map((date, dateIndex) => {
                                      // Find interviews that overlap with this time slot
                                      const slotInterviews =
                                        interviewer.interviews.filter(
                                          (interview) => {
                                            const interviewStart = new Date(
                                              interview.startTime,
                                            );

                                            // Check if this interview is on this date and overlaps with this time slot
                                            return (
                                              isSameDay(interviewStart, date) &&
                                              interviewStart.getHours() ===
                                                timeSlot.hour &&
                                              interviewStart.getMinutes() ===
                                                timeSlot.minute
                                            );
                                          },
                                        );

                                      const hasInterview =
                                        slotInterviews.length > 0;
                                      const isSelected =
                                        isMultiSelectMode &&
                                        isTimeSlotSelected(date, timeSlot);

                                      return (
                                        <div
                                          key={dateIndex}
                                          className={cn(
                                            "relative cursor-pointer border-l border-neutral-700 p-1 hover:bg-neutral-800",
                                            isWeekend(date) &&
                                              "bg-neutral-800/50",
                                            hasInterview && "bg-stone-700/50",
                                            isSelected &&
                                              "bg-blue-900/30 ring-2 ring-blue-500",
                                            isMultiSelectMode &&
                                              !hasInterview &&
                                              "hover:bg-blue-900/30",
                                          )}
                                          onClick={() =>
                                            handleTimeSlotSelect(
                                              interviewer.id,
                                              date,
                                              timeSlot,
                                            )
                                          }
                                        >
                                          {hasInterview ? (
                                            slotInterviews.map(
                                              (interview, i) => (
                                                <div
                                                  key={i}
                                                  className="absolute inset-0 m-1 overflow-hidden rounded bg-stone-600 p-1"
                                                >
                                                  <div className="truncate text-xs font-medium">
                                                    {interview.applicantName}
                                                  </div>
                                                  <div className="truncate text-[10px] text-neutral-300">
                                                    {interview.location}
                                                  </div>
                                                </div>
                                              ),
                                            )
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
                            {slot.timeSlot.formatted}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedTimeSlot ? (
                  <div className="text-neutral-200">
                    {format(selectedTimeSlot.date, "MMMM d, yyyy")} at{" "}
                    {selectedTimeSlot.timeSlot.formatted}
                  </div>
                ) : (
                  <div className="text-neutral-400">No time selected</div>
                )}
              </div>
            </div>

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
              {isMultiSelectMode && selectedTimeSlots.length > 0
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
              {isEditingInterview ? "Edit Interview" : "Interview Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedInterview && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Date & Time</Label>
                <div className="col-span-3 text-neutral-200">
                  {format(selectedInterview.startTime, "MMMM d, yyyy")} at{" "}
                  {format(selectedInterview.startTime, "h:mm a")} -{" "}
                  {format(selectedInterview.endTime, "h:mm a")}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Applicant</Label>
                <div className="col-span-3 text-neutral-200">
                  {selectedInterview.applicantName}
                </div>
              </div>

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
    </DndProvider>
  );
};

export default Scheduler;
