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
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Current Semester Classes</h3>
        <p className="text-sm text-gray-600">
          If you have more than 7 classes, please list your main/core classes here. At least 2 classes are required.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Classes <span className="text-red-500">*</span></CardTitle>
          <CardDescription>Enter at least 2 current classes. Format: XXXX 123 or XXXXb1234</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          <FormField control={form.control} name="academic.currentClasses.0" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 1 (Required): ENGR 102" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.currentClasses.1" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 2 (Required): MATH 151" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.currentClasses.2" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 3 (Optional): PHYS 206" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.currentClasses.3" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 4 (Optional): CHEM 107" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.currentClasses.4" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 5 (Optional): HIST 105" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.currentClasses.5" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 6 (Optional): ENGL 104" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.currentClasses.6" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 7 (Optional): KINE 199" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>
      </Card>

      {/* Next Semester Classes - 7 fields */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Next Semester Classes</h3>
        <p className="text-sm text-gray-600">
          If you have more than 7 classes planned, please list your main/core classes here. At least 2 classes are required.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Next Semester Classes <span className="text-red-500">*</span></CardTitle>
          <CardDescription>Enter at least 2 planned classes. Format: XXXX 123 or XXXXb1234</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          <FormField control={form.control} name="academic.nextClasses.0" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 1 (Required): ENGR 216" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.nextClasses.1" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 2 (Required): MATH 152" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.nextClasses.2" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 3 (Optional): PHYS 207" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.nextClasses.3" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 4 (Optional): CHEM 117" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.nextClasses.4" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 5 (Optional): POLS 206" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.nextClasses.5" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 6 (Optional): COMM 203" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.nextClasses.6" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value ?? ""} placeholder="Class 7 (Optional): ARTS 101" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>
      </Card>

      {/* Time Commitments - Super Simple */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Time Commitments</h3>
        <p className="text-sm text-gray-600">
          Please estimate the total combined hours per week (on average) for all your current and planned commitments. 
          This includes work, organizations, sports, volunteering, etc. Maximum 40 hours total.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Time Commitments (Optional)</CardTitle>
          <CardDescription>Add up all your time commitments and enter the total hours per week</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="academic.currentCommitmentHours" render={({ field }) => (
            <FormItem>
              <FormLabel>Current Total Hours/Week</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0" min={0} max={40} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="academic.plannedCommitmentHours" render={({ field }) => (
            <FormItem>
              <FormLabel>Planned Total Hours/Week</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0" min={0} max={40} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>
      </Card>
    </div>
  );
}
