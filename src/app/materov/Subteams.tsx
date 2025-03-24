"use client";

import React from "react";
import BoxComponent from "./subteam_box_component";
import Container from "@/components/Container";

const Challenges = () => {
  const teams = [
    {
      teamName: "Computation and Communications",
      shortOverview: "Build a Robust Onboard Processing System",
      competitionOverview:
        "C&C subteam designs the onboard computer and communication architecture for the ROV, integrating with all other subsystems to process and respond to all generated data.",
      duration: "1 Calendar Year",
      teamSize: "2-3",
      admissionTimeline: [
        { date: "Applications", description: "3/29/25" },
        { date: "Interviews", description: "4/4/25" },
        { date: "Acceptance", description: "4/7/25" },
      ],
      researchAreas: [
        "Microprocessors",
        "Data Logging and Networking",
        "Signal Processing",
        "C/C++/Arduino",
      ],
      competitionLink: "https://materovcompetition.org/",
      imageUrl: "images/materov/CC.png",
    },
    {
      teamName: "Electrical and Power Systems",
      shortOverview: "Build a Reliable Power Delivery System",
      competitionOverview:
        "EPS subteam designs the circuitry throughout the ROV, ensuring sufficient power distribution and management to all components while preventing water intrusion.",
      duration: "Year Long",
      teamSize: "2-3",
      admissionTimeline: [
        { date: "Applications", description: "3/29/25" },
        { date: "Interviews", description: "4/4/25" },
        { date: "Acceptance", description: "4/7/25" },
      ],
      researchAreas: [
        "PCB Design",
        "Battery Selection/Configuration",
        "Power Delivery",
      ],
      competitionLink: "https://materovcompetition.org/",
      imageUrl: "images/materov/EPS.png",
    },
    {
      teamName: "Fluids and Propulsion",
      shortOverview: "Build a Precise Maneuvering System",
      competitionOverview:
        "F&P subteam designs the movement system for the ROV, optimizing the hydrodynamics and buoyancy effects on the vehicle to ensure robust, precise, and accurate maneuverability.",
      duration: "1 Calendar Year",
      teamSize: "2-3",
      admissionTimeline: [
        { date: "Applications", description: "3/29/25" },
        { date: "Interviews", description: "4/4/25" },
        { date: "Acceptance", description: "4/7/25" },
      ],
      researchAreas: [
        "Propeller Design",
        "Hydrodynamics",
        "Computational Fluid Dynamics (CFD)",
      ],
      competitionLink: "https://materovcompetition.org/",
      imageUrl: "images/materov/FP.png",
    },
    {
      teamName: "Guidance, Navigation, and Control",
      shortOverview: "Build an Autonomous Navigation System",
      competitionOverview:
        "GNC subteam designs the positioning, orientation, and movement systems of the ROV, developing optimal control algorithms fed by sensors to efficiently navigate competition obstacles autonomously.",
      duration: "1 Calendar Year",
      teamSize: "2-3",
      admissionTimeline: [
        { date: "Applications", description: "3/29/25" },
        { date: "Interviews", description: "4/4/25" },
        { date: "Acceptance", description: "4/7/25" },
      ],
      researchAreas: [
        "Optimal Linear Control",
        "Rigid Body Dynamics",
        "Sensor Fusion",
        "Advanced Python",
      ],
      competitionLink: "https://materovcompetition.org/",
      imageUrl: "images/materov/GNC.png",
    },
    {
      teamName: "Thermal, Mechanisms, and Structures",
      shortOverview: "Build a Sturdy Frame and Arms",
      competitionOverview:
        "TMS subteam designs the physical aspects of the ROV, ensuring structural integrity, effective thermal management, and manipulation of competition objects.",
      duration: "1 Calendar Year",
      teamSize: "2-3",
      admissionTimeline: [
        { date: "Applications", description: "3/29/25" },
        { date: "Interviews", description: "4/4/25" },
        { date: "Acceptance", description: "4/7/25" },
      ],
      researchAreas: [
        "Computer Aided Design (CAD)",
        "Structural Design and Analysis",
        "Thermal Design",
        "Robotic Control",
      ],
      competitionLink: "https://materovcompetition.org/",
      imageUrl: "images/materov/TMS.png",
    },
    {
      teamName: "MATE ROV Leadership",
      shortOverview: "Lead the Team to Success",
      competitionOverview:
        "The team’s leadership consists of a Project Manager and a Chief System Engineer who work with all subteams to ensure the team will succeed.",
      duration: "1 Calendar Year",
      teamSize: "2-3",
      admissionTimeline: [
        { date: "Applications", description: "3/29/25" },
        { date: "Interviews", description: "4/4/25" },
        { date: "Acceptance", description: "4/7/25" },
      ],
      researchAreas: [
        "Project Management",
        "Systems Engineering",
        "Systems Architecture",
      ],
      competitionLink: "https://materovcompetition.org/",
      imageUrl: "images/materov/Leadership.png",
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
          competitionLink={team.competitionLink}
          imageUrl={team.imageUrl}
        />
      ))}
    </Container>
  );
};

export default Challenges;
