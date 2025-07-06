import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const RatingDropdown = ({
  ratingFilter,
  setRatingFilter,
}: {
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-background flex w-40 items-center justify-between rounded-full border-[0.75px] border-white px-4 py-2 text-white"
          aria-label="Select Rating"
        >
          {ratingFilter || "All Ratings"}
          <ChevronDown className="ml-2 h-4 w-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-popover text-popover-foreground min-w-[8rem] rounded-md border p-1 shadow-md"
        sideOffset={4}
      >
        <DropdownMenuItem
          onClick={() => setRatingFilter("")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          All Ratings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setRatingFilter("High")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          High
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setRatingFilter("Medium")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          Medium
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setRatingFilter("Low")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TeamDropdown = ({
  teamFilter,
  setTeamFilter,
}: {
  teamFilter: string;
  setTeamFilter: (value: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-background flex w-40 items-center justify-between rounded-full border-[0.75px] border-white px-4 py-2 text-white"
          aria-label="Select Teams"
        >
          {teamFilter || "All Teams"}
          <ChevronDown className="ml-2 h-4 w-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-popover text-popover-foreground min-w-[8rem] rounded-md border p-1 shadow-md"
        sideOffset={4}
      >
        <DropdownMenuItem
          onClick={() => setTeamFilter("")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          All Teams
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTeamFilter("Team A")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          Team A
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTeamFilter("Team B")}
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-2 py-1.5 text-sm"
        >
          Team B
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// export default RatingDropdown;

export default function ApplicantsTable() {
  const [teamFilter, setTeamFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchUIN, setSearchUIN] = useState("");

  const applicants = [
    {
      name: "John Doe",
      uin: "123001234",
      submissionDate: "2024-12-25",
      team: "Team A",
      rating: "High",
    },
    {
      name: "Jane Smith",
      uin: "123001235",
      submissionDate: "2024-12-24",
      team: "Team B",
      rating: "Medium",
    },
  ];

  const filteredApplicants = applicants.filter((applicant) => {
    return (
      (!searchName ||
        applicant.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (!searchUIN || applicant.uin.includes(searchUIN)) &&
      (!teamFilter || applicant.team === teamFilter) &&
      (!ratingFilter || applicant.rating === ratingFilter)
    );
  });

  return (
    <div className="flex max-h-[95%] flex-col items-center overflow-auto">
      <div className="bg-background sticky top-0 z-10 flex gap-4 py-4">
        <Input
          placeholder="Search by Name"
          className="w-60 rounded-full border-[0.75px] border-white text-white"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Input
          placeholder="UIN"
          className="w-60 rounded-full border-[0.75px] border-white text-white"
          value={searchUIN}
          onChange={(e) => setSearchUIN(e.target.value)}
        />
        <RatingDropdown
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />
        <TeamDropdown teamFilter={teamFilter} setTeamFilter={setTeamFilter} />
        <Button className="bg-background rounded-full border-[0.75px] border-white text-white">
          More
        </Button>
      </div>
      <div className="w-[70%] rounded-lg border border-[0.75px] border-white">
        <Table>
          <TableHeader>
            <TableRow className="border-opacity-25 border-b border-white bg-zinc-700">
              <TableHead className="text-center text-white">Name</TableHead>
              <TableHead className="text-center text-white">UIN</TableHead>
              <TableHead className="text-center text-white">
                Submission Date
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length ? (
              filteredApplicants.map((applicant, index) => (
                <TableRow
                  key={index}
                  className="border-opacity-25 border-b border-white"
                >
                  <TableCell className="text-center">
                    {applicant.name}
                  </TableCell>
                  <TableCell className="text-center">{applicant.uin}</TableCell>
                  <TableCell className="text-center">
                    {applicant.submissionDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="flex items-center text-white">
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No applicants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
