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
import { clientErrorHandler } from "@/lib/utils";
import { ApplyFormSchema } from "@/lib/z.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
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
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const table = useCalculateTable(userTimezone);

  const form = usePersistForm<RouterInputs["public"]["apply"]>("apply-form", {
    resolver: zodResolver(ApplyFormSchema),
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
      },
      meetingTimes: [],
      resumeLink: "l",
    },
  });
  const isLeadershipSelected = form.getValues("interests.isLeadership");
  const viewportRef = useRef<HTMLDivElement>(null);

  const { mutate } = api.public.apply.useMutation({
    onSuccess: () => {
      toast({
        title: "Form submitted!",
        action: (
          <Button variant={"outline"} size={"sm"}>
            <Link href={"/"} className="flex items-center justify-center gap-2">
              Home <ArrowUpRight />
            </Link>
          </Button>
        ),
        duration: 5000,
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
                nextTab="resumeLink"
                viewportRef={viewportRef}
              >
                <Availability
                  userTimezone={userTimezone}
                  setUserTimezone={setUserTimezone}
                  table={table}
                />
              </ApplyTab>
              <TabsContent className="space-y-2" value="resumeLink">
                <ResumeUpload />
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
  | "resumeLink";

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
