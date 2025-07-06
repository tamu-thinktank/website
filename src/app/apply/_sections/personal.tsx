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
import { q, PRONOUN_OPTIONS, GENDER_OPTIONS } from "@/consts/apply-form";
import type { RouterInputs } from "@/lib/trpc/shared";
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

      <FormField
        control={form.control}
        name="personal.pronouns"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>{q.personal.pronouns}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={
                    field.value?.startsWith("OTHER:")
                      ? "OTHER"
                      : (field.value ?? "")
                  }
                  onValueChange={(value) => {
                    if (value === "") {
                      field.onChange(undefined);
                    } else if (value === "OTHER") {
                      field.onChange("OTHER:");
                    } else {
                      field.onChange(value);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="pronoun-none" />
                    <FormLabel htmlFor="pronoun-none">
                      Prefer not to say
                    </FormLabel>
                  </div>
                  {PRONOUN_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`pronoun-${option.value}`}
                      />
                      <FormLabel htmlFor={`pronoun-${option.value}`}>
                        {option.label}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>

                {(field.value?.startsWith("OTHER:") ??
                  form.watch("personal.pronouns") === "OTHER") && (
                  <Input
                    value={
                      field.value?.startsWith("OTHER:")
                        ? (field.value.split(":")[1] ?? "")
                        : ""
                    }
                    onChange={(e) => field.onChange(`OTHER:${e.target.value}`)}
                    placeholder="Specify your pronouns"
                    className="ml-6 mt-2"
                  />
                )}
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

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
                  value={
                    field.value?.startsWith("OTHER:")
                      ? "OTHER"
                      : (field.value ?? "")
                  }
                  onValueChange={(value) => {
                    if (value === "") {
                      field.onChange(undefined);
                    } else if (value === "OTHER") {
                      field.onChange("OTHER:");
                    } else {
                      field.onChange(value);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="gender-none" />
                    <FormLabel htmlFor="gender-none">
                      Prefer not to say
                    </FormLabel>
                  </div>
                  {GENDER_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`gender-${option.value}`}
                      />
                      <FormLabel htmlFor={`gender-${option.value}`}>
                        {option.label}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>

                {(field.value?.startsWith("OTHER:") ??
                  form.watch("personal.gender") === "OTHER") && (
                  <Input
                    value={
                      field.value?.startsWith("OTHER:")
                        ? (field.value.split(":")[1] ?? "")
                        : ""
                    }
                    onChange={(e) => field.onChange(`OTHER:${e.target.value}`)}
                    placeholder="Specify your gender"
                    className="ml-6 mt-2"
                  />
                )}
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
