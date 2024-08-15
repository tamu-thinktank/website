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
import * as React from "react";

interface InterviewEmailProps {
  userFirstname: string;
  time: string;
  location: string;
  eventLink: string;
  interviewerName: string;
}

export const InterviewEmail = ({
  userFirstname = "Zeno",
  time = Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(Date.now()),
  location = "TBD",
  interviewerName = "John Doe",
}: InterviewEmailProps) => (
  <Html>
    <Head />
    <Preview>
      ThinkTank would like to conduct an interview with you over a position on
      one of the design challenge teams for the Spring 2024 season.
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
          TAMU ThinkTank would like to interview you for a spot on one of the
          design challenge teams. We believe you could have the skills and
          talents necessary to compete and excel in one of our design challenge
          teams. This interview is the final step for us to determine if you
          would be a good fit in the organization and on a team.
        </Text>
        <Text style={paragraph}>
          The details for your interview are as follows:
          <br />
          <strong>Time:</strong> {time} <br />
          <strong>Location:</strong> {location} <br />
          <strong>Interviewer:</strong> {interviewerName}
        </Text>
        <Text style={paragraph}>
          These details are optimized to match your availability with ours, but
          let us know if these do not work for you and we will try and
          accommodate you. Accommodations will only be made for academic,
          disability, family, or other related matters. If you're unsure,
          contact us and we'll discuss it.
        </Text>
        <Text style={paragraph}>
          Prior to your interview, we require you to join our discord server in
          order to receive information about your application status in
          ThinkTank.
        </Text>
        <a
          href="https://discord.gg/qUAuSraYV9"
          className="display:inline-block; background-color:#5865F2; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; font-family:Ginto Nord, Arial, sans-serif;"
        >
          ThinkTank Discord
        </a>
        <Text style={paragraph}>
          Once in the discord, please change your server nickname to your
          preferred first name and last name. Additionally, ensure that
          notifications for the ThinkTank server are enabled. This is
          <strong> VERY IMPORTANT</strong> and failure to do so before the
          interview will result in the <strong>IMMEDIATE </strong>
          dismissal of your application.
        </Text>
        <Text style={paragraph}>
          Additionally, any student applying for an “open-ended” challenge as
          their first choice is required to come up with a general solution to
          their challenge before the interview. This solution doesn't need to be
          thoroughly thought out but should clearly demonstrate understanding of
          the rules and conditions of the challenge. Failure to produce a basic
          high level conceptual solution will result in a harsh consideration
          against your application.
        </Text>
        <Text style={paragraph}>
          This season, we are offering the following “open-ended” challenges:
          <br />
          <a
            href="https://www.aiaa.org/docs/default-source/uploadedfiles/membership-and-communities/university-students/design-competitions/2024-25-aiaa-undergraduate-team-space-design-competition.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <strong>AIAA:</strong> Mars Exploration Surveyors to Enable Human
            Exploration
          </a>
          <br />
          <a
            href="https://blueskies.nianet.org/competition/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <strong>Blue Skies:</strong> AgAir (Aviation Solutions for
            Agriculture)
          </a>
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
