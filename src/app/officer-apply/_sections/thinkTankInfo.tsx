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
import { Checkbox } from "@/components/ui/checkbox";
import { qOfficer } from "@/consts/officer-apply-form";
// import type { { position: OfficerPosition; interestLevel: InterestLevel } } from "@/lib/validations/officer-apply"; // Type doesn't exist
import type { RouterInputs } from "@/lib/trpc/shared";
import {
  OfficerCommitment,
  OfficerPosition,
  InterestLevel,
} from "@prisma/client";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ThinkTankInfo() {
  const form = useFormContext<RouterInputs["officer"]["OfficerApplyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {qOfficer.thinkTankInfo.title}
          </CardTitle>
          <Separator />
        </CardHeader>
      </Card>

      {/* Officer Commitment Question */}
      <FormField
        control={form.control}
        name="thinkTankInfo.officerCommitment"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qOfficer.thinkTankInfo.officerCommitment}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  The number of hours is doubled for Project Managers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) =>
                    field.onChange(value as OfficerCommitment)
                  }
                  value={field.value}
                >
                  <div className="space-y-2">
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={OfficerCommitment.YES}
                          id="commitment-yes"
                        />
                        <FormLabel htmlFor="commitment-yes">Yes</FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={OfficerCommitment.PARTIAL}
                          id="commitment-partial"
                        />
                        <FormLabel htmlFor="commitment-partial">
                          No, I’m too busy for 1 of the semesters
                        </FormLabel>
                      </div>
                    </FormItem>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={OfficerCommitment.NO}
                          id="commitment-no"
                        />
                        <FormLabel htmlFor="commitment-no">No</FormLabel>
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

      {/* Preferred Positions */}
      <FormField
        control={form.control}
        name="thinkTankInfo.preferredPositions"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qOfficer.thinkTankInfo.preferredPositions}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  For each selected position, rate your relative interest.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.values(OfficerPosition).map((position) => {
                  const isSelected = field.value.some(
                    (p: {
                      position: OfficerPosition;
                      interestLevel: InterestLevel;
                    }) => p.position === position,
                  );
                  return (
                    <FormItem key={position}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const updatedPositions = checked
                              ? [
                                  ...field.value,
                                  {
                                    position,
                                    interestLevel: "MEDIUM" as InterestLevel,
                                  },
                                ]
                              : field.value.filter(
                                  (p: {
                                    position: OfficerPosition;
                                    interestLevel: InterestLevel;
                                  }) => p.position !== position,
                                );
                            field.onChange(updatedPositions);
                          }}
                        />
                        <FormLabel className="leading-none">
                          {position.replace(/_/g, " ")}
                        </FormLabel>
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Select
                            value={
                              field.value.find(
                                (p: {
                                  position: OfficerPosition;
                                  interestLevel: InterestLevel;
                                }) => p.position === position,
                              )?.interestLevel ?? "MEDIUM"
                            }
                            onValueChange={(value) => {
                              const updated = field.value.map(
                                (p: {
                                  position: OfficerPosition;
                                  interestLevel: InterestLevel;
                                }) =>
                                  p.position === position
                                    ? {
                                        ...p,
                                        interestLevel: value as InterestLevel,
                                      }
                                    : p,
                              );
                              field.onChange(updated);
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(InterestLevel).map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() +
                                    level.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </FormItem>
                  );
                })}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </div>
  );
}
