"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/trpc/react";
import { redirect, useParams } from "next/navigation";

export default function ApplicantPage() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();

  const { data: applicant, isError } = api.admin.getApplicant.useQuery(userId);

  if (isError) {
    toast({
      title: "Error",
      description: "Application not found, going to admin page",
      duration: 3000,
    });

    return redirect("/admin");
  }

  return applicant ? (
    <Card className="h-[95%] overflow-auto">
      <CardHeader>
        <CardTitle>{JSON.stringify(applicant, null, 2)}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  ) : (
    <PageSkeleton />
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
