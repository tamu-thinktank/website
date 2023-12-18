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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { type ApplyFormSchema } from "@/lib/z.schema";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

export default function Leadership({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ApplyFormSchema>>;
}) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Leadership</CardTitle>
          <CardDescription>
            Responses must be within 1000 characters
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Describe a situation where you demonstrated leadership skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="skillsAnswer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Long answer text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            How do you handle conflicts within a team environment?
          </CardTitle>
          <CardDescription>
            Provide a specific example if possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="conflictsAnswer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Long answer text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Rate your presentation skills on a scale from 1 to 5
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="presentation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex w-1/2 justify-between">
                      <p>1</p>
                      <p>2</p>
                      <p>3</p>
                      <p>4</p>
                      <p>5</p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-4">
                      Novice{" "}
                      <Slider
                        max={4}
                        step={1}
                        className="w-1/2"
                        onValueChange={field.onChange}
                        value={field.value ? [field.value] : [0]}
                      />{" "}
                      Expert
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            How would you rate your ability to meet deadlines and manage time
            effectively?
          </CardTitle>
          <CardDescription>
            Provide an example where you successfully managed your time under
            pressure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="timeManagement"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Long answer text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
