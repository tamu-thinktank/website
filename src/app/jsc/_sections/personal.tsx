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
import { q } from "@/consts/jsc-questions";
import { type RouterInputs } from "@/lib/trpc/shared";
import { Year } from "@prisma/client";
import { useFormContext } from "react-hook-form";

export default function PersonalInfo() {
  const form = useFormContext<RouterInputs["public"]["jsc"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{q.personal.title}</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>hausdas</CardContent>
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
        name="personal.companyName"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.companyName}{" "}
                  <span className="text-red-500">*</span>
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
                  <Input type="text" placeholder="mail@gmail.com" {...field} />
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
                  Provide any other points of contact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="text" placeholder="a@b.com" {...field} />
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
