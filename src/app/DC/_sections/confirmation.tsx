'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function SubmissionConfirmation() {
  const router = useRouter();

  const handleReturn = () => {
    // Clean up any remaining state
    window.localStorage.removeItem("officer-form-S2025-v1");
    router.replace("/");
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
            Thank you for applying to our Mini Design Challenge Competition! You will receive an email with your responses momentarily.
          </p>

          <p>
            We will be reviewing your application shortly and start sending acceptances in 1-2 weeks. If you do not receive a response after 3 days past the posted application deadline, please contact us.
          </p>



          <Button
            onClick={handleReturn}
            className="w-auto bg-white text-black hover:bg-white hover:text-black"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
