"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";

interface AdmissionTimelineEntry {
  date: string;
  description: string;
}

const FacultyMentorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  text-align: center;

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
  }
`;

interface BoxProps {
  teamName: string;
  shortOverview: string;
  competitionOverview: string;
  duration: string;
  teamSize: string;
  admissionTimeline: AdmissionTimelineEntry[];
  researchAreas?: string[];
  pastTeams?: string[];
  mentors: {
    peer: string;
    faculty: string;
  };
  competitionLink?: string;
  imageUrl: string;
  image: string;
  major: string;
  year: string;
  description: string;
  facultyImage: string;
  field?: string;
  interest?: string;
  prize: string;
  dtype: string;
}

interface ExpandedProps {
  expanded: boolean;
}

const fasterDuration = 800;
const easing = "cubic-bezier(0.25, 0.8, 0.25, 1)";

const Box = styled.div<ExpandedProps>`
  display: flex;
  flex-direction: ${(props) => (props.expanded ? "column" : "row")};
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  height: ${(props) => (props.expanded ? "auto" : "300px")};
  margin: 20px auto;
  border: 2px solid rgba(83, 81, 81, 0.5);
  background-color: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  transition:
    height ${fasterDuration}ms ${easing},
    flex-direction ${fasterDuration}ms ${easing};

  @media (max-width: 768px) {
    flex-direction: column;
    height: ${(props) => (props.expanded ? "auto" : "450px")};
    margin: 10px auto;
  }
`;

const ImageSection = styled.div<ExpandedProps>`
  width: ${(props) => (props.expanded ? "100%" : "50%")};
  height: ${(props) => (props.expanded ? "450px" : "300px")};
  transition:
    width ${fasterDuration}ms ${easing},
    height ${fasterDuration}ms ${easing};

  @media (max-width: 768px) {
    width: 100%;
    height: ${(props) => (props.expanded ? "200px" : "150px")};
  }
`;

const TextSection = styled.div<ExpandedProps>`
  flex: 1;
  padding: 15px 20px;
  background-color: #000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  color: #bababa;
  position: relative;

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const Header = styled.div<ExpandedProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  margin-bottom: ${(props) => (props.expanded ? "10px" : "5px")};

  .team-name {
    font-family: "Poppins", sans-serif;
    font-size: ${(props) => (props.expanded ? "1.5rem" : "2.5rem")};
    text-align: center;
    margin-right: 10px;
    color: white;
    padding-top: ${(props) => (props.expanded ? "0px" : "10px")};

    @media (max-width: 768px) {
      font-size: ${(props) => (props.expanded ? "1.2rem" : "2rem")};
    }
  }

  .separator {
    margin: 0 10px;
  }

  .otherSeparator {
    margin: 0 5px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: 10px;
  }
