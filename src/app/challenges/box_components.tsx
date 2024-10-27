"use client";

import React, { useState } from "react";
import styles from "./BoxComponent.module.css";

// Define interfaces for props
interface BoxProps {
  teamName: string;
  shortOverview: string;
  competitionOverview: string;
  duration: string;
  teamSize: string;
  admissionTimeline: string;
  researchAreas?: string[];
  pastTeams?: string[];
  mentors: {
    peer: string;
    faculty: string;
  };
  competitionLink?: string;
  imageUrl: string;
}

const BoxComponent: React.FC<BoxProps> = ({
  teamName,
  shortOverview,
  competitionOverview,
  duration,
  teamSize,
  admissionTimeline,
  researchAreas,
  pastTeams,
  mentors,
  competitionLink,
  imageUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`${styles.box} ${isExpanded ? styles.boxExpanded : styles.boxCollapsed}`}
    >
      <div
        className={`${styles.imageSection} ${isExpanded ? styles.imageSectionExpanded : styles.imageSectionCollapsed}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${teamName} visual`}
            className="h-full w-full object-cover"
          />
        ) : (
          <p>Image not available</p>
        )}
      </div>

      <div className={styles.textSection}>
        <h2 className="mb-2 text-2xl font-bold">{teamName}</h2>
        <p className="mb-2 font-semibold">{shortOverview}</p>
        {isExpanded && (
          <>
            <h3 className="mb-2 mt-4 text-xl font-semibold">
              Competition Overview
            </h3>
            <p>{competitionOverview}</p>
            <h3 className="mb-2 mt-4 text-xl font-semibold">Details</h3>
            <p>
              <strong>Duration:</strong> {duration}
            </p>
            <p>
              <strong>Team Size:</strong> {teamSize}
            </p>
            <h3 className="mb-2 mt-4 text-xl font-semibold">
              Admission Timeline
            </h3>
            <p>{admissionTimeline}</p>
            {researchAreas && (
              <>
                <h3 className="mb-2 mt-4 text-xl font-semibold">
                  Research Areas
                </h3>
                <ul className="list-disc pl-5">
                  {researchAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </>
            )}
            {pastTeams && (
              <>
                <h3 className="mb-2 mt-4 text-xl font-semibold">Past Teams</h3>
                <ul className="list-disc pl-5">
                  {pastTeams.map((team, index) => (
                    <li key={index}>{team}</li>
                  ))}
                </ul>
              </>
            )}
            <h3 className="mb-2 mt-4 text-xl font-semibold">Mentors</h3>
            <p>
              <strong>Peer:</strong> {mentors.peer}
            </p>
            <p>
              <strong>Faculty:</strong> {mentors.faculty}
            </p>
            {competitionLink && (
              <p className="mt-4">
                <a
                  href={competitionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Competition Link
                </a>
              </p>
            )}
          </>
        )}
      </div>

      <button onClick={handleToggle} className={styles.toggleButton}>
        {isExpanded ? "−" : "+"}
      </button>
    </div>
  );
};

export default BoxComponent;
