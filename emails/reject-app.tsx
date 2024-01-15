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

interface RejectAppProps {
  userFirstname: string;
}

export const RejectAppEmail = ({ userFirstname = "Zeno" }: RejectAppProps) => (
  <Html>
    <Head />
    <Preview>TAMU ThinkTank has declined to proceed with your admission into one of our design challenge teams.</Preview>
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
          TAMU ThinkTank has declined to proceed with your admission into one of
          our design challenge teams. ThinkTank is growing every year and we
          currently do not have the space to fit everyone who applies. We
          believe you have potential on a design challenge team and encourage
          you to apply again in the following semester as we expand our size.
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

export default RejectAppEmail;

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
