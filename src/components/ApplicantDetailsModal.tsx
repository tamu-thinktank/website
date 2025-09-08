"use client";

import React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Unlock, Calendar } from "lucide-react";
import { ApplicationStatus } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api as _api } from "@/lib/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

// Update the ApplicantDetails interface to include the new fields for MATEROV applications
interface ApplicantDetails {
  id: string;
  fullName: string;
  preferredName: string | null;
  uin: number;
  email: string;
  altEmail: string | null;
  phone: string;
  submittedAt: string;
  status: ApplicationStatus;
  major: string;
  year: string;
  firstQuestion: string;
  secondQuestion: string;
  thirdQuestion?: string;
  meetings: boolean;
  rating?: number | null;
  weeklyCommitment: boolean;
  currentClasses: string[];
  nextClasses: string[];
  summerPlans?: string;
  timeCommitment?: {
    name: string;
    hours: number;
    type: string;
  }[];
  assignedTeam?: string;
  preferredTeams?: {
    id: string;
    teamId: string;
    interest: string;
    team?: {
      id: string;
      name: string;
    };
  }[];
  preferredPositions?: {
    id: string;
    position: string;
    interest: string;
  }[];
  resumeId?: string;
  applicationType?: "DCMEMBER" | "OFFICER" | "MATEROV" | "MINIDC";
  subteamPreferences?: {
    id: string;
    name: string;
    interest: string;
  }[];
  skills?: {
    id: string;
    name: string;
    experienceLevel: string;
  }[];
  learningInterests?: {
    id: string;
    area: string;
    interestLevel: string;
  }[];
  previousParticipation?: boolean;
  referral?: string[];
  officerCommitment?: "YES" | "NO" | "PARTIAL";
}

interface InterviewNote {
  id: string;
  applicantId: string;
  content: string;
}

interface InterviewData {
  interviewer: {
    id: string;
    name: string;
    email?: string;
  };
  startTime: string;
  location?: string;
}

interface ErrorResponse {
  error?: string;
}

interface AutoScheduleResult {
  success: boolean;
  matches: {
    interviewerId: string;
    name: string;
    email?: string;
    targetTeams: string[];
    matchScore: number;
    availableSlots: {
      hour: number;
      minute: number;
      date: string; // serialized Date from API
      timestamp?: number;
    }[];
    conflicts: string[];
  }[];
  suggestedSlot?: {
    interviewer: {
      interviewerId: string;
      name: string;
      email?: string;
      targetTeams: string[];
      matchScore: number;
      availableSlots: {
        hour: number;
        minute: number;
        date: string;
        timestamp?: number;
      }[];
      conflicts: string[];
    };
    slot: {
      hour: number;
      minute: number;
      date: string; // serialized Date from API
      timestamp?: number;
    };
  };
  createdInterview?: {
    id: string;
    applicantId: string;
    interviewerId: string;
    startTime: string; // serialized Date from API
    endTime: string; // serialized Date from API
    location: string;
    teamId?: string;
    applicantName: string;
    interviewerName: string;
  };
  errors: string[];
}

interface ApplicantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId?: string;
}

const statusColors = {
  PENDING: "text-orange-400",
  INTERVIEWING: "text-blue-400",
  ACCEPTED: "text-green-400",
  REJECTED: "text-red-400",
  REJECTED_APP: "text-red-400",
  REJECTED_INT: "text-red-400",
};

