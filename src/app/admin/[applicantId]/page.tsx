"use client";

import { H3 } from "@/components/typography/H3";
import { H4 } from "@/components/typography/H4";
import { P } from "@/components/typography/P";
import { Table } from "@/components/typography/Table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { q } from "@/consts/apply-questions";
import { api } from "@/lib/trpc/react";
import type { RouterOutputs } from "@/lib/trpc/shared";
import { clientErrorHandler } from "@/lib/utils";
import { Temporal } from "@js-temporal/polyfill";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import PdfViewer from "./pdf-viewer";

/**
 * @returns Array of string Q&A pairs for each section, make sure questions and answers object share the same key names
 */
function getQAs<
  Section extends keyof typeof q,
  QKey extends keyof (typeof q)[Section],
  AKey extends keyof RouterOutputs["admin"]["getApplicant"][Section],
>(answers: RouterOutputs["admin"]["getApplicant"]) {
  const QAs = new Map<Section, [(typeof q)[Section][QKey], string][]>();

  Object.keys(q).forEach((section) => {
    let currSection = QAs.get(section as Section);
    if (!currSection) {
      QAs.set(section as Section, []);
      currSection = QAs.get(section as Section);
    }
    Object.keys(q[section as Section]).forEach((qkey) => {
      if (qkey === "title") return;

      currSection?.push([
        q[section as Section][qkey as QKey],
        String(answers[section as Section][qkey as AKey]),
      ]);
    });
  });

  return QAs;
}

export default function ApplicantPage() {
  const { toast } = useToast();
  const { applicantId } = useParams<{ applicantId: string }>();
  const {
    data: applicant,
    isError,
    isLoading,
  } = api.admin.getApplicant.useQuery(applicantId, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
  });

  const QAs: ReturnType<typeof getQAs> = useMemo(() => {
    if (!applicant) {
      return new Map() as ReturnType<typeof getQAs>;
    }

    return getQAs(applicant);
  }, [applicant]);

  if (isLoading) {
    return <PageSkeleton />;
  }
  if (isError) {
    toast({
      title: "Error",
      description: "Application not found, going to admin page",
      duration: 3000,
    });

    return redirect("/admin");
  }

  return (
    <Card className="max-h-[95%] overflow-auto">
      <CardContent>
        <Buttons
          applicantId={applicantId}
          applicantName={applicant.personal.fullName}
          applicantEmail={applicant.personal.email}
          meetingTimes={applicant.meetingTimes}
        />
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
        <PdfViewer resumeLink={"/resume.pdf"} />
      </CardContent>
    </Card>
  );
}

function Buttons({
  applicantId,
  applicantName,
  applicantEmail,
  meetingTimes,
}: {
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  meetingTimes: RouterOutputs["admin"]["getApplicant"]["meetingTimes"];
}) {
  const { toast } = useToast();
  const apiUtils = api.useUtils();
  const { data: officerTimes } = api.admin.getAvailabilities.useQuery();

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

        if (overlapCount === 2) {
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

  const { mutate: updateApplicant } = api.admin.updateApplicant.useMutation({
    onSuccess: (data, input) => {
      let description = `Applicant has been ${input.status}.`;
      if (input.status === "ACCEPTED") {
        if (!soonestOfficer) {
          description += " Email applicant about interview time.";
        } else {
          description += ` Scheduling interview...`;
        }
      }

      toast({
        title: input.status,
        description,
        action: (
          <Button variant={"outline"} size={"sm"}>
            <Link
              href={"/admin"}
              className="flex items-center justify-center gap-2"
            >
              Admin <ArrowUpRight />
            </Link>
          </Button>
        ),
        duration: 5000,
      });
    },
    onSettled: async (newData, err) => {
      if (err) {
        clientErrorHandler(err, toast);
      }

      // refetch
      void apiUtils.admin.getApplicant.invalidate(applicantId);
      void apiUtils.admin.getApplicants.invalidate();
    },
  });

  const { mutate: scheduleInterview } = api.admin.scheduleInterview.useMutation(
    {
      onSuccess: (data, input) => {
        toast({
          title: "Interview scheduled",
          description: `Interview has been scheduled for ${input.officerName}.`,
          action: (
            <Button variant={"outline"} size={"sm"}>
              <Link
                href={"/admin"}
                className="flex items-center justify-center gap-2"
              >
                Admin <ArrowUpRight />
              </Link>
            </Button>
          ),
          duration: 5000,
        });
      },
      onSettled: async (newData, err) => {
        if (err) {
          clientErrorHandler(err, toast);
        }

        // refetch
        void apiUtils.admin.getAvailabilities.invalidate();
      },
    },
  );

  const acceptApplicant = useCallback(() => {
    updateApplicant({
      id: applicantId,
      status: "ACCEPTED",
    });

    if (soonestOfficer) {
      scheduleInterview({
        officerId: soonestOfficer.id,
        officerName: soonestOfficer.name,
        officerEmail: soonestOfficer.email,
        applicantName,
        applicantEmail,
        startTime: soonestOfficer.startTime,
      });
    }
  }, [soonestOfficer]);

  const rejectApplicant = useCallback(() => {
    updateApplicant({
      id: applicantId,
      status: "REJECTED",
    });
  }, []);

  return (
    <div className="mt-4 flex gap-4">
      <TooltipProvider>
        <Tooltip open={!soonestOfficer}>
          <TooltipTrigger asChild>
            <Button onClick={acceptApplicant}>Accept</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{!soonestOfficer ? "No meeting time available" : null}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button variant={"destructive"} onClick={rejectApplicant}>
        Reject
      </Button>
    </div>
  );
}

function PageSkeleton() {
  return <Card className="h-[95%] overflow-auto"></Card>;
}
