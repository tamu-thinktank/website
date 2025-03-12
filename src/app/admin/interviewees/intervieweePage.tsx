"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWeekend,
  addWeeks,
  subWeeks,
  isSameDay,
  setHours,
  setMinutes,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Challenge } from "@prisma/client";
import { TableHeader } from "./tableHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
type Availability = "available" | "busy" | "filled";

interface Interview {
  id: string;
  applicantName: string;
  applicantId: string;
  startTime: Date;
  endTime: Date;
  teamId: string;
  location: string;
}

interface TeamPriority {
  teamId: Challenge | string;
  priority: number;
}

interface Interviewer {
  id: string;
  name: string;
  priorityTeams: TeamPriority[];
  interviews: Interview[];
  calendarOpen: boolean;
}

type ViewMode = "day" | "week";

export const IntervieweesPage: React.FC = () => {
  const [interviewers, setInterviewers] = React.useState<Interviewer[]>([
    {
      id: "1",
      name: "John Doe",
      priorityTeams: [
        { teamId: Challenge.TSGC, priority: 1 },
        { teamId: Challenge.AIAA, priority: 2 },
      ],
      interviews: [],
      calendarOpen: false,
    },
    {
      id: "2",
      name: "Jane Smith",
      priorityTeams: [{ teamId: Challenge.AIAA, priority: 1 }],
      interviews: [],
      calendarOpen: false,
    },
    {
      id: "3",
      name: "Alex Chen",
      priorityTeams: [{ teamId: Challenge.TSGC, priority: 1 }],
      interviews: [],
      calendarOpen: false,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = React.useState("DC");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [viewMode, setViewMode] = React.useState<ViewMode>("week");

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedInterviewer, setSelectedInterviewer] = React.useState<
    string | null
  >(null);
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null);
  const [newInterview, setNewInterview] = React.useState({
    applicantName: "",
    teamId: "",
    location: "",
  });

  // Team options
  const teams = [
    { id: Challenge.TSGC, name: "Team 1" },
    { id: Challenge.AIAA, name: "Team 2" },
    { id: "TEAM3", name: "Team 3" },
    { id: "TEAM4", name: "Team 4" },
    { id: "TEAM5", name: "Team 5" },
    { id: "TEAM6", name: "Team 6" },
  ];

  // Calculate availability based on interviews
  const getAvailability = (
    interviewer: Interviewer,
    date: Date,
  ): Availability => {
    const isWeekendDay = isWeekend(date);
    const maxInterviews = isWeekendDay ? 6 : 4;

    // Count interviews for this date
    const interviewsOnDate = interviewer.interviews.filter((interview) =>
      isSameDay(interview.startTime, date),
    ).length;

    if (interviewsOnDate >= maxInterviews) {
      return "filled";
    } else if (interviewsOnDate > 0) {
      return "busy";
    }
    return "available";
  };

  // Add a new interview
  const addInterview = () => {
    if (
      !selectedInterviewer ||
      !selectedTime ||
      !newInterview.applicantName ||
      !newInterview.teamId
    ) {
      return;
    }

    const startTime = new Date(selectedTime);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30); // 30 minute interview

    const interview: Interview = {
      id: Math.random().toString(36).substring(2, 9),
      applicantName: newInterview.applicantName,
      applicantId: Math.random().toString(36).substring(2, 9),
      startTime,
      endTime,
      teamId: newInterview.teamId,
      location: newInterview.location,
    };

    setInterviewers((prev) =>
      prev.map((interviewer) =>
        interviewer.id === selectedInterviewer
          ? {
              ...interviewer,
              interviews: [...interviewer.interviews, interview],
            }
          : interviewer,
      ),
    );

    // Reset form
    setModalOpen(false);
    setSelectedInterviewer(null);
    setSelectedTime(null);
    setNewInterview({
      applicantName: "",
      teamId: "",
      location: "",
    });
  };

  // Update team priorities
  const updateTeamPriority = (
    interviewerId: string,
    teamId: string,
    priority: number,
  ) => {
    setInterviewers((prev) =>
      prev.map((interviewer) => {
        if (interviewer.id === interviewerId) {
          // Check if team already exists in priorities
          const existingIndex = interviewer.priorityTeams.findIndex(
            (pt) => pt.teamId === teamId,
          );

          if (existingIndex >= 0) {
            // Update existing priority
            const updatedPriorities = [...interviewer.priorityTeams];
            updatedPriorities[existingIndex] = {
              ...updatedPriorities[existingIndex],
              priority,
            };
            return { ...interviewer, priorityTeams: updatedPriorities };
          } else {
            // Add new priority
            return {
              ...interviewer,
              priorityTeams: [
                ...interviewer.priorityTeams,
                { teamId, priority },
              ],
            };
          }
        }
        return interviewer;
      }),
    );
  };

  // Remove a team priority
  const removeTeamPriority = (interviewerId: string, teamId: string) => {
    setInterviewers((prev) =>
      prev.map((interviewer) => {
        if (interviewer.id === interviewerId) {
          return {
            ...interviewer,
            priorityTeams: interviewer.priorityTeams.filter(
              (pt) => pt.teamId !== teamId,
            ),
          };
        }
        return interviewer;
      }),
    );
  };

  // Toggle calendar open/close
  const toggleCalendar = (interviewerId: string) => {
    setInterviewers((prev) =>
      prev.map((interviewer) =>
        interviewer.id === interviewerId
          ? { ...interviewer, calendarOpen: !interviewer.calendarOpen }
          : interviewer,
      ),
    );
  };

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    if (viewMode === "day") {
      setCurrentDate((prev) => addDays(prev, -1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "day") {
      setCurrentDate((prev) => addDays(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  // Get current view dates
  const getCurrentViewDates = () => {
    if (viewMode === "day") {
      return [currentDate];
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    }
  };

  const viewDates = getCurrentViewDates();

  // Generate time slots from 8am to 10pm in 15-minute increments
  const generateTimeSlots = () => {
    const slots: Date[] = [];
    const baseDate = new Date();
    baseDate.setSeconds(0, 0);

    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const date = new Date(baseDate);
        date.setHours(hour, minute);
        slots.push(date);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const tableHeaders = ["Name", "Availability", "Priority Teams", "Calendar"];

  // Check if an interview exists at a specific time slot
  const getInterviewAtTimeSlot = (
    interviewer: Interviewer,
    date: Date,
    timeSlot: Date,
  ): Interview | null => {
    if (!isSameDay(date, timeSlot)) {
      return null;
    }

    return (
      interviewer.interviews.find((interview) => {
        const interviewStart = new Date(interview.startTime);
        const interviewEnd = new Date(interview.endTime);

        return (
          isSameDay(interviewStart, date) &&
          interviewStart.getHours() === timeSlot.getHours() &&
          interviewStart.getMinutes() === timeSlot.getMinutes()
        );
      }) || null
    );
  };

  return (
    <div className="flex flex-col overflow-hidden bg-neutral-950 text-xl font-medium shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div className="flex w-full flex-col items-center justify-center whitespace-nowrap bg-neutral-950 px-16 py-5 tracking-wide text-neutral-200 text-opacity-80 max-md:mr-2 max-md:max-w-full max-md:px-5">
        {/* Header content would go here */}
      </div>

      <div className="mt-1 flex w-full flex-col items-center overflow-hidden px-20 pb-96 pt-11 max-md:max-w-full max-md:px-5 max-md:pb-24">
        <div className="mb-0 flex w-full max-w-[1537px] flex-col max-md:mb-2.5 max-md:max-w-full">
          <div className="self-start pb-10 text-center text-5xl font-semibold max-md:text-4xl">
            Scheduler
          </div>

          <div className="flex w-full overflow-hidden rounded-[48px] border border-solid border-neutral-200">
            <div
              onClick={() => setSelectedCategory("DC")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[37px_0px_0px_37px] py-2.5 pl-20 pr-5 transition-colors max-md:max-w-full max-md:pl-5 ${
                selectedCategory === "DC"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              DC
            </div>
            <div className="w-[1.5px] bg-neutral-200"></div>
            <div
              onClick={() => setSelectedCategory("MATE ROV")}
              className={`flex-1 cursor-pointer flex-wrap whitespace-nowrap rounded-[0px_37px_37px_0px] py-2.5 pl-20 pr-5 transition-colors max-md:max-w-full max-md:pl-5 ${
                selectedCategory === "MATE ROV"
                  ? "bg-stone-600 text-white"
                  : "bg-neutral-950 text-gray-300 hover:bg-stone-500"
              }`}
            >
              MATE ROV
            </div>
          </div>

          <div className="mt-9 h-px w-full shrink-0 border border-solid border-neutral-200" />

          <div className="ml-7 mt-8 flex w-auto max-w-full items-center justify-start gap-10 self-stretch px-0 py-0 text-sm tracking-wide text-neutral-200 max-md:flex-col">
            <input
              type="text"
              placeholder="Search by Name or UIN"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-[350px] rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-4 max-md:w-full max-md:max-w-[500px] max-md:px-5"
            />
            <div className="h-12 w-[1px] bg-neutral-400"></div>

            <div className="flex items-center gap-4">
              <button
                onClick={goToToday}
                className="rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-3 text-white transition-colors hover:bg-stone-800"
              >
                Today
              </button>
              <button
                onClick={goToPrevious}
                className="rounded-full border border-solid border-neutral-200 bg-transparent p-2 text-white transition-colors hover:bg-stone-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="rounded-full border border-solid border-neutral-200 bg-transparent p-2 text-white transition-colors hover:bg-stone-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium">
                {viewMode === "day"
                  ? format(currentDate, "MMMM d, yyyy")
                  : `${format(viewDates[0], "MMM d")} - ${format(viewDates[viewDates.length - 1], "MMM d, yyyy")}`}
              </span>
            </div>

            <div className="h-12 w-[1px] bg-neutral-400"></div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode("day")}
                className={`rounded-[48px] border border-solid px-6 py-3 transition-colors ${
                  viewMode === "day"
                    ? "border-stone-600 bg-stone-600 text-white"
                    : "border-neutral-200 bg-transparent text-white hover:bg-stone-800"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`rounded-[48px] border border-solid px-6 py-3 transition-colors ${
                  viewMode === "week"
                    ? "border-stone-600 bg-stone-600 text-white"
                    : "border-neutral-200 bg-transparent text-white hover:bg-stone-800"
                }`}
              >
                Week
              </button>
            </div>
          </div>

          <div className="mt-7 flex w-full flex-col overflow-hidden rounded-[48px] border border-solid border-neutral-200 tracking-wide max-md:max-w-full">
            <div className="flex w-full items-center justify-center gap-10 rounded-t-[48px] bg-neutral-900 px-5 py-4 text-sm font-medium tracking-wide text-neutral-200 max-md:flex-wrap max-md:px-5">
              {tableHeaders.map((header, index) => (
                <div key={index} className="flex-1 text-center">
                  {header}
                </div>
              ))}
            </div>

            {interviewers.map((interviewer, index) => (
              <React.Fragment key={interviewer.id}>
                <div className="flex w-full items-center justify-center gap-10 px-5 py-4 text-sm transition-colors hover:bg-neutral-800">
                  <div className="flex-1 text-center">{interviewer.name}</div>

                  <div className="flex-1 text-center">
                    {viewDates.map((date, i) => {
                      const availability = getAvailability(interviewer, date);
                      const color =
                        availability === "available"
                          ? "text-green-400"
                          : availability === "busy"
                            ? "text-yellow-400"
                            : "text-red-400";

                      return (
                        <span key={i} className="mx-1">
                          <span className={color}>●</span>
                          <span className="ml-1 text-xs">
                            {format(date, "E")}
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex-1 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {interviewer.priorityTeams
                        .sort((a, b) => a.priority - b.priority)
                        .map((teamPriority, i) => {
                          const team = teams.find(
                            (t) => t.id === teamPriority.teamId,
                          );
                          return (
                            <div
                              key={i}
                              className="inline-flex items-center rounded-full bg-stone-700/70 px-3 py-2 text-xs backdrop-blur-sm"
                            >
                              <span>
                                {team?.name} (#{teamPriority.priority})
                              </span>
                              <button
                                className="ml-2 text-red-400 hover:text-red-300"
                                onClick={() =>
                                  removeTeamPriority(
                                    interviewer.id,
                                    teamPriority.teamId,
                                  )
                                }
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center rounded-full bg-stone-800/70 px-2 py-2 text-xs backdrop-blur-sm hover:bg-stone-700">
                            <Plus className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-neutral-700 bg-neutral-900 text-white">
                          {teams
                            .filter(
                              (team) =>
                                !interviewer.priorityTeams.some(
                                  (pt) => pt.teamId === team.id,
                                ),
                            )
                            .map((team, i) => (
                              <DropdownMenuItem
                                key={i}
                                className="hover:bg-stone-800 focus:bg-stone-800"
                                onClick={() =>
                                  updateTeamPriority(
                                    interviewer.id,
                                    team.id,
                                    interviewer.priorityTeams.length + 1,
                                  )
                                }
                              >
                                {team.name}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <button
                      className={`rounded-[48px] border border-solid px-6 py-2 text-white transition-colors ${
                        interviewer.calendarOpen
                          ? "border-stone-600 bg-stone-700 hover:bg-stone-600"
                          : "border-stone-500 bg-stone-600 hover:bg-stone-500"
                      }`}
                      onClick={() => toggleCalendar(interviewer.id)}
                    >
                      {interviewer.calendarOpen
                        ? "Close Calendar"
                        : "Open Calendar"}
                    </button>
                  </div>
                </div>

                {interviewer.calendarOpen && (
                  <div className="bg-neutral-900/50 px-6 py-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-neutral-200">
                        {interviewer.name}'s Calendar
                      </h3>
                      <button
                        className="rounded-[48px] border border-solid bg-stone-600 px-4 py-2 text-sm text-white transition-colors hover:bg-stone-500"
                        onClick={() => {
                          setSelectedInterviewer(interviewer.id);
                          setSelectedTime(new Date(currentDate));
                          setNewInterview({
                            applicantName: "",
                            teamId:
                              interviewer.priorityTeams[0]?.teamId ||
                              teams[0].id,
                            location: "",
                          });
                          setModalOpen(true);
                        }}
                      >
                        Schedule Interview
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-[100px_1fr] overflow-hidden rounded-t-lg border-b border-neutral-700">
                          <div className="bg-neutral-800 p-2 text-center text-neutral-400">
                            Time
                          </div>
                          <div
                            className={`grid ${viewMode === "day" ? "grid-cols-1" : "grid-cols-7"}`}
                          >
                            {viewDates.map((date, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "border-l border-neutral-700 bg-neutral-800 p-2 text-center font-medium",
                                  isWeekend(date) && "bg-neutral-800/80",
                                )}
                              >
                                <div>{format(date, "EEE")}</div>
                                <div className="text-lg">
                                  {format(date, "d")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time Slots - Only show every hour for header, but have 15-min slots */}
                        {timeSlots.map((timeSlot, timeIndex) => {
                          // Only show hour markers for cleaner UI
                          const showHourMarker = timeSlot.getMinutes() === 0;

                          return (
                            <div
                              key={timeIndex}
                              className={cn(
                                "grid grid-cols-[100px_1fr] border-b border-neutral-700",
                                showHourMarker ? "h-10" : "h-6",
                              )}
                            >
                              {showHourMarker && (
                                <div className="row-span-4 border-r border-neutral-700 p-2 text-center text-xs text-neutral-400">
                                  {format(timeSlot, "h:mm a")}
                                </div>
                              )}
                              {!showHourMarker && (
                                <div className="border-r border-dashed border-neutral-700"></div>
                              )}

                              <div
                                className={`grid ${viewMode === "day" ? "grid-cols-1" : "grid-cols-7"}`}
                              >
                                {viewDates.map((date, dateIndex) => {
                                  // Create a date object for this specific time slot
                                  const slotDateTime = new Date(date);
                                  slotDateTime.setHours(
                                    timeSlot.getHours(),
                                    timeSlot.getMinutes(),
                                    0,
                                    0,
                                  );

                                  // Check if there's an interview at this time slot
                                  const interview = getInterviewAtTimeSlot(
                                    interviewer,
                                    date,
                                    slotDateTime,
                                  );

                                  return (
                                    <div
                                      key={dateIndex}
                                      className={cn(
                                        "group relative border-l border-neutral-700",
                                        timeSlot.getMinutes() !== 0 &&
                                          "border-dashed border-neutral-800",
                                        isWeekend(date) && "bg-neutral-900/30",
                                      )}
                                      onClick={() => {
                                        if (!interview) {
                                          setSelectedInterviewer(
                                            interviewer.id,
                                          );
                                          setSelectedTime(slotDateTime);
                                          setNewInterview({
                                            applicantName: "",
                                            teamId:
                                              interviewer.priorityTeams[0]
                                                ?.teamId || teams[0].id,
                                            location: "",
                                          });
                                          setModalOpen(true);
                                        }
                                      }}
                                    >
                                      {interview && (
                                        <div className="absolute inset-0 z-10 m-0.5 overflow-hidden rounded bg-stone-600 p-1 text-xs">
                                          <div className="truncate font-medium">
                                            {interview.applicantName}
                                          </div>
                                          <div className="truncate text-[10px] text-neutral-300">
                                            {interview.location} •{" "}
                                            {
                                              teams.find(
                                                (t) =>
                                                  t.id === interview.teamId,
                                              )?.name
                                            }
                                          </div>
                                        </div>
                                      )}

                                      {!interview && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-stone-700/20 opacity-0 group-hover:opacity-100">
                                          <Plus className="h-3 w-3 text-neutral-400" />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {index < interviewers.length - 1 && (
                  <div className="w-full shrink-0 border border-solid border-neutral-200" />
                )}
              </React.Fragment>
            ))}

            {/* Add padding at the end of the table */}
            <div className="rounded-b-[48px] bg-neutral-900/30 px-6 py-4"></div>
          </div>
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-neutral-800 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Schedule Interview</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {selectedTime &&
                `${format(selectedTime, "EEEE, MMMM d, yyyy")} at ${format(selectedTime, "h:mm a")}`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="applicantName" className="text-neutral-200">
                Applicant Name
              </Label>
              <Input
                id="applicantName"
                value={newInterview.applicantName}
                onChange={(e) =>
                  setNewInterview({
                    ...newInterview,
                    applicantName: e.target.value,
                  })
                }
                className="border-neutral-700 bg-neutral-800 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location" className="text-neutral-200">
                Location
              </Label>
              <Input
                id="location"
                value={newInterview.location}
                onChange={(e) =>
                  setNewInterview({ ...newInterview, location: e.target.value })
                }
                className="border-neutral-700 bg-neutral-800 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="team" className="text-neutral-200">
                Team
              </Label>
              <Select
                value={newInterview.teamId}
                onValueChange={(value) =>
                  setNewInterview({ ...newInterview, teamId: value })
                }
              >
                <SelectTrigger className="border-neutral-700 bg-neutral-800 text-white">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent className="border-neutral-700 bg-neutral-800 text-white">
                  {teams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      className="focus:bg-neutral-700 focus:text-white"
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="border-neutral-600 bg-transparent text-white hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={addInterview}
              className="bg-stone-600 text-white hover:bg-stone-500"
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
