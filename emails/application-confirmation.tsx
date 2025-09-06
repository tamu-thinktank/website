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

interface ApplicationConfirmationProps {
  userFirstname: string;
  applicationId: string;
  submittedAt: string;
  applicationType?: string;
  selectedTeams?: string[];
}

export const ApplicationConfirmationEmail = ({
  userFirstname = "Applicant",
  applicationId = "N/A",
  submittedAt,
  applicationType = "Design Challenge",
  selectedTeams = [],
}: ApplicationConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your ThinkTank Design Challenge application has been successfully submitted!
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
            Thank you for applying to TAMU ThinkTank's Design Challenge program!
            We have successfully received your application and are excited to review it.
          </Text>

          <Text style={paragraph}>
            <strong>Application Details:</strong>
            <br />
            <strong>Application ID:</strong> {applicationId}
            <br />
            <strong>Application Type:</strong> {applicationType}
            <br />
            <strong>Submitted:</strong> {submittedAt}
            {selectedTeams.length > 0 && (
              <>
                <br />
                <strong>Team Preferences:</strong> {selectedTeams.join(', ')}
              </>
            )}
          </Text>

          <Text style={paragraph}>
            <strong>What's Next?</strong>
          </Text>
          <Text style={paragraph}>
            Our admissions team will review your application along with all other submissions.
            If your application is selected for the next stage, you will receive an interview 
            invitation via email. This process typically takes 1-2 weeks.
          </Text>

          <Text style={paragraph}>
            In the meantime, we encourage you to:
            <br />
            • Join our Discord server for updates and community engagement
            <br />
            • Follow us on social media for the latest news
            <br />
            • Prepare for potential technical interviews by reviewing your coursework
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
                <Heading as="h3">Join ThinkTank Discord</Heading>
              </Column>
            </Row>
          </Button>

          <Text style={paragraph}>
            <strong>Important:</strong> Please save this email for your records. 
            If you have any questions or need to make changes to your application, 
            please contact us as soon as possible.
          </Text>

          <Text style={paragraph}>
            We appreciate your interest in ThinkTank and look forward to potentially 
            welcoming you to our community of innovators and problem-solvers!
          </Text>

          <Text style={paragraph}>
            Best regards,
            <br />
            TAMU ThinkTank Admissions Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Contact: tamuthinktank@gmail.com | Application ID: {applicationId}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ApplicationConfirmationEmail;

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