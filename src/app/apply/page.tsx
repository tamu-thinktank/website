"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useCalculateTable from "@/hooks/useCalculateTable";
import { api } from "@/lib/trpc/react";
import { type RouterInputs } from "@/lib/trpc/shared";
import { ApplyFormSchema } from "@/lib/validations/apply";
import { type UploadResumeResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";
import { useFormContext } from "react-hook-form";
import { usePersistForm } from "../_hooks/usePersistForm";
import Availability from "./_sections/availability";
import Interests from "./_sections/interests";
import FormIntroTab from "./_sections/intro";
import Leadership from "./_sections/leadership";
import PersonalInfo from "./_sections/personal";
import ResumeUpload from "./_sections/resume";

export default function Apply() {
  const { toast } = useToast();
  const router = useRouter();
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const table = useCalculateTable(userTimezone);

  const form = usePersistForm<RouterInputs["public"]["apply"]>("apply-form", {
    resolver: zodResolver(ApplyFormSchema),
    // include at least the default values of optional fields
    defaultValues: {
      id: createId(),
      personal: {
        altEmail: null,
      },
      interests: {
        challenges: [],
      },
      leadership: {
        skillsAnswer: null,
        conflictsAnswer: null,
        presentation: 1,
        timeManagement: null,
        relevantExperience: null,
        timeCommitment: null,
      },
      meetingTimes: [],
      resumeId: "",
    },
  });
  const isLeadershipSelected = form.getValues("interests.isLeadership");
  const viewportRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: submitForm } = api.public.apply.useMutation({
    onSuccess: () => {
      toast({
        title: "Form submitted! Redirecting home...",
        duration: 3000,
      });

      form.reset();
      router.push("/");
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

  const [resumeFile, setResumeFile] = useState<File>();
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
    async (data: RouterInputs["public"]["apply"]) => {
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
        const resumeId = (await uploadResume(formData)).resumeId;
        data.resumeId = resumeId;
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (err as Error).message,
        });
        return;
      }

      try {
        await submitForm(data);
      } catch {
        await deleteResume({
          resumeId: data.resumeId,
        });
      }
    },
    [resumeFile, uploadResume, toast, submitForm],
  );

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
            <Tabs defaultValue="id" className="my-4 w-11/12 md:w-3/4 lg:w-1/2">
              <FormIntroTab />
              <ApplyTab
                previousTab="id"
                currentTab="personal"
                nextTab="interests"
                viewportRef={viewportRef}
              >
                <PersonalInfo />
              </ApplyTab>
              <ApplyTab
                previousTab="personal"
                currentTab="interests"
                nextTab={isLeadershipSelected ? "leadership" : "meetingTimes"}
                viewportRef={viewportRef}
              >
                <Interests />
              </ApplyTab>
              <ApplyTab
                previousTab="interests"
                currentTab="leadership"
                nextTab="meetingTimes"
                viewportRef={viewportRef}
              >
                <Leadership />
              </ApplyTab>
              <ApplyTab
                previousTab={isLeadershipSelected ? "leadership" : "interests"}
                currentTab="meetingTimes"
                nextTab="resumeId"
                viewportRef={viewportRef}
              >
                <Availability
                  userTimezone={userTimezone}
                  setUserTimezone={setUserTimezone}
                  table={table}
                />
              </ApplyTab>
              <TabsContent className="space-y-2" value="resumeId">
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
                    disabled={
                      form.formState.isSubmitting || form.formState.isValidating
                    }
                  >
                    {form.formState.isSubmitting ||
                    form.formState.isValidating ? (
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
  | "id"
  | "personal"
  | "interests"
  | "leadership"
  | "meetingTimes"
  | "resumeId";

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
  const form = useFormContext<RouterInputs["public"]["apply"]>();

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
    const isValid = await form.trigger(currentTab, {
      shouldFocus: true,
    });

    if (isValid) {
      setIsValid(true);
      scrollToTop();
    } else {
      setIsValid(false);
    }

    setIsChecked(true);
  }, [form.trigger]);

  useEffect(() => {
    if (!isChecked) return;

    const sub = form.watch((values, { name }) => {
      if (name?.startsWith(currentTab)) {
        form
          .trigger(currentTab)
          .then((isValid) => {
            if (isValid) {
              setIsValid(true);
            } else {
              setIsValid(false);
            }
          })
          .catch(() => setIsValid(false));
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [form.watch, isChecked]);

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
