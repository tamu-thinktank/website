"use client";

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
import { Lock, Unlock } from "lucide-react";
import { ApplicationStatus } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc/react";

// Define application types
export enum ApplicationType {
  OFFICER = "OFFICER",
  MATEROV = "MATEROV",
  GENERAL = "GENERAL",
}

interface ApplicantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string | null;
}

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
  applicationType?: ApplicationType;
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
}

interface InterviewNote {
  id: string;
  applicantId: string;
  content: string;
}

const statusColors = {
  PENDING: "text-orange-400",
  INTERVIEWING: "text-blue-400",
  ACCEPTED: "text-green-400",
  REJECTED: "text-red-400",
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
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);
  const [interviewers, setInterviewers] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewRoom, setInterviewRoom] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [assignedTeam, setAssignedTeam] = useState("");
  const [applicationType, setApplicationType] = useState<ApplicationType>(
    ApplicationType.GENERAL,
  );
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
      setInterviewTime("");
      setInterviewRoom("");
      setAssignedTeam("");
      setApplicationType(ApplicationType.GENERAL);
    }
  }, [isOpen, applicantId]);

  // Add useEffect to initialize assignedTeam and applicationType when applicant data is loaded
  useEffect(() => {
    if (applicant) {
      setAssignedTeam(applicant.assignedTeam ?? "NONE");
      setApplicationType(applicant.applicationType ?? ApplicationType.GENERAL);
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
      setApplicationType(data.applicationType ?? ApplicationType.GENERAL);
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
      if (newStatus === ApplicationStatus.REJECTED) {
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

  // Update the scheduleInterview function to use the tRPC endpoint and show confirmation dialog
  const confirmScheduleInterview = () => {
    if (
      !applicantId ||
      !selectedInterviewer ||
      !interviewTime ||
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

    setIsInterviewDialogOpen(true);
  };

  // Function to actually schedule the interview after confirmation
  const scheduleInterview = async () => {
    if (
      !applicantId ||
      !selectedInterviewer ||
      !interviewTime ||
      !interviewRoom ||
      !applicant
    ) {
      return;
    }

    try {
      setIsSendingEmail(true);

      // First create the interview record
      const response = await fetch("/api/schedule-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicantId,
          interviewerId: selectedInterviewer,
          time: interviewTime,
          location: interviewRoom,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to schedule interview: ${response.status}`);
      }

      // Get the interviewer details
      const interviewer = interviewers.find(
        (i) => i.id === selectedInterviewer,
      );
      if (!interviewer) {
        throw new Error("Selected interviewer not found");
      }

      // Generate the interviewer email (in a real app, this would come from the database)
      const officerEmail = `${interviewer.name.toLowerCase().replace(/\s+/g, ".")}@example.com`;

      // Send the interview email using a direct fetch to the tRPC endpoint
      const emailResponse = await fetch("/api/trpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "admin.scheduleInterview",
          input: {
            officerId: interviewer.id,
            officerName: interviewer.name,
            officerEmail: officerEmail,
            applicantName: applicant.fullName,
            applicantEmail: applicant.email,
            startTime: interviewTime,
            location: interviewRoom,
            team: assignedTeam === "NONE" ? undefined : assignedTeam,
            applicationType: applicationType,
          },
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(
          `Failed to send interview email: ${emailResponse.status}`,
        );
      }

      // Update the applicant status to INTERVIEWING
      await fetch(`/api/applicant/${applicantId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: ApplicationStatus.INTERVIEWING,
        }),
      });

      // Update the applicant type and team if needed
      await fetch(`/api/applicant/${applicantId}/application-info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationType: applicationType,
          assignedTeam: assignedTeam === "NONE" ? null : assignedTeam,
        }),
      });

      console.log("Interview email sent to:", applicant.email);

      toast({
        title: "Success",
        description: `Interview scheduled with ${interviewer.name} and email sent to ${applicant.fullName}`,
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
      setIsInterviewDialogOpen(false);
    }
  };

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
      if (applicant) {
        setApplicant({
          ...applicant,
          assignedTeam: assignedTeam === "NONE" ? undefined : assignedTeam,
        });
      }

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

  // Add function to update application type
  const updateApplicationType = async (type: ApplicationType) => {
    setApplicationType(type);

    // Reset assigned team when application type changes
    if (assignedTeam !== "NONE" && assignedTeam !== "INTERVIEWING") {
      setAssignedTeam("NONE");
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

  // Function to update applicant status
  const updateApplicantStatus = async () => {
    if (!applicantId || !newStatus || !applicant) return false;

    try {
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

      // Update local state if applicant exists
      if (applicant) {
        setApplicant({
          ...applicant,
          status: newStatus,
        });
      }

      return true;
    } catch (error) {
      console.error("Error updating applicant status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update the rejectApplicant function to properly handle the rejection flow
  const rejectApplicant = useCallback(() => {
    if (!applicantId || !applicant) return;

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
            status: ApplicationStatus.REJECTED,
          };
        });

        // Send rejection email using a direct fetch to the tRPC endpoint
        fetch("/api/trpc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "admin.rejectAppEmail",
            input: {
              applicantName: applicant.fullName,
              applicantEmail: applicant.email,
            },
          }),
        })
          .then((emailResponse) => {
            if (!emailResponse.ok) {
              throw new Error(
                `Failed to send rejection email: ${emailResponse.status}`,
              );
            }

            toast({
              title: "Success",
              description: `Application status updated to REJECTED and rejection email sent`,
            });
          })
          .catch((emailErr) => {
            console.error("Error sending rejection email:", emailErr);
            toast({
              title: "Warning",
              description: `Application status updated but failed to send rejection email: ${emailErr instanceof Error ? emailErr.message : "Unknown error"}`,
              variant: "destructive",
            });
          });
      })
      .catch((err) => {
        console.error("Error updating application status:", err);
        toast({
          title: "Error",
          description: `Failed to update application status: ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      });
  }, [applicantId, applicant, toast]);

  // Function to get team options based on application type
  const getTeamOptions = () => {
    const commonOptions = [
      { value: "NONE", label: "None" },
      { value: "INTERVIEWING", label: "Interviewing" },
    ];

    if (applicationType === ApplicationType.OFFICER) {
      return [
        ...commonOptions,
        { value: "PRESIDENT", label: "President" },
        { value: "VICE_PRESIDENT", label: "Vice President" },
        { value: "SECRETARY", label: "Secretary" },
        { value: "TREASURER", label: "Treasurer" },
        { value: "OUTREACH", label: "Outreach" },
      ];
    } else if (applicationType === ApplicationType.MATEROV) {
      return [
        ...commonOptions,
        { value: "MATEROV_TEAM1", label: "MateROV Team 1" },
        { value: "MATEROV_TEAM2", label: "MateROV Team 2" },
        { value: "MATEROV_TEAM3", label: "MateROV Team 3" },
        { value: "MATEROV_TEAM4", label: "MateROV Team 4" },
        { value: "MATEROV_TEAM5", label: "MateROV Team 5" },
        { value: "MATEROV_TEAM6", label: "MateROV Team 6" },
      ];
    } else {
      // Default/General teams
      return [
        ...commonOptions,
        { value: "TEAM1", label: "Team 1" },
        { value: "TEAM2", label: "Team 2" },
        { value: "TEAM3", label: "Team 3" },
        { value: "TEAM4", label: "Team 4" },
      ];
    }
  };

  const updateApplicant = api.admin.updateApplicant.useMutation();

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-neutral-700 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {loading
                ? "Loading Applicant Details..."
                : applicant?.fullName || "Applicant Details"}
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

                <div className="space-y-1">
                  <div className="text-sm text-neutral-400">
                    Application Type
                  </div>
                  <div>{applicant.applicationType || "GENERAL"}</div>
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
                    {applicant.currentClasses &&
                    applicant.currentClasses.length > 0 ? (
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
                    {applicant.nextClasses &&
                    applicant.nextClasses.length > 0 ? (
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

              {/* Interests and Motivation Section */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">
                  Interests and Motivation
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
                      Which Design Challenges are you interested in?
                    </Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {applicant.preferredTeams &&
                      applicant.preferredTeams.length > 0 ? (
                        applicant.preferredTeams.map((teamPref, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-neutral-700 px-2 py-1 text-xs"
                          >
                            {teamPref.team?.name || teamPref.teamId} (
                            {teamPref.interest})
                          </span>
                        ))
                      ) : (
                        <div className="text-neutral-500">
                          No team preferences listed
                        </div>
                      )}
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

                  <div>
                    <Label className="text-neutral-400">
                      Are you interested in a Team Lead position?
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
                          No leadership preferences listed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Controls */}
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <h3 className="text-lg font-semibold">Interview Controls</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Application Type</Label>
                    <Select
                      value={applicationType}
                      onValueChange={(value) =>
                        updateApplicationType(value as ApplicationType)
                      }
                    >
                      <SelectTrigger className="w-full border-neutral-700 bg-neutral-900">
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                      <SelectContent className="border-neutral-700 bg-neutral-900">
                        <SelectItem value={ApplicationType.GENERAL}>
                          General
                        </SelectItem>
                        <SelectItem value={ApplicationType.OFFICER}>
                          Officer
                        </SelectItem>
                        <SelectItem value={ApplicationType.MATEROV}>
                          MateROV
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                        {getTeamOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                    <Label>Interview Time</Label>
                    <input
                      type="datetime-local"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
                      disabled={isLocked}
                    />
                  </div>

                  <div className="relative space-y-2">
                    <Label>Room</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Room"
                        value={interviewRoom}
                        onChange={(e) => setInterviewRoom(e.target.value)}
                        className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
                        onClick={() => setIsLocked(!isLocked)}
                        title={
                          isLocked
                            ? "Unlock time and interviewer fields"
                            : "Lock time and interviewer fields"
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
                    onClick={confirmScheduleInterview}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !selectedInterviewer ||
                      !interviewTime ||
                      !interviewRoom ||
                      isSendingEmail
                    }
                  >
                    {isSendingEmail ? "Scheduling..." : "Schedule Interview"}
                  </Button>

                  <Button
                    onClick={() =>
                      handleStatusChange(ApplicationStatus.REJECTED)
                    }
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>

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

      {/* Confirmation Dialog for Interview Scheduling */}
      <AlertDialog
        open={isInterviewDialogOpen}
        onOpenChange={setIsInterviewDialogOpen}
      >
        <AlertDialogContent className="border-neutral-700 bg-neutral-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Interview Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to schedule an interview with the following
              details?
              <div className="mt-2 space-y-1 rounded-md bg-neutral-800 p-3 text-white">
                <p>
                  <strong>Applicant:</strong> {applicant?.fullName}
                </p>
                <p>
                  <strong>Application Type:</strong> {applicationType}
                </p>
                <p>
                  <strong>Team:</strong>{" "}
                  {assignedTeam === "NONE" ? "Not Assigned" : assignedTeam}
                </p>
                <p>
                  <strong>Interviewer:</strong>{" "}
                  {interviewers.find((i) => i.id === selectedInterviewer)?.name}
                </p>
                <p>
                  <strong>Time:</strong> {interviewTime}
                </p>
                <p>
                  <strong>Location:</strong> {interviewRoom}
                </p>
              </div>
              <p className="mt-2 text-blue-300">
                This will send an interview invitation email to the applicant.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void scheduleInterview()}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Schedule Interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApplicantDetailsModal;
