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
import { type RouterInputs } from "@/lib/trpc/shared";
import { useFormContext } from "react-hook-form";

export default function Leadership() {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Leadership</CardTitle>
          <CardDescription>
            Responses must be within 1000 characters
          </CardDescription>
        </CardHeader>
      </Card>

      <FormField
        control={form.control}
        name="leadership.skillsAnswer"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  Describe a situation where you demonstrated leadership skills{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Textarea
                    placeholder="Long answer text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="leadership.conflictsAnswer"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  How do you handle conflicts within a team environment?{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Provide a specific example if possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Textarea
                    placeholder="Long answer text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="leadership.presentation"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  Rate your presentation skills on a scale from 1 to 5{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        min={1}
                        max={5}
                        step={1}
                        className="w-1/2"
                        onValueChange={field.onChange}
                        value={field.value ? [field.value] : [1]}
                      />{" "}
                      Expert
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="leadership.timeManagement"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  How would you rate your ability to meet deadlines and manage
                  time effectively? <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Provide an example where you successfully managed your time
                  under pressure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Textarea
                    placeholder="Long answer text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </div>
  );
}
