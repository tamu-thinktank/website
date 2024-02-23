import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormIntroTab() {
  return (
    <TabsContent className="space-y-2" value="id">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>JSC Form</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>Statement about design challenges here</CardContent>
      </Card>
      <TabsList className="float-right bg-transparent">
        <TabsTrigger className="bg-white text-black" value="personal">
          Next
        </TabsTrigger>
      </TabsList>
    </TabsContent>
  );
}
