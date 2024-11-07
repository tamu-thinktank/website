import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormIntroTab() {
  return (
    <TabsContent className="space-y-2" value="start">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>ThinkTank Membership Application Form</CardTitle>
          <Separator />
        </CardHeader>
      </Card>
      <TabsList className="float-right bg-transparent">
        <TabsList className="float-right bg-transparent">
          <TabsTrigger className="bg-white text-black" value="personal">
            Next
          </TabsTrigger>
        </TabsList>
      </TabsList>
    </TabsContent>
  );
}
