"use client";

import React from 'react';
import BoxComponent from './box_component'; // Assuming you have the BoxComponent in the same directory
import Container from "@/components/Container"; // Keep the original Container component

const Challenges = () => {
  // Information for the three teams
  const teams = [
    {
      teamName: "Daedalus",
      shortOverview: "Hands-On NASA Research Project I like t",
      competitionOverview: "Texas Space Grant Consortium (TSGC) offers unique, hands-on challenges sponsored by NASA mentors which rotate each year. We can’t guarantee what you will be working on, but we can guarantee it will be an amazing experience!",
      duration: "1 Semester",
      teamSize: "6",
      admissionTimeline: "Applications: 1/16/25\nInterviews: 1/25/25\nAcceptance: 1/27/25",
      pastTeams: [
        "Astronaut Tracking System",
        "Microgravity Water Filtration",
        "Lunar Cellular Infrastructure"
      ],
      mentors: {
        peer: "Aiden Kampwerth",
        faculty: "TBD"
      },
      competitionLink: "https://ig.utexas.edu/tsgc/design-challenge/",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK7R7OIUg1uWdF5NKWZgGWSg3AJZ1_Har5kw&s" // Add a valid image URL for Daedalus
    },
    {
      teamName: "Altas",
      shortOverview: "Design ThinkTank’s Next-Gen Website",
      competitionOverview: "ThinkTank is creating a team to overhaul both the frontend and backend of our website. We’re looking to vastly improve the applicant experience as well as enhance the administrative tools ThinkTank needs to run.",
      duration: "2 Semesters",
      teamSize: "4-6",
      admissionTimeline: "Applications: 9/6/24\nInterviews: 9/15/24\nAcceptance: 9/16/24",
      researchAreas: [
        "Full Stack Web Development",
        "UI/UX Design",
        "Backend/Database Architecture",
        "Automation"
      ],
      mentors: {
        peer: "Aiden Kampwerth",
        faculty: "N/A"
      },
      competitionLink: "", // Add competition link if available
      imageUrl: "https://thewebcycle.com/wp-content/uploads/2022/07/PMG-WITH-WHITE-TEXT-Copy-e1657541928389.png" // Add a valid image URL for Altas
    },
    {
      teamName: "Nova",
      shortOverview: "Design NASA’s Next Lunar Base",
      competitionOverview: "RASC-AL is looking for a research proposal for the design, development, and operation of a Lunar Base on the South Pole of the moon.",
      duration: "2 Semesters",
      teamSize: "12-20",
      admissionTimeline: "Applications Due: 9/6/24\nInterviews End: 9/15/24\nAcceptance: 9/16/24",
      researchAreas: [
        "Architecture/Construction",
        "Power Systems",
        "Communication",
        "Life Support Systems",
        "In-Situ Resource Utilization (ISRU)",
        "Logistics",
        "And many more…"
      ],
      mentors: {
        peer: "Moksh Shah",
        faculty: ""
      },
      competitionLink: "https://rascal.nianet.org",
      imageUrl: "https://i.ytimg.com/vi/HatbpRKdbew/maxresdefault.jpg" // Add a valid image URL for Nova
    }
  ];

  return (
    <Container>
      <div className="mb-12 justify-between space-y-2 pt-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Fall 2024 Student Design Challenges
        </h1>
        <p className="text-gray-600 dark:text-gray-300 lg:mx-auto lg:w-6/12">
          The Official TAMU ThinkTank Fall 2024 Challenge Suite
        </p>
      </div>
      {teams.map((team, index) => (
        <BoxComponent
          key={index}
          teamName={team.teamName}
          shortOverview={team.shortOverview}
          competitionOverview={team.competitionOverview}
          duration={team.duration}
          teamSize={team.teamSize}
          admissionTimeline={team.admissionTimeline}
          researchAreas={team.researchAreas}
          pastTeams={team.pastTeams}
          mentors={team.mentors}
          competitionLink={team.competitionLink}
          imageUrl={team.imageUrl}
        />
      ))}
    </Container>
  );
};

export default Challenges;