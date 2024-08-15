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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RouterInputs } from "@/lib/trpc/shared";
import { useFormContext } from "react-hook-form";

export default function ResumeUpload({
  setResumeFile,
}: {
  setResumeFile: (file?: File) => void;
}) {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

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
        <FormField
          control={form.control}
          name="resumeId"
          render={() => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  className="hover:cursor-pointer"
                  accept=".pdf"
                  onChange={(e) => {
                    const resume = e.target.files?.[0];

                    if (resume) {
                      if (resume.size > 1024 * 1024) {
                        form.setError("resumeId", {
                          message: "File size must be less than 1MB",
                        });
                        setResumeFile(undefined);

                        return;
                      }

                      if (resume.type !== "application/pdf") {
                        form.setError("resumeId", {
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
      </CardContent>
    </Card>
  );
}