`;

const ButtonStyle = styled.a`
  font-size: 14px;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 50px;
  border: 1px solid white;
  background-color: black;
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.3s ${easing},
    color 0.3s ${easing};
  text-transform: none;

  &:hover {
    background-color: white;
    color: black;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const ToggleButton = styled.div<ExpandedProps>`
  font-size: 14px;
  font-weight: bold;
  padding: ${(props) => (props.expanded ? "6px 80px" : "6px 12px")};
  border-radius: 50px;
  border: 1px solid white;
  background-color: black;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.3s ${easing},
    color 0.3s ${easing};

  &:hover {
    background-color: white;
    color: black;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: ${(props) => (props.expanded ? "4px 60px" : "4px 8px")};
  }
`;

const Separator = styled.span`
  color: white;
  font-weight: bold;
  margin: 0 5px;
`;

const otherSeparator = styled.span`
  margin: 0 5px;
`;

const InfoBlock = styled.div`
  background-color: #262626;
  outline: 1px solid rgba(82, 80, 80, 0.5);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  ul {
    list-style-type: disc;
    margin-left: 20px;
  }

  li {
    margin-bottom: 8px;
    font-size: 0.9rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
`;

const TimelineContainer = styled.div`
  margin: 15px 0;
  text-align: center;

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 15px;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  .timeline-line {
    height: 5px;
    border-radius: 10px;
    background-color: white;
    width: 80%;
    position: relative;
    margin: 0 auto;
  }

  .timeline-markers {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: 10px;
    width: 90%;
    margin: 10px auto 0;
  }

  .marker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 90%;
  }

  .marker {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-bottom: 5px;
  }

  .timeline-label {
    color: #bababa;
    font-size: 0.8rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }

  strong {
    display: block;
    color: white;

  `;
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
  image,
  major,
  year,
  description,
  facultyImage,
  field,
  interest,
  prize,
  dtype,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

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
              <ButtonStyle
                href={competitionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply
              </ButtonStyle>
              <span className="otherSeparator"></span>
              <ButtonStyle
                href={competitionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Competition Link
              </ButtonStyle>
            </>
          )}
        </Header>
        {!isExpanded && (
          <>
            <p className="mb-2 text-center font-semibold">{shortOverview}</p>
            <ButtonContainer>
              <ToggleButton expanded={isExpanded} onClick={handleToggle}>
                See More
              </ToggleButton>
              <Separator>|</Separator>
              <ButtonStyle
                href={competitionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply
              </ButtonStyle>
            </ButtonContainer>
          </>
        )}
        {isExpanded && (
          <>
            <InfoBlock>
              <h3>Challenge Overview</h3>
              <p>{competitionOverview}</p>
            </InfoBlock>

            <div style={{ display: "flex", justifyContent: "start", gap: 20 }}>
              {researchAreas ? (
                <InfoBlock style={{ flex: "1" }}>
                  <h3>Research Areas</h3>
                  <ul>
                    {researchAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </InfoBlock>
              ) : (
                pastTeams && (
                  <InfoBlock style={{ flex: "1" }}>
                    <h3>Past Teams</h3>
                    <ul>
                      {pastTeams.map((team, index) => (
                        <li key={index}>{team}</li>
                      ))}
                    </ul>
                  </InfoBlock>
                )
              )}

              <InfoBlock style={{ flex: "1" }}>
                <h3>Details</h3>
                <ul>
                  <li>
                    <strong>Duration:</strong> {duration}
                  </li>
                  <li>
                    <strong>Team Size:</strong> {teamSize}
                  </li>
                  <li>
                    <strong>Prize Amount:</strong> {prize}
                  </li>
                  <li>
                    <strong>Deliverable Type:</strong> {dtype}
                  </li>
                </ul>
              </InfoBlock>
            </div>

            <InfoBlock>
              <h3>Mentors</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <div
                  className="group relative aspect-square transform overflow-hidden rounded-3xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 dark:bg-gray-800"
                  style={{ width: "200px", height: "200px" }}
                >
                  <Image
                    className="transition-opacity duration-300 ease-in-out group-hover:opacity-50"
                    src={image}
                    alt={`${mentors.peer} avatar`}
                    width={200}
                    height={200}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-60 group-hover:opacity-100">
                    <h3 className="text-xl font-bold text-white">
                      {mentors.peer}
                    </h3>
                    <p className="text-md mt-1 font-semibold text-gray-200">
                      {major} '{year}
                    </p>
                    <p className="mt-3 text-sm text-gray-200">Peer Mentor</p>
                    <p className="mt-3 px-4 text-center text-sm text-gray-200">
                      {description}
                    </p>
                  </div>
                </div>

                <div
                  className="group relative aspect-square transform overflow-hidden rounded-3xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 dark:bg-gray-800"
                  style={{ width: "200px", height: "200px" }}
                >
                  <Image
                    className="transition-opacity duration-300 ease-in-out group-hover:opacity-50"
                    src={facultyImage}
                    alt={`${mentors.faculty} avatar`}
                    width={200}
                    height={200}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-60 group-hover:opacity-100">
                    <h3 className="text-xl font-bold text-white">
                      {mentors.faculty}
                    </h3>
                    <p className="text-md mt-1 font-semibold text-gray-200">
                      {field}
                    </p>
                    <p className="mt-3 text-sm text-gray-200">Faculty Mentor</p>
                    <p className="mt-3 px-4 text-center text-sm text-gray-200">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </InfoBlock>

            <InfoBlock>
              <h3>Admission Timeline</h3>
              <TimelineContainer>
                <div className="timeline-line" />
                <div className="timeline-markers">
                  {admissionTimeline.map((entry, index) => {
                    const entryDate = new Date(entry.date);
                    const currentDate = new Date();
                    const dotColor = entryDate > currentDate ? "green" : "red";

                    return (
                      <div key={index} className="marker-container">
                        <div
                          className="marker"
                          style={{ backgroundColor: dotColor }}
                        />
                        <div className="timeline-label">
                          <strong>{entry.date}</strong>
                          {entry.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TimelineContainer>
            </InfoBlock>

            <ButtonContainer>
              <ToggleButton expanded={isExpanded} onClick={handleToggle}>
                See Less
              </ToggleButton>
            </ButtonContainer>
          </>
        )}
      </TextSection>
    </Box>
  );
};

export default BoxComponent;
