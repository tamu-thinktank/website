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

export const RejectAppEmail = ({
  userFirstname = "Zeno",
}: RejectAppProps) => (
  <Html>
    <Head />
    <Preview>
      ur trash lol
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
        <Text style={paragraph}>Howdy {userFirstname}! 😎</Text>
        <Text style={paragraph}>
          We dont want u. Get good.
        </Text>
        <Text style={paragraph}>
          Tough luck kiddo,
          <br />
          The TAMU ThinkTank Officer Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}></Text>
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
