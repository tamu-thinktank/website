import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RouterInputs } from "@/lib/trpc/shared";
import { useFormContext, useWatch } from "react-hook-form";

export default function ResumeUpload({
  setResumeFile,
}: {
  setResumeFile: (file?: File) => void;
}) {
  const form = useFormContext<RouterInputs["public"]["applyOfficer"]>();
  const fullName = useWatch({
    control: form.control,
    name: "personal.fullName",
  });

  const signatureTexts = [
    `I, ${fullName}, understand that becoming a ThinkTank Officer is a major commitment for an entire year. I will likely not have the time to join any other major technical organization while I am a ThinkTank Officer.`,
    `I, ${fullName}, believe I am able to commit to this position for the total duration. If this is to change for unforeseeable circumstances, I understand I must disclose this information to ThinkTank.`,
    `If selected for this position, I, ${fullName}, understand that many future engineering students are counting on me to provide them the opportunity to succeed, just like the officers before did for me.`,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Resume Submission <span className="text-red-500">*</span>
        </CardTitle>
        <CardDescription>
          Please upload your resume as a PDF file (max 20MB). We do not expect
          applicants to have any prior official engineering experience. All we
          ask is for your experience in general as well as anything that makes
          you stand out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resume Upload */}
        <FormField
          control={form.control}
          name="resume.resumeId"
          render={() => (
            <FormItem>
              <FormLabel>Upload Resume (PDF only, max 20MB)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  className="hover:cursor-pointer"
                  accept=".pdf"
                  onChange={(e) => {
                    const resume = e.target.files?.[0];
                    if (resume) {
                      if (resume.size > 20 * 1024 * 1024) {
                        // 20MB
                        form.setError("resume.resumeId", {
                          message: "File size must be less than 20MB",
                        });
                        setResumeFile(undefined);
                        return;
                      }
                      if (resume.type !== "application/pdf") {
                        form.setError("resume.resumeId", {
                          message: "File must be a PDF",
                        });
                        setResumeFile(undefined);
                        return;
                      }
                    }
                    setResumeFile(resume);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Signature Sections */}
        {signatureTexts.map((text, index) => (
          <div key={index} className="space-y-4">
            <Label className="block text-sm font-medium text-muted-foreground">
              {text}
            </Label>
            <FormField
              control={form.control}
              name={
                index === 0
                  ? "resume.signatureCommitment"
                  : index === 1
                    ? "resume.signatureAccountability"
                    : "resume.signatureQuality"
              }
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Type your signature here"
                      className="w-full md:w-3/4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
