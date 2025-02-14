'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function SubmissionConfirmation() {
  const router = useRouter();

  const handleReturn = () => {
    // Clean up any remaining state if needed
    window.localStorage.removeItem("apply-form-S2025-v1");
    router.push("/");
  };

  return (
    <div className="flex h-full w-screen items-center justify-center">
      <Card className="my-4 w-11/12 md:w-3/4 lg:w-1/2">
        <CardHeader className="text-center">
          <CardTitle>Submission Confirmation</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p>
            Thank you for applying to our Design Challenge Teams! You will receive
            an email with your responses momentarily.
          </p>

          <p>
            We will be reviewing your application shortly and scheduling interviews
            which are optimized to match your availability with ours. If you do
            not receive a response after 3 days past the posted application
            deadline, please contact us.
          </p>

          <p>
            If you want to prepare further for your potential interview, we
            recommend reading the competition&apos;s Request For Proposal (RFP) for
            the teams you applied for and brainstorming potential solutions.
          </p>

          <Button 
            onClick={handleReturn}
            className="w-full"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
