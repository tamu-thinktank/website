"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useCalculateTable from "@/hooks/useCalculateTable";
import { api } from "@/lib/trpc/react";
import type { RouterInputs } from "@/lib/trpc/shared";
import { MATEROVApplyFormSchema } from "@/lib/validations/materov-apply";
import type { UploadResumeResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { PropsWithChildren, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { usePersistForm } from "../../hooks/usePersistForm";

import Availability from "./_sections/availability";
import FormIntroTab from "./_sections/intro";
import MateROVPersonalInfo from "./_sections/personal";
import MateROVAcademicInfo from "./_sections/academic";
import ResumeUpload from "./_sections/resume";
import MateROVThinkTankInfo from "./_sections/thinkTankInfo";
import OpenEndedQuestions from "./_sections/openEndedQuestions";
import SubmissionConfirmation from "./_sections/confirmation";

export default function MateROVApply() {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [resumeFile, setResumeFile] = useState<File>();
  const table = useCalculateTable(userTimezone);
  const viewportRef = useRef<HTMLDivElement>(null);

  const form = usePersistForm<RouterInputs["mateROV"]["MateROVApplyForm"]>(
    "materov-form-S2025-v1",
    {
      resolver: zodResolver(MATEROVApplyFormSchema),
      defaultValues: {
        personal: {
          preferredName: null,
          altEmail: null,
          pronouns: "",
          gender: "",
        },
        academic: {
          currentClasses: [{ value: "" }, { value: "" }],
          nextClasses: [{ value: "" }, { value: "" }],
          timeCommitment: [],
        },
        thinkTankInfo: {
          meetings: false,
          weeklyCommitment: false,
          subteamPreferences: [],
          skills: [],
          learningInterests: [],
          previousParticipation: false,
          referralSources: [],
        },
        openEndedQuestions: {
          firstQuestion: "",
          secondQuestion: "",
          thirdQuestion: "",
        },
        meetingTimes: [],
        resume: {
          resumeId: "",
          signatureCommitment: "",
          signatureAccountability: "",
          signatureQuality: "",
        },
      },
    },
  );

  const { mutateAsync: submitForm } = api.mateROV.MateROVApplyForm.useMutation({
    onSuccess: () => {
      // Reset form and local storage first
      form.reset();
      window.localStorage.removeItem("materov-form-S2025-v1");

      // Then show toast and confirmation
      toast({
        title: "Form Submitted!",
        description:
          "Contact tamuthinktank@gmail.com if you do not receive an email within 3 days.",
        duration: 10000,
      });
      setShowConfirmation(true);
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          "UIN or email already submitted for this application. Contact us at tamuthinktank@gmail.com if you believe this is an error.",
        duration: 5000,
      });
    },
  });

  const { mutateAsync: uploadResume } = useMutation<
    UploadResumeResponse,
    unknown,
    FormData
  >({
    mutationFn: (formData) => {
      return fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      }).then((res) => res.json() as Promise<UploadResumeResponse>);
    },
  });

  const { mutateAsync: deleteResume } = api.public.deleteResume.useMutation();

  const onFormSubmit = useCallback(
    async (data: RouterInputs["mateROV"]["MateROVApplyForm"]) => {
      if (!resumeFile) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Resume is required.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("resume", resumeFile);

      try {
        const uploadResult = await uploadResume(formData);
        const updatedData = {
          ...data,
          resume: {
            ...data.resume,
            resumeId: uploadResult.resumeId,
          },
        };

        await submitForm(updatedData);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (err as Error).message,
        });

        // Clean up resume if upload failed
        if (data.resume.resumeId) {
          await deleteResume({ resumeId: data.resume.resumeId });
        }
      }
    },
    [resumeFile, uploadResume, submitForm, deleteResume, toast],
  );

  if (showConfirmation) {
    return <SubmissionConfirmation />;
  }

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
        className="h-full"
      >
        <ScrollArea viewportRef={viewportRef} className="h-full">
          <div className="flex w-screen items-center justify-center">
            <Tabs
              defaultValue="start"
              className="my-4 w-11/12 md:w-3/4 lg:w-1/2"
            >
              <FormIntroTab />
              <ApplyTab
                previousTab="start"
                currentTab="personal"
                nextTab="academic"
                viewportRef={viewportRef}
              >
                <MateROVPersonalInfo />
              </ApplyTab>

              <ApplyTab
                previousTab="personal"
                currentTab="academic"
                nextTab="thinkTankInfo"
                viewportRef={viewportRef}
              >
                <MateROVAcademicInfo />
              </ApplyTab>

              <ApplyTab
                previousTab="academic"
                currentTab="thinkTankInfo"
                nextTab="openEndedQuestions"
                viewportRef={viewportRef}
              >
                <MateROVThinkTankInfo />
              </ApplyTab>

              <ApplyTab
                previousTab="thinkTankInfo"
                currentTab="openEndedQuestions"
                nextTab="meetingTimes"
                viewportRef={viewportRef}
              >
                <OpenEndedQuestions />
              </ApplyTab>

              <ApplyTab
                previousTab="openEndedQuestions"
                currentTab="meetingTimes"
                nextTab="resume"
                viewportRef={viewportRef}
              >
                <Availability
                  userTimezone={userTimezone}
                  setUserTimezone={setUserTimezone}
                  table={table}
                />
              </ApplyTab>
              <TabsContent className="space-y-2" value="resume">
                <ResumeUpload
                  resumeFile={resumeFile}
                  setResumeFile={setResumeFile}
                />
                <TabsList className="flex w-full justify-between bg-transparent">
                  <TabsTrigger
                    className="bg-white text-black"
                    value="meetingTimes"
                  >
                    Back
                  </TabsTrigger>
                  <Button
                    type="submit"
                    className="bg-white text-black hover:bg-white hover:text-black"
                    disabled={
                      form.formState.isSubmitting ||
                      form.formState.isValidating ||
                      !form.formState.isValid ||
                      !form.watch("resume.signatureCommitment") ||
                      !form.watch("resume.signatureAccountability") ||
                      !form.watch("resume.signatureQuality")
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
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}

