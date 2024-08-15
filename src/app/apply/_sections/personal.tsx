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
import { Year } from "@prisma/client";
import { useFormContext } from "react-hook-form";

export default function PersonalInfo() {
  const form = useFormContext<RouterInputs["public"]["applyForm"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{q.personal.title}</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          Include contacts where you are mostly likely to response if notified
        </CardContent>
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
      <FormField
        control={form.control}
        name="personal.year"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.year} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={Year.FRESHMAN} id="Freshman" />
                          <FormLabel htmlFor="Freshman">Freshman</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={Year.SOPHOMORE}
                            id="Sophomore"
                          />
                          <FormLabel htmlFor="Sophomore">Sophomore</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={Year.JUNIOR} id="Junior" />
                          <FormLabel htmlFor="Junior">Junior</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={Year.SENIOR} id="Senior" />
                          <FormLabel htmlFor="Senior">Senior</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={Year.GRADUATE} id="Graduate" />
                          <FormLabel htmlFor="Graduate">Graduate</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="personal.major"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.major} <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Use the four letter abbreviation of your major. If in general
                  engineering, respond with intended major
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="text" placeholder="AERO" {...field} />
                </FormControl>
                <FormMessage />
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personal.availability"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>
                  {q.personal.availability}{" "}
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      if (value === "true") {
                        field.onChange(true);
                      } else {
                        field.onChange(false);
                      }
                    }}
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            onBlur={field.onBlur}
                            checked={field.value === true}
                            value="true"
                            id="yes"
                          />
                          <FormLabel htmlFor="yes">Yes</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            onBlur={field.onBlur}
                            checked={field.value === false}
                            value="false"
                            id="no"
                          />
                          <FormLabel htmlFor="no">No</FormLabel>
                        </div>
                      </FormControl>
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
