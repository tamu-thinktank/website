"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { q } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { useFormContext } from "react-hook-form";

const wordCount = (text: string) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export default function OpenEndedQuestions() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{q.openEndedQuestions.title}</CardTitle>
          <Separator />
        </CardHeader>
      </Card>

      {/* Passion Answer */}
      <FormField
        control={form.control}
        name="openEndedQuestions.firstQuestion"
        render={({ field }) => {
          const count = wordCount(field.value || "");
          return (
            <FormItem>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {q.openEndedQuestions.firstQuestion} <span className="text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>250 word maximum length</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your passion experience..."
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <div className={`text-sm ${count > 250 ? "text-destructive" : "text-muted-foreground"}`}>
                    {count}/250 words
                  </div>
                  <FormMessage />
                </CardContent>
              </Card>
            </FormItem>
          );
        }}
      />

      {/* Teamwork Answer */}
      <FormField
        control={form.control}
        name="openEndedQuestions.secondQuestion"
        render={({ field }) => {
          const count = wordCount(field.value || "");
          return (
            <FormItem>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {q.openEndedQuestions.secondQuestion} <span className="text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>250 word maximum length</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your teamwork experience..."
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <div className={`text-sm ${count > 250 ? "text-destructive" : "text-muted-foreground"}`}>
                    {count}/250 words
                  </div>
                  <FormMessage />
                </CardContent>
              </Card>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
