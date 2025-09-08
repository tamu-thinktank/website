import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { challenges, q } from "@/consts/apply-form";
import type { RouterInputs as _RouterInputs } from "@/lib/trpc/shared";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

export default function Interests() {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{q.interests.title}</CardTitle>
          <CardDescription>
            Responses must be within 1000 characters
          </CardDescription>
        </CardHeader>
      </Card>

      <FormField
        control={form.control}
        name="interests.interestedAnswer"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.interests.interestedAnswer}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Textarea placeholder="Long answer text" {...field} />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="interests.challenges"
        render={() => (
          <FormItem>
            <Card>
              <CardHeader className="gap-4">
                <CardTitle>
                  {q.interests.challenges}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Details can be found{" "}
                  <Link
                    className="inline-block"
                    target="_blank"
                    href="https://ig.utexas.edu/tsgc/design-challenge/"
                  >
                    <span className="text-info dark:text-blue-300">here</span>
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {challenges.map((challenge) => (
                  <FormField
                    key={challenge.id}
                    control={form.control}
                    name="interests.challenges"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={challenge.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`checkbox-${challenge.id}`}
                                checked={
                                  (field.value as string[] | undefined)?.some(
                                    (value: string) => value === challenge.id,
                                  ) ?? false
                                }
                                onCheckedChange={(checked) => {
                                  const currentValue = (field.value ??
                                    []) as string[];
                                  return checked
                                    ? field.onChange([
                                        ...currentValue,
                                        challenge.id,
                                      ])
                                    : field.onChange(
                                        currentValue.filter(
                                          (value: string) =>
                                            value !== challenge.id,
                                        ),
                                      );
                                }}
                              />
                              <FormLabel
                                className="font-normal"
                                htmlFor={`checkbox-${challenge.id}`}
                              >
                                {challenge.label}
                              </FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interests.interestedChallenge"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.interests.interestedChallenge}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  This helps us more quickly match applicants with their desired
                  design challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={(field.value as string) || ""}
                  >
                    {challenges.map((challenge) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={challenge.id}
                              id={challenge.id}
                            />
                            <FormLabel htmlFor={challenge.id}>
                              {challenge.label}
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interests.passionAnswer"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.interests.passionAnswer}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Textarea placeholder="Long answer text" {...field} />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interests.isLeadership"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.interests.isLeadership}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  These positions will vary from team to team in terms of number
                  and specific responsibilities.
                </CardDescription>
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
