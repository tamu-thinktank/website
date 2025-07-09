"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { INTEREST_LEVELS, MATEROV_SUBTEAM_OPTIONS, SKILL_OPTIONS, LEARNING_AREA_OPTIONS, EXPERIENCE_LEVELS, LEARNING_INTEREST_LEVELS } from "@/consts/apply-form";
import { qMateROV } from "@/consts/materov-apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import type {
  InterestLevel,
  ExperienceLevel,
  LearningInterestLevel,
} from "@prisma/client";
import { ReferralSource } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MateROVThinkTankInfo() {
  const form = useFormContext<RouterInputs["mateROV"]["MateROVApplyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {qMateROV.thinkTankInfo.title}
          </CardTitle>
          <Separator />
        </CardHeader>
      </Card>

      {/* In-Person Meetings */}
      <FormField
        control={form.control}
        name="thinkTankInfo.meetings"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.meetings}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Meetings will take place on Saturdays for the next 2 semesters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value.toString()}
                >
                  <div className="space-y-2">
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="meetings-yes" />
                        <FormLabel htmlFor="meetings-yes">
                          Yes, I can attend
                        </FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="meetings-no" />
                        <FormLabel htmlFor="meetings-no">
                          No, I cannot attend regularly
                        </FormLabel>
                      </div>
                    </FormItem>
                  </div>
                </RadioGroup>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Weekly Commitment */}
      <FormField
        control={form.control}
        name="thinkTankInfo.weeklyCommitment"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.weeklyCommitment}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value.toString()}
                >
                  <div className="space-y-2">
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="commitment-yes" />
                        <FormLabel htmlFor="commitment-yes">
                          Yes, I can commit
                        </FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="commitment-no" />
                        <FormLabel htmlFor="commitment-no">
                          No, I cannot commit
                        </FormLabel>
                      </div>
                    </FormItem>
                  </div>
                </RadioGroup>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Subteam Preferences */}
      <FormField
        control={form.control}
        name="thinkTankInfo.subteamPreferences"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.subteamPreferences}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  For each selected team, rate your relative interest compared
                  to the other teams selected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MATEROV_SUBTEAM_OPTIONS.map((subteam) => {
                  const isSelected = field.value.some(
                    (t) => t.name === subteam.value,
                  );

                  return (
                    <div
                      key={subteam.value}
                      className="relative flex flex-col gap-2 rounded-lg border p-4"
                    >
                      {/* Checkbox and Label Container */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const updatedTeams = checked
                                ? [
                                    ...field.value,
                                    {
                                      name: subteam.value,
                                      interest: "MEDIUM" as InterestLevel,
                                    },
                                  ]
                                : field.value.filter(
                                    (t) => t.name !== subteam.value,
                                  );
                              form.setValue(
                                "thinkTankInfo.subteamPreferences",
                                updatedTeams,
                              );
                            }}
                          />
                          <FormLabel className="m-0">{subteam.label}</FormLabel>
                        </div>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              const updated = field.value.filter(
                                (t) => t.name !== subteam.value,
                              );
                              form.setValue(
                                "thinkTankInfo.subteamPreferences",
                                updated,
                              );
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Select
                            value={
                              field.value.find((t) => t.name === subteam.value)
                                ?.interest ?? "MEDIUM"
                            }
                            onValueChange={(value) => {
                              const updated = field.value.map((t) =>
                                t.name === subteam.value
                                  ? { ...t, interest: value as InterestLevel }
                                  : t,
                              );
                              form.setValue(
                                "thinkTankInfo.subteamPreferences",
                                updated,
                              );
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {INTEREST_LEVELS.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                })}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Skills */}
      <FormField
        control={form.control}
        name="thinkTankInfo.skills"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.skills}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  For each skill, rate your relative expertise compared to the
                  other skillsets selected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {SKILL_OPTIONS.map((skill) => {
                  const isSelected = field.value.some(
                    (s) => s.name === skill.value,
                  );

                  return (
                    <div
                      key={skill.value}
                      className="relative flex flex-col gap-2 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [
                                    ...field.value,
                                    {
                                      name: skill.value,
                                      experienceLevel:
                                        "MARGINAL" as ExperienceLevel,
                                    },
                                  ]
                                : field.value.filter(
                                    (s) => s.name !== skill.value,
                                  );
                              form.setValue("thinkTankInfo.skills", updated);
                            }}
                          />
                          <FormLabel className="m-0">{skill.label}</FormLabel>
                        </div>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              const updated = field.value.filter(
                                (s) => s.name !== skill.value,
                              );
                              form.setValue("thinkTankInfo.skills", updated);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Select
                            value={
                              field.value.find((s) => s.name === skill.value)
                                ?.experienceLevel ?? "MARGINAL"
                            }
                            onValueChange={(value) => {
                              const updated = field.value.map((s) =>
                                s.name === skill.value
                                  ? {
                                      ...s,
                                      experienceLevel: value as ExperienceLevel,
                                    }
                                  : s,
                              );
                              form.setValue("thinkTankInfo.skills", updated);
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPERIENCE_LEVELS.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                })}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Learning Interests */}
      <FormField
        control={form.control}
        name="thinkTankInfo.learningInterests"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.learningInterests}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  For each area of interest, rate your relative interest
                  compared to the others provided.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {LEARNING_AREA_OPTIONS.map((area) => {
                  const isSelected = field.value.some(
                    (a) => a.area === area.value,
                  );

                  return (
                    <div
                      key={area.value}
                      className="relative flex flex-col gap-2 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [
                                    ...field.value,
                                    {
                                      area: area.value,
                                      interestLevel:
                                        "MODERATE" as LearningInterestLevel,
                                    },
                                  ]
                                : field.value.filter(
                                    (a) => a.area !== area.value,
                                  );
                              form.setValue(
                                "thinkTankInfo.learningInterests",
                                updated,
                              );
                            }}
                          />
                          <FormLabel className="m-0">{area.label}</FormLabel>
                        </div>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              const updated = field.value.filter(
                                (a) => a.area !== area.value,
                              );
                              form.setValue(
                                "thinkTankInfo.learningInterests",
                                updated,
                              );
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Select
                            value={
                              field.value.find((a) => a.area === area.value)
                                ?.interestLevel ?? "MODERATE"
                            }
                            onValueChange={(value) => {
                              const updated = field.value.map((a) =>
                                a.area === area.value
                                  ? {
                                      ...a,
                                      interestLevel:
                                        value as LearningInterestLevel,
                                    }
                                  : a,
                              );
                              form.setValue(
                                "thinkTankInfo.learningInterests",
                                updated,
                              );
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {LEARNING_INTEREST_LEVELS.map(
                                ({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                })}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Previous Participation */}
      <FormField
        control={form.control}
        name="thinkTankInfo.previousParticipation"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.previousParticipation}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value.toString()}
                >
                  <div className="space-y-2">
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="previous-yes" />
                        <FormLabel htmlFor="previous-yes">Yes</FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="previous-no" />
                        <FormLabel htmlFor="previous-no">No</FormLabel>
                      </div>
                    </FormItem>
                  </div>
                </RadioGroup>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Referral Sources */}
      <FormField
        control={form.control}
        name="thinkTankInfo.referralSources"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMateROV.thinkTankInfo.referralSources}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>Select all that apply</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.values(ReferralSource).map((source) => (
                  <FormItem key={source}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value.includes(source)}
                        onCheckedChange={(checked) => {
                          const updated = checked
                            ? [...field.value, source]
                            : field.value.filter((s) => s !== source);
                          form.setValue(
                            "thinkTankInfo.referralSources",
                            updated,
                          );
                        }}
                      />
                      <FormLabel className="leading-none">
                        {source.replace(/_/g, " ")}
                      </FormLabel>
                    </div>
                  </FormItem>
                ))}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </div>
  );
}