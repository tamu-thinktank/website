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
  eventLink: string;
}

export const InterviewEmail = ({
  userFirstname = "Zeno",
  time = Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(Date.now()),
  eventLink = "https://calendar.google.com",
}: InterviewEmailProps) => (
  <Html>
    <Head />
    <Preview>
      ThinkTank would like to conduct an interview with you over a 
      position on one of the design challenge teams for the Spring 2024 season.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            href="https://tamuthinktank.org"
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <Row>
              <Column>
                <Img src={`/ttt.webp`} width="50" alt="TTT" style={logo} />
              </Column>
              <Column>
                <Heading as="h2">TAMU ThinkTank</Heading>
              </Column>
            </Row>
          </Button>
        </Section>
        <Text style={paragraph}>Howdy {userFirstname}!</Text>
        <Text style={paragraph}>
          ThinkTank would like to conduct an interview with you over a 
          position on one of the design challenge teams for the Spring 2024 season.
        </Text>
        <Text style={paragraph}>Your interview is scheduled at {time}.</Text>
        <Section style={btnContainer}>
          <Button style={button} href={eventLink}>
            Google Calendar
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The TAMU ThinkTank Officer Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}></Text>
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

const logo = {
  marginRight: "16px",
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
