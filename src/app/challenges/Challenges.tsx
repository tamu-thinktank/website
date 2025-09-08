"use client";

import React from "react";
import BoxComponent from "./box_component";
import Container from "@/components/Container";

const Challenges = () => {
  const teams = [
    {
      teamName: "Atlas",
      shortOverview: "Design ThinkTank’s Next-Gen Website",
      competitionOverview:
        "ThinkTank is creating a team to overhaul both the frontend and backend of our website. We’re looking to vastly improve the applicant experience as well as enhance the administrative tools ThinkTank needs to run.",
      duration: "2 Semesters",
      teamSize: "4-6",
      admissionTimeline: [
        { date: "Applications", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" },
      ],
      researchAreas: [
        "Full Stack Web Development",
        "UI/UX Design",
        "Backend/Database Architecture",
        "Automation",
        "Languages: React, Prisma, Git, Figma",
      ],
      mentors: {
        peer: "Moksh Shah",
        faculty: "N/A",
      },
      competitionLink:
        "https://docs.google.com/document/d/1gFVdFCoLfGgvlPvA1qoBKyV9seidLXgtLZyCMtijvHM/edit?usp=drive_link",
      imageUrl: "/images/Atlas.png",
      image: "/images/avatars/moksh2526.webp",
      major: "Aerospace",
      year: "27",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      prize: "Potential Research Lab Positions",
      dtype: "Functional Website",
    },
    {
      teamName: "Nova",
      shortOverview:
        "Develop a lunar sample return mission from acquisition to transportation.",
      competitionOverview:
        "NASA is seeking innovative concepts for a lunar sample return mission to collect, preserve, and transport 10s–100s of kilograms of geological and human research samples in various conditions from the Moon to Earth. Proposals should detail operations for identifying, acquiring, storing, and moving samples on the lunar surface, along with system requirements, technology needs, costs, and timelines. Concepts should also consider adaptability to Mars or other planetary missions.",
      duration: "2 Semesters",
      teamSize: "12-20",
      admissionTimeline: [
        { date: "Applications", description: "9/6/25" },
        { date: "Interviews End", description: "9/14/25" },
        { date: "Acceptance", description: "9/22/25" },
      ],
      researchAreas: [
        "Robotics",
        "Automation",
        "Power Systems",
        "Sample Extraction",
        "Life Support Systems",
        "Transportation Planning",
      ],
      mentors: {
        peer: "Rithvik Gogula",
        faculty: "TBD",
      },
      competitionLink: "https://rascal.nianet.org",
      imageUrl: "/images/Nova.jpg",
      image: "/images/avatars/rithvikgogula2526",
      major: "Industrial Engineering",
      year: "27",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      field: "N/A",
      interest: "N/A",
      prize: "$7,000 travel stipend for finalists",
      dtype: "Proposal",
    },
    {
      teamName: "Servus",
      shortOverview:
        "Design resilient Mars CPNT architectures that manage varied data and operational needs.",
      competitionOverview:
        "NASA is also seeking innovative architectures to provide Communications, Position, Navigation, and Timing (CPNT) for human and robotic operations on the surface of Mars. These systems must handle massive data demands, ensure interoperability among diverse surface elements, and remain resilient to challenges like terrain, dust storms, and communication blackouts. Teams should design robust, scalable architectures with defined operations, system requirements, costs, and potential testing on the Moon, while also identifying benefits for future lunar missions.",
      duration: "2 Semesters",
      teamSize: "12-20",
      admissionTimeline: [
        { date: "Applications", description: "9/6/25" },
        { date: "Interviews End", description: "9/14/25" },
        { date: "Acceptance", description: "9/22/25" },
      ],
      researchAreas: [
        "System Data Management & Transmission",
        "Robustness & Resilience in Emergency/Environment",
        "Operational Concepts & Costs",
        "Extensibility & Testing",
      ],
      mentors: {
        peer: "Rithvik Gogula",
        faculty: "TBD",
      },
      competitionLink: "https://rascal.nianet.org",
      imageUrl: "/images/Servus.png",
      image: "/images/avatars/rithvikgogula2526",
      major: "Industrial Engineering",
      year: "27",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      field: "N/A",
      interest: "N/A",
      prize: "$7,000 travel stipend for finalists",
      dtype: "Proposal",
    },
    {
      teamName: "Solara",
      shortOverview:
        "Explores lowering environmental impact through reducing emissions and sustainable aviation",
      competitionOverview: "No details until early September",
      duration: "2 Semesters",
      teamSize: "6",
      admissionTimeline: [
        { date: "Applications", description: "9/6/25" },
        { date: "Interviews End", description: "9/14/25" },
        { date: "Acceptance", description: "9/22/25" },
      ],
      researchAreas: [
        "Aerodynamics & Aircraft Design",
        "Sustainable Propulsion & Energy Systems",
        "Current innovations in agricultural industry",
        "Systems Engineering & Integration",
        "Environmental Impact Assessment",
      ],
      mentors: {
        peer: "Anoushka Kaushik",
        faculty: "TBD",
      },
      competitionLink: "https://blueskies.nianet.org/competition/",
      imageUrl: "/images/Solara.jpg",
      image: "/images/avatars/anoushkakaushik2526",
      major: "Aerospace",
      year: "28",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      field: "N/A",
      prize: "$8,000 travel stipend for finalists",
      dtype: "Proposal",
    },
    {
      teamName: "Voltaris",
      shortOverview:
        "Design and model a solar energy grid for an assigned collegiate campus.",
      competitionOverview:
        "The Solar District Cup challenges student teams to design solar energy systems for campuses or districts that maximize energy offset and financial savings over the system’s lifetime. Teams act as renewable energy developers, creating proposals under PPA, lease, or cash purchase models while analyzing grid interactions",
      duration: "2 Semesters",
      teamSize: "12-14",
      admissionTimeline: [
        { date: "Applications", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" },
      ],
      researchAreas: [
        "Integration of renewable energy systems",
        "Power & energy focused electrical engineering",
        "Urban planning and civil engineering",
        "Project-based finance and budget work",
      ],
      mentors: {
        peer: "Anoushka Kaushik",
        faculty: "TBD",
      },
      competitionLink: "https://www.herox.com/SolarDistrictCup",
      imageUrl: "/images/Voltaris.jpg",
      image: "/images/avatars/anoushkakaushik2526",
      major: "Aerospace",
      year: "28",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      field: "N/A",
      prize: "N/A",
      dtype: "Proposal",
    },
    {
      teamName: "Orion",
      shortOverview:
        "Design a space mission to send a spacecraft to monitor space weather and provide communication to Mars.",
      competitionOverview:
        "AIAA has asked research teams to create an innovative mission concept of operations and system designs to support the next decade of Heliophysics science investigation, space weather monitoring and analysis, as well as provide communication support for crewed missions to the lunar and Martian surface. This will provide the crew with early warnings for space weather events.",
      duration: "2 Semesters",
      teamSize: "10",
      admissionTimeline: [
        { date: "Applications", description: "9/6/24" },
        { date: "Interviews End", description: "9/15/24" },
        { date: "Acceptance", description: "9/16/24" },
      ],
      researchAreas: [
        "Space Mission Design and Planning",
        "Space Weather Monitoring",
        "Orbital and Spacecraft Dynamics",
        "Systems Engineering",
      ],
      mentors: {
        peer: "Moksh Shah",
        faculty: "TBD",
      },
      competitionLink:
        "https://www.aiaa.org/get-involved/students-educators/Design-Competitions#design-competition-rfps",
      imageUrl: "03Qi7SZgiYjO1OLFnklCfog-3.webp",
      image: "/images/mokshshah2526.webp",
      major: "Aerospace",
      year: "27",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      field: "N/A",
      interest: "N/A",
      prize: "$750 for 1st place",
      dtype: "Proposal",
    },
    {
      teamName: "Electra",
      shortOverview:
        "Design an affordable EV charger to meet competition specifications.",
      competitionOverview: "Details have not come out yet.",
      duration: "2 Semesters",
      teamSize: "TBD",
      admissionTimeline: [
        { date: "Applications", description: "9/6/25" },
        { date: "Interviews End", description: "9/14/25" },
        { date: "Acceptance", description: "9/22/25" },
      ],
      researchAreas: [
        "Power Electronics and Circuit Design",
        "Electric Vehicles and Charging Infrastructure",
        "Renewable Energy and Smart Grids",
        "Control Systems and Digital Implementation",
      ],
      mentors: {
        peer: "Rithvik Gogula",
        faculty: "TBD",
      },
      competitionLink: "https://energychallenge.weebly.com",
      imageUrl: "03Qi7SZgiYjO1OLFnklCfog-3.webp",
      image: "/images/rithvikgogula2526",
      major: "Industrial Engineering",
      year: "27",
      description: "About Me",
      facultyImage: "/images/avatars/blank.webp",
      field: "N/A",
      interest: "N/A",
      prize:
        "Grand Prize of $10,000 and three additional awards granted at $5,000, $3,000 and $1,000 each",
      dtype: "Proposal",
    },
    {
      teamName: "Daedalus",
      shortOverview: "Hands-On NASA Research Project",
      competitionOverview:
        "Texas Space Grant Consortium (TSGC) offers unique, hands-on challenges sponsored by NASA mentors which rotate each year. We can’t guarantee what you will be working on, but we can guarantee it will be an amazing experience!",
      duration: "1 Semester",
      teamSize: "6",
      admissionTimeline: [
        { date: "Applications", description: "11/21/25" },
        { date: "Interviews", description: "1/17/26" },
        { date: "Acceptance", description: "1/26/26" },
      ],
      pastTeams: [
        "Astronaut Tracking System",
        "Microgravity Water Filtration",
        "Lunar Cellular Infrastructure",
      ],
      mentors: {
        peer: "Anoushka Kaushik",
        faculty: "TBD",
      },
      competitionLink: "https://ig.utexas.edu/tsgc/design-challenge/",
      imageUrl: "/images/Daedalus.png",
      image: "/images/avatars/anoushkakaushik2526",
      major: "Aerospace",
      year: "28",
      description: "About Me",
      facultyImage: "blank.webp",
      prize: "$6,000 for 1st place",
      dtype: "Showcase",
    },
  ];

  return (
    <Container>
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
