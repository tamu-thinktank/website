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
import { api } from "@/lib/trpc/react";
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
  const _router = useRouter();
  const { data: _session } = useSession();

  // Add the sendRejectEmail function using tRPC mutation
  const { mutate: sendRejectEmail } = api.admin.rejectAppEmail.useMutation({
    onSuccess: (data, input) => {
      toast({
        title: "Success",
        description: `Rejection email sent to ${input.applicantName}`,
      });
    },
    onError: (err) => {
      console.error("Error sending rejection email:", err);
      toast({
        title: "Error",
        description: "Failed to send rejection email. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add the scheduleInterviewEmail mutation
  const { mutate: sendInterviewEmail } =
    api.admin.scheduleInterview.useMutation({
      onSuccess: (data, input) => {
        toast({
          title: "Success",
          description: `Interview email sent to ${input.applicantName}`,
        });
      },
      onError: (err) => {
        console.error("Error sending interview email:", err);
        toast({
          title: "Error",
          description: "Failed to send interview email. Please try again.",
          variant: "destructive",
        });
      },
    });

  // Fetch applicant details when the modal opens and applicantId changes
  useEffect(() => {
    if (isOpen && applicantId) {
      void fetchApplicantDetails(applicantId);
      void fetchInterviewNotes(applicantId);
      void seedAndFetchInterviewers();
    } else {
      // Reset state when modal closes
      setApplicant(null);
      setInterviewNotes([]);
      setNewNote("");
      setIsLocked(false);
      setSelectedInterviewer("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setInterviewRoom("");
      setAssignedTeam("");
    }
  }, [isOpen, applicantId]);

  // Add useEffect to initialize assignedTeam when applicant data is loaded
  useEffect(() => {
    if (applicant) {
      setAssignedTeam(applicant.assignedTeam ?? "NONE");
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
      setAssignedTeam(data.assignedTeam ?? "NONE");
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

  const seedAndFetchInterviewers = async () => {
    try {
      // First seed the mock interviewers if they don't exist
      await fetch("/api/seed-interviewers");

      // Then fetch all interviewers
      const response = await fetch("/api/interviewers");

      if (!response.ok) {
        throw new Error(`Failed to fetch interviewers: ${response.status}`);
      }

      const data = (await response.json()) as { id: string; name: string }[];
      setInterviewers(data);
    } catch (err) {
      console.error("Error seeding and fetching interviewers:", err);
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
        // Send rejection email using the mutation
        sendRejectEmail({
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
    const hours = Number.parseInt(hoursStr, 10) || 0; // Default to 0 if parsing fails
    const minutes = Number.parseInt(minutesStr, 10) || 0; // Default to 0 if parsing fails

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
      const data = await response.json();
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

      // Send interview email using the tRPC mutation - similar to how rejection email is sent
      sendInterviewEmail({
        officerId: interviewer.id,
        officerName: interviewer.name,
        officerEmail: `${interviewer.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        applicantName: applicant.fullName,
        applicantEmail: applicant.email,
        startTime: interviewDateTime,
        location: interviewRoom,
        team: assignedTeam === "NONE" ? "" : assignedTeam,
        applicationType: applicant.applicationType ?? "General",
      });

      toast({
        title: "Success",
        description: `Interview scheduled successfully for ${formattedTime} and email sent`,
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

  // Toggle lock and schedule interview if locking

  // Add function to update assigned team
  const updateAssignedTeam = async () => {
    if (!applicantId) return;

    try {
      const response = await fetch(`/api/applicant/${applicantId}/team`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedTeam: assignedTeam === "NONE" ? null : assignedTeam,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update team assignment: ${response.status}`);
      }

      // Update the local state
      setApplicant((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          assignedTeam: assignedTeam === "NONE" ? undefined : assignedTeam,
        };
      });

      toast({
        title: "Success",
        description:
          assignedTeam !== "NONE"
            ? `Applicant transferred to ${assignedTeam}`
            : "Team assignment removed",
      });
    } catch (err) {
      console.error("Error updating team assignment:", err);
      toast({
        title: "Error",
        description: `Failed to update team assignment: ${err instanceof Error ? err.message : "Unknown error"}`,
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
        status: ApplicationStatus.REJECTED,
      }),
    })
      .then((response) => {
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

        // Send rejection email using the tRPC mutation
        sendRejectEmail({
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
  }, [applicantId, applicant, sendRejectEmail, toast]);

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-neutral-700 bg-neutral-900 text-white">
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
            <div className="space-y-6">
              {/* Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-neutral-800 p-5">
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

                {applicant.summerPlans && (
                  <div className="mt-4">
                    <Label className="text-neutral-400">Summer Plans</Label>
                    <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                      {applicant.summerPlans}
                    </div>
                  </div>
                )}

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
                        Which previous team were you a member of and what did
                        you specifically contribute?
                      </Label>
                      <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                        {applicant.secondQuestion}
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-400">
                        Why do you want to become a ThinkTank Officer?
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
                        {Array.from({ length: 24 }).map((_, hour) => (
                          <React.Fragment key={hour}>
                            <SelectItem value={`${hour}:00`}>
                              {hour === 0
                                ? "12:00 AM"
                                : hour < 12
                                  ? `${hour}:00 AM`
                                  : hour === 12
                                    ? "12:00 PM"
                                    : `${hour - 12}:00 PM`}
                            </SelectItem>
                            <SelectItem value={`${hour}:30`}>
                              {hour === 0
                                ? "12:30 AM"
                                : hour < 12
                                  ? `${hour}:30 AM`
                                  : hour === 12
                                    ? "12:30 PM"
                                    : `${hour - 12}:30 PM`}
                            </SelectItem>
                          </React.Fragment>
                        ))}
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
                  <Button
                    onClick={() => void scheduleInterview()}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !selectedInterviewer ||
                      !selectedDate ||
                      !selectedTime ||
                      !interviewRoom ||
                      isSendingEmail
                    }
                  >
                    {isSendingEmail
                      ? "Scheduling..."
                      : "Schedule Interview & Send Email"}
                  </Button>

                  <Button
                    onClick={() =>
                      handleStatusChange(ApplicationStatus.REJECTED)
                    }
                    className="bg-red-600 hover:bg-red-700"
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
                    <Label>Assign Team</Label>
                    <Select
                      value={assignedTeam}
                      onValueChange={setAssignedTeam}
                    >
                      <SelectTrigger className="w-full border-neutral-700 bg-neutral-900">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="border-neutral-700 bg-neutral-900">
                        <SelectItem value="NONE">None</SelectItem>
                        <SelectItem value="INTERVIEWING">
                          Interviewing
                        </SelectItem>

                        {applicant.applicationType === "OFFICER" ? (
                          <>
                            <SelectItem value="PROJECT_MANAGER">
                              PROJECT MANAGER
                            </SelectItem>
                            <SelectItem value="MARKETING_SPECIALIST">
                              MARKETING SPECIALIST
                            </SelectItem>
                            <SelectItem value="GRAPHIC_DESIGNER">
                              GRAPHIC DESIGNER
                            </SelectItem>
                            <SelectItem value="WEB_DEV_LEAD">
                              WEB DEV LEAD
                            </SelectItem>
                            <SelectItem value="TREASURER">TREASURER</SelectItem>
                            <SelectItem value="DC_PROGRAM_MANAGER">
                              DC PROGRAM MANAGER
                            </SelectItem>
                          </>
                        ) : applicant.applicationType === "MATEROV" ? (
                          <>
                            <SelectItem value="COMPUTATION_COMMUNICATIONS">
                              Computation and Communications
                            </SelectItem>
                            <SelectItem value="ELECTRICAL_POWER">
                              Electrical and Power Systems
                            </SelectItem>
                            <SelectItem value="FLUIDS_PROPULSION">
                              Fluids and Propulsion
                            </SelectItem>
                            <SelectItem value="GNC">
                              Guidance, Navigation, and Control
                            </SelectItem>
                            <SelectItem value="THERMAL_MECHANISMS">
                              Thermal, Mechanisms, and Structures
                            </SelectItem>
                            <SelectItem value="MATEROV_LEADERSHIP">
                              MATE ROV Leadership
                            </SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="TEAM1">Team 1</SelectItem>
                            <SelectItem value="TEAM2">Team 2</SelectItem>
                            <SelectItem value="TEAM3">Team 3</SelectItem>
                            <SelectItem value="TEAM4">Team 4</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => void updateAssignedTeam()}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={
                      assignedTeam === (applicant.assignedTeam ?? "NONE")
                    }
                  >
                    Transfer to Team
                  </Button>
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
                      onClick={() => void saveInterviewNote()}
                      className="bg-stone-600 hover:bg-stone-700"
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
              className={`text-white ${
                newStatus === ApplicationStatus.ACCEPTED
                  ? "bg-green-600 hover:bg-green-700"
                  : newStatus === ApplicationStatus.REJECTED
                    ? "bg-red-600 hover:bg-red-700"
                    : newStatus === ApplicationStatus.INTERVIEWING
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-orange-600 hover:bg-orange-700"
              }`}
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
