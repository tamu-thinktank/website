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
import { ApplyFormSchema } from "@/lib/validations/apply";
import type { UploadResumeResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { PropsWithChildren, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { usePersistForm } from "../../hooks/usePersistForm";

import Availability from "./_sections/availability";
import FormIntroTab from "./_sections/intro";
import PersonalInfo from "./_sections/personal";
import AcademicInfo from "./_sections/academic";
import ResumeUpload from "./_sections/resume";
import ThinkTankInfo from "./_sections/thinkTankInfo";
import OpenEndedQuestions from "./_sections/openEndedQuestions";
import SubmissionConfirmation from "./_sections/confirmation";

export default function Apply() {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<ApplyTabType>("start");
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [resumeFile, setResumeFile] = useState<File>();
  const table = useCalculateTable(userTimezone);
  const viewportRef = useRef<HTMLDivElement>(null);

  const form = usePersistForm<RouterInputs["public"]["applyForm"]>(
    "apply-form-S2025-v1",
    {
      resolver: zodResolver(ApplyFormSchema),
      defaultValues: {
        personal: {
          preferredName: null,
          altEmail: null,
          pronouns: "",
          gender: "",
        },
        academic: {
          currentClasses: ["", ""],
          nextClasses: ["", ""],
          currentCommitmentHours: "",
          plannedCommitmentHours: "",
          timeCommitment: [],
        },
        thinkTankInfo: {
          meetings: false,
          weeklyCommitment: false,
          preferredTeams: [],
          researchAreas: [],
          referralSources: [],
        },
        openEndedQuestions: {
          firstQuestion: "",
          secondQuestion: "",
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

  const submitFormMutation = api.public.applyForm.useMutation({
    onSuccess: () => {
      // Reset form and local storage first
      form.reset();
      window.localStorage.removeItem("apply-form-S2025-v1");

      // Then show toast and confirmation
      toast({
        title: "Application Submitted Successfully!",
        description:
          "A confirmation email has been sent to your TAMU email. Check your inbox and spam folder. Contact tamuthinktank@gmail.com if you don't receive it within 10 minutes.",
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

  const submitForm = submitFormMutation.mutateAsync;

  const uploadResumeMutation = useMutation<
    UploadResumeResponse,
    unknown,
    FormData
  >({
    mutationFn: (formData: FormData) => {
      return fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      }).then((res) => res.json() as Promise<UploadResumeResponse>);
    },
  });

  const uploadResume = uploadResumeMutation.mutateAsync;

  const deleteResumeMutation = api.public.deleteResume.useMutation();
  const deleteResume = deleteResumeMutation.mutateAsync;

  const onFormSubmit = useCallback(
    async (data: RouterInputs["public"]["applyForm"]) => {
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

        // Transform data for database submission
        const transformedData: RouterInputs["public"]["applyForm"] = {
          ...data,
          academic: {
            year: data.academic.year,
            major: data.academic.major,
            currentClasses: data.academic.currentClasses.filter(
              (cls) => cls && cls.trim() !== "",
            ),
            nextClasses: data.academic.nextClasses.filter(
              (cls) => cls && cls.trim() !== "",
            ),
            timeCommitment: [
              ...(data.academic.currentCommitmentHours &&
              Number(data.academic.currentCommitmentHours) > 0
                ? [
                    {
                      name: "Current Time Commitments",
                      hours: Number(data.academic.currentCommitmentHours),
                      type: "CURRENT" as const,
                    },
                  ]
                : []),
              ...(data.academic.plannedCommitmentHours &&
              Number(data.academic.plannedCommitmentHours) > 0
                ? [
                    {
                      name: "Planned Time Commitments",
                      hours: Number(data.academic.plannedCommitmentHours),
                      type: "PLANNED" as const,
                    },
                  ]
                : []),
            ],
          },
          resume: {
            ...data.resume,
            resumeId: uploadResult.resumeId,
          },
        };

        await submitForm(transformedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
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
              value={activeTab}
              onValueChange={(value: string) =>
                setActiveTab(value as ApplyTabType)
              }
              className="my-4 w-11/12 md:w-3/4 lg:w-1/2"
            >
              <FormIntroTab />
              <ApplyTab
                previousTab="start"
                currentTab="personal"
                nextTab="academic"
                viewportRef={viewportRef}
                setActiveTab={setActiveTab}
              >
                <PersonalInfo />
              </ApplyTab>

              <ApplyTab
                previousTab="personal"
                currentTab="academic"
                nextTab="thinkTankInfo"
                viewportRef={viewportRef}
                setActiveTab={setActiveTab}
              >
                <AcademicInfo />
              </ApplyTab>

              <ApplyTab
                previousTab="academic"
                currentTab="thinkTankInfo"
                nextTab="openEndedQuestions"
                viewportRef={viewportRef}
                setActiveTab={setActiveTab}
              >
                <ThinkTankInfo />
              </ApplyTab>

              <ApplyTab
                previousTab="thinkTankInfo"
                currentTab="openEndedQuestions"
                nextTab="meetingTimes"
                viewportRef={viewportRef}
                setActiveTab={setActiveTab}
              >
                <OpenEndedQuestions />
              </ApplyTab>

              <ApplyTab
                previousTab="openEndedQuestions"
                currentTab="meetingTimes"
                nextTab="resume"
                viewportRef={viewportRef}
                setActiveTab={setActiveTab}
              >
                <Availability
                  userTimezone={userTimezone}
                  setUserTimezone={setUserTimezone}
                  table={table}
                />
              </ApplyTab>
              <TabsContent className="space-y-2" value="resume">
                <ResumeUpload setResumeFile={setResumeFile} />
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
  setActiveTab,
  children,
}: {
  previousTab: ApplyTabType;
  currentTab: ApplyTabType;
  nextTab: ApplyTabType;
  viewportRef: RefObject<HTMLDivElement>;
  setActiveTab: (tab: ApplyTabType) => void;
} & PropsWithChildren) {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  const [isValid, setIsValid] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const scrollToTop = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [viewportRef]);

  const handleNext = useCallback(async () => {
    if (currentTab === "start") {
      setIsValid(true);
      setActiveTab(nextTab);
      scrollToTop();
      return;
    }

    // Clear previous validation state
    setIsChecked(false);
    
    const result = await form.trigger(currentTab, {
      shouldFocus: true,
    });

    setIsValid(result);
    setIsChecked(true);
    
    // Navigate if validation passes
    if (result) {
      setActiveTab(nextTab);
      scrollToTop();
    }
  }, [currentTab, form, scrollToTop, nextTab, setActiveTab]);

  // Reset validation state when tab changes
  const handleBack = useCallback(() => {
    setIsValid(false);
    setIsChecked(false);
    setActiveTab(previousTab);
    scrollToTop();
  }, [scrollToTop, previousTab, setActiveTab]);

  return (
    <TabsContent className="space-y-2" value={currentTab}>
      <Card className="p-4">{children}</Card>
      <TabsList className="flex w-full justify-between bg-transparent">
        <Button
          type="button"
          className="bg-white text-black hover:bg-gray-100"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isChecked && !isValid}
          className="bg-white text-black hover:bg-gray-100"
        >
          Next
        </Button>
      </TabsList>
    </TabsContent>
  );
}
