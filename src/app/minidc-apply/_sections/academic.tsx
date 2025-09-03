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
import { qMiniDC } from "@/consts/minidc-apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { Year, Major } from "@prisma/client";
import type { CommitmentType } from "@prisma/client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X } from "lucide-react";

export default function AcademicInfo() {
  const form = useFormContext<RouterInputs["minidc"]["MiniDCApplyForm"]>();

  const {
    formState: { errors },
  } = form;

  const {
    fields: currentClassesFields,
    append: appendCurrentClass,
    remove: removeCurrentClass,
  } = useFieldArray({
    control: form.control,
    name: "academic.currentClasses",
  });

  const {
    fields: commitmentFields,
    append: appendCommitment,
    remove: removeCommitment,
  } = useFieldArray({
    control: form.control,
    name: "academic.timeCommitment",
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {qMiniDC.academic.title}
          </CardTitle>
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
                  {qMiniDC.academic.year}{" "}
                  <span className="text-red-500">*</span>
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
                  {qMiniDC.academic.major}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Use the 4 letter uppercase abbreviation of your major. If in
                  general engineering, respond with your intended major. If
                  undecided, respond with 'OPEN'
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
            {qMiniDC.academic.currentClasses}
            <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription>
            Enter at least two classes in one of the following formats:
            <br />
            - TAMU format: 'XXXX 123' (e.g., ENGR 102)
            <br />
            - Blinn format: 'XXXXb1234' (e.g., MATHb2413)
            <br />
            If you have fewer than two courses, use 'NULL 101' as a placeholder
            and contact us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {currentClassesFields.map((item, index) => (
            <div key={item.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`academic.currentClasses.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Input {...field} placeholder="XXXX 123" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeCurrentClass(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendCurrentClass({ value: "" })}
          >
            Add Class
          </Button>
          {errors.academic?.currentClasses?.message && (
            <p className="mt-2 text-sm font-medium text-destructive">
              {errors.academic.currentClasses.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Time Commitments */}
      <FormField
        control={form.control}
        name="academic.timeCommitment"
        render={() => (
          <FormItem>
            {["CURRENT", "PLANNED"].map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle>
                    {type === "CURRENT"
                      ? "Current Time Commitments"
                      : "Planned Time Commitments"}
                  </CardTitle>
                  <CardDescription>
                    Enter commitments between 1-15 hours per week
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {commitmentFields.map(
                    (item, index) =>
                      item.type === type && (
                        <div
                          key={item.id}
                          className="grid grid-cols-[1fr_4rem_2.5rem] items-start gap-2"
                        >
                          <FormField
                            control={form.control}
                            name={`academic.timeCommitment.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  placeholder="Commitment Name"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`academic.timeCommitment.${index}.hours`}
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Hours per week"
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value, 10))
                                  }
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeCommitment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ),
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendCommitment({
                        name: "",
                        hours: 1,
                        type: type as CommitmentType,
                      })
                    }
                  >
                    Add Commitment
                  </Button>
                </CardContent>
              </Card>
            ))}
            {errors.academic?.timeCommitment?.message && (
              <div className="px-6">
                <p className="-mt-4 text-sm font-medium text-destructive">
                  {errors.academic.timeCommitment.message}
                </p>
              </div>
            )}
          </FormItem>
        )}
      />

      {/* Weekly Commitment */}
      <FormField
        control={form.control}
        name="academic.weeklyCommitment"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {qMiniDC.academic.weeklyCommitment}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value ? "true" : "false"}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
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
