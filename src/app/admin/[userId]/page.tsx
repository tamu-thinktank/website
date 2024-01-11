"use client";

import { H3 } from "@/components/typography/H3";
import { H4 } from "@/components/typography/H4";
import { P } from "@/components/typography/P";
import { Table } from "@/components/typography/Table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { q } from "@/consts/apply-questions";
import { api } from "@/lib/trpc/react";
import type { RouterOutputs } from "@/lib/trpc/shared";
import { redirect, useParams } from "next/navigation";
import { useMemo } from "react";
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
  const { userId } = useParams<{ userId: string }>();
  const {
    data: applicant,
    isError,
    isLoading,
  } = api.admin.getApplicant.useQuery(userId, {
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
        <div className="mt-4 flex gap-4">
          <Button>Accept</Button>
          <Button variant={"destructive"}>Reject</Button>
        </div>
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

function PageSkeleton() {
  return (
    <Card className="h-[95%] overflow-auto">
      <CardHeader>
        <CardTitle>
          <Skeleton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </CardContent>
    </Card>
  );
}
