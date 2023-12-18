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
import { type ApplyFormSchema } from "@/lib/z.schema";
import { Challenge } from "@prisma/client";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

const challenges: {
  id: Challenge;
  label: string;
}[] = [
  {
    id: Challenge.AIAA,
    label: "AIAA",
  },
  {
    id: Challenge.RASC_AL,
    label: "RASC-AL",
  },
  {
    id: Challenge.Blue_Skies,
    label: "Blue Skies",
  },
];

export default function Interests({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ApplyFormSchema>>;
}) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Interests and Motivation</CardTitle>
          <CardDescription>
            Responses must be within 1000 characters
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Why are you interested in joining ThinkTank?</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="interestedAnswer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Long answer text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Which Design Challenges are you interested in?</CardTitle>
          <CardDescription>
            Details can be found below: <br />- AIAA:
            https://www.aiaa.org/get-involved/students-educators/Design-Competitions{" "}
            <br />
            - RASC-AL: https://rascal.nianet.org/competition-details/ <br />-
            Blue Skies: https://blueskies.nianet.org/competition/
          </CardDescription>
        </CardHeader>
        <CardContent>
          Details can be found below: <br />- AIAA:
          https://www.aiaa.org/get-involved/students-educators/Design-Competitions{" "}
          <br />
          - RASC-AL: https://rascal.nianet.org/competition-details/ <br />- Blue
          Skies: https://blueskies.nianet.org/competition/
        </CardContent>
        <CardContent>
          <FormField
            control={form.control}
            name="challenges"
            render={() => (
              <FormItem>
                {challenges.map((challenge) => (
                  <FormField
                    key={challenge.id}
                    control={form.control}
                    name="challenges"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={challenge.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.some(
                                (value) => value.challenge === challenge.id,
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      { challenge: challenge.id },
                                    ])
                                  : field.onChange(
                                      field.value.filter(
                                        (value) =>
                                          value.challenge !== challenge.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {challenge.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Which Design Challenge are you most interested in?
          </CardTitle>
          <CardDescription>
            This helps us more quickly match applicants with their desired
            design challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="interestedChallenge"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={Challenge.AIAA} id="AIAA" />
                          <FormLabel htmlFor="AIAA">AIAA</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={Challenge.RASC_AL}
                            id="RASC-AL"
                          />
                          <FormLabel htmlFor="RASC-AL">RASC-AL</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={Challenge.Blue_Skies}
                            id="Blue Skies"
                          />
                          <FormLabel htmlFor="Blue Skies">Blue Skies</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
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
            Describe an instance where you demonstrated your passion for a
            project, task, or subject matter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="passionAnswer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Long answer text" {...field} />
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
            Are you interested in a leadership position on a team?
          </CardTitle>
          <CardDescription>
            These positions will vary from team to team in terms of number and
            specific responsibilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="isLeadership"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ? "true" : ""}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="yes" />
                          <FormLabel htmlFor="yes">Yes</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="no" />
                          <FormLabel htmlFor="no">No</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
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
