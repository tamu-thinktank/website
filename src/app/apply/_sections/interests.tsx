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
import { q } from "@/consts/apply-questions";
import { type RouterInputs } from "@/lib/trpc/shared";
import { Challenge } from "@prisma/client";
import { useFormContext } from "react-hook-form";

const challenges: {
  id: Challenge;
  label: string;
  link: string;
}[] = [
  {
    id: Challenge.TDC_93,
    label: "TDC-93",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.TDC_94,
    label: "TDC-94",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.TDC_95,
    label: "TDC-95",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.TDC_96,
    label: "TDC-96",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.TDC_97,
    label: "TDC-97",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  },
  {
    id: Challenge.TDC_98,
    label: "TDC-98",
    link: "https://ig.utexas.edu/tsgc/design-challenge/",
  }

];

export default function Interests() {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

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
                  Details can be found below: <br /> https://docs.google.com/spreadsheets/d/1RV2x2WfHnKadF7-wfvLKe-247PeqpOvk/edit?usp=sharing&ouid=110812824996366755065&rtpof=true&sd=true
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
                              <FormLabel className="font-normal">
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
                    value={field.value}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={Challenge.TDC_93} 
                            id="TDC-93" 
                          />
                          <FormLabel htmlFor="TDC-93">TDC-93</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={Challenge.TDC_94} 
                            id="TDC-94" 
                          />
                          <FormLabel htmlFor="TDC-94">TDC-94</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={Challenge.TDC_95} 
                            id="TDC-95" 
                          />
                          <FormLabel htmlFor="TDC-95">TDC-95</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={Challenge.TDC_96} 
                            id="TDC-96" 
                          />
                          <FormLabel htmlFor="TDC-96">TDC-96</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={Challenge.TDC_97} 
                            id="TDC-97" 
                          />
                          <FormLabel htmlFor="TDC-97">TDC-97</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={Challenge.TDC_98} 
                            id="TDC-98" 
                          />
                          <FormLabel htmlFor="TDC-98">TDC-98</FormLabel>
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
