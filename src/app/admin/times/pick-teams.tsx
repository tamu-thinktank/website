"use client";

import { Button } from "@/components/ui/button";
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
import { challenges } from "@/consts/apply-form";
import useMediaQuery from "@/hooks/use-media-query";
import { api } from "@/lib/trpc/react";
import { Check, ChevronsUpDown } from "lucide-react";

export default function PickTeams() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isLoading } = api.admin.getTargetTeams.useQuery();

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-semibold">Your teams</Label>
      {isDesktop ? (
        <Popover>
          <PopoverTrigger asChild disabled={isLoading}>
            <Button variant="outline" className="w-fit justify-start">
              Select teams
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <TeamsList />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-fit justify-start">
              Select teams
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <TeamsList />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function TeamsList() {
  const apiUtils = api.useUtils();
  const { data: selectedTeams } = api.admin.getTargetTeams.useQuery();
  const {
    mutate: selectTeam,
    variables: selectionInput,
    isPending: isSelecting,
  } = api.admin.updateTargetTeams.useMutation({
    onSettled: async () => {
      return await apiUtils.admin.getTargetTeams.invalidate();
    },
  });

  return (
    <Command>
      <CommandInput placeholder="Search teams..." />
      <CommandList>
        <CommandEmpty>No teams found.</CommandEmpty>
        <CommandGroup>
          {challenges.map(({ id: challengeId }) => (
            <CommandItem
              key={challengeId}
              value={challengeId}
              onSelect={() => {
                selectTeam({
                  team: challengeId,
                  op: selectedTeams?.includes(challengeId) ? "remove" : "add",
                });
              }}
              disabled={isSelecting && selectionInput.team === challengeId}
              className={
                isSelecting && selectionInput.team === challengeId
                  ? "opacity-50"
                  : ""
              }
            >
              <div className="flex items-center space-x-2">
                <Check
                  className={
                    selectedTeams?.includes(challengeId)
                      ? "opacity-100"
                      : "opacity-0"
                  }
                />
                <label
                  htmlFor={challengeId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {challengeId}
                </label>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
