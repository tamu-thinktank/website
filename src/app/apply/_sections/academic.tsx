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
            List your classes for the current semester. At least 2 classes are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array(7).fill(null).map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`academic.currentClasses.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder={`Class ${index + 1}: e.g., ENGR 102`}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </CardContent>
      </Card>

      {/* Next Semester Classes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Next Semester Classes <span className="text-red-500">*</span>
          </CardTitle>
          <CardDescription className="text-gray-500">
            List your planned classes for next semester. At least 2 classes are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array(7).fill(null).map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`academic.nextClasses.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder={`Class ${index + 1}: e.g., ENGR 216`}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
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
