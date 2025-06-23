import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormIntroTab() {
  return (
    <TabsContent className="space-y-2" value="start">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>ThinkTank MINI-DC Application Form</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="text-center">
          Our club’s mission is to provide experience and opportunities to all
          engineering students, regardless of their prior experiences. Please
          keep this in mind as you complete your application.
          <br /> <br />
          There are 2 multiple-choice sections and 1 open-end question section
          with a resume upload at the end. We recommend writing your free
          responses in a separate document and transferring them to the
          application. Additionally, we recommend having your resume downloaded
          on your device before continuing. <br /> <br />
          Please note: Applications with missing or incomplete responses will be
          automatically rejected. We encourage you to take your time and
          thoroughly fill out the application. ThinkTank reserves the right to
          vary evaluation criteria each recruitment cycle based on number of
          applications and other relevant factors.
          <br /> <br />
          <strong>
            WE HIGHLY RECOMMEND READING THE MINI DC FAQ AND COMPLETING THE
            APPLICATION ON A LAPTOP/DESKTOP
          </strong>
          {/* <br /> <br />
          <strong>❗❗❗❗❗❗ APPLICATIONS ARE NOW CLOSED❗❗❗❗❗❗</strong> */}
        </CardContent>
      </Card>
      <TabsList className="float-right bg-transparent">
        <TabsTrigger className="bg-white text-black" value="personal">
          Closed
        </TabsTrigger>
      </TabsList>
    </TabsContent>
  );
}
