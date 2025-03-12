import * as React from "react";
import { FilterButton } from "./filterButton";
import { TableHeader } from "./tableHeader";
import type { FilterState } from "./membertypes";
import { useMemberContext } from "../transfer";

export const MembersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("DC");
  const [filters, setFilters] = React.useState<FilterState>({
    team: "",
    rating: "",
    interests: "",
    major: "",
  });

  const { members } = useMemberContext();

  const tableHeaders = [
    "Name",
    "Rating",
    "Research Interests",
    "Team Rankings",
    "Major",
    "Year",
  ];

  const teamOptions = ["Team A", "Team B", "Team C", "Reset"];
  const ratingOptions = ["1/5", "2/5", "3/5", "4/5", "5/5", "Reset"];
  const interestOptions = ["AI", "Robotics", "Web Development", "Reset"];
  const majorOptions = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Reset",
  ];

  const filteredMembers = React.useMemo(() => {
    return members.filter((member) => {
      const matchesCategory = member.category === selectedCategory;
      const matchesSearch = member.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMajor = !filters.major || member.major === filters.major;
      const matchesInterests =
        !filters.interests || member.interests.includes(filters.interests);
      const matchesTeam =
        !filters.team || member.teamRankings.includes(filters.team);
      const matchesRating = !filters.rating || member.rating === filters.rating;
      return (
        matchesCategory &&
        matchesSearch &&
        matchesMajor &&
        matchesInterests &&
        matchesTeam &&
        matchesRating
      );
    });
  }, [searchQuery, filters, members, selectedCategory]);

  const handleFilterChange =
    (filterType: keyof FilterState) => (value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value === prev[filterType] ? "" : value,
      }));
    };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col overflow-hidden bg-neutral-950 text-xl font-medium shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      {/* <div className="flex flex-col justify-center items-center px-16 py-5 w-full tracking-wide whitespace-nowrap bg-neutral-950 text-neutral-200 text-opacity-80 max-md:px-5 max-md:mr-2 max-md:max-w-full">
                <div className="flex flex-wrap gap-5 justify-between w-full max-w-[1538px] max-md:max-w-full">
                    <img
                        loading="lazy"
                        src="ttt.png"
                        alt="Logo"
                        className="object-contain max-w-full aspect-[2.4] w-[139px]"
                    />
                    <div className="flex gap-8 my-auto max-md:max-w-full">
                        <div className="grow">Applicants</div>
                        <div className="basis-auto">Interviewees</div>
                        <div>Members</div>
                        <div>Scheduler</div>
                        <div>Statistics</div>
                    </div>
                </div>
            </div>
            <div className='w-full border border-solid border-neutral-200'></div> */}

      <div className="mt-1 flex w-full flex-col items-center overflow-hidden px-20 pb-96 pt-11  max-md:max-w-full max-md:px-5 max-md:pb-24">
        <div className="mb-0 flex w-full max-w-[1537px] flex-col max-md:mb-2.5 max-md:max-w-full">
          <div className="self-start pb-10 text-center text-5xl font-semibold max-md:text-4xl">
            Members
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
              Individual
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
              className="w-[500px] rounded-[48px] border border-solid border-neutral-200 bg-transparent px-6 py-4 max-md:w-full max-md:max-w-[500px] max-md:px-5"
            />
            <div className="h-12 w-[1px] bg-neutral-400"></div>
            <FilterButton
              label="Team"
              options={teamOptions}
              onOptionSelect={handleFilterChange("team")}
              selected={filters.team || "Team"}
            />
            <FilterButton
              label="Rating"
              options={ratingOptions}
              onOptionSelect={handleFilterChange("rating")}
              selected={filters.rating || "Rating"}
            />
            <FilterButton
              label="Interests"
              options={interestOptions}
              onOptionSelect={handleFilterChange("interests")}
              selected={filters.interests || "Interests"}
            />
            <FilterButton
              label="Major"
              options={majorOptions}
              onOptionSelect={handleFilterChange("major")}
              selected={filters.major || "Major"}
            />
          </div>

          <div className="mt-7 flex w-full flex-col rounded-[48px] border border-solid border-neutral-200 tracking-wide max-md:max-w-full max-md:pb-24">
            <TableHeader headers={tableHeaders} />
            {filteredMembers.map((applicant, index) => (
              <React.Fragment key={index}>
                <div className="flex w-full items-center justify-center gap-10 px-5 py-4 text-sm transition-colors hover:bg-neutral-800">
                  <div className="flex-1 text-center">{applicant.name}</div>
                  <div className="flex-1 text-center">{applicant.rating}</div>
                  <div className="flex-1 text-center">
                    {applicant.interests.join(", ")}
                  </div>
                  <div className="flex-1 text-center">
                    {applicant.teamRankings.join(", ")}
                  </div>
                  <div className="flex-1 text-center">{applicant.major}</div>
                  <div className="flex-1 text-center">{applicant.year}</div>
                </div>
                {index < filteredMembers.length - 1 && (
                  <div className="w-full shrink-0 border border-solid border-neutral-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
