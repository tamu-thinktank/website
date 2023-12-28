import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FormIntro() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ThinkTank Membership Application Form</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        There are 5 sections with a resume upload at the end. Make sure you have
        your resume downloaded on your current device before proceeding. Please
        note: Applications with missing or incomplete responses will be
        automatically rejected. We encourage you to take your time and
        thoroughly fill out the application. Our club's mission is to provide
        experience and opportunities to all engineering students, regardless of
        their past experiences. Please keep this in mind as you complete your
        application. TAMU ThinkTank (TTT) reserves the right to vary the
        evaluation criteria from semester to semester based on the number of
        applicants, available teams, competition requirements, and other
        relevant factors.
      </CardContent>
    </Card>
  );
}
