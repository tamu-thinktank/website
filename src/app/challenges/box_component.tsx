"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface AdmissionTimelineEntry {
  date: string;
  description: string;
}

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

const Box = styled(motion.div)<ExpandedProps>`
  display: flex;
  flex-direction: ${(props) => (props.expanded ? "column" : "row")};
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  height: ${(props) => (props.expanded ? "auto" : "300px")};
  margin: 30px auto;
  border: 2px solid rgba(83, 81, 81, 0.5);
  background-color: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
    height: ${(props) => (props.expanded ? "auto" : "500px")};
    max-height: ${(props) => (props.expanded ? "none" : "500px")};
    margin: 20px auto;
  }
`;

const ImageSection = styled.div<ExpandedProps>`
  width: ${(props) => (props.expanded ? "100%" : "50%")};
  height: ${(props) => (props.expanded ? "450px" : "300px")};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: height 0.5s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const TextSection = styled.div<ExpandedProps>`
  flex: 1;
  padding: 15px 20px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  color: #bababa;
  position: relative;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: max-height 0.5s ease-in-out;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    max-height: ${(props) => (props.expanded ? "none" : "300px")};
    overflow-y: auto;
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
    color: white;
  }

  .status {
    font-size: 0.8rem;
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-top: 10px;
    margin-bottom: 15px;
  }
`;

const ButtonStyle = styled.a<{
  disabled?: boolean;
  filled?: boolean;
  expanded?: boolean;
}>`
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  width: ${(props) => (props.expanded ? "100%" : "100%")};
  max-width: ${(props) =>
    props.expanded
      ? "200px"
      : "420px"}; // Differentiate based on expanded state
  border-radius: 50px;
  border: 0.5px solid white;
  background-color: ${(props) => (props.filled ? "white" : "transparent")};
  color: ${(props) => (props.filled ? "black" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
    max-width: ${(props) =>
      props.expanded
        ? "100%"
        : "100%"}; // Ensure full width responsiveness on smaller screens
  }
`;

const ToggleButton = styled.div<ExpandedProps>`
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  width: 100%;
  max-width: 420px;
  border-radius: 50px;
  border: 0.5px solid white;
  background-color: transparent;
  color: white;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
    max-width: 100%;
  }
`;

const StatusIndicator = styled.span<{ isOpen: boolean }>`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.isOpen ? "#4CAF50" : "#FF5722")};
`;

const InfoBlock = styled.div`
  background-color: #050505;
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
  }
