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
  eventLink = "https://calendar.google.com",
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
        <Text style={paragraph}>We're excited to meet you!</Text>
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

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#4286F5",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: ".6em 1em",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
