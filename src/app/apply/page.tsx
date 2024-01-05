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
import { useCallback, useEffect, useState } from "react";
import { usePersistForm } from "../_hooks/usePersistForm";
import Interests from "./_sections/interests";
import FormIntro from "./_sections/intro";
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
  }, []);

  // Validate input in personal section before allowing user to move on

  const [isPersonalValid, setIsPersonalValid] = useState(false);
  const [isPersonalChecked, setIsPersonalChecked] = useState(false);
  const [personalValue, setPersonalValue] = useState<"interests" | "personal">(
    "personal",
  );

  const handlePersonalNext = useCallback(async () => {
    const isValid = await form.trigger("personal", {
      shouldFocus: true,
    });

    if (isValid) {
      setIsPersonalValid(true);
      setPersonalValue("interests");
    } else {
      setIsPersonalValid(false);
      setPersonalValue("personal");
    }

    setIsPersonalChecked(true);
  }, [form.trigger]);

  useEffect(() => {
    if (!isPersonalChecked) return;

    const sub = form.watch((values, { name }) => {
      if (name?.startsWith("personal")) {
        form
          .trigger("personal")
          .then((isValid) => {
            if (isValid) {
              setIsPersonalValid(true);
              setPersonalValue("interests");
            } else {
              setIsPersonalValid(false);
              setPersonalValue("personal");
            }
          })
          .catch(() => setIsPersonalValid(false));
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [form.watch, isPersonalChecked]);

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
        <Tabs defaultValue="intro" className="w-11/12 md:w-3/4 lg:w-1/2">
          <TabsContent className="space-y-2" value="intro">
            <FormIntro />
            <TabsList className="float-right bg-transparent">
              <TabsTrigger className="bg-white text-black" value="personal">
                Next
              </TabsTrigger>
            </TabsList>
          </TabsContent>
          <TabsContent className="h-[90vh] space-y-2" value="personal">
            <Card className="h-5/6">
              <ScrollArea className="h-full p-4">
                <PersonalInfo />
              </ScrollArea>
            </Card>
            <TabsList className="flex w-full justify-between bg-transparent">
              <TabsTrigger className="bg-white text-black" value="intro">
                Back
              </TabsTrigger>
              <TabsTrigger
                onMouseDown={handlePersonalNext}
                value={personalValue}
                disabled={isPersonalChecked && !isPersonalValid}
                className="bg-white text-black data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Next
              </TabsTrigger>
            </TabsList>
          </TabsContent>
          <TabsContent className="h-[90vh] space-y-2" value="interests">
            <Card className="h-5/6">
              <ScrollArea className="h-full p-4">
                <Interests />
              </ScrollArea>
            </Card>
            <TabsList className="flex w-full justify-between  bg-transparent">
              <TabsTrigger className="bg-white text-black" value="personal">
                Back
              </TabsTrigger>
              <TabsTrigger
                className="bg-white text-black data-[state=active]:bg-white data-[state=active]:text-black"
                value={
                  Boolean(form.watch("interests.isLeadership"))
                    ? "leadership"
                    : "resume"
                }
              >
                Next
              </TabsTrigger>
            </TabsList>
          </TabsContent>
          <TabsContent className="h-[90vh] space-y-2" value="leadership">
            <Card className="h-5/6">
              <ScrollArea className="h-full p-4">
                <Leadership />
              </ScrollArea>
            </Card>
            <TabsList className="flex w-full justify-between bg-transparent">
              <TabsTrigger className="bg-white text-black" value="interests">
                Back
              </TabsTrigger>
              <TabsTrigger
                className="bg-white text-black data-[state=active]:bg-white data-[state=active]:text-black"
                value="resume"
              >
                Next
              </TabsTrigger>
            </TabsList>
          </TabsContent>
          <TabsContent className="h-[90vh] space-y-2" value="resume">
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
