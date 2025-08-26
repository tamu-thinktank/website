"use client";

import { H3 } from "@/components/typography/H3";
import { H4 } from "@/components/typography/H4";
import { P } from "@/components/typography/P";
import { Table } from "@/components/typography/Table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { challenges, q } from "@/consts/apply-form";
import {
  eventTimezone,
  GRID_SLOTS_INTERVIEW_LEN,
} from "@/consts/availability-grid";
import { api, clientErrorHandler } from "@/lib/trpc/react";
import type { RouterOutputs } from "@/lib/trpc/shared";
import type { FileDataResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import type { Challenge } from "@prisma/client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast as sonner } from "sonner";
import { z } from "zod";
import PdfViewer from "./pdf-viewer";

/**
 * @returns Array of string Q&A pairs for each section, make sure questions and answers object share the same key names
 */
function getQAs<
  Section extends keyof typeof q,
  QKey extends keyof (typeof q)[Section],
  AKey extends keyof RouterOutputs["admin"]["getApplicant"][Section],
>(answers: RouterOutputs["admin"]["getApplicant"]) {
  const QAs = new Map<Section, [string, string][]>();

  (Object.keys(q) as Section[]).forEach((section) => {
    let currSection = QAs.get(section);
    if (!currSection) {
      QAs.set(section, []);
      currSection = QAs.get(section);
    }
    Object.keys(q[section]).forEach((qkey) => {
      if (qkey === "title") return;

      const question = q[section][qkey as QKey];
      const answer = answers[section][qkey as AKey];
      if (qkey === "challenges") {
        currSection?.push([
          question,
          (answer as Challenge[])
            .map((c) => challenges.find((ch) => ch.id === c)?.label ?? "")
            .join(", "),
        ]);
      } else if (qkey === "interestedChallenge") {
        currSection?.push([
          question,
          challenges.find((ch) => ch.id === answer)?.label ?? "",
        ]);
      } else {
        currSection?.push([question, String(answer)]);
      }
    });
  });

  return QAs;
}

export default function ApplicantPage() {
  const { toast } = useToast();
  const { data: session, status: sessionStatus } = useSession();

  // get applicant data into Q&A format

  const { applicantId } = useParams<{ applicantId: string }>();
  
  // Parallelize data fetching - start both queries simultaneously
  const {
    data: applicant,
    isError: isApplicantError,
    isLoading: isApplicantLoading,
  } = api.admin.getApplicant.useQuery(applicantId, {
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when returning to tab
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Start officer availability query in parallel if we have an interested challenge
  const { data: officerTimes } = api.admin.getAvailabilities.useQuery(
    { targetTeam: applicant?.interests?.interestedChallenge },
    {
      enabled: !!applicant?.interests?.interestedChallenge,
      staleTime: 60000, // Officer availability is less frequently updated
    }
  );

  const QAs: ReturnType<typeof getQAs> = useMemo(() => {
    if (!applicant) {
      return new Map() as ReturnType<typeof getQAs>;
    }

    return getQAs(applicant);
  }, [applicant]);

  // get resume from google drive

  const getResumeURL = new URL("/api/get-resume", window.location.origin);
  const params = new URLSearchParams({
    resumeId: applicant?.resumeId ?? "",
    userEmail: session?.user.email ?? "",
  });
  getResumeURL.search = params.toString();
  const getResume = async () => {
    const resp = await fetch(getResumeURL, {
      method: "GET",
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<FileDataResponse>;
    });

    return resp;
  };
  const {
    data: resumeFileData,
    isLoading: isResumeLoading,
    isError: isResumeError,
  } = useQuery({
    queryKey: ["get-resume", applicant?.resumeId, session?.user.email],
    queryFn: getResume,
    enabled: !!applicant && !!session,
    staleTime: 5 * 60 * 1000, // Consider resume data fresh for 5 minutes
    refetchOnMount: false, // Don't refetch resume on every mount (heavy operation)
    refetchOnWindowFocus: false, // Don't refetch resume on focus
    retry: 1, // Retry once for resume fetching
    retryDelay: 2000, // Wait 2 seconds before retry
  });

  useEffect(() => {
    if (isApplicantError || isResumeError) {
      toast({
        title: "Error",
        description: `${
          isApplicantError
            ? "Application not found, going to admin page"
            : "Resume not found"
        } `,
        duration: 3000,
      });

      if (isApplicantError) redirect("/admin");
    }
  }, [isApplicantError, isResumeError]);

  if (
    isApplicantLoading ||
    isApplicantError ||
    sessionStatus === "loading" ||
    !applicant
  ) {
    return <PageSkeleton />;
  }

  return (
    <Card className="max-h-[95%] overflow-auto">
      <CardContent>
        {applicant.status === "PENDING" ? (
          <Buttons
            applicantId={applicantId}
            applicantName={applicant.personal.fullName}
            applicantEmail={applicant.personal.email}
            meetingTimes={applicant.meetingTimes}
            resumeId={applicant.resumeId}
            interestedChallenge={applicant.interests.interestedChallenge}
            officerTimes={officerTimes}
          />
        ) : null}
        <Table
          caption={q.personal.title}
          headRow={["Questions", "Answers"]}
          rows={QAs.get("personal") ?? []}
        />

        <Card className="mb-4">
          <CardHeader>
            <H3>{q.interests.title}</H3>
            <Separator />
          </CardHeader>
          {QAs.get("interests")?.map(([question, answer]) => (
            <CardContent>
              <H4>{question}</H4>
              <P>{answer}</P>
            </CardContent>
          )) ?? null}
        </Card>
        {applicant.interests.isLeadership ? (
          <Card className="mb-4">
            <CardHeader>
              <H3>{q.leadership.title}</H3>
              <Separator />
            </CardHeader>
            {QAs.get("leadership")?.map(([question, answer]) => (
              <CardContent>
                <H4>{question}</H4>
                <P>{answer}</P>
              </CardContent>
            )) ?? null}
          </Card>
        ) : null}
        {isResumeLoading ? (
          <Skeleton className="my-6 h-[26rem] w-full" />
        ) : (
          <PdfViewer
            file={resumeFileData?.fileContent}
            fileName={resumeFileData?.fileName}
            webViewLink={resumeFileData?.fileViewLink}
          />
        )}
      </CardContent>
    </Card>
  );
}

function Buttons({
  applicantId,
  applicantName,
  applicantEmail,
  meetingTimes,
  resumeId,
  interestedChallenge,
  officerTimes,
}: {
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  meetingTimes: RouterOutputs["admin"]["getApplicant"]["meetingTimes"];
  resumeId: string;
  interestedChallenge: Challenge;
  officerTimes?: RouterOutputs["admin"]["getAvailabilities"];
}) {
  const router = useRouter();
  const apiUtils = api.useUtils();

  const soonestOfficer = useMemo(() => {
    if (!officerTimes) return;

    // find a 30 minute window in meetingTimes when an officer is available

    let overlapCount = 1;
    let soonest:
      | (NonNullable<
          ReturnType<
            RouterOutputs["admin"]["getAvailabilities"]["availabilities"]["get"]
          >
        >[number] & { startTime: string })
      | undefined;
    let currOfficerTime:
      | {
          officer: NonNullable<
            NonNullable<
              ReturnType<
                RouterOutputs["admin"]["getAvailabilities"]["availabilities"]["get"]
              >
            >[number]
          >;
          startTime: Temporal.ZonedDateTime;
        }
      | {
          officer: undefined;
          startTime: undefined;
        } = {
      officer: undefined,
      startTime: undefined,
    };
    const objTimes = meetingTimes.map((time) =>
      Temporal.ZonedDateTime.from(time),
    );
    for (const gridTime of objTimes) {
      const officersHere = officerTimes.availabilities.get(gridTime.toString());

      if (!officersHere?.[0]) {
        overlapCount = 1;
        currOfficerTime = {
          officer: undefined,
          startTime: undefined,
        };
        continue;
      }

      if (!currOfficerTime.officer) {
        currOfficerTime = {
          officer: officersHere[0],
          startTime: gridTime,
        };
        continue;
      }

      if (currOfficerTime.officer.id !== officersHere[0].id) {
        overlapCount = 1;
        currOfficerTime = {
          officer: officersHere[0],
          startTime: gridTime,
        };
        continue;
      }

      if (currOfficerTime.startTime.add({ minutes: 15 }).equals(gridTime)) {
        overlapCount++;

        if (overlapCount === GRID_SLOTS_INTERVIEW_LEN) {
          soonest = {
            ...currOfficerTime.officer,
            startTime: currOfficerTime.startTime.toString(),
          };
          break;
        }
      } else {
        overlapCount = 1;
        currOfficerTime = {
          officer: officersHere[0],
          startTime: gridTime,
        };
      }
    }

    return soonest;
  }, [meetingTimes, officerTimes?.availabilities]);

  const { mutate: updateApplicant, isPending: isUpdateLoading } =
    api.admin.updateApplicant.useMutation({
      onSuccess: (data, input) => {
        let description = `Applicant has been ${input.status}.`;
        if (input.status === "ACCEPTED") {
          if (!soonestOfficer) {
            description += " Email applicant about interview time.";
          } else {
            description += ` Scheduling interview...`;
          }
        }

        sonner.success(input.status, {
          description,
          action:
            !soonestOfficer || input.status === "REJECTED"
              ? {
                  label: "Admin",
                  onClick: () => router.push("/admin"),
                }
              : undefined,
          duration: 5000,
        });
      },
      onSettled: (newData, err) => {
        if (err) {
          clientErrorHandler({ err, sonnerFn: sonner });
        }

        // refetch
        void apiUtils.admin.getApplicant.invalidate(applicantId);
        void apiUtils.admin.getApplicants.invalidate();
      },
    });

  const { mutate: scheduleInterview } = api.admin.scheduleInterview.useMutation(
    {
      onSuccess: (data, input) => {
        sonner.success("Interview scheduled", {
          description: `${
            input.applicantName.split(" ")[0] ?? "Applicant"
          }'s interview has been scheduled with ${input.officerName}.`,
          action: {
            label: "Admin",
            onClick: () => router.push("/admin"),
          },
          duration: 5000,
        });
      },
      onSettled: (newData, err) => {
        if (err) {
          clientErrorHandler({ err, sonnerFn: sonner });
        }

        // refetch
        void apiUtils.admin.getAvailabilities.invalidate();
      },
    },
  );

  const { mutate: sendRejectEmail } = api.admin.rejectAppEmail.useMutation({
    onSuccess: (data, input) => {
      sonner.success(`Rejection email sent to ${input.applicantName}`, {
        action: {
          label: "Admin",
          onClick: () => router.push("/admin"),
        },
        duration: 5000,
      });
    },
    onSettled: (newData, err) => {
      if (err) {
        clientErrorHandler({ err, sonnerFn: sonner });
      }

      // refetch
      void apiUtils.admin.getApplicant.invalidate(applicantId);
    },
  });

  const form = useForm<{
    location: string;
  }>({
    resolver: zodResolver(
      z.object({ location: z.string().min(1, "Required") }),
    ),
  });

  const acceptApplicant = useCallback(() => {
    if (!!soonestOfficer && !form.getValues("location")) {
      sonner.error("Error", {
        description: "Enter the location of the interview",
        duration: 3000,
      });
      return;
    }

    updateApplicant({
      applicantId,
      status: "ACCEPTED",
      resumeId: resumeId,
      location: form.getValues("location"),
    });

    if (soonestOfficer) {
      scheduleInterview({
        officerId: soonestOfficer.id,
        officerName: soonestOfficer.name,
        officerEmail: soonestOfficer.email,
        applicantName,
        applicantEmail,
        startTime: soonestOfficer.startTime,
        location: form.getValues("location"),
      });
    }
  }, [applicantId, soonestOfficer, form]);

  const rejectApplicant = useCallback(() => {
    updateApplicant({
      applicantId,
      status: "REJECTED",
      resumeId: resumeId,
    });

    sendRejectEmail({
      applicantName,
      applicantEmail,
    });
  }, [applicantId]);

  return (
    <div className="mt-4 flex gap-4">
      <LocationInput form={form} isMeetingTimeAvailable={!!soonestOfficer} />
      <TooltipProvider>
        <Tooltip open={!soonestOfficer || !form.formState.isValid}>
          <TooltipTrigger asChild>
            <Button
              onClick={acceptApplicant}
              disabled={
                isUpdateLoading || (!!soonestOfficer && !form.formState.isValid)
              }
              className="w-20"
            >
              {isUpdateLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Accept"
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {soonestOfficer
                ? !form.formState.isValid
                  ? `Enter location of the interview at ${Temporal.ZonedDateTime.from(
                      soonestOfficer.startTime,
                    )
                      .withTimeZone(eventTimezone)
                      .toLocaleString("en-US")}`
                  : null
                : "No meeting time available"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant={"destructive"}
        onClick={rejectApplicant}
        disabled={isUpdateLoading}
        className="w-20"
      >
        {isUpdateLoading ? <Loader2 className="animate-spin" /> : "Reject"}
      </Button>
    </div>
  );
}

function LocationInput({
  form,
  isMeetingTimeAvailable,
}: {
  form: UseFormReturn<{
    location: string;
  }>;
  isMeetingTimeAvailable: boolean;
}) {
  return (
    <Form {...form}>
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="location"
                  type="text"
                  placeholder="Interview location"
                  {...field}
                  disabled={!isMeetingTimeAvailable}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function PageSkeleton() {
  return (
    <Card className="h-[95%] overflow-hidden">
      <CardContent>
        <div className="mt-4 flex gap-4">
          <Skeleton className="h-10 w-1/12" />
          <Skeleton className="h-10 w-1/12" />
        </div>
        <Skeleton className="my-6 h-[26rem] w-full" />
        <Skeleton className="my-6 h-[26rem] w-full" />
      </CardContent>
    </Card>
  );
}