/**
 * Tab names match with object sections in the form schema
 */
type ApplyTabType =
  | "start"
  | "personal"
  | "academic"
  | "thinkTankInfo"
  | "openEndedQuestions"
  | "meetingTimes"
  | "resume";

/**
 * Validate input in section before allowing user to move on to next
 */
function ApplyTab({
  previousTab,
  currentTab,
  nextTab,
  viewportRef,
  children,
}: {
  previousTab: ApplyTabType;
  currentTab: ApplyTabType;
  nextTab: ApplyTabType;
  viewportRef: RefObject<HTMLDivElement>;
} & PropsWithChildren) {
  const form = useFormContext<RouterInputs["mateROV"]["MateROVApplyForm"]>();

  const [isValid, setIsValid] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const scrollToTop = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNext = useCallback(async () => {
    if (currentTab === "start") {
      return;
    }

    const result = await form.trigger(currentTab, {
      shouldFocus: true,
    });

    if (result) {
      setIsValid(true);
      scrollToTop();
    } else {
      setIsValid(false);
    }

    setIsChecked(true);
  }, [currentTab, form]);

  useEffect(() => {
    if (!isChecked) return;
    if (currentTab === "start") return;

    const sub = form.watch((values, { name }) => {
      if (name?.startsWith(currentTab)) {
        form
          .trigger(currentTab)
          .then((isValid) => setIsValid(isValid))
          .catch(() => setIsValid(false));
      }
    });

    return () => sub.unsubscribe();
  }, [form, isChecked, currentTab]);

  return (
    <TabsContent className="space-y-2" value={currentTab}>
      <Card className="p-4">{children}</Card>
      <TabsList className="flex w-full justify-between bg-transparent">
        <TabsTrigger
          className="bg-white text-black"
          value={previousTab}
          onMouseDown={scrollToTop}
        >
          Back
        </TabsTrigger>
        <TabsTrigger
          onMouseDown={handleNext}
          value={isValid ? nextTab : currentTab}
          disabled={isChecked && !isValid}
          className="bg-white text-black data-[state=active]:bg-white data-[state=active]:text-black"
        >
          Next
        </TabsTrigger>
      </TabsList>
    </TabsContent>
  );
}
