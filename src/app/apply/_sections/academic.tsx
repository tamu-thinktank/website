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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { q } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { Year, Major } from "@prisma/client";
import { useFormContext, useWatch } from "react-hook-form";
import { X } from "lucide-react";

export default function AcademicInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  // Stable validation function
  const validateClass = (value: string) => {
    if (!value.trim()) return false;
    return /^(?:[A-Z]{4} \d{3}|[A-Z]{4}b\d{4}|NULL 101)$/.test(value);
  };

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
                  Select your major from the dropdown. If your major is not
                  listed or you are undecided, choose "Other".
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {q.academic.currentClasses}
            <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription>
            Enter your current classes. Use format: XXXX 123 (e.g., ENGR 102) or XXXXb1234 (e.g., MATHb2413). Use 'NULL 101' if you prefer not to share.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormField
            control={form.control}
            name="academic.currentClasses.0"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">1</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="academic.currentClasses.1"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">2</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic.currentClasses.2"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">3</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234 (optional)"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic.currentClasses.3"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">4</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234 (optional)"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic.currentClasses.4"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">5</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234 (optional)"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Next Semester Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {q.academic.nextClasses}
            <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription>
            Enter your planned classes for next semester. Use format: XXXX 123 (e.g., ENGR 102) or XXXXb1234 (e.g., MATHb2413). Use 'NULL 101' if you prefer not to share.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormField
            control={form.control}
            name="academic.nextClasses.0"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">1</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="academic.nextClasses.1"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">2</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic.nextClasses.2"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">3</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234 (optional)"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic.nextClasses.3"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">4</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234 (optional)"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic.nextClasses.4"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">5</div>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="XXXX 123 or XXXXb1234 (optional)"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Time Commitments - Unified System */}
      <FormField
        control={form.control}
        name="academic.timeCommitment"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>Time Commitments</CardTitle>
                <CardDescription>
                  Add your current and planned time commitments (optional). Helps us understand your availability.
                  Hours should be between 1-15 per week per commitment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(field.value ?? []).map((commitment, index) => (
                  <div
                    key={`commitment-${index}`}
                    className="grid grid-cols-[2fr_120px_120px_40px] items-start gap-4 p-3 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`academic.timeCommitment.${index}.name`}
                      render={({ field: nameField }) => (
                        <FormItem>
                          <Input
                            {...nameField}
                            value={nameField.value || ""}
                            placeholder="Commitment name (e.g., SAE, Work, Tutoring)"
                            onChange={(e) => {
                              nameField.onChange(e.target.value);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`academic.timeCommitment.${index}.hours`}
                      render={({ field: hoursField }) => (
                        <FormItem>
                          <Input
                            type="number"
                            placeholder="Hours/week"
                            value={hoursField.value || ""}
                            min={0}
                            max={15}
                            onChange={(e) => {
                              const value = e.target.value === "" ? "" : Number(e.target.value);
                              hoursField.onChange(value);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`academic.timeCommitment.${index}.type`}
                      render={({ field: typeField }) => (
                        <FormItem>
                          <select
                            {...typeField}
                            value={typeField.value || "CURRENT"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="CURRENT">Current</option>
                            <option value="PLANNED">Planned</option>
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const updated = [...(field.value ?? [])];
                        updated.splice(index, 1);
                        field.onChange(updated);
                      }}
                      title="Remove commitment"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentValue = field.value ?? [];
                    const newCommitment = {
                      name: "",
                      hours: 1,
                      type: "CURRENT" as "CURRENT" | "PLANNED",
                    };
                    field.onChange([...currentValue, newCommitment]);
                  }}
                  className="w-full"
                >
                  + Add Time Commitment
                </Button>

                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </div>
  );
}
