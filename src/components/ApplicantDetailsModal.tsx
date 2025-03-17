"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  // Add other fields as needed
}

interface InterviewNote {
  id: string;
  applicantId: string;
  interviewerId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  interviewer?: {
    name: string;
  };
}

const statusColors = {
  PENDING: "text-orange-400",
  INTERVIEWING: "text-blue-400",
  ACCEPTED: "text-green-400",
  REJECTED: "text-red-400",
};

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  isOpen,
  onClose,
  applicantId,
}) => {
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
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewRoom, setInterviewRoom] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Fetch applicant details when the modal opens and applicantId changes
  useEffect(() => {
    if (isOpen && applicantId) {
      void fetchApplicantDetails(applicantId);
      void fetchInterviewNotes(applicantId);
      void fetchInterviewers();
    } else {
      // Reset state when modal closes
      setApplicant(null);
      setInterviewNotes([]);
      setNewNote("");
      setIsLocked(false);
      setSelectedInterviewer("");
      setInterviewTime("");
      setInterviewRoom("");
    }
  }, [isOpen, applicantId]);

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
      const response = await fetch("/api/interviewers");

      if (!response.ok) {
        throw new Error(`Failed to fetch interviewers: ${response.status}`);
      }

      const data = (await response.json()) as { id: string; name: string }[];
      setInterviewers(data);
    } catch (err) {
      console.error("Error fetching interviewers:", err);
      toast({
        title: "Error",
        description: `Failed to load interviewers: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const saveInterviewNote = async () => {
    if (!applicantId || !newNote.trim()) return;

    try {
      // Get the current user's ID (you'll need to implement this based on your auth system)
      // For now, we'll use a default ID
      const currentUserId = "default-interviewer-id"; // Replace with actual user ID from your auth system

      const response = await fetch("/api/interview-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicantId,
          content: newNote,
          interviewerId: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save interview note: ${response.status}`);
      }

      const savedNote = (await response.json()) as InterviewNote;
      setInterviewNotes([savedNote, ...interviewNotes]);
      setNewNote("");

      toast({
        title: "Success",
        description: "Interview note saved successfully",
      });
    } catch (err) {
      console.error("Error saving interview note:", err);
      toast({
        title: "Error",
        description: `Failed to save interview note: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Replace the sendEmail function with this implementation that uses your existing tRPC setup
  const sendEmail = async (type: "reject" | "accept" | "interview") => {
    if (!applicant) return;

    setIsSendingEmail(true);
    try {
      if (type === "reject") {
        // Use your existing tRPC mutation for rejection emails
        await fetch("/api/trpc/admin.rejectAppEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            json: {
              applicantName: applicant.fullName,
              applicantEmail: applicant.email,
            },
          }),
        });
      } else if (type === "interview") {
        if (!selectedInterviewer || !interviewTime || !interviewRoom) {
          throw new Error("Missing interview details");
        }

        const interviewer = interviewers.find(
          (i) => i.id === selectedInterviewer,
        );
        if (!interviewer) {
          throw new Error("Selected interviewer not found");
        }

        // Use your existing tRPC mutation for scheduling interviews
        await fetch("/api/trpc/admin.scheduleInterview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            json: {
              officerId: interviewer.id,
              officerName: interviewer.name,
              officerEmail: "officer@example.com", // You'll need to get this from your user data
              applicantName: applicant.fullName,
              applicantEmail: applicant.email,
              startTime: interviewTime,
              location: interviewRoom,
            },
          }),
        });
      } else if (type === "accept") {
        // For accept emails, you might need to add a new tRPC mutation similar to rejectAppEmail
        // For now, we'll use the reject email endpoint with a note that this should be replaced
        await fetch("/api/trpc/admin.rejectAppEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            json: {
              applicantName: applicant.fullName,
              applicantEmail: applicant.email,
            },
          }),
        });

        console.warn(
          "Using reject email endpoint for accept emails - consider adding a dedicated accept email endpoint",
        );
      }

      toast({
        title: "Email Sent",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} email sent to ${applicant.email}`,
      });
    } catch (err) {
      console.error(`Error sending ${type} email:`, err);
      toast({
        title: "Error",
        description: `Failed to send ${type} email: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Update the updateApplicationStatus function to call the appropriate email function
  const updateApplicationStatus = async () => {
    if (!applicantId || !newStatus) return;

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

      // Update the local state
      if (applicant) {
        setApplicant({
          ...applicant,
          status: newStatus,
        });
      }

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}`,
      });

      // Send appropriate email based on status
      if (newStatus === ApplicationStatus.REJECTED) {
        void sendEmail("reject");
      } else if (newStatus === ApplicationStatus.ACCEPTED) {
        void sendEmail("accept");
      }
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
    }
  };

  // Update the scheduleInterview function to use the sendEmail function
  const scheduleInterview = async () => {
    if (
      !applicantId ||
      !selectedInterviewer ||
      !interviewTime ||
      !interviewRoom
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all interview details",
        variant: "destructive",
      });
      return;
    }

    try {
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

      toast({
        title: "Success",
        description: "Interview scheduled successfully",
      });

      // Update status to INTERVIEWING if not already
      if (applicant && applicant.status !== "INTERVIEWING") {
        setNewStatus("INTERVIEWING");
        await updateApplicationStatus();
      }

      // Send interview email
      void sendEmail("interview");
    } catch (err) {
      console.error("Error scheduling interview:", err);
      toast({
        title: "Error",
        description: `Failed to schedule interview: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

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
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-neutral-800 p-4">
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
                      Can Add Class Workload
                    </Label>
                    <div>{applicant.weeklyCommitment ? "Yes" : "No"}</div>
                  </div>
                </div>
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
                    <div className="mt-1 whitespace-pre-wrap rounded bg-neutral-900 p-3">
                      {/* This would need to be mapped from the actual data structure */}
                      Data not available in this view
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
                    <div className="mt-1">
                      {/* This would need to be mapped from the actual data structure */}
                      Data not available in this view
                    </div>
                  </div>
                </div>
              </div>

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
                    onClick={() => void scheduleInterview()}
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
                    onClick={() =>
                      handleStatusChange(ApplicationStatus.ACCEPTED)
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
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
                        <div className="mb-2 text-sm text-neutral-400">
                          {format(
                            new Date(note.createdAt),
                            "MMM d, yyyy h:mm a",
                          )}
                          {note.interviewer && ` - ${note.interviewer.name}`}
                        </div>
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
              {newStatus === ApplicationStatus.ACCEPTED && (
                <p className="mt-2 text-green-300">
                  This will send an acceptance email to the applicant.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void updateApplicationStatus()}
              className={`text-white ${
                newStatus === "ACCEPTED"
                  ? "bg-green-600 hover:bg-green-700"
                  : newStatus === "REJECTED"
                    ? "bg-red-600 hover:bg-red-700"
                    : newStatus === "INTERVIEWING"
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
