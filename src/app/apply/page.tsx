"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useApplyFormTab, { type ApplyTabType } from "@/hooks/useApplyFormTab";
import { api } from "@/lib/trpc/react";
import { type RouterInputs } from "@/lib/trpc/shared";
import { clientErrorHandler } from "@/lib/utils";
import { ApplyFormSchema } from "@/lib/z.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { usePersistForm } from "../_hooks/usePersistForm";
import InterestsTab from "./_sections/interests";
import FormIntroTab from "./_sections/intro";
import Leadership from "./_sections/leadership";
import PersonalInfo from "./_sections/personal";
import ResumeUpload from "./_sections/time-resume";

export default function Apply() {
  const { toast } = useToast();

  const form = usePersistForm<RouterInputs["public"]["apply"]>("apply-form", {
    resolver: zodResolver(ApplyFormSchema),
    defaultValues: {
      id: createId(),
      personal: {
        altEmail: null,
      },
      interests: {
        challenges: [],
        isLeadership: false,
      },
      leadership: {
        skillsAnswer: null,
        conflictsAnswer: null,
        presentation: 1,
        timeManagement: null,
      },
      resumeLink: "l",
    },
  });

  const { mutate } = api.public.apply.useMutation({
    onSuccess: (_, data) => {
      toast({
        title: "Form submitted!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    },
    onError: (err) => {
      clientErrorHandler(err, toast);
    },
  });

  const onFormSubmit = useCallback((data: RouterInputs["public"]["apply"]) => {
    mutate(data);
    // toast({
    //   title: "Form submitted!",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit, () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Check the form for errors and try again.",
          });
        })}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        className="flex w-full items-center justify-center"
      >
        <Tabs defaultValue="id" className="w-11/12 md:w-3/4 lg:w-1/2">
          <FormIntroTab />
          <ApplyTab
            tabPage={<PersonalInfo />}
            previousTab="id"
            currentTab="personal"
            nextTab="interests"
          />
          <ApplyTab
            tabPage={<InterestsTab />}
            previousTab="personal"
            currentTab="interests"
            nextTab={
              Boolean(form.watch("interests.isLeadership"))
                ? "leadership"
                : "resumeLink"
            }
          />
          <ApplyTab
            tabPage={<Leadership />}
            previousTab="interests"
            currentTab="leadership"
            nextTab="resumeLink"
          />
          <TabsContent className="h-[90vh] space-y-2" value="resumeLink">
            <ResumeUpload />
            <TabsList className="flex w-full justify-between bg-transparent">
              <TabsTrigger
                className="bg-white text-black"
                value={
                  Boolean(form.watch("interests.isLeadership"))
                    ? "leadership"
                    : "interests"
                }
              >
                Back
              </TabsTrigger>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || form.formState.isValidating
                }
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </TabsList>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

function ApplyTab({
  tabPage,
  previousTab,
  currentTab,
  nextTab,
}: {
  tabPage: JSX.Element;
  previousTab: ApplyTabType;
  currentTab: ApplyTabType;
  nextTab: ApplyTabType;
}) {
  const [isValid, isChecked, value, handleNext] = useApplyFormTab(
    currentTab,
    nextTab,
  );

  return (
    <TabsContent className="h-[90vh] space-y-2" value={currentTab}>
      <Card className="h-5/6">
        <ScrollArea className="h-full p-4">{tabPage}</ScrollArea>
      </Card>
      <TabsList className="flex w-full justify-between bg-transparent">
        <TabsTrigger className="bg-white text-black" value={previousTab}>
          Back
        </TabsTrigger>
        <TabsTrigger
          onMouseDown={handleNext}
          value={value}
          disabled={isChecked && !isValid}
          className="bg-white text-black data-[state=active]:bg-white data-[state=active]:text-black"
        >
          Next
        </TabsTrigger>
      </TabsList>
    </TabsContent>
  );
}
