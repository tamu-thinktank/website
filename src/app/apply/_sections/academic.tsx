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
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function AcademicInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();
  const currentClasses = form.watch("academic.currentClasses");
  const nextClasses = form.watch("academic.nextClasses");

  const addCurrentClass = () => {
    if (currentClasses.length < 7) {
      form.setValue("academic.currentClasses", [...currentClasses, ""]);
    }
  };

  const removeCurrentClass = (index: number) => {
    if (currentClasses.length > 2) {
      const updated = currentClasses.filter((_, i) => i !== index);
      form.setValue("academic.currentClasses", updated);
    }
  };

  const addNextClass = () => {
    if (nextClasses.length < 7) {
      form.setValue("academic.nextClasses", [...nextClasses, ""]);
    }
  };

  const removeNextClass = (index: number) => {
    if (nextClasses.length > 2) {
      const updated = nextClasses.filter((_, i) => i !== index);
      form.setValue("academic.nextClasses", updated);
    }
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
          <CardTitle>
            Current Semester Classes <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            If you have more than 7 classes, please list your main/core classes
            here. At least 2 classes are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentClasses.map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`academic.currentClasses.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder={
                          index < 2
                            ? `Class ${index + 1} (Required): e.g., ENGR 102`
                            : `Class ${index + 1} (Optional): e.g., PHYS 206`
                        }
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    {currentClasses.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeCurrentClass(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          
          {currentClasses.length < 7 && (
            <Button
              type="button"
              variant="outline"
              onClick={addCurrentClass}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Class ({currentClasses.length}/7)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Next Semester Classes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Next Semester Classes <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            If you have more than 7 classes planned, please list your main/core
            classes here. At least 2 classes are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextClasses.map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`academic.nextClasses.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder={
                          index < 2
                            ? `Class ${index + 1} (Required): e.g., ENGR 216`
                            : `Class ${index + 1} (Optional): e.g., PHYS 207`
                        }
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    {nextClasses.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeNextClass(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          
          {nextClasses.length < 7 && (
            <Button
              type="button"
              variant="outline"
              onClick={addNextClass}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Class ({nextClasses.length}/7)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Time Commitments */}
      <Card>
        <CardHeader>
          <CardTitle>Time Commitments (Optional)</CardTitle>
          <CardDescription className="text-gray-500">
            Please estimate the total combined hours per week (on average) for all
            your current and planned commitments. This includes work, organizations,
            sports, volunteering, etc. Maximum 40 hours total.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="academic.currentCommitmentHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Total Hours/Week</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    min={0}
                    max={40}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="academic.plannedCommitmentHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Planned Total Hours/Week</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    min={0}
                    max={40}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
