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
import { q, TEAMS } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { ReferralSource } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { X, ArrowUp, ArrowDown } from "lucide-react";

export default function ThinkTankInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();
  const selectedTeams = form.watch("thinkTankInfo.preferredTeams");

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
                  {q.thinkTankInfo.meetings}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Workshops: Wednesdays 6:30-7:30pm, Location TBD, team meetings
                  scheduled post-Onboarding
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
                  {q.thinkTankInfo.weeklyCommitment}{" "}
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

      {/* Preferred Teams - Ranking System */}
      <FormField
        control={form.control}
        name="thinkTankInfo.preferredTeams"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  Preferred Teams <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Select and rank your preferred teams in order of preference. You
                  can reorder them after selection.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Team Selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Available Teams:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {TEAMS.filter((team) =>
                      !selectedTeams.some((t) => t.teamId === team.id),
                    ).map((team) => (
                      <Button
                        key={team.id}
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const updatedTeams = [
                            ...field.value,
                            {
                              teamId: team.id,
                              ranking: field.value.length + 1, // Next rank
                            },
                          ];
                          form.setValue("thinkTankInfo.preferredTeams", updatedTeams);
                        }}
                        className="justify-start"
                      >
                        + {team.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Teams with Ranking */}
                {selectedTeams.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">
                      Your Team Preferences (in order):
                    </h4>
                    <div className="space-y-2">
                      {selectedTeams
                        .sort((a, b) => (a.ranking || 0) - (b.ranking || 0))
                        .map((selectedTeam, index) => {
                          const team = TEAMS.find((t) => t.id === selectedTeam.teamId);
                          if (!team) return null;

                          return (
                            <div
                              key={selectedTeam.teamId}
                              className="flex items-center gap-3 rounded-lg border p-3"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium">{team.name}</span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {index === 0
                                    ? "(1st choice)"
                                    : index === 1
                                      ? "(2nd choice)"
                                      : `(${index + 1}${index === 2 ? "rd" : "th"} choice)`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (index > 0) {
                                      const updated = [...selectedTeams];
                                      const currentItem = updated[index];
                                      const previousItem = updated[index - 1];
                                      if (currentItem && previousItem) {
                                        // Swap rankings
                                        const tempRanking = currentItem.ranking;
                                        currentItem.ranking = previousItem.ranking;
                                        previousItem.ranking = tempRanking;
                                      }
                                      form.setValue("thinkTankInfo.preferredTeams", updated);
                                    }
                                  }}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (index < selectedTeams.length - 1) {
                                      const updated = [...selectedTeams];
                                      const currentItem = updated[index];
                                      const nextItem = updated[index + 1];
                                      if (currentItem && nextItem) {
                                        // Swap rankings
                                        const tempRanking = currentItem.ranking;
                                        currentItem.ranking = nextItem.ranking;
                                        nextItem.ranking = tempRanking;
                                      }
                                      form.setValue("thinkTankInfo.preferredTeams", updated);
                                    }
                                  }}
                                  disabled={index === selectedTeams.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updated = selectedTeams.filter(
                                      (t) => t.teamId !== selectedTeam.teamId,
                                    );
                                    // Reindex rankings
                                    const reindexed = updated.map((team, idx) => ({
                                      ...team,
                                      ranking: idx + 1,
                                    }));
                                    form.setValue("thinkTankInfo.preferredTeams", reindexed);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

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
                  {q.thinkTankInfo.referralSources}{" "}
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
                          const currentValues = field.value;
                          const updated = checked
                            ? [...currentValues, source]
                            : currentValues.filter((s) => s !== source);
                          form.setValue("thinkTankInfo.referralSources", updated);
                        }}
                      />
                      <FormLabel className="leading-none">
                        {source === "MSC_OPEN_HOUSE" 
                          ? "MSC Open House (Club Crawl)" 
                          : source.replace(/_/g, " ")}
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
