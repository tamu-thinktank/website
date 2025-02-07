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
          <CardTitle>{q.academic.title}</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          Provide details about your academic background and commitments.
        </CardContent>
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
                  <select 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value)} 
                    className="w-full border rounded-md p-2"
                  >
                    <option value="" disabled>Select your major</option>
                    {Object.values(Major).map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
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
                  Enter at least two classes (e.g., ENGR 102, MATH 151)
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
                            placeholder={`Class ${index + 1} (e.g., ENGR 102)`}
                          />
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
                        form.setValue("academic.currentClasses", updated);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {field.value.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.setValue("academic.currentClasses", [...field.value, ""])}
                  >
                    Add Class
                  </Button>
                )}
              </CardContent>
              <FormMessage>
                {form.formState.errors.academic?.currentClasses?.message}
              </FormMessage>
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
                  Enter at least two classes (e.g., ENGR 102, MATH 151)
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
                            placeholder={`Class ${index + 1} (e.g., ENGR 102)`}
                          />
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
                        form.setValue("academic.nextClasses", updated);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {field.value.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.setValue("academic.nextClasses", [...field.value, ""])}
                  >
                    Add Class
                  </Button>
                )}
              </CardContent>
              <FormMessage>
                {form.formState.errors.academic?.nextClasses?.message}
              </FormMessage>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  {field.value
                    .filter((c) => c.type === type)
                    .map((commitment, index) => {
                      const globalIndex = field.value.findIndex(c => c === commitment);
                      return (
                        <div key={globalIndex} className="grid grid-cols-[1fr_100px_40px] gap-4 items-start">
                          <FormField
                            control={form.control}
                            name={`academic.timeCommitment.${globalIndex}.name`}
                            render={({ field }) => (
                              <FormItem className="h-full">
                                <Input
                                  {...field}
                                  placeholder="Commitment name"
                                  value={field.value || ""}
                                />
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`academic.timeCommitment.${globalIndex}.hours`}
                            render={({ field }) => (
                              <FormItem className="h-full">
                                <Input
                                  type="number"
                                  {...field}
                                  min={1}
                                  value={field.value || 1}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mt-[2px]"
                            onClick={() => {
                              const updated = field.value.filter((_, i) => i !== globalIndex);
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
                    onClick={() => form.setValue("academic.timeCommitment", [
                      ...field.value,
                      { 
                        name: "", 
                        hours: 1, // Default to minimum 1 hour
                        type: type as "CURRENT" | "PLANNED" 
                      }
                    ])}
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
