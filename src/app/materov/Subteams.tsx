"use client";

import React from "react";
import BoxComponent from "./subteam_box_component";
import Container from "@/components/Container";

const Challenges = () => {
  const teams = [
    {
      teamName: "Communications & Data Handling",
      competitionOverview:
        "The CDH subteam is responsible for enabling reliable data transmission between the operators and the ROV, and developing the software and hardware solutions required for communication and efficient data processing.",
      duration: "? Semesters",
      teamSize: "???",
      admissionTimeline: [
        { date: "Applications", description: "?/?/?" },
        { date: "Interviews", description: "?/?/?" },
        { date: "Acceptance", description: "?/?/?" },
      ],
      researchAreas: [
        "Signal processing",
        "RF and communication methods",
        "Data logging",
      ],
      mentors: {
        peer: "TBD",
        faculty: "TBD",
      },
      competitionLink: "",
      imageUrl: "",
      image: "",
      major: "",
      year: "",
      description: "",
      facultyImage: "",
    },
    {
      teamName: "Electrical & Power Systems",
      competitionOverview:
        "The EPS subteam is handling the power distribution and electrical circuit design for the ROV, ensuring the system is efficient, stable, and capable of delivering the power necessary for the ROV to succeed.",
      duration: "? Semesters",
      teamSize: "???",
      admissionTimeline: [
        { date: "Applications", description: "?/?/?" },
        { date: "Interviews", description: "?/?/?" },
        { date: "Acceptance", description: "?/?/?" },
      ],
      researchAreas: [
        "Circuit design",
        "Battery selection/management",
        "Overall power distribution and integration",
      ],
      mentors: {
        peer: "TBD",
        faculty: "TBD",
      },
      competitionLink: "",
      imageUrl: "",
      image: "",
      major: "",
      year: "",
      description: "",
      facultyImage: "",
    },
    {
      teamName: "Fluids",
      competitionOverview:
        "The FLD subteam is focusing on propulsion, buoyancy, and the hydrodynamics of the ROV. Their work will ensure the ROV can maneuver effectively with stability in the underwater environment, which poses many challenges.",
      duration: "? Semesters",
      teamSize: "???",
      admissionTimeline: [
        { date: "Applications", description: "?/?/?" },
        { date: "Interviews", description: "?/?/?" },
        { date: "Acceptance", description: "?/?/?" },
      ],
      researchAreas: [
        "Propeller and thrust design",
        "Hydrodynamics",
        "Computational fluid dynamics (CFD)",
      ],
      mentors: {
        peer: "TBD",
        faculty: "TBD",
      },
      competitionLink: "",
      imageUrl: "",
      image: "",
      major: "",
      year: "",
      description: "",
      facultyImage: "",
    },
    {
      teamName: "Guidance, Navigation, & Control",
      competitionOverview:
        "The GNC subteam is responsible for the ROV’s positioning and movement, developing control algorithms to optimize the navigation and sensor feedback of the vehicle through the competition course.",
      duration: "? Semesters",
      teamSize: "???",
      admissionTimeline: [
        { date: "Applications", description: "?/?/?" },
        { date: "Interviews", description: "?/?/?" },
        { date: "Acceptance", description: "?/?/?" },
      ],
      researchAreas: [
        "Visual navigation",
        "Path planning and obstacle avoidance",
        "Sensor fusion",
      ],
      mentors: {
        peer: "TBD",
        faculty: "TBD",
      },
      competitionLink: "",
      imageUrl: "",
      image: "",
      major: "",
      year: "",
      description: "",
      facultyImage: "",
    },
    {
      teamName: "Guidance, Navigation, & Control",
      competitionOverview:
        "The GNC subteam is responsible for the ROV’s positioning and movement, developing control algorithms to optimize the navigation and sensor feedback of the vehicle through the competition course.",
      duration: "? Semesters",
      teamSize: "???",
      admissionTimeline: [
        { date: "Applications", description: "?/?/?" },
        { date: "Interviews", description: "?/?/?" },
        { date: "Acceptance", description: "?/?/?" },
      ],
      researchAreas: [
        "Visual navigation",
        "Path planning and obstacle avoidance",
        "Sensor fusion",
      ],
      mentors: {
        peer: "TBD",
        faculty: "TBD",
      },
      competitionLink: "",
      imageUrl: "",
      image: "",
      major: "",
      year: "",
      description: "",
      facultyImage: "",
    },
    {
      teamName: "Thermal, Mechanisms, & Structures",
      competitionOverview:
        "The TMS subteam is handling the physical design of the ROV, ensuring its structural integrity and efficient management of thermals. Their work will focus greatly on the mechanisms and general design of the vehicle.",
      duration: "? Semesters",
      teamSize: "???",
      admissionTimeline: [
        { date: "Applications", description: "?/?/?" },
        { date: "Interviews", description: "?/?/?" },
        { date: "Acceptance", description: "?/?/?" },
      ],
      researchAreas: [
        "CAD",
        "Structural design and stress analysis",
        "Thermal engineering",
      ],
      mentors: {
        peer: "TBD",
        faculty: "TBD",
      },
      competitionLink: "",
      imageUrl: "",
      image: "",
      major: "",
      year: "",
      description: "",
      facultyImage: "",
    },
  ];

  return (
    <Container>
      {teams.map((team, index) => (
        <BoxComponent
          key={index}
          teamName={team.teamName}
          competitionOverview={team.competitionOverview}
          duration={team.duration}
          teamSize={team.teamSize}
          admissionTimeline={team.admissionTimeline}
          researchAreas={team.researchAreas}
          mentors={team.mentors}
          competitionLink={team.competitionLink}
          imageUrl={team.imageUrl}
          image={team.image}
          major={team.major}
          year={team.year}
          description={team.description}
          facultyImage={team.facultyImage}
        />
      ))}
    </Container>
  );
};

export default Challenges;