export const ApplicantDetailsModal = ({
  isOpen,
  onClose,
  applicantId,
}: ApplicantDetailsModalProps) => {
  const { toast } = useToast();
  const [applicant, setApplicant] = useState<ApplicantDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewNotes, setInterviewNotes] = useState<InterviewNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);
  const [interviewers, setInterviewers] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [interviewRoom, setInterviewRoom] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [assignedTeam, setAssignedTeam] = useState("");
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [applicantRating, setApplicantRating] = useState<number | null>(null);
  const _router = useRouter();
  const { data: _session } = useSession();

  // Send rejection email using API route
  const sendRejectEmail = async (data: {
    applicantName: string;
    applicantEmail: string;
  }) => {
    try {
      const response = await fetch("/api/send-rejection-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: data.applicantName,
          applicantEmail: data.applicantEmail,
          applicationType: applicant?.applicationType ?? "General",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send rejection email");
      }

      toast({
        title: "Success",
        description: `Rejection email sent to ${data.applicantName}`,
      });
    } catch (err) {
      console.error("Error sending rejection email:", err);
      toast({
        title: "Error",
        description: "Failed to send rejection email. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Save applicant rating
  const saveApplicantRating = async (rating: number | null) => {
    if (!applicantId) return;

    try {
      const response = await fetch(`/api/applicants/${applicantId}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to save rating");
      }

      // Update both the rating state and the applicant object
      setApplicantRating(rating);
      if (applicant) {
        setApplicant({ ...applicant, rating });
      }
      toast({
        title: "Success",
        description: `Rating ${rating ? `updated to ${rating}` : "removed"}`,
      });
    } catch (error) {
      console.error("Error saving rating:", error);
      toast({
        title: "Error",
        description: "Failed to save rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch applicant details when the modal opens and applicantId changes
  useEffect(() => {
    if (isOpen && applicantId) {
      void fetchApplicantDetails(applicantId);
      void fetchInterviewNotes(applicantId);
      void fetchInterviewers();
    }
  }, [isOpen, applicantId]);

  // Reset state only when modal closes (not when applicantId changes)
  useEffect(() => {
    if (!isOpen) {
      setApplicant(null);
      setInterviewNotes([]);
      setNewNote("");
      setIsLocked(false);
      setSelectedInterviewer("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setInterviewRoom("");
      setAssignedTeam("");
      setApplicantRating(null);
    }
  }, [isOpen]);

  // Add useEffect to initialize assignedTeam and rating when applicant data is loaded
  useEffect(() => {
    if (applicant) {
      setAssignedTeam(applicant.assignedTeam ?? "NONE");
      setApplicantRating(applicant.rating ?? null);
    }
  }, [applicant]);

  const fetchApplicantDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/applicant/${id}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch applicant details: ${response.status}`,
        );
      }

      const data = (await response.json()) as ApplicantDetails;
      console.log("Fetched applicant details:", data);
      setApplicant(data);
    } catch (err) {
      console.error("Error fetching applicant details:", err);
      setError(
        `Failed to load applicant details: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewNotes = async (id: string) => {
    try {
      const response = await fetch(`/api/interview-notes/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch interview notes: ${response.status}`);
      }

      const data = (await response.json()) as InterviewNote[];
      setInterviewNotes(data);
    } catch (err) {
      console.error("Error fetching interview notes:", err);
      // We don't set the main error state here to avoid blocking the whole modal
      toast({
        title: "Error",
        description: `Failed to load interview notes: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const fetchInterviewers = async () => {
    try {
      // Fetch all authenticated interviewers (real users only)
      const response = await fetch("/api/interviewers");

      if (!response.ok) {
        throw new Error(`Failed to fetch interviewers: ${response.status}`);
      }

      const data = (await response.json()) as { id: string; name: string }[];
      setInterviewers(data);

      if (data.length === 0) {
        console.warn(
          "No interviewers found. Make sure you've logged in to create an interviewer account.",
        );
      }
    } catch (err) {
      console.error("Error fetching interviewers:", err);
      toast({
        title: "Error",
        description: `Failed to load interviewers: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Simplified saveInterviewNote function - just sends the applicantId and content
  const saveInterviewNote = async () => {
    if (!applicantId || !newNote.trim()) return;

    try {
      const response = await fetch("/api/interview-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId,
          content: newNote,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save interview note: ${response.status}`);
      }

      // Refresh the notes after saving
      await fetchInterviewNotes(applicantId);

      toast({
        title: "Success",
        description: "Interview note saved successfully",
      });
      setNewNote(""); // Clear input field after saving
    } catch (err) {
      console.error("Error saving interview note:", err);
      toast({
        title: "Error",
        description: `Failed to save interview note: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Update the updateApplicationStatus function to properly send rejection emails
  const updateApplicationStatus = async () => {
    if (!applicantId || !newStatus || !applicant) return;

    try {
      setIsSendingEmail(true);

      // First update the status in the database
      const response = await fetch(`/api/applicant/${applicantId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update application status: ${response.status}`,
        );
      }

      // Update the local state
      setApplicant({
        ...applicant,
        status: newStatus,
      });

      // Send rejection email if status is REJECTED
      if (
        newStatus === ApplicationStatus.REJECTED ||
        newStatus === ApplicationStatus.REJECTED_APP ||
        newStatus === ApplicationStatus.REJECTED_INT
      ) {
        // Send rejection email using the API route
        await sendRejectEmail({
          applicantName: applicant.fullName,
          applicantEmail: applicant.email,
        });
      }

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}`,
      });
    } catch (err) {
      console.error("Error updating application status:", err);
      toast({
        title: "Error",
        description: `Failed to update application status: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsStatusDialogOpen(false);
      setNewStatus(null);
      setIsSendingEmail(false);
    }
  };

  // Combine date and time into a single ISO string
  const getInterviewDateTime = (): string => {
    if (!selectedDate || !selectedTime) return "";

    const [hoursStr, minutesStr] = selectedTime.split(":");
    const hours = Number.parseInt(hoursStr ?? "0", 10) || 0; // Default to 0 if parsing fails
    const minutes = Number.parseInt(minutesStr ?? "0", 10) || 0; // Default to 0 if parsing fails

    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);

    return dateTime.toISOString();
  };

  // Update the toggleLock function to schedule interview without sending email
  const toggleLock = async () => {
    if (!isLocked && selectedInterviewer && selectedDate && selectedTime) {
      // If we're locking, schedule the interview without sending email
      try {
        const interviewDateTime = getInterviewDateTime();
        console.log("Scheduling interview at:", interviewDateTime);

        // Check for scheduling conflicts
        const hasConflict = await checkInterviewerScheduleConflict(
          selectedInterviewer,
          interviewDateTime,
        );
        if (hasConflict) {
          toast({
            title: "Scheduling Conflict",
            description:
              "This interviewer already has an interview scheduled at this time.",
            variant: "destructive",
          });
          return;
        }

        // Create the interview record with default room if none provided
        const response = await fetch("/api/schedule-interview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicantId,
            interviewerId: selectedInterviewer,
            time: interviewDateTime,
            location: interviewRoom.trim() || "To be determined",
            teamId: assignedTeam !== "NONE" ? assignedTeam : null,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to schedule interview: ${response.status}`);
        }

        // Update local state
        if (applicant) {
          setApplicant({
            ...applicant,
            status: ApplicationStatus.INTERVIEWING,
          });
        }

        toast({
          title: "Success",
          description: "Interview scheduled successfully (no email sent)",
        });

        // Refresh applicant details to get updated status
        if (applicantId) {
          await fetchApplicantDetails(applicantId);
        }
      } catch (err) {
        console.error("Error scheduling interview:", err);
        toast({
          title: "Error",
          description: `Failed to schedule interview: ${err instanceof Error ? err.message : "Unknown error"}`,
          variant: "destructive",
        });
        return; // Don't toggle lock if scheduling failed
      }
    }

    // Toggle the lock state
    setIsLocked(!isLocked);
  };

  // Add function to check for interviewer schedule conflicts
  const checkInterviewerScheduleConflict = async (
    interviewerId: string,
    dateTime: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/interviewer-schedule/${interviewerId}?time=${encodeURIComponent(dateTime)}`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to check interviewer schedule: ${response.status}`,
        );
      }
      const data = (await response.json()) as { hasConflict: boolean };
      return data.hasConflict;
    } catch (error) {
      console.error("Error checking interviewer schedule:", error);
      return false; // If we can't check, assume no conflict
    }
  };

  // Update scheduleInterview function to check for conflicts
  const scheduleInterview = async () => {
    if (
      !applicantId ||
      !selectedInterviewer ||
      !selectedDate ||
      !selectedTime ||
      !interviewRoom ||
      !applicant
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all interview details",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSendingEmail(true);

      // Get the interviewer details
      const interviewer = interviewers.find(
        (i) => i.id === selectedInterviewer,
      );
      if (!interviewer) {
        throw new Error("Selected interviewer not found");
      }

      const interviewDateTime = getInterviewDateTime();
      console.log("Scheduling interview at:", interviewDateTime);

      // Check for scheduling conflicts
      const hasConflict = await checkInterviewerScheduleConflict(
        selectedInterviewer,
        interviewDateTime,
      );
      if (hasConflict) {
        toast({
          title: "Scheduling Conflict",
          description:
            "This interviewer already has an interview scheduled at this time.",
          variant: "destructive",
        });
        setIsSendingEmail(false);
        return;
      }

      // First update the application status in the database
      const statusResponse = await fetch(
        `/api/applicant/${applicantId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: ApplicationStatus.INTERVIEWING,
          }),
        },
      );

      if (!statusResponse.ok) {
        throw new Error(
          `Failed to update application status: ${statusResponse.status}`,
        );
      }

      // Create the interview record
      const response = await fetch("/api/schedule-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicantId,
          interviewerId: selectedInterviewer,
          time: interviewDateTime,
          location: interviewRoom,
          teamId: assignedTeam !== "NONE" ? assignedTeam : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to schedule interview: ${response.status}`);
      }

      // Format the time for display
      const formattedTime = format(
        new Date(interviewDateTime),
        "MMMM d, yyyy 'at' h:mm a",
      );

      // Update local state
      setApplicant({
        ...applicant,
        status: ApplicationStatus.INTERVIEWING,
      });

      toast({
        title: "Success",
        description: `Interview scheduled successfully for ${formattedTime}`,
      });

      // Refresh applicant details to get updated status
      await fetchApplicantDetails(applicantId);
    } catch (err) {
      console.error("Error scheduling interview:", err);
      toast({
        title: "Error",
        description: `Failed to schedule interview: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Send interview email separately
  const sendInterviewEmailOnly = async () => {
    if (!applicant || !applicantId) {
      toast({
        title: "Error",
        description: "No applicant data available",
        variant: "destructive",
      });
      return;
    }

    // More flexible check - allow if interviewing
    if (applicant.status !== ApplicationStatus.INTERVIEWING) {
      toast({
        title: "Error",
        description: "Interview must be scheduled before sending email",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSendingEmail(true);

      // Try to fetch interview details from API
      let interviewData = null;
      try {
        const response = await fetch(`/api/applicant/${applicantId}/interview`);
        if (response.ok) {
          interviewData = await response.json();
        }
      } catch (err) {
        console.warn("Could not fetch interview details, using fallback data");
      }

      // Use fallback data if interview details are not available
      if (!interviewData) {
        interviewData = {
          interviewer: {
            id: "fallback",
            name: "TBD",
            email: "lucasvad123@gmail.com",
          },
          startTime: new Date().toISOString(),
          location: "TBD",
        };
      }

      // Send interview email using API route
      const emailResponse = await fetch("/api/send-interview-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officerId: (interviewData as InterviewData).interviewer.id,
          officerName: (interviewData as InterviewData).interviewer.name,
          officerEmail: "lucasvad123@gmail.com", // Updated to use test email
          applicantName: applicant.fullName,
          applicantEmail: applicant.email,
          startTime: (interviewData as InterviewData).startTime,
          location: (interviewData as InterviewData).location ?? "TBD",
          team: applicant.assignedTeam ?? "",
          applicationType: applicant.applicationType ?? "General",
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email");
      }

      toast({
        title: "Success",
        description: "Interview email sent successfully",
      });
    } catch (err) {
      console.error("Error sending interview email:", err);
      toast({
        title: "Error",
        description: `Failed to send interview email: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Toggle lock and schedule interview if locking

  // Add function to update assigned team and status
  const updateAssignedTeam = async () => {
    if (!applicantId) return;

    try {
      // Team values that should set status to ACCEPTED
      const teamValues = [
        "PROJECT_MANAGER",
        "MARKETING_SPECIALIST",
        "GRAPHIC_DESIGNER",
        "WEB_DEV_LEAD",
        "TREASURER",
        "DC_PROGRAM_MANAGER",
      ];

      // Status values that should clear team assignment
      const statusValues = [
        "NONE",
        "INTERVIEWING",
        "REJECTED_APP",
        "REJECTED_INT",
        "REJECTED",
      ];

      let newTeam: string | null = null;
      let newStatus: string | null = null;

      if (teamValues.includes(assignedTeam)) {
        // Team assignment - set team and status to ACCEPTED
        newTeam = assignedTeam;
        newStatus = "ACCEPTED";
      } else if (statusValues.includes(assignedTeam)) {
        // Status change - clear team and set status
        newTeam = null;
        newStatus = assignedTeam === "NONE" ? "PENDING" : assignedTeam;
      }

      // Update team assignment if needed
      if (
        newTeam !== null ||
        (statusValues.includes(assignedTeam) && applicant?.assignedTeam)
      ) {
        const teamResponse = await fetch(`/api/applicant/${applicantId}/team`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedTeam: newTeam,
          }),
        });

        if (!teamResponse.ok) {
          throw new Error(
            `Failed to update team assignment: ${teamResponse.status}`,
          );
        }
      }

      // Update status if needed
      if (newStatus && newStatus !== applicant?.status) {
        const statusResponse = await fetch(
          `/api/applicant/${applicantId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          },
        );

        if (!statusResponse.ok) {
          throw new Error(`Failed to update status: ${statusResponse.status}`);
        }
      }

      // Update the local state
      setApplicant((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          assignedTeam: newTeam ?? undefined,
          status: prev.status,
        };
      });

      // Show appropriate success message
      let description = "";
      if (teamValues.includes(assignedTeam)) {
        description = `Applicant assigned to ${assignedTeam} team and status set to ACCEPTED`;
      } else if (assignedTeam === "NONE") {
        description = "Team assignment removed and status set to PENDING";
      } else if (assignedTeam === "INTERVIEWING") {
        description = "Status set to INTERVIEWING";
      } else if (statusValues.includes(assignedTeam)) {
        description = `Status set to ${assignedTeam}`;
      }

      toast({
        title: "Success",
        description,
      });
    } catch (err) {
      console.error("Error updating team/status:", err);
      toast({
        title: "Error",
        description: `Failed to update assignment: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Update the handleStatusChange function to directly handle rejection
  const handleStatusChange = (status: ApplicationStatus) => {
    if (status === ApplicationStatus.REJECTED) {
      // For rejection, show confirmation dialog first
      setNewStatus(status);
      setIsStatusDialogOpen(true);
    } else {
      // For other statuses, use the dialog
      setNewStatus(status);
      setIsStatusDialogOpen(true);
    }
  };

  // Auto-schedule interview for this applicant
  const autoScheduleInterview = async () => {
    if (!applicantId || !applicant) return;

    try {
      setIsAutoScheduling(true);

      // Get applicant's preferred teams based on application type
      let preferredTeams: string[] = [];

      if (
        applicant.applicationType === "OFFICER" &&
        applicant.preferredPositions
      ) {
        preferredTeams = applicant.preferredPositions.map(
          (pos) => pos.position,
        );
      } else if (
        applicant.applicationType === "MATEROV" &&
        applicant.subteamPreferences
      ) {
        preferredTeams = applicant.subteamPreferences.map((sub) => sub.name);
      } else if (applicant.preferredTeams) {
        preferredTeams = applicant.preferredTeams.map((team) => team.teamId);
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

      // Call auto-scheduler API with automatic interview creation enabled
      const response = await fetch("/api/auto-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intervieweeId: applicantId,
          preferredTeams,
          availableSlots,
          autoCreateInterview: true, // Enable automatic interview creation
        }),
      });

      if (!response.ok) {
        // Try to get more detailed error from response
        let errorMessage = "Failed to auto-schedule interview";
        try {
          const errorData = (await response.json()) as ErrorResponse;
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const result = (await response.json()) as AutoScheduleResult;

      // Check for errors in successful response
      if (result.errors.length > 0) {
        const errorMessage = result.errors.join(", ");
        throw new Error(errorMessage);
      }

      // Check if interview was automatically created
      if (result.success && result.createdInterview) {
        const interview = result.createdInterview;

        toast({
          title: "Interview Scheduled Successfully!",
          description: `Interview automatically scheduled with ${interview.interviewerName} on ${new Date(interview.startTime).toLocaleDateString()} at ${new Date(interview.startTime).toLocaleTimeString()}.`,
        });

        // Refresh applicant details to show updated status
        if (applicantId) {
          await fetchApplicantDetails(applicantId);
        }

        // Close modal since applicant is now scheduled
        onClose();

        return; // Exit early since interview was created successfully
      }

      // Fallback: If auto-creation failed but we have a suggestion, show it
      if (result.success && result.suggestedSlot) {
        const { interviewer, slot } = result.suggestedSlot;

        // Auto-fill the form with the suggested slot
        setSelectedInterviewer(interviewer.interviewerId);
        setSelectedDate(new Date(slot.date));
        setSelectedTime(
          `${slot.hour}:${slot.minute.toString().padStart(2, "0")}`,
        );

        toast({
          title: "Auto-Schedule Suggestion",
          description: `Found match with ${interviewer.name} on ${new Date(slot.date).toLocaleDateString()} at ${slot.hour}:${slot.minute.toString().padStart(2, "0")}. Please review and confirm manually.`,
          variant: "default",
        });
      } else {
        // Show all available matches
        const matches = result.matches;
        const [topMatch] = matches;
        if (topMatch) {
          const slots = topMatch.availableSlots;
          const [firstSlot] = slots;
          if (firstSlot) {
            setSelectedInterviewer(topMatch.interviewerId);
            setSelectedDate(new Date(firstSlot.date));
            setSelectedTime(
              `${firstSlot.hour}:${firstSlot.minute.toString().padStart(2, "0")}`,
            );

            toast({
              title: "Auto-Schedule Suggestion",
              description: `Found partial match with ${topMatch.name}. ${matches.length} interviewer(s) available. Please review the suggestion.`,
            });
          } else {
            toast({
              title: "No Available Slots",
              description: `Found ${matches.length} matching interviewer(s) but no available time slots. Please schedule manually.`,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "No Matches Found",
            description:
              "No interviewers found matching the applicant's team preferences. Please schedule manually.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error auto-scheduling interview:", error);

      // Extract more detailed error information
      let errorMessage =
        "Failed to auto-schedule. Please try manual scheduling.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (errorMessage.includes("conflicts")) {
        errorMessage =
          "No available time slots found due to scheduling conflicts. Please try manual scheduling.";
      } else if (errorMessage.includes("No interviewers")) {
        errorMessage =
          "No interviewers available for your application type. Please contact admin.";
      } else if (errorMessage.includes("Failed to create interview")) {
        errorMessage =
          "Found a match but failed to create interview. Please try manual scheduling with the suggested slot.";
      }

      toast({
        title: "Auto-Schedule Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAutoScheduling(false);
    }
  };

  // Update the rejectApplicant function to properly handle the rejection flow
  const rejectApplicant = useCallback(() => {
    if (!applicantId || !applicant) return;

    const rejectionStatus =
      applicant.status === ApplicationStatus.PENDING
        ? "REJECTED_APP"
        : applicant.status === ApplicationStatus.INTERVIEWING
          ? "REJECTED_INT"
          : ApplicationStatus.REJECTED;

    // First update the status in the database
    fetch(`/api/applicant/${applicantId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: rejectionStatus,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to update application status: ${response.status}`,
          );
        }

        // Update local state
        setApplicant((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: rejectionStatus,
          };
        });

        // Send rejection email using the API route
        await sendRejectEmail({
          applicantName: applicant.fullName,
          applicantEmail: applicant.email,
        });

        toast({
          title: "Success",
          description: `Application status updated to REJECTED`,
        });
      })
      .catch((err) => {
        console.error("Error updating application status:", err);
        toast({
          title: "Error",
          description: `Failed to update application status: ${err instanceof Error ? err.message : "Unknown error"}`,
          variant: "destructive",
        });
      });
  }, [applicantId, applicant, toast]);

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[95vh] max-w-6xl overflow-y-auto border-neutral-700 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {loading
                ? "Loading Applicant Details..."
                : (applicant?.fullName ?? "Applicant Details")}
            </DialogTitle>
          </DialogHeader>

          {error ? (
            <div className="my-4 rounded-md bg-red-500/20 p-4 text-red-200">
              {error}
            </div>
          ) : loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-600 border-t-white"></div>
            </div>
          ) : applicant ? (
            <div className="space-y-4">
              {/* Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-neutral-800 p-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {applicant.fullName}
                  </h3>
                  <div className="text-sm text-neutral-400">
                    UIN: {applicant.uin}
                  </div>
                  {applicant.status === ApplicationStatus.ACCEPTED &&
                    applicant.assignedTeam && (
                      <div className="mt-1 text-sm text-green-400">
                        Team: {applicant.assignedTeam}
                      </div>
                    )}
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-neutral-400">Submitted</div>
                  <div>
                    {format(new Date(applicant.submittedAt), "MMM d, yyyy")}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-neutral-400">Status</div>
                  <div className={statusColors[applicant.status]}>
                    {applicant.status}
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-neutral-400">Full Name</Label>
                    <div>{applicant.fullName}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">Preferred Name</Label>
                    <div>{applicant.preferredName ?? "N/A"}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">TAMU Email</Label>
                    <div>{applicant.email}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">UIN</Label>
                    <div>{applicant.uin}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">Additional Email</Label>
                    <div>{applicant.altEmail ?? "N/A"}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">Contact Number</Label>
                    <div>{applicant.phone}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">Current Year</Label>
                    <div>{applicant.year}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">Major</Label>
                    <div>{applicant.major}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">
                      Weekly Commitment
                    </Label>
                    <div>{applicant.weeklyCommitment ? "Yes" : "No"}</div>
                  </div>

                  <div>
                    <Label className="text-neutral-400">
                      Can Attend Meetings
                    </Label>
                    <div>{applicant.meetings ? "Yes" : "No"}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-neutral-400">Current Classes</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {applicant.currentClasses.length > 0 ? (
                      applicant.currentClasses.map((cls, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                        >
                          {cls}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-500">None listed</span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-neutral-400">
                    Next Semester Classes
                  </Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {applicant.nextClasses.length > 0 ? (
                      applicant.nextClasses.map((cls, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                        >
                          {cls}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-500">None listed</span>
                    )}
                  </div>
                </div>

                {applicant.timeCommitment &&
                  applicant.timeCommitment.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-neutral-400">
                        Time Commitments
                      </Label>
                      <div className="mt-1 space-y-2">
                        {applicant.timeCommitment.map((commitment, idx) => (
                          <div key={idx} className="rounded bg-neutral-900 p-2">
                            <span className="font-medium">
                              {commitment.name}
                            </span>
                            <span className="ml-2 text-neutral-400">
                              ({commitment.hours} hrs/week, {commitment.type})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Application Type Specific Information */}
              {applicant.applicationType === "OFFICER" ? (
                <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                  <h3 className="text-lg font-semibold">
                    Officer Application Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-neutral-400">
                        Are you able to commit to and attend weekly team
                        meetings in person on campus for the next 2 semesters?
                      </Label>
                      <div className="mt-1 text-white">
                        {applicant.officerCommitment === "YES"
                          ? "Yes"
                          : applicant.officerCommitment === "PARTIAL"
                            ? "Partially"
                            : "No"}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Interest in each position
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {applicant.preferredPositions &&
                        applicant.preferredPositions.length > 0 ? (
                          applicant.preferredPositions.map((position, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                            >
                              {position.position} ({position.interest})
                            </span>
                          ))
                        ) : (
                          <div className="text-neutral-500">
                            No position preferences listed
                          </div>
                        )}
                      </div>
                    </div>

                    {applicant.summerPlans && (
                      <div>
                        <Label className="text-neutral-400">Summer Plans</Label>
                        <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                          {applicant.summerPlans}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-neutral-400">
                        Why do you want to become a ThinkTank Officer?
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.secondQuestion}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Which previous team were you a member of and what did
                        you specifically contribute?
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.firstQuestion}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Where did you hear about us?
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {applicant.referral && applicant.referral.length > 0 ? (
                          applicant.referral.map((ref, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                            >
                              {ref}
                            </span>
                          ))
                        ) : (
                          <div className="text-neutral-500">
                            No referral sources listed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : applicant.applicationType === "MATEROV" ? (
                <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                  <h3 className="text-lg font-semibold">
                    MATE ROV Application Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-neutral-400">
                        Are you able to commit to and attend weekly team
                        meetings in person, which will take place on Saturdays
                        for the next 2 semesters?
                      </Label>
                      <div className="mt-1 text-white">
                        {applicant.meetings ? "Yes" : "No"}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Are you able to commit 8-10 hours per week (equivalent
                        to 1 in-major engineering course) to your team for the
                        entire duration of the project?
                      </Label>
                      <div className="mt-1 text-white">
                        {applicant.weeklyCommitment ? "Yes" : "No"}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Preferred Subteams
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {applicant.subteamPreferences &&
                        applicant.subteamPreferences.length > 0 ? (
                          applicant.subteamPreferences.map((subteam, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                            >
                              {subteam.name} ({subteam.interest})
                            </span>
                          ))
                        ) : (
                          <div className="text-neutral-500">
                            No subteam preferences listed
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Experience & Skills
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {applicant.skills && applicant.skills.length > 0 ? (
                          applicant.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                            >
                              {skill.name} ({skill.experienceLevel})
                            </span>
                          ))
                        ) : (
                          <div className="text-neutral-500">
                            No skills listed
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        What do you most want to learn?
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {applicant.learningInterests &&
                        applicant.learningInterests.length > 0 ? (
                          applicant.learningInterests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                            >
                              {interest.area} ({interest.interestLevel})
                            </span>
                          ))
                        ) : (
                          <div className="text-neutral-500">
                            No learning interests listed
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Have you participated in a ThinkTank Design Challenge
                        before?
                      </Label>
                      <div className="mt-1 text-white">
                        {applicant.previousParticipation ? "Yes" : "No"}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Where did you hear about us?
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {applicant.referral && applicant.referral.length > 0 ? (
                          applicant.referral.map((ref, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                            >
                              {ref}
                            </span>
                          ))
                        ) : (
                          <div className="text-neutral-500">
                            No referral sources listed
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Describe an instance where you worked with a team to
                        accomplish a goal you were passionate about.
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.firstQuestion}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Describe an instance where you demonstrated your passion
                        for a project, task, or subject matter
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.secondQuestion}
                      </div>
                    </div>

                    {applicant.thirdQuestion && (
                      <div>
                        <Label className="text-neutral-400">
                          If you were previously in a ThinkTank design team,
                          which previous team were you a member of and what did
                          you specifically contribute? If you were not
                          previously in ThinkTank, but have participated in an
                          engineering design competition before, what was it and
                          how did you contribute to the team?
                        </Label>
                        <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                          {applicant.thirdQuestion}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                  <h3 className="text-lg font-semibold">
                    Application Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-neutral-400">
                        Why are you interested in joining ThinkTank?
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.firstQuestion}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Describe an instance where you demonstrated your passion
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.secondQuestion}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Controls */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">Interview Controls</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Interviewer</Label>
                    <Select
                      value={selectedInterviewer}
                      onValueChange={setSelectedInterviewer}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="w-full border-neutral-700 bg-neutral-900">
                        <SelectValue placeholder="Select interviewer" />
                      </SelectTrigger>
                      <SelectContent className="border-neutral-700 bg-neutral-900">
                        {interviewers.map((interviewer) => (
                          <SelectItem
                            key={interviewer.id}
                            value={interviewer.id}
                          >
                            {interviewer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Interview Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start border-neutral-700 bg-neutral-900 text-left font-normal ${
                            !selectedDate && "text-muted-foreground"
                          }`}
                          disabled={isLocked}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto border-neutral-700 bg-neutral-900 p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Interview Time</Label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="w-full border-neutral-700 bg-neutral-900">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="border-neutral-700 bg-neutral-900">
                        {/* Business hours: 8am-10pm in 15-minute increments */}
                        {Array.from({ length: 14 })
                          .map((_, index) => {
                            const hour = index + 8; // Start at 8am
                            return Array.from({ length: 4 }).map(
                              (_, minuteIndex) => {
                                const minute = minuteIndex * 15; // 0, 15, 30, 45
                                const timeValue = `${hour}:${minute.toString().padStart(2, "0")}`;
                                const displayTime =
                                  hour < 12
                                    ? `${hour}:${minute.toString().padStart(2, "0")} AM`
                                    : hour === 12
                                      ? `12:${minute.toString().padStart(2, "0")} PM`
                                      : `${hour - 12}:${minute.toString().padStart(2, "0")} PM`;

                                return (
                                  <SelectItem key={timeValue} value={timeValue}>
                                    {displayTime}
                                  </SelectItem>
                                );
                              },
                            );
                          })
                          .flat()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative space-y-2">
                    <Label>Room</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Room"
                        value={interviewRoom}
                        onChange={(e) => setInterviewRoom(e.target.value)}
                        className="flex-1 border-neutral-700 bg-neutral-900"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
                        onClick={() => void toggleLock()}
                        title={
                          isLocked
                            ? "Unlock interviewer, date, and time fields"
                            : "Lock interviewer, date, and time fields"
                        }
                      >
                        {isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {(applicant.status === ApplicationStatus.INTERVIEWING ||
                    applicant.status === ApplicationStatus.PENDING) && (
                    <Button
                      onClick={() => void autoScheduleInterview()}
                      className="bg-white text-neutral-900 hover:bg-neutral-100"
                      disabled={isAutoScheduling}
                      title={
                        applicant.status === ApplicationStatus.PENDING
                          ? "Auto-schedule interview for pending applicant"
                          : "Auto-schedule interview"
                      }
                    >
                      {isAutoScheduling ? "Finding Match..." : "Auto-Schedule"}
                    </Button>
                  )}

                  <Button
                    onClick={() => void scheduleInterview()}
                    className="bg-white text-neutral-900 hover:bg-neutral-100"
                    disabled={
                      !selectedInterviewer ||
                      !selectedDate ||
                      !selectedTime ||
                      !interviewRoom ||
                      isSendingEmail
                    }
                  >
                    {isSendingEmail ? "Scheduling..." : "Schedule Interview"}
                  </Button>

                  {/* Send Interview Email button - always show if interview is scheduled */}
                  {applicant.status === ApplicationStatus.INTERVIEWING && (
                    <Button
                      variant="outline"
                      onClick={() => void sendInterviewEmailOnly()}
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      disabled={isSendingEmail}
                    >
                      {isSendingEmail
                        ? "Sending Email..."
                        : "Send Interview Email"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(ApplicationStatus.REJECTED)
                    }
                    className="border-white text-white hover:bg-white hover:text-neutral-900"
                  >
                    Reject
                  </Button>
                </div>
              </div>

              {/* Team Assignment Section - Separated from Interview Controls */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">Team Assignment</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Team Assignment & Status</Label>
                    <Select
                      value={assignedTeam}
                      onValueChange={setAssignedTeam}
                    >
                      <SelectTrigger className="w-full border-neutral-700 bg-neutral-900">
                        <SelectValue placeholder="Select team or status" />
                      </SelectTrigger>
                      <SelectContent className="border-neutral-700 bg-neutral-900">
                        {/* Status Options */}
                        <SelectItem value="NONE" className="text-neutral-400">
                          📋 Pending (No Team)
                        </SelectItem>
                        <SelectItem
                          value="INTERVIEWING"
                          className="text-blue-400"
                        >
                          💬 Interviewing
                        </SelectItem>

                        {/* Team Options (will set status to ACCEPTED) */}
                        <SelectItem
                          value="PROJECT_MANAGER"
                          className="text-green-400"
                        >
                          ✅ PROJECT MANAGER (Accept)
                        </SelectItem>
                        <SelectItem
                          value="MARKETING_SPECIALIST"
                          className="text-green-400"
                        >
                          ✅ MARKETING SPECIALIST (Accept)
                        </SelectItem>
                        <SelectItem
                          value="GRAPHIC_DESIGNER"
                          className="text-green-400"
                        >
                          ✅ GRAPHIC DESIGNER (Accept)
                        </SelectItem>
                        <SelectItem
                          value="WEB_DEV_LEAD"
                          className="text-green-400"
                        >
                          ✅ WEB DEV LEAD (Accept)
                        </SelectItem>
                        <SelectItem
                          value="TREASURER"
                          className="text-green-400"
                        >
                          ✅ TREASURER (Accept)
                        </SelectItem>
                        <SelectItem
                          value="DC_PROGRAM_MANAGER"
                          className="text-green-400"
                        >
                          ✅ DC PROGRAM MANAGER (Accept)
                        </SelectItem>
                        <SelectItem
                          value="COMPUTATION_COMMUNICATIONS"
                          className="text-green-400"
                        >
                          ✅ Computation & Communications (Accept)
                        </SelectItem>
                        <SelectItem
                          value="ELECTRICAL_POWER"
                          className="text-green-400"
                        >
                          ✅ Electrical & Power Systems (Accept)
                        </SelectItem>
                        <SelectItem
                          value="FLUIDS_PROPULSION"
                          className="text-green-400"
                        >
                          ✅ Fluids & Propulsion (Accept)
                        </SelectItem>
                        <SelectItem value="GNC" className="text-green-400">
                          ✅ Guidance, Navigation & Control (Accept)
                        </SelectItem>
                        <SelectItem
                          value="THERMAL_MECHANISMS"
                          className="text-green-400"
                        >
                          ✅ Thermal, Mechanisms & Structures (Accept)
                        </SelectItem>
                        <SelectItem
                          value="MATEROV_LEADERSHIP"
                          className="text-green-400"
                        >
                          ✅ MATE ROV Leadership (Accept)
                        </SelectItem>

                        {/* Rejection Options */}
                        <SelectItem
                          value="REJECTED_APP"
                          className="text-red-400"
                        >
                          ❌ Rejected - Application Stage
                        </SelectItem>
                        <SelectItem
                          value="REJECTED_INT"
                          className="text-red-400"
                        >
                          ❌ Rejected - Interview Stage
                        </SelectItem>
                        <SelectItem value="REJECTED" className="text-red-400">
                          ❌ Rejected - General
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => void updateAssignedTeam()}
                    className="border-white text-white hover:bg-white hover:text-neutral-900"
                    disabled={
                      assignedTeam === (applicant.assignedTeam ?? "NONE")
                    }
                  >
                    Update Status/Team
                  </Button>
                </div>
              </div>

              {/* Rating Section */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">Applicant Rating</h3>
                <div className="space-y-3">
                  <Label>Rate this applicant (1-5 stars)</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => saveApplicantRating(star)}
                        className="transition-colors hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            applicantRating && star <= applicantRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-500 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveApplicantRating(null)}
                      className="ml-4 border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                    >
                      Clear Rating
                    </Button>
                  </div>
                  {applicantRating && (
                    <p className="text-sm text-neutral-400">
                      Current rating: {applicantRating} out of 5 stars
                    </p>
                  )}
                </div>
              </div>

              {/* Resume Section */}
              {applicant.resumeId && (
                <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                  <h3 className="text-lg font-semibold">Resume</h3>
                  <div className="aspect-[8.5/11] w-full overflow-hidden rounded border border-neutral-700">
                    <iframe
                      src={`https://drive.google.com/file/d/${applicant.resumeId}/preview`}
                      className="h-full w-full"
                      title={`${applicant.fullName}'s Resume`}
                      allow="autoplay"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Interview Notes */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">Interview Notes</h3>

                <div className="space-y-4">
                  {interviewNotes.length > 0 ? (
                    interviewNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded border border-neutral-700 bg-neutral-900 p-3"
                      >
                        <div className="whitespace-pre-wrap">
                          {note.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-400">
                      No interview notes yet
                    </div>
                  )}

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add interview notes here..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[100px] border-neutral-700 bg-neutral-900"
                    />
                    <Button
                      variant="outline"
                      onClick={() => void saveInterviewNote()}
                      className="border-white text-white hover:bg-white hover:text-neutral-900"
                      disabled={!newNote.trim()}
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Status Change */}
      <AlertDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
      >
        <AlertDialogContent className="border-neutral-700 bg-neutral-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the application status to{" "}
              <span className={newStatus ? statusColors[newStatus] : ""}>
                {newStatus}
              </span>
              ?
              {newStatus === ApplicationStatus.REJECTED && (
                <p className="mt-2 text-red-300">
                  This will send a rejection email to the applicant.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (newStatus === ApplicationStatus.REJECTED) {
                  rejectApplicant();
                } else {
                  void updateApplicationStatus();
                }
                setIsStatusDialogOpen(false);
              }}
              className="bg-white text-neutral-900 hover:bg-neutral-100"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApplicantDetailsModal;
