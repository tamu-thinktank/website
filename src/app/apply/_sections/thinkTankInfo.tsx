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
import { q, TEAMS, RESEARCH_AREAS, INTEREST_LEVELS } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import type { InterestLevel } from "@prisma/client";
import { ReferralSource } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ThinkTankInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();
  const selectedTeams = form.watch("thinkTankInfo.preferredTeams");

  // Get available research areas based on selected teams
  const availableResearch = RESEARCH_AREAS.filter(ra =>
    ra.relatedTeams.some(teamId => 
      selectedTeams.map(t => t.teamId).includes(teamId)
    )
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{q.thinkTankInfo.title}</CardTitle>
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
                  {q.thinkTankInfo.meetings} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Workshops: Thursdays 6-7pm in RICH 106, team meetings scheduled post-Onboarding
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
                  value={field.value.toString()}
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
              {TEAMS.map((team) => {
                const isSelected = field.value.some(t => t.teamId === team.id);
                
                return (
                  <div key={team.id} className="relative flex flex-col gap-2 border p-4 rounded-lg">
                    {/* Checkbox and Label Container */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const updatedTeams = checked
                              ? [...field.value, { 
                                  teamId: team.id, 
                                  interestLevel: "MEDIUM" as InterestLevel
                                }]
                              : field.value.filter(t => t.teamId !== team.id);

                            // First update the teams
                            form.setValue("thinkTankInfo.preferredTeams", updatedTeams);

                            // Then filter research areas to only those belonging to remaining teams
                            const remainingTeamIds = updatedTeams.map(t => t.teamId);
                            const validResearchIds = TEAMS
                              .filter(t => remainingTeamIds.includes(t.id))
                              .flatMap(t => t.researchAreas)
                              .map(ra => ra.id);

                            const updatedResearch = form.getValues("thinkTankInfo.researchAreas")
                              .filter(ra => validResearchIds.includes(ra.researchAreaId));

                            form.setValue("thinkTankInfo.researchAreas", updatedResearch);
                          }}
                          />
                          <FormLabel className="m-0">{team.name}</FormLabel>
                        </div>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              const updated = field.value.filter(t => t.teamId !== team.id);
                              form.setValue("thinkTankInfo.preferredTeams", updated);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Select
                            value={field.value.find(t => t.teamId === team.id)?.interestLevel ?? "MEDIUM"}
                            onValueChange={(value) => {
                              const updated = field.value.map(t => 
                                t.teamId === team.id 
                                  ? { ...t, interestLevel: value as InterestLevel }
                                  : t
                              );
                              form.setValue("thinkTankInfo.preferredTeams", updated);
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
                <CardDescription>Select up to 3 research areas from your chosen teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              {availableResearch.map((area) => {
                const isSelected = field.value.some(ra => ra.researchAreaId === area.id);
                
                return (
                  <div key={area.id} className="relative flex flex-col gap-2 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...field.value, { 
                                    researchAreaId: area.id, 
                                    interestLevel: "MEDIUM" as InterestLevel
                                  }]
                                : field.value.filter(ra => ra.researchAreaId !== area.id);
                              form.setValue("thinkTankInfo.researchAreas", updated);
                            }}
                            disabled={!isSelected && field.value.length >= 3}
                          />
                          <FormLabel className="m-0">{area.name}</FormLabel>
                        </div>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              const updated = field.value.filter(ra => ra.researchAreaId !== area.id);
                              form.setValue("thinkTankInfo.researchAreas", updated);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Select
                            value={field.value.find(ra => ra.researchAreaId === area.id)?.interestLevel ?? "MEDIUM"}
                            onValueChange={(value) => {
                              const updated = field.value.map(ra => 
                                ra.researchAreaId === area.id 
                                  ? { ...ra, interestLevel: value as InterestLevel }
                                  : ra
                              );
                              form.setValue("thinkTankInfo.researchAreas", updated);
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
                          form.setValue("thinkTankInfo.referralSources", updated);
                        }}
                      />
                      <FormLabel className="leading-none">
                        {source.replace(/_/g, ' ')}
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
