import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResumeUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Resume Submission <span className="text-red-500">*</span>
        </CardTitle>
        <CardDescription>
          Please upload your resume as a PDF file. We do not expect applicants
          to have any prior official engineering experience. All we ask is for
          your experience in general as well as anything that makes you stand
          out.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-fit">
        <Input type="file" className="hover:cursor-pointer" accept=".pdf" />
      </CardContent>
    </Card>
  );
}
