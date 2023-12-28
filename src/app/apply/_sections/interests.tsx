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
import { type RouterInputs } from "@/lib/trpc/shared";
import { Challenge } from "@prisma/client";
import { useFormContext } from "react-hook-form";

const challenges: {
  id: Challenge;
  label: string;
  link: string;
}[] = [
  {
    id: Challenge.AIAA,
    label: "AIAA",
    link: "https://www.aiaa.org/get-involved/students-educators/Design-Competitions",
  },
  {
    id: Challenge.RASC_AL,
    label: "RASC-AL",
    link: "https://rascal.nianet.org/competition-details/",
  },
  {
    id: Challenge.Blue_Skies,
    label: "Blue Skies",
    link: "https://blueskies.nianet.org/competition/",
  },
];

export default function Interests() {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Interests and Motivation</CardTitle>
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
                  Why are you interested in joining ThinkTank?{" "}
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
                  Which Design Challenges are you interested in?{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Details can be found below: <br />- AIAA:
                  https://www.aiaa.org/get-involved/students-educators/Design-Competitions{" "}
                  <br />- RASC-AL:
                  https://rascal.nianet.org/competition-details/ <br />- Blue
                  Skies: https://blueskies.nianet.org/competition/
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                            <Checkbox
                              checked={field.value?.some(
                                (value) => value === challenge.id,
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      challenge.id,
                                    ])
                                  : field.onChange(
                                      field.value.filter(
                                        (value) => value !== challenge.id,
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
                  Which Design Challenge are you most interested in?{" "}
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
                  Describe an instance where you demonstrated your passion for a
                  project, task, or subject matter{" "}
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
                  Are you interested in a leadership position on a team?{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  These positions will vary from team to team in terms of number
                  and specific responsibilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange}>
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
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </div>
  );
}
