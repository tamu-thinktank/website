"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useMediaQuery from "@/hooks/use-media-query";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import AvailabilityGrid from "./_components/availability-grid";
import { eventTimezone, timezones } from "./_consts";

export default function MeetingTimes() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [openTimezone, setOpenTimezone] = useState(false);

  return (
    <Card className="h-[95%] overflow-auto">
      <CardContent className="mt-6 flex flex-col gap-1">
        <Label className="text-sm font-semibold">Your time zone</Label>
        {isDesktop ? (
          <Popover open={openTimezone} onOpenChange={setOpenTimezone}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit justify-start">
                {userTimezone}{" "}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <TimezoneList
                setOpen={setOpenTimezone}
                setTimezone={setUserTimezone}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Drawer open={openTimezone} onOpenChange={setOpenTimezone}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-fit justify-start">
                {userTimezone}{" "}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mt-4 border-t">
                <TimezoneList
                  setOpen={setOpenTimezone}
                  setTimezone={setUserTimezone}
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {eventTimezone !== userTimezone && (
          <CardDescription>
            This event was created in the timezone{" "}
            <strong>{eventTimezone}</strong>.{" "}
            <a
              href="#"
              className="text-purple-400 underline"
              onClick={(e) => {
                e.preventDefault();
                setUserTimezone(eventTimezone);
              }}
            >
              Click here
            </a>{" "}
            to use it.
          </CardDescription>
        )}

        {((Intl.DateTimeFormat().resolvedOptions().timeZone !== userTimezone &&
          eventTimezone !== Intl.DateTimeFormat().resolvedOptions().timeZone) ||
          (eventTimezone === undefined &&
            Intl.DateTimeFormat().resolvedOptions().timeZone !==
              userTimezone)) && (
          <CardDescription>
            Your local timezone is detected to be{" "}
            <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>.{" "}
            <a
              href="#"
              className="text-purple-400 underline"
              onClick={(e) => {
                e.preventDefault();
                setUserTimezone(
                  Intl.DateTimeFormat().resolvedOptions().timeZone,
                );
              }}
            >
              Click here
            </a>{" "}
            to use it.
          </CardDescription>
        )}
      </CardContent>
      <CardContent>
        <AvailabilityGrid userTimezone={userTimezone} />
      </CardContent>
    </Card>
  );
}

function TimezoneList({
  setOpen,
  setTimezone,
}: {
  setOpen: (open: boolean) => void;
  setTimezone: (timezone: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search timezones..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {timezones.map((zone) => (
            <CommandItem
              key={zone}
              value={zone}
              onSelect={(value) => {
                setTimezone(value);
                setOpen(false);
              }}
            >
              {zone}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
