"use client";

import FormLayout from "@/components/FormLayout";
import { toast } from "@/components/ui/use-toast";
import { ApplyFormSchema } from "@/lib/z.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { useCallback } from "react";
import type * as z from "zod";
import { usePersistForm } from "../_hooks/usePersistForm";
import Interests from "./_sections/interests";
import FormIntro from "./_sections/intro";
import Leadership from "./_sections/leadership";
import PersonalInfo from "./_sections/personal";
import ResumeUpload from "./_sections/resume";

export default function Apply() {
  const form = usePersistForm<z.infer<typeof ApplyFormSchema>>("apply-form", {
    resolver: zodResolver(ApplyFormSchema),
    defaultValues: {
      id: createId(),
      altEmail: null,
      challenges: [],
      skillsAnswer: null,
      conflictsAnswer: null,
      presentation: 0,
      timeManagement: null,
      resumeLink: "",
    },
  });

  const onFormSubmit = useCallback((data: z.infer<typeof ApplyFormSchema>) => {
    console.log(data);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }, []);

  return (
    <FormLayout<z.infer<typeof ApplyFormSchema>>
      form={form}
      onSubmit={onFormSubmit}
    >
      <FormIntro />
      <PersonalInfo form={form} />
      <Interests form={form} />
      <Leadership form={form} />
      <ResumeUpload />
    </FormLayout>
  );
}
