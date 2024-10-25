"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

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

// Define expanded state prop interface
interface ExpandedProps {
  expanded: boolean;
}

// Styled components
const fasterDuration = 800;
const easing = 'cubic-bezier(0.25, 0.8, 0.25, 1)';

const Box = styled.div<ExpandedProps>`
  display: flex;
  flex-direction: ${(props) => (props.expanded ? 'column' : 'row')};
  align-items: stretch;
  justify-content: space-between;
  width: 60%;
  height: ${(props) => (props.expanded ? '800px' : '300px')};
  margin: 40px auto;
  border: 1px solid #ececec;
  background-color: #f9f9f9;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: height ${fasterDuration}ms ${easing}, flex-direction ${fasterDuration}ms ${easing};
`;

const ImageSection = styled.div<ExpandedProps>`
  width: ${(props) => (props.expanded ? '100%' : '50%')};
  height: ${(props) => (props.expanded ? '200px' : '100%')};
  transition: width ${fasterDuration}ms ${easing}, height ${fasterDuration}ms ${easing};
`;

const TextSection = styled.div<ExpandedProps>`
  flex: 1;
  padding: 20px;
  text-align: ${(props) => (props.expanded ? 'left' : 'left')};
  transition: width ${fasterDuration}ms ${easing}, height ${fasterDuration}ms ${easing};
  background-color: #ffffff;
  color: black;
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #003366;
  color: white;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ${easing}, transform 0.3s ${easing};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #00509e;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

// Main BoxComponent
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
      <Box expanded={isExpanded}>
        <ImageSection expanded={isExpanded}>
          {imageUrl ? (
            <img src={imageUrl} alt={`${teamName} visual`} className="w-full h-full object-cover" />
          ) : (
            <p>Image not available</p>
          )}
        </ImageSection>

        <TextSection expanded={isExpanded}>
          <h2 className="text-2xl font-bold mb-2">{teamName}</h2>
          <p className="font-semibold mb-2">{shortOverview}</p>
          {isExpanded && (
            <>
              <h3 className="text-xl font-semibold mt-4 mb-2">Competition Overview</h3>
              <p>{competitionOverview}</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Details</h3>
              <p><strong>Duration:</strong> {duration}</p>
              <p><strong>Team Size:</strong> {teamSize}</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Admission Timeline</h3>
              <p>{admissionTimeline}</p>
              {researchAreas && (
                <>
                  <h3 className="text-xl font-semibold mt-4 mb-2">Research Areas</h3>
                  <ul className="list-disc pl-5">
                    {researchAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </>
              )}
              {pastTeams && (
                <>
                  <h3 className="text-xl font-semibold mt-4 mb-2">Past Teams</h3>
                  <ul className="list-disc pl-5">
                    {pastTeams.map((team, index) => (
                      <li key={index}>{team}</li>
                    ))}
                  </ul>
                </>
              )}
              <h3 className="text-xl font-semibold mt-4 mb-2">Mentors</h3>
              <p><strong>Peer:</strong> {mentors.peer}</p>
              <p><strong>Faculty:</strong> {mentors.faculty}</p>
              {competitionLink && (
                <p className="mt-4">
                  <a href={competitionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Competition Link
                  </a>
                </p>
              )}
            </>
          )}
        </TextSection>

        <ToggleButton onClick={handleToggle}>
          {isExpanded ? '−' : '+'}
        </ToggleButton>
      </Box>
  );
};

export default BoxComponent;