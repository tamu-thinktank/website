"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/trpc/react";
import { type RouterInputs } from "@/lib/trpc/shared";
import { clientErrorHandler } from "@/lib/utils";
import { ApplyFormSchema } from "@/lib/z.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Loader2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useFormContext } from "react-hook-form";
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
          <ApplyTab previousTab="id" currentTab="personal" nextTab="interests">
            <PersonalInfo />
          </ApplyTab>
          <ApplyTab
            previousTab="personal"
            currentTab="interests"
            nextTab={
              Boolean(form.watch("interests.isLeadership"))
                ? "leadership"
                : "resumeLink"
            }
          >
            <InterestsTab />
          </ApplyTab>
          <ApplyTab
            previousTab="interests"
            currentTab="leadership"
            nextTab="resumeLink"
          >
            <Leadership />
          </ApplyTab>
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

/**
 * Tab names match with object sections in the form schema
 */
type ApplyTabType =
  | "id"
  | "personal"
  | "interests"
  | "leadership"
  | "resumeLink";

/**
 * Validate input in section before allowing user to move on to next
 */
function ApplyTab({
  previousTab,
  currentTab,
  nextTab,
  children,
}: {
  previousTab: ApplyTabType;
  currentTab: ApplyTabType;
  nextTab: ApplyTabType;
} & PropsWithChildren) {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

  const [isValid, setIsValid] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [value, setValue] = useState<ApplyTabType>(currentTab);

  const handleNext = useCallback(async () => {
    const isValid = await form.trigger(currentTab, {
      shouldFocus: true,
    });

    if (isValid) {
      setIsValid(true);
      setValue(nextTab);
    } else {
      setIsValid(false);
      setValue(currentTab);
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
              setValue(nextTab);
            } else {
              setIsValid(false);
              setValue(currentTab);
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
    <TabsContent className="h-[90vh] space-y-2" value={currentTab}>
      <Card className="h-5/6">
        <ScrollArea className="h-full p-4">{children}</ScrollArea>
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
