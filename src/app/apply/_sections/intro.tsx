import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormIntroTab() {
  return (
    <TabsContent className="space-y-2" value="id">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>ThinkTank Membership Application Form</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          Our club's mission is to provide experience and opportunities to all
          engineering students, regardless of their past experiences. Please
          keep this in mind as you complete your application. <br /> <br />
          There are 5 sections with a resume upload at the end. Make sure you
          have your resume downloaded on your current device before proceeding.{" "}
          <br /> <br />
          Please note: Applications with missing or incomplete responses will be
          automatically rejected. We encourage you to take your time and
          thoroughly fill out the application. TAMU ThinkTank (TTT) reserves the
          right to vary the evaluation criteria from semester to semester based
          on the number of applicants, available teams, competition
          requirements, and other relevant factors.
          <br /> <br />
        </CardContent>
      </Card>
      <TabsList className="float-right bg-transparent">
        <TabsTrigger className="bg-white text-black" value="personal">
          Next
        </TabsTrigger>
      </TabsList>
    </TabsContent>
  );
}
