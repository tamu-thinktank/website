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
  height: ${(props) => (props.expanded ? '1075px' : '300px')};
  margin: 40px auto;
  border: 1px solid #000;
  background-color: #000;
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: ${(props) => (props.expanded ? 'pointer' : 'auto')};
    transition: transform 0.5s ${easing};

    &:hover {
      transform: scale(1.05); /* Zooms in slightly on hover */
    }
  }

`;

const TextSection = styled.div<ExpandedProps>`
  flex: 1;
  padding: 20px;
  background-color: #000;
  color: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<ExpandedProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: ${(props) => (props.expanded ? '10px' : '5px')};

  .team-name {
    font-size: ${(props) => (props.expanded ? '2rem' : '1.5rem')};
    text-align: center;
    margin-right: 10px; /* Add space to the right of the team name */
  }

  .separator {
    margin: 0 15px; /* Space on both sides of the separator */
  }
`;

const ApplyButton = styled.button`
  padding: 8px 12px;
  border-radius: 5px;
  background-color: #555;
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 10px; /* Space to the left of the Apply button */
  transition: background-color 0.3s ${easing};

  &:hover {
    background-color: #777;
  }
`;

const CompetitionOverviewSection = styled.div`
  margin: 20px 0;
  text-align: center;

  hr {
    border: none;
    border-top: 1px solid #555;
    margin: 10px 0;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    font-size: 1rem;
    color: #d0d0d0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const InfoCard = styled.div`
  background-color: #1c1c1c;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: center;
  }
`;

const MentorSection = styled.div`
  margin-top: 20px;
  text-align: center;

  h4 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .mentor-grid {
    display: flex;
    justify-content: space-around;
    gap: 15px;
  }

  .mentor-placeholder {
    width: 200px;
    height: 200px;
    background-color: #333;
    border-radius: 8px;
  }
`;

const ToggleButton = styled.div<ExpandedProps>`
  position: absolute;
  bottom: ${(props) => (props.expanded ? '5px' : '10px')};
  right: ${(props) => (props.expanded ? '350px' : '150px')};
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #000;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ${easing}, transform 0.3s ${easing};

  &:hover {
    background-color: #545454;
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
          <a href={competitionLink} target="_blank" rel="noopener noreferrer">
            <img src={imageUrl} alt={`${teamName} visual`} />
          </a>
        ) : (
          <p>Image not available</p>
        )}
      </ImageSection>

      <TextSection expanded={isExpanded}>
        <Header expanded={isExpanded}>
          <span className="team-name">{teamName.toUpperCase()}</span>
          {isExpanded && (
            <>
              <span className="separator">|</span>
              <ApplyButton>Apply</ApplyButton>
            </>
          )}
        </Header>
        {!isExpanded && <p className="font-semibold mb-2">{shortOverview}</p>}
        {isExpanded && (
          <>
            <CompetitionOverviewSection>
              <hr />
              <h3>Competition Overview</h3>
              <p>{competitionOverview}</p>
              <hr />
            </CompetitionOverviewSection>

            <InfoGrid>
              <InfoCard>
                <h3>Details</h3>
                <p><strong>Duration:</strong> {duration}</p>
                <p><strong>Team Size:</strong> {teamSize}</p>
              </InfoCard>
              <InfoCard>
                <h3>Admission Timeline</h3>
                <p>{admissionTimeline}</p>
              </InfoCard>
              {researchAreas && (
                <InfoCard>
                  <h3>Research Areas</h3>
                  <ul className="list-disc pl-5">
                    {researchAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </InfoCard>
              )}
              {pastTeams && (
                <InfoCard>
                  <h3>Past Teams</h3>
                  <ul className="list-disc pl-5">
                    {pastTeams.map((team, index) => (
                      <li key={index}>{team}</li>
                    ))}
                  </ul>
                </InfoCard>
              )}
            </InfoGrid>

            <MentorSection>
              <h4>Mentors</h4>
              <div className="mentor-grid">
                <div className="mentor-placeholder"></div>
                <div className="mentor-placeholder"></div>
                <div className="mentor-placeholder"></div>
              </div>
            </MentorSection>
          </>
        )}
      </TextSection>

      <ToggleButton expanded={isExpanded} onClick={handleToggle}>
        {isExpanded ? 'See Less' : 'See More'}
      </ToggleButton>
    </Box>
  );
};

export default BoxComponent;