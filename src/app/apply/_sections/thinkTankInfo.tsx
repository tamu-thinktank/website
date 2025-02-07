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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { q } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { InterestLevel, ReferralSource } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

export default function ThinkTankInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{q.thinkTankInfo.title}</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          Provide details about your availability and interests within ThinkTank.
        </CardContent>
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
                  {q.thinkTankInfo.meetings} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Workshops: Thursdays 6-7pm in RICH 106, team meetings scheduled post-Onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value?.toString()}
                >
                  <div className="space-y-2">
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="meetings-yes" />
                        <FormLabel htmlFor="meetings-yes">Yes, I can attend</FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="meetings-no" />
                        <FormLabel htmlFor="meetings-no">No, I cannot attend regularly</FormLabel>
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
                  {q.thinkTankInfo.weeklyCommitment} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value?.toString()}
                >
                  <div className="space-y-2">
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="commitment-yes" />
                        <FormLabel htmlFor="commitment-yes">Yes, I can commit</FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="commitment-no" />
                        <FormLabel htmlFor="commitment-no">No, I cannot commit</FormLabel>
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

      {/* Preferred Teams */}
      <FormField
        control={form.control}
        name="thinkTankInfo.preferredTeams"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.thinkTankInfo.preferredTeams} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Select at least one team and rate your interest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Example team selection - replace with actual team data */}
                {['Team 1', 'Team 2', 'Team 3'].map((team) => (
                  <div key={team} className="flex flex-col gap-2 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <FormLabel>{team}</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = field.value.filter(t => t.teamId !== team);
                          form.setValue("thinkTankInfo.preferredTeams", updated);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <RadioGroup
                      value={field.value.find(t => t.teamId === team)?.interestLevel || ''}
                      onValueChange={(value) => {
                        const existing = field.value.find(t => t.teamId === team);
                        const updated = existing
                          ? field.value.map(t => t.teamId === team ? {...t, interestLevel: value as InterestLevel} : t)
                          : [...field.value, { teamId: team, interestLevel: value as InterestLevel }];
                        form.setValue("thinkTankInfo.preferredTeams", updated);
                      }}
                    >
                      <div className="flex gap-4">
                        {Object.values(InterestLevel).map(level => (
                          <FormItem key={level}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={level} id={`${team}-${level}`} />
                              <FormLabel htmlFor={`${team}-${level}`}>{level}</FormLabel>
                            </div>
                          </FormItem>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Research Areas */}
      <FormField
        control={form.control}
        name="thinkTankInfo.researchAreas"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.thinkTankInfo.researchAreas} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>Select up to 3 research areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Example research areas - replace with actual data */}
                {['Area 1', 'Area 2', 'Area 3'].map((area) => (
                  <div key={area} className="flex flex-col gap-2 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <FormLabel>{area}</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = field.value.filter(a => a.researchAreaId !== area);
                          form.setValue("thinkTankInfo.researchAreas", updated);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <RadioGroup
                      value={field.value.find(a => a.researchAreaId === area)?.interestLevel || ''}
                      onValueChange={(value) => {
                        const existing = field.value.find(a => a.researchAreaId === area);
                        const updated = existing
                          ? field.value.map(a => a.researchAreaId === area ? {...a, interestLevel: value as InterestLevel} : a)
                          : [...field.value, { researchAreaId: area, interestLevel: value as InterestLevel }];
                        form.setValue("thinkTankInfo.researchAreas", updated);
                      }}
                    >
                      <div className="flex gap-4">
                        {Object.values(InterestLevel).map(level => (
                          <FormItem key={level}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={level} id={`${area}-${level}`} />
                              <FormLabel htmlFor={`${area}-${level}`}>{level}</FormLabel>
                            </div>
                          </FormItem>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
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
                  {q.thinkTankInfo.referralSources} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.values(ReferralSource).map((source) => (
                  <FormItem key={source}>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value?.includes(source)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...field.value, source]
                              : field.value.filter((s) => s !== source);
                            form.setValue("thinkTankInfo.referralSources", updated);
                          }}
                        />
                      </FormControl>
                      <FormLabel>{source.replace(/_/g, ' ')}</FormLabel>
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
