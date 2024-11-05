"use client";

import React from 'react';
import BoxComponent from './box_component';
import Container from "@/components/Container";

const Challenges = () => {
  const teams = [
    {
      teamName: "Daedalus",
      shortOverview: "Hands-On NASA Research Project",
      competitionOverview: "Texas Space Grant Consortium (TSGC) offers unique, hands-on challenges sponsored by NASA mentors which rotate each year. We can’t guarantee what you will be working on, but we can guarantee it will be an amazing experience!",
      duration: "1 Semester",
      teamSize: "6",
      admissionTimeline: [
        { date: "Applications", description: "1/16/25" },
        { date: "Interviews", description: "1/25/25" },
        { date: "Acceptance", description: "1/27/25" }
      ],

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
      imageUrl: "/images/Daedalus.png",
      image: "/images/avatars/aiden.webp",
      major: "Aerospace",
      year: "26",
      description: "About Me",
      facultyImage: "8742495.png",
      prize: "$6,000 for 1st place",
      dtype: "Showcase"
    },
    {
      teamName: "Altas",
      shortOverview: "Design ThinkTank’s Next-Gen Website",
      competitionOverview: "ThinkTank is creating a team to overhaul both the frontend and backend of our website. We’re looking to vastly improve the applicant experience as well as enhance the administrative tools ThinkTank needs to run.",
      duration: "2 Semesters",
      teamSize: "4-6",
      admissionTimeline: [
        { date: "Applications Due", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" }
      ],
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
      competitionLink: "https://docs.google.com/document/d/1gFVdFCoLfGgvlPvA1qoBKyV9seidLXgtLZyCMtijvHM/edit?usp=drive_link",
      imageUrl: "/images/Atlas.png",
      image: "/images/avatars/aiden.webp",
      major: "Aerospace",
      year: "26",
      description: "About Me",
      facultyImage: "8742495.png",
      prize: "Potential Research Lab Positions",
      dtype: "Functional Website"
    },
    {
      teamName: "Nova",
      shortOverview: "Design NASA’s Next Lunar Base",
      competitionOverview: "NASA RASC-AL is looking for a research proposal for the design, development, and operation of a Lunar Base on the South Pole of the moon. The base should be self-sustaining by providing goods and services to 3rd party companies while supporting scientific research for future expansion.",
      duration: "2 Semesters",
      teamSize: "12-20",
      admissionTimeline: [
        { date: "Applications Due", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" }
      ],
      researchAreas: [
        "Architecture",
        "Construction",
        "Power Systems",
        "Communication",
        "Life Support Systems",
        "In-Situ Resource Utilization (ISRU)",
        "Logistics",
        "And many more…"
      ],
      mentors: {
        peer: "Moksh Shah",
        faculty: "Dr. Arash Noshadravan"
      },
      competitionLink: "https://rascal.nianet.org",
      imageUrl: "/images/Nova.jpg",
      image: "/images/avatars/moksh.webp",
      major: "Aerospace",
      year: "27",
      description: "About Me",
      facultyImage: "/images/Noshadravan_Arash.jpg",
      field: "Civil Engineering",
      interest: "Materials and Infrastructure \n Life-cycle Assessment and Optimization \n Multiscale Modeling \n Computational Mechanics",
      prize: "$6,500 travel stipend for finalists",
      dtype: "Proposal"
    },
    {
      teamName: "Servus",
      shortOverview: "Aviation Solutions for Agriculture",
      competitionOverview:
        "NASA RASC-AL is also looking for a proposal for a maintenance rover that can service and preserve the permanent lunar base that NASA aims to establish. The rover shall weigh no more than 500kg and perform critical tasks to support the base such as inspecting systems, swapping payloads, and connecting umbilicals.",
      duration: "2 Semesters",
      teamSize: "12-20",
      admissionTimeline: [
        { date: "Applications Due", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" }
      ],
      researchAreas: [
        "Mechanical systems",
        "Power systems",
        "Communications, Navigation, and Autonomy",
        "Robotic applications",
      ],
      mentors: {
        peer: "Moksh Shah",
        faculty: "Dr. Sivakumar Rathinam",
      },
      competitionLink: "https://rascal.nianet.org",
      imageUrl: "/images/Servus.png",
      image: "/images/avatars/moksh.webp",
      major: "Aerospace",
      year: "27",
      description: "About Me",
      facultyImage: "/images/rathinam-sivakumar.jpg",
      field: "Mechanical Engineering",
      interest: "Autonomous Vehicles\n Combinatorial Optimization\nVision-based Control\nMotion Planning",
      prize: "$6,500 travel stipend for finalists",
      dtype: "Proposal"
    },

    {
      teamName: "Solara",
      shortOverview: "Aviation Solutions for Agriculture",
      competitionOverview:
        "BlueSkies is looking for a conceptual aviation system meant to support the agricultural industry in some form. The solution is to be tailored to improving production, efficiency, environmental impact, and the resilience of agriculture.",
      duration: "2 Semesters",
      teamSize: "6",
      admissionTimeline: [
        { date: "Applications Due", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" }
      ],
      researchAreas: [
        "Theoretical aviation solutions",
        "Aeronautical interactions with environment",
        "Current innovations in agricultural industry",
        "Product development and deployment",
        "Applications of high-potential technologies",
      ],
      mentors: {
        peer: "Arjun Sawhney",
        faculty: "Dr. Matt Elliott",
      },
      competitionLink: "https://blueskies.nianet.org/competition/",
      imageUrl: "/images/Solara.jpg",
      image: "/images/avatars/arjun.webp",
      major: "Aerospace",
      year: "27",
      description: "About Me",
      facultyImage: "/Elliott_Matt-2022.jpg",
      field: "Mechanical Engineering",
      prize: "$8,000 travel stipend for finalists",
      dtype: "Proposal"
    },

    {
      teamName: "Voltaris",
      shortOverview: "Model Renewable Energy Systems",
      competitionOverview:
        "The U.S. Dept. of Energy is looking for student teams to take the role of solar developers to conceptualize solar energy systems for a campus. Teams are to consider the community in which they are assigned and design an effective and reliable solar-powered energy management system.",
      duration: "2 Semesters",
      teamSize: "12-14",
      admissionTimeline: [
        { date: "Applications Due", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" }
      ],
      researchAreas: [
        "Integration of renewable energy systems",
        "Power & energy focused electrical engineering",
        "Urban planning and civil engineering",
        "Project-based finance and budget work",
      ],
      mentors: {
        peer: "Arjun Sawhney",
        faculty: "Dr. Stacey Lyle",
      },
      competitionLink: "https://www.energy.gov/eere/solar/solar-district-cup",
      imageUrl: "/images/Voltaris.jpg",
      image: "/images/avatars/arjun.webp",
      major: "Aerospace",
      year: "27",
      description: "About Me",
      facultyImage: "images/Lyle_Stacey.jpg",
      field: "Civil Engineering",
      prize: "N/A",
      dtype: "Proposal"
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
          image={team.image}
          major={team.major}
          year={team.year}
          description={team.description}
          facultyImage={team.facultyImage}
          field={team.field}
          interest={team.interest}
          prize={team.prize}
          dtype={team.dtype}
        />
      ))}
    </Container>
  );
};

export default Challenges;