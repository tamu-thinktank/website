# Email System Documentation

The Think Tank application features a comprehensive email notification system for interview scheduling, application updates, and administrative communications.

## Overview

**Email Service**: Gmail SMTP with nodemailer  
**Templates**: React Email components  
**Service Location**: `/src/server/service/email.ts`  
**Templates Location**: `/emails/`

## Architecture

### Email Service Stack

```
Email System
├── SMTP Transport (Gmail)
├── Email Service (nodemailer)
├── Template Engine (React Email)
├── Template Components
└── API Endpoints
```

### Configuration

```typescript
// Email service configuration
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: env.APP_EMAIL, // Organization Gmail account
    pass: env.APP_PW, // App-specific password
  },
});
```

## Email Service Implementation

### Core Email Function

```typescript
// /src/server/service/email.ts
export default async function sendEmail({
  to: string[],           // Recipient emails
  cc?: string[],          // CC recipients (optional)
  subject: string,        // Email subject
  template: ReactElement  // React email template
}) {
  // Template rendering
  const htmlContent = render(template);

  // Email sending with logging
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: `"ThinkTank" <${env.APP_EMAIL}>`,
      to,
      cc,
      subject,
      html: htmlContent
    }, (error, info) => {
      // Error handling and success logging
    });
  });
}
```

### Logging System

The email service includes comprehensive logging:

- **Attempt Logging**: Email details before sending
- **Template Rendering**: Confirmation of successful HTML generation
- **Delivery Confirmation**: SMTP server response details
- **Error Logging**: Detailed error information for debugging

## Email Templates

### Interview Notification Template

**File**: `/emails/interview.tsx`  
**Purpose**: Notify applicants and interviewers about scheduled interviews

#### Template Props

```typescript
interface InterviewEmailProps {
  userFirstname: string; // Recipient's first name
  time?: string; // Interview date/time (formatted)
  location?: string; // Interview location
  interviewerName?: string; // Interviewer name
  team?: string; // Team assignment
  applicationType?: string; // Application type (General/Officer/MateROV)
}
```

#### Dynamic Content Features

- **Application Type Handling**: Different messaging for Officer vs General applications
- **Team-Specific Content**: Conditional sections based on team assignment
- **Personalization**: First name extraction and usage
- **Responsive Design**: Mobile-optimized email layout

#### Template Structure

```jsx
<InterviewEmail
  userFirstname="John"
  time="March 15, 2024 at 3:15 PM"
  location="Zach 420"
  interviewerName="Sarah Johnson"
  team="Software Team"
  applicationType="General"
/>
```

### Other Email Templates

#### Application Confirmation

**File**: `/emails/application-confirmation.tsx`  
**Purpose**: Confirm successful application submission

#### Rejection Notification

**File**: `/emails/reject-app.tsx`  
**Purpose**: Notify applicants of application rejection

#### Acceptance Notification

**File**: `/emails/acceptance.tsx`  
**Purpose**: Welcome new members to Think Tank

## Interview Email System

### 15-Minute Offset Implementation

#### Dual Email Strategy

When an interview is scheduled, two different emails are sent with different time displays:

1. **Interviewer Email**: Shows actual interview start time
2. **Interviewee Email**: Shows time offset by 15 minutes

#### API Implementation

```typescript
// /api/send-interview-email/route.ts
export async function POST(request: Request) {
  const validatedData = SendInterviewEmailSchema.parse(await request.json());

  const baseStartTime = new Date(validatedData.startTime);

  // Interviewer time (actual start)
  const interviewerTime = formatCentralTime(baseStartTime);

  // Interviewee time (15 minutes later)
  let offsetMinutes = validatedData.intervieweeTimeOffset || 15;

  // Handle edge cases
  if (offsetMinutes >= 45) offsetMinutes = 0; // Interview too short
  if (wouldExtendPastBusinessHours(baseStartTime, offsetMinutes))
    offsetMinutes = 0;

  const intervieweeTime = formatCentralTime(
    new Date(baseStartTime.getTime() + offsetMinutes * 60000),
  );

  // Send separate emails with different times
  // ...
}
```

#### Edge Case Handling

- **Short Interviews**: If interview duration < offset, use original time
- **Business Hours**: If offset would extend past 10 PM, use original time
- **Time Zone Conversion**: All times converted to Central Time for display

#### Request Schema

```typescript
const SendInterviewEmailSchema = z.object({
  officerId: z.string(),
  officerName: z.string(),
  officerEmail: z.string().email(),
  applicantName: z.string(),
  applicantEmail: z.string().email(),
  startTime: z.string(), // ISO timestamp
  location: z.string(),
  team: z.string().optional(),
  applicationType: z.string().optional(),
  sendToInterviewer: z.boolean().default(true),
  sendToInterviewee: z.boolean().default(true),
  intervieweeTimeOffset: z.number().default(15), // Minutes
});
```

## Automatic Email Triggers

### Interview Scheduling

**Trigger**: When `POST /api/schedule-interview` succeeds  
**Recipients**: Interviewer + Interviewee (if not placeholder)  
**Template**: Interview notification with appropriate time offset