`;

const MentorSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const MentorCard = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const MentorInfo = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  text-align: center;
  padding: 1rem;

  &:hover {
    opacity: 1;
  }

  h4 {
    width: 100%;
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  p {
    width: 100%;
    font-size: 0.875rem;
    margin: 0;

    &.role {
      margin-top: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    h4 {
      font-size: 1rem;
    }

    p {
      font-size: 0.75rem;
    }
  }
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
  facultyImage,
  field,
  prize,
  dtype,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // const isOpen = teamName === "Daedalus";
  const isOpen = false;
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      const boxElement = document.getElementById(`box-${teamName}`);
      if (boxElement) {
        boxElement.scrollTop = 0;
      }
      const textSection = boxElement?.querySelector("[data-text-section]");
      if (textSection) {
        textSection.scrollTop = 0;
      }
    }
  }, [isExpanded, teamName]);

  useEffect(() => {
    const handleResize = () => {
      const boxElement = document.getElementById(`box-${teamName}`);
      if (boxElement) {
        if (window.innerWidth <= 768) {
          boxElement.style.height = isExpanded ? "auto" : "500px";
        } else {
          boxElement.style.height = isExpanded ? "auto" : "300px";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, teamName]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const variants = {
    collapsed: {
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    expanded: {
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };
  // - timeline functionality isnt working
  const getMarkerColor = (date: string) => {
    const deadlineDate = new Date(date);
    const currentDate = new Date("2024-11-07"); // testing out with current date
    return currentDate > deadlineDate ? "red" : "green";
  };

  return (
    <Box
      id={`box-${teamName}`}
      expanded={isExpanded}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <ImageSection
        expanded={isExpanded}
        onClick={() =>
          window.open(competitionLink, "_blank", "noopener,noreferrer")
        }
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`${teamName} visual`}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              cursor: "pointer", // Add this line to change cursor on hover
            }}
            onLoadingComplete={() => setIsLoaded(true)}
          />
        )}
      </ImageSection>

      <TextSection expanded={isExpanded} data-text-section>
        <Header expanded={isExpanded}>
          <span className="team-name">{teamName.toUpperCase()}</span>
          <span className="separator">|</span>
          <StatusIndicator isOpen={isOpen}>
            {isOpen ? "Open" : "Closed"}
          </StatusIndicator>
        </Header>
        {!isExpanded && (
          <>
            <p className="mb-2 text-center font-semibold">{shortOverview}</p>
            <ButtonContainer>
              <ButtonStyle
                href="/apply"
                target="_blank"
                rel="noopener noreferrer"
                disabled={!isOpen}
                filled={isOpen}
              >
                {isOpen ? "Apply" : "Closed"}
              </ButtonStyle>
              <ToggleButton expanded={isExpanded} onClick={handleToggle}>
                See More
              </ToggleButton>
            </ButtonContainer>
          </>
        )}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InfoBlock>
                <h3>Challenge Overview</h3>
                <p>{competitionOverview}</p>
              </InfoBlock>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {researchAreas ? (
                  <InfoBlock>
                    <h3>Research Areas</h3>
                    <ul>
                      {researchAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </InfoBlock>
                ) : (
                  pastTeams && (
                    <InfoBlock>
                      <h3>Past Teams</h3>
                      <ul>
                        {pastTeams.map((team, index) => (
                          <li key={index}>{team}</li>
                        ))}
                      </ul>
                    </InfoBlock>
                  )
                )}

                <InfoBlock>
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
                <MentorSection>
                  <MentorCard>
                    <Image
                      src={image}
                      alt={`${mentors.peer} avatar`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <MentorInfo>
                      <h4>{mentors.peer}</h4>
                      <p>
                        {major} '{year}
                      </p>
                      <p className="role">Peer Mentor</p>
                    </MentorInfo>
                  </MentorCard>

                  <MentorCard>
                    <Image
                      src={facultyImage}
                      alt={`${mentors.faculty} avatar`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <MentorInfo>
                      <h4>{mentors.faculty}</h4>
                      {field && <p>{field}</p>}
                      <p className="role">Faculty Mentor</p>
                    </MentorInfo>
                  </MentorCard>
                </MentorSection>
              </InfoBlock>

              <InfoBlock>
                <h3>Admission Timeline</h3>
                <TimelineContainer>
                  <div className="timeline-line" />
                  <div className="timeline-markers">
                    {admissionTimeline.map((entry, index) => (
                      <div key={index} className="marker-container">
                        <div
                          className="marker"
                          style={{
                            backgroundColor: getMarkerColor(entry.date),
                          }}
                        />
                        <div className="timeline-label">
                          <strong>{entry.date}</strong>
                          {entry.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </TimelineContainer>
              </InfoBlock>

              <ButtonContainer
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: "20px",
                  width: "100%",
                }}
              >
                <ButtonStyle
                  href={competitionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  filled={false}
                  style={{
                    border: "1px solid white",
                    color: "white",
                    backgroundColor: "transparent",
                  }}
                >
                  Competition Link
                </ButtonStyle>
                <ButtonStyle
                  href="/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!isOpen}
                  filled={true}
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  {isOpen ? "Apply" : "Closed"}
                </ButtonStyle>
              </ButtonContainer>
              <ButtonContainer style={{ marginTop: "10px", width: "100%" }}>
                <ToggleButton expanded={isExpanded} onClick={handleToggle}>
                  See Less
                </ToggleButton>
              </ButtonContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </TextSection>
    </Box>
  );
};

export default BoxComponent;
