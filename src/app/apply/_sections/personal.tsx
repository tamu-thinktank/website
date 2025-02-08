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
import { q } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
import { Gender, Pronoun } from "@prisma/client";
import { useFormContext } from "react-hook-form";

export default function PersonalInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{q.personal.title}</CardTitle>
          <Separator />
        </CardHeader>
      </Card>

      <FormField
        control={form.control}
        name="personal.fullName"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.fullName} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="text" placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personal.preferredName"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.preferredName}{" "}
                  <span className="text-red-500"></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Joe"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Preferred Pronouns */}
      <FormField
        control={form.control}
        name="personal.preferredPronoun"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>{q.personal.preferredPronoun}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value as Pronoun)}
                  value={field.value ?? undefined} // Convert null to undefined
                >
                  {Object.values(Pronoun).map((pronoun) => (
                    <FormItem key={pronoun}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={pronoun} id={pronoun} />
                        {/* Convert enum value to a user-friendly label */}
                        <FormLabel htmlFor={pronoun}>
                          {pronoun.replace("_", "/").replace(/_/g, " ")} {/* Replace underscores */}
                        </FormLabel>
                      </div>

                      {/* Show text input if "Other" is selected */}
                      {field.value === "OTHER" && pronoun === "OTHER" && (
                        <Input
                          type="text"
                          placeholder="Specify your pronouns"
                          {...form.register("personal.pronounsText")}
                        />
                      )}
                    </FormItem>
                  ))}
                </RadioGroup>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={form.control}
        name="personal.gender"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>{q.personal.gender}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value as Gender)}
                  value={field.value ?? undefined} // Convert null to undefined
                >
                  {Object.values(Gender).map((gender) => (
                    <FormItem key={gender}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={gender} id={gender} />
                        {/* Convert enum value to a user-friendly label */}
                        <FormLabel htmlFor={gender}>
                          {gender.replace("_", " ").replace(/_/g, " ")} {/* Replace underscores */}
                        </FormLabel>
                      </div>

                      {/* Show text input if "Other" is selected */}
                      {field.value === "OTHER" && gender === "OTHER" && (
                        <Input
                          type="text"
                          placeholder="Specify your gender"
                          {...form.register("personal.genderText")}
                        />
                      )}
                    </FormItem>
                  ))}
                </RadioGroup>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personal.uin"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.uin} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  If you have a special UIN that doesn't match the format
                  123004567, please contact us at: tamuthinktank@gmail.com
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input placeholder="123004567" {...field} />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personal.email"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.email} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="text" placeholder="mail@tamu.edu" {...field} />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personal.altEmail"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>{q.personal.altEmail}</CardTitle>
                <CardDescription>
                  Provide any other email that is a good point of contact in
                  addition to your TAMU email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="a@b.com"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="personal.phone"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.phone} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Enter phone number as 123-456-7890
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="text" placeholder="123-456-7890" {...field} />
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