```typescript
// Automatic email sending after interview creation
if (!isPlaceholder && interview.applicant) {
  try {
    const emailResponse = await fetch("/api/send-interview-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        officerId: interviewer.id,
        officerName: interviewer.name,
        officerEmail: interviewer.email,
        applicantName: interview.applicant.fullName,
        applicantEmail: interview.applicant.email,
        startTime: startTime.toISOString(),
        location: location,
        // ... other fields
      }),
    });
  } catch (emailError) {
    // Email failures don't prevent interview creation
    console.error("Error sending interview emails:", emailError);
  }
}
```

### Application Status Changes

**Triggers**: Status updates (ACCEPTED, REJECTED, WAITLIST)  
**Templates**: Appropriate notification template  
**Manual/Automatic**: Usually manually triggered by admin

### Interview Modifications

**Triggers**: Interview time/location changes  
**Recipients**: Both interviewer and interviewee  
**Content**: Updated information with change highlighting

## Email API Endpoints

### Send Interview Email

**Endpoint**: `POST /api/send-interview-email`  
**Purpose**: Send interview notifications with time offset logic  
**Features**: Dual recipient support, edge case handling

### Send Rejection Email

**Endpoint**: `POST /api/send-rejection-email`  
**Purpose**: Send application rejection notifications  
**Features**: Personalized rejection with feedback options

### General Email Sender

**Endpoint**: `POST /api/send-email`  
**Purpose**: Send custom emails through the system  
**Features**: Template selection, bulk sending capabilities

## Email Delivery Monitoring

### Success Tracking

```typescript
// Email delivery confirmation
transporter.sendMail(emailOptions, (error, info) => {
  if (error) {
    console.error(`❌ [EMAIL-SERVICE] Failed to send email:`, error);
    return reject(`Unable to send email: ${error.message}`);
  }

  // Success logging
  console.log(`✅ [EMAIL-SERVICE] Email sent successfully!`);
  console.log(`📧 [EMAIL-SERVICE] Message ID: ${info.messageId}`);
  console.log(`📧 [EMAIL-SERVICE] Accepted: ${info.accepted?.toString()}`);
  console.log(`📧 [EMAIL-SERVICE] Rejected: ${info.rejected?.toString()}`);

  resolve(`Message delivered to ${info.accepted?.toString()}`);
});
```

### Error Handling

- **SMTP Errors**: Connection, authentication, and server issues
- **Template Errors**: React email rendering failures
- **Validation Errors**: Invalid email addresses or data
- **Rate Limiting**: Gmail API quota management

### Delivery Status

- **Accepted**: Email accepted by SMTP server
- **Rejected**: Email rejected (invalid address, blocked, etc.)
- **Pending**: Email queued for delivery
- **Failed**: Delivery attempt failed

## Development Guidelines

### Creating New Email Templates

1. **Create Template Component**

   ```jsx
   // /emails/new-template.tsx
   export const NewTemplate = ({ prop1, prop2 }: Props) => (
     <Html>
       <Head />
       <Preview>Email preview text</Preview>
       <Body style={main}>
         <Container style={container}>
           {/* Email content */}
         </Container>
       </Body>
     </Html>
   );
   ```

2. **Add Type Definitions**

   ```typescript
   interface NewTemplateProps {
     prop1: string;
     prop2?: string;
   }
   ```

3. **Test Template**
   ```bash
   # Preview template in development
   npm run email:dev
   ```

### Email Styling Best Practices

- **Inline Styles**: Use inline CSS for maximum compatibility
- **Table Layouts**: Use tables for complex layouts
- **Mobile Responsive**: Test on various email clients
- **Alt Text**: Include alt text for images
- **Fallback Fonts**: Use web-safe font stacks

### Testing Emails

#### Development Testing

```typescript
// Test email sending in development
const testEmail = async () => {
  await sendEmail({
    to: ["test@example.com"],
    subject: "Test Email",
    template: InterviewEmail({
      userFirstname: "Test User",
      time: "March 15, 2024 at 3:00 PM",
      location: "Test Location",
      interviewerName: "Test Interviewer",
    }),
  });
};
```

#### Email Client Testing

- **Gmail**: Primary target client
- **Outlook**: Secondary target
- **Apple Mail**: Mobile compatibility
- **Yahoo Mail**: Baseline compatibility

### Security Considerations

#### Email Authentication

- **SPF Records**: Configured for domain verification
- **DKIM Signing**: Email signature verification
- **DMARC Policy**: Email authentication reporting

#### Content Security

- **Input Sanitization**: All dynamic content sanitized
- **Template Validation**: Props validated before rendering
- **Sensitive Data**: No sensitive information in emails

#### Rate Limiting

- **Gmail Limits**: Respect Gmail's sending quotas
- **Recipient Limits**: Batch large recipient lists
- **Retry Logic**: Exponential backoff for failed sends

## Troubleshooting Common Issues

### Email Not Sending

1. Check SMTP credentials and connectivity
2. Verify Gmail app password is current
3. Check for rate limiting or quota exceeded
4. Review email formatting and template rendering

### Emails Going to Spam

1. Verify SPF/DKIM/DMARC configuration
2. Check email content for spam triggers
3. Monitor sender reputation scores
4. Test with different email providers

### Template Rendering Issues

1. Validate React Email component syntax
2. Check for missing required props
3. Test template rendering separately
4. Verify CSS compatibility with email clients

### Time Zone Problems

1. Confirm server timezone configuration
2. Test time formatting functions
3. Validate Central Time conversion logic
4. Check offset calculation edge cases

---

_The email system is critical for user communication. Always test email templates across multiple clients and monitor delivery rates._
