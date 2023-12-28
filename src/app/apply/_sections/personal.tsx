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
import { type RouterInputs } from "@/lib/trpc/shared";
import { Availability, Year } from "@prisma/client";
import { useFormContext } from "react-hook-form";

export default function PersonalInfo() {
  const form = useFormContext<RouterInputs["public"]["apply"]>();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
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
                  Full Name <span className="text-red-500">*</span>
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
                  TAMU Email <span className="text-red-500">*</span>
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
                  UIN <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  If you have a special UIN that doesn't match the format
                  123004567, please contact us at: tamuthinktank@gmail.com
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="123004567"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...field}
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
        name="personal.altEmail"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <CardTitle>Additional Email Contact</CardTitle>
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
                  Contact Number <span className="text-red-500">*</span>
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
                  Current Year at TAMU <span className="text-red-500">*</span>
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
                  Major <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Use the four letter abbreviation of your major If in general
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
                  Availability <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Provide the number of hours per week you are available to work
                  on a design challenge
                </CardDescription>
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
                          <RadioGroupItem
                            value={Availability.PART_TIME}
                            id="less"
                          />
                          <FormLabel htmlFor="less">6 - 12 hours</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={Availability.FULL_TIME}
                            id="more"
                          />
                          <FormLabel htmlFor="more"> {">12 hours"}</FormLabel>
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
