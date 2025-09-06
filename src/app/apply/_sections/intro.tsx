import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";

export default function FormIntroTab() {
  return (
    <TabsContent className="space-y-2" value="start">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>ThinkTank Membership Application Form</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="text-center">
          Our club's mission is to provide experience and opportunities to all
          engineering students, regardless of their prior experiences. Please
          keep this in mind as you complete your application.
          <br /> <br />
          There are 3 multiple-choice sections and 1 open-end question section
          with a resume upload at the end. We recommend writing your free
          responses in a separate document and transferring them to the
          application. Additionally, we recommend having your resume downloaded
          on your device before continuing. <br /> <br />
          Please note: Applications with missing or incomplete responses will be
          automatically rejected. We encourage you to take your time and
          thoroughly fill out the application. ThinkTank reserves the right to
          vary evaluation criteria each recruitment cycle based on number of
          applications, available teams, competition requirements, and other
          relevant factors.
          <br /> <br />
          <strong>
            WE HIGHLY RECOMMEND READING THE FAQ AND COMPLETING THE APPLICATION
            ON A LAPTOP/DESKTOP
          </strong>
          <br /> <br />
          {/* <strong>❗❗❗❗❗❗ APPLICATIONS ARE NOW CLOSED❗❗❗❗❗❗</strong> */}
        </CardContent>
      </Card>

      {/* Helpful Notices */}
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-left text-lg flex items-center gap-2">
              💡 Application Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-left space-y-2">
            <ul className="text-sm space-y-1">
              <li>• <strong>Classes:</strong> Fill out one class at a time - you can't add the next class until the current one is valid</li>
              <li>• <strong>Auto-save:</strong> Your progress is automatically saved as you type</li>
              <li>• <strong>Required fields:</strong> Make sure all fields marked with (*) are completed</li>
              <li>• <strong>Time commitments:</strong> You can specify whether each commitment is current or planned</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-left text-lg flex items-center gap-2 text-amber-900">
              ⚠️ Having Trouble Submitting?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <div className="text-sm text-amber-800 space-y-3">
              <div>
                <p className="font-medium mb-2">Try these steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Refresh the page and try submitting again</li>
                  <li>Clear your browser cache and reload</li>
                  <li>Make sure all required fields (*) are filled out completely</li>
                  <li>Check that all classes are in the correct format (XXXX 123)</li>
                </ol>
              </div>
              
              <div className="bg-amber-100 p-3 rounded">
                <p className="font-medium mb-1">Still having issues?</p>
                <p>Join our{" "}
                  <a 
                    href="https://discord.gg/qUAuSraYV9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Discord server
                  </a>{" "}
                  and message an officer for help, or email us at{" "}
                  <a href="mailto:tamuthinktank@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                    tamuthinktank@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <TabsList className="float-right bg-transparent">
        <TabsTrigger className="bg-white text-black" value="personal">
          Next
        </TabsTrigger>
      </TabsList>
    </TabsContent>
  );
}
