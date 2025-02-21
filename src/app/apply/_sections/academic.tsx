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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { q } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { Year, Major } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

export default function AcademicInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{q.academic.title}</CardTitle>
          <Separator />
        </CardHeader>
      </Card>

      {/* Current Year at TAMU */}
      <FormField
        control={form.control}
        name="academic.year"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.academic.year} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {Object.values(Year).map((year) => (
                      <FormItem key={year}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={year} id={year} />
                          <FormLabel htmlFor={year}>{year}</FormLabel>
                        </div>
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

      {/* Major */}
      <FormField
        control={form.control}
        name="academic.major"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.academic.major} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Select your major from the dropdown. If undecided, choose "OPEN".
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Major).map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Current Semester Classes */}
      <FormField
        control={form.control}
        name="academic.currentClasses"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {q.academic.currentClasses} 
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Enter at least two classes in format 'XXXX 123' (e.g., ENGR 102)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {field.value.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`academic.currentClasses.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Input
                            {...field}
                            placeholder="XXXX 123"
                            pattern="[A-Z]{4} \d{3}"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const updated = [...field.value];
                        updated.splice(index, 1);
                        field.onChange(updated);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([...field.value, ""])}
                >
                  Add Class
                </Button>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Next Semester Classes */}
      <FormField
        control={form.control}
        name="academic.nextClasses"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {q.academic.nextClasses} 
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Enter at least two classes in format 'XXXX 123' (e.g., ENGR 102)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {field.value.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`academic.nextClasses.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Input
                            {...field}
                            placeholder="XXXX 123"
                            pattern="[A-Z]{4} \d{3}"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const updated = [...field.value];
                        updated.splice(index, 1);
                        field.onChange(updated);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([...field.value, ""])}
                >
                  Add Class
                </Button>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Time Commitments */}
      {["CURRENT", "PLANNED"].map((type) => (
        <FormField
          key={type}
          control={form.control}
          name="academic.timeCommitment"
          render={({ field }) => (
            <FormItem>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {type === "CURRENT" ? "Current Time Commitments" : "Planned Time Commitments"}
                  </CardTitle>
                  <CardDescription>
                    Enter commitments between 1-15 hours per week
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(field.value ?? [])
                    .filter((c) => c.type === type)
                    .map((commitment, idx) => {
                      const globalIndex = (field.value ?? []).findIndex(c => 
                        c.type === type && (field.value ?? []).filter(fc => fc.type === type).indexOf(c) === idx
                      );
                      return (
                        <div key={globalIndex} className="grid grid-cols-[1fr_100px_40px] gap-4 items-start">
                          <FormField
                            control={form.control}
                            name={`academic.timeCommitment.${globalIndex}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  placeholder="Commitment name"
                                  onBlur={async () => {
                                    field.onBlur();
                                    if (field.value) {
                                      await form.trigger(`academic.timeCommitment.${globalIndex}.name`);
                                    }
                                  }}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`academic.timeCommitment.${globalIndex}.hours`}
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  type="number"
                                  {...field}
                                  min={1}
                                  max={15}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const currentValue = field.value ?? [];
                              const updated = [...currentValue];
                              updated.splice(globalIndex, 1);
                              form.setValue("academic.timeCommitment", updated);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentValue = field.value ?? [];
                      form.setValue("academic.timeCommitment", [
                        ...currentValue,
                        { name: "Commitment Name", hours: 1, type: type as "CURRENT" | "PLANNED" }
                      ]);
                    }}
                  >
                    Add Commitment
                  </Button>
                </CardContent>
              </Card>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
