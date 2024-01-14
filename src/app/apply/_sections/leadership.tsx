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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { q } from "@/consts/apply-questions";
import { type RouterInputs } from "@/lib/trpc/shared";
import { useFormContext } from "react-hook-form";

export default function Leadership() {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{q.leadership.title}</CardTitle>
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
                  {q.leadership.skillsAnswer}{" "}
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
                  {q.leadership.conflictsAnswer}{" "}
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
                  {q.leadership.presentation}{" "}
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
                  {q.leadership.timeManagement}{" "}
                  <span className="text-red-500">*</span>
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

      <FormField
        control={form.control}
        name="leadership.relevantExperience"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.leadership.relevantExperience}{" "}
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
        name="leadership.timeCommitment"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.leadership.timeCommitment}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      if (value === "true") {
                        field.onChange(true);
                      } else {
                        field.onChange(false);
                      }
                    }}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            onBlur={field.onBlur}
                            checked={field.value === true}
                            value="true"
                            id="yes"
                          />
                          <FormLabel htmlFor="yes">Yes</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            onBlur={field.onBlur}
                            checked={field.value === false}
                            value="false"
                            id="no"
                          />
                          <FormLabel htmlFor="no">No</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
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
