import { env } from "@/env";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface InterviewEmailProps {
  userFirstname: string;
  time?: string;
  location?: string;
  interviewerName?: string;
  team?: string;
  applicationType?: string;
}

export const InterviewEmail = ({
  userFirstname = "Applicant",
  time = "To be determined",
  location = "To be determined",
  interviewerName = "ThinkTank Team",
  team,
  applicationType = "General",
}: InterviewEmailProps) => {
  // Determine the interview type based on application type
  const interviewType =
    applicationType.toUpperCase() === "OFFICER"
      ? "Officer Position"
      : applicationType.toUpperCase() === "MATEROV"
        ? "MateROV Team"
        : "Design Challenge Team";

  // Create position/team text
  const positionText =
    team && team !== "NONE" && team !== "INTERVIEWING"
      ? `for the ${team} ${interviewType}`
      : `for a ${interviewType}`;

  return (
    <Html>
      <Head />
      <Preview>
        ThinkTank would like to conduct an interview with you {positionText} for
        the Spring 2024 season.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section
            style={{
              textAlign: "center",
            }}
          >
            <Button
              href={env.WEB_URL}
              style={{
                backgroundColor: "transparent",
                textDecoration: "none",
                textAlign: "center",
                color: "black",
                display: "block",
              }}
            >
              <Row>
                <Column>
                  <Img
                    src={new URL(`/ttt.png`, env.WEB_URL).toString()}
                    width="50"
                    alt="TTT"
                    style={{
                      marginRight: "16px",
                      backgroundColor: "transparent",
                    }}
                  />
                </Column>
                <Column>
                  <Heading as="h2">TAMU ThinkTank</Heading>
                </Column>
              </Row>
            </Button>
          </Section>
          <Text style={paragraph}>Howdy {userFirstname}!</Text>
          <Text style={paragraph}>
            TAMU ThinkTank would like to interview you {positionText}. We
            believe you could have the skills and talents necessary to compete
            and excel{" "}
            {applicationType.toUpperCase() === "OFFICER"
              ? "as an officer in our organization"
              : "in one of our design challenge teams"}
            . This interview is the final step for us to determine if you would
            be a good fit in the organization
            {team && team !== "NONE" && team !== "INTERVIEWING"
              ? ` and on the ${team} team`
              : ""}
            .
          </Text>
          <Text style={paragraph}>
            The details for your interview are as follows:
            <br />
            <strong>Time:</strong> {time} <br />
            <strong>Location:</strong> {location} <br />
            <strong>Interviewer:</strong> {interviewerName} <br />
            {team && team !== "NONE" && team !== "INTERVIEWING" && (
              <>
                <strong>Team/Position:</strong> {team} <br />
              </>
            )}
            <strong>Application Type:</strong> {applicationType}
          </Text>
          <Text style={paragraph}>
            These details are optimized to match your availability with ours,
            but let us know if these do not work for you and we will try and
            accommodate you. Accommodations will only be made for academic,
            disability, family, or other related matters. If you're unsure,
            contact us and we'll discuss it.
          </Text>
          <Text style={paragraph}>
            Prior to your interview, we require you to join our discord server
            in order to receive information about your application status in
            ThinkTank.
          </Text>
          <Button
            href="https://discord.gg/qUAuSraYV9"
            style={{
              backgroundColor: "transparent",
              textDecoration: "none",
              textAlign: "center",
              color: "black",
              display: "block",
            }}
          >
            <Row>
              <Column>
                <Img
                  src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
                  width="50"
                  alt="Discord"
                  style={{
                    marginRight: "16px",
                    backgroundColor: "transparent",
                  }}
                />
              </Column>
              <Column>
                <Heading as="h3">ThinkTank Discord</Heading>
              </Column>
            </Row>
          </Button>
          <Text style={paragraph}>
            Once in the discord, please change your server nickname to your
            preferred first name and last name. Additionally, ensure that
            notifications for the ThinkTank server are enabled. This is
            <strong> VERY IMPORTANT</strong> and failure to do so before the
            interview will result in the <strong>IMMEDIATE </strong>
            dismissal of your application.
          </Text>
          <Text style={paragraph}>
            Notify us if you have any questions or issues with links. We're very
            excited to meet you!
          </Text>
          <Text style={paragraph}>
            Sincerely,
            <br />
            TAMU ThinkTank Leadership
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Contact: tamuthinktank@gmail.com</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InterviewEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
