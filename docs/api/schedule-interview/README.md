# Schedule Interview API

**Endpoint**: `POST /api/schedule-interview`  
**Purpose**: Create new interview bookings with comprehensive validation and automatic email notifications  
**Location**: `/src/app/api/schedule-interview/route.ts`

## Overview

This endpoint handles the core interview scheduling functionality, including conflict detection, business hours validation, and automatic email notifications with the 15-minute offset system.

## Request Format

### HTTP Method

`POST /api/schedule-interview`

### Headers

```
Content-Type: application/json
Authorization: Bearer <session-token>
```

### Request Body

```typescript
{
  applicantId?: string;      // Optional for placeholder bookings
  interviewerId: string;     // Required - interviewer user ID
  time: string;             // Required - ISO timestamp of start time
  location: string;         // Required - interview location
  teamId?: string;          // Optional - team assignment
  isPlaceholder?: boolean;  // Optional - default false
  applicantName?: string;   // Required for placeholders
}
```

### Field Validation Rules

#### `applicantId` (string, optional)

- Must be valid UUID format
- Must correspond to existing application record
- Required unless `isPlaceholder` is true
- Applicant must have `INTERVIEWING` status (or will be updated to this status)

#### `interviewerId` (string, required)

- Must be valid UUID format
- Must correspond to existing user with interviewer role
- Cannot be the same as `applicantId`

#### `time` (string, required)

- Must be valid ISO 8601 timestamp
- Cannot be in the past (5-minute buffer allowed)
- Must be within business hours (8:00 AM - 10:00 PM)
- Must align with 15-minute increments (e.g., :00, :15, :30, :45)
- End time (start + 45 minutes) cannot extend past 10:00 PM

#### `location` (string, required)

- Minimum length: 1 character
- Maximum length: 255 characters
- Common formats: "Zach 420", "Zoom: https://...", "Phone"

#### `teamId` (string, optional)

- Must correspond to valid team/position ID
- Used for team-specific interview processes

#### `isPlaceholder` (boolean, optional)

- Default: `false`
- When `true`, creates reserved slot without specific applicant
- When `true`, `applicantName` is required and `applicantId` ignored

#### `applicantName` (string, conditional)

- Required when `isPlaceholder` is `true`
- Used as display name for placeholder bookings
- Maximum length: 100 characters

## Response Format

### Success Response (201 Created)

```typescript
{
  id: string;              // Interview UUID
  applicantId?: string;    // Null for placeholders
  interviewerId: string;   // Interviewer UUID
  startTime: string;       // ISO timestamp
  endTime: string;         // ISO timestamp (startTime + 45 minutes)
  location: string;        // Interview location
  teamId?: string;         // Team assignment
  isPlaceholder: boolean;  // Placeholder flag
  placeholderName?: string; // Name for placeholders
  applicantName: string;   // Display name (applicant or placeholder)
}
```

### Error Responses

#### 400 Bad Request - Missing Fields

```typescript
{
  error: "Missing required fields",
  status: 400
}
```

#### 400 Bad Request - Past Time

```typescript
{
  error: "Cannot schedule interviews in the past",
  status: 400
}
```

#### 400 Bad Request - Business Hours

```typescript
{
  error: "Interviews can only be scheduled between 8 AM and 10 PM",
  status: 400
}
```

#### 400 Bad Request - Extended Hours

```typescript
{
  error: "Interview would extend past 10 PM business hours",
  status: 400
}
```

#### 404 Not Found - Interviewer

```typescript
{
  error: "Interviewer not found",
  status: 404
}
```

#### 404 Not Found - Applicant

```typescript
{
  error: "Applicant not found",
  status: 404
}
```

#### 409 Conflict - Interview Overlap

```typescript
{
  error: "Time slot conflicts with an existing interview",
  conflictingInterviews: [
    {
      id: string,
      startTime: string,
      endTime: string,
      applicantName: string,
      location: string
    }
  ],
  status: 409
}
```

#### 409 Conflict - Applicant Double-Booked

```typescript
{
  error: "Applicant already has a conflicting interview scheduled",
  conflictingInterviews: [
    {
      id: string,
      startTime: string,
      endTime: string,
      interviewerName: string,
      location: string
    }
  ],
  status: 409
}
```

#### 400 Bad Request - Busy Time Conflict

```typescript
{
  error: "Time slot conflicts with interviewer busy time",
  busyTimes: [
    {
      startTime: string,
      endTime: string,
      reason: string
    }
  ],
  status: 400
}
```

## Business Logic

### Time Slot Validation

#### Duration Calculation

```typescript
const startTime = new Date(time);
const endTime = new Date(startTime.getTime() + 45 * 60000); // 45 minutes
```

#### Business Hours Check

```typescript
const hour = startTime.getHours();
if (hour < 8 || hour >= 22) {
  // Reject - outside business hours
}

// Also check end time doesn't extend past 10 PM
const endHour = endTime.getHours();
const endMinute = endTime.getMinutes();
if (endHour > 22 || (endHour === 22 && endMinute > 0)) {
  // Reject - would run past business hours
}
```

### Conflict Detection

#### Interviewer Conflicts

Checks for overlapping interviews for the same interviewer:

```sql
SELECT * FROM Interview
WHERE interviewerId = ?
  AND startTime < ?
  AND endTime > ?
```

#### Applicant Conflicts

Checks for overlapping interviews for the same applicant:

```sql
SELECT * FROM Interview
WHERE applicantId = ?
  AND startTime < ?
  AND endTime > ?
```

#### Busy Time Conflicts

Checks interviewer marked busy periods:

```sql
SELECT * FROM InterviewerBusyTime
WHERE interviewerId = ?
  AND startTime < ?
  AND endTime > ?
```

### Status Updates

When scheduling a regular interview (not placeholder):

1. Update applicant status to `INTERVIEWING` if not already
2. Set `assignedTeam` to provided `teamId`
3. Log status change for audit trail

## Email Notifications

### Automatic Email Sending

After successful interview creation, emails are automatically sent to both interviewer and interviewee (if not a placeholder).

#### Email Data Sent

```typescript
{
  officerId: interviewer.id,
  officerName: interviewer.name,
  officerEmail: interviewer.email,
  applicantName: applicant.fullName,
  applicantEmail: applicant.email,
  startTime: startTime.toISOString(),
  location: location,
  team: teamId || "General",
  applicationType: "General",
  sendToInterviewer: true,
  sendToInterviewee: true,
  intervieweeTimeOffset: 15  // 15-minute buffer
}
```

#### Time Offset Logic

- **Interviewer Email**: Shows actual start time
- **Interviewee Email**: Shows start time + 15 minutes
- **Edge Cases**: No offset applied if interview < 15 minutes or would extend past business hours

### Email Failure Handling

- Interview creation succeeds even if email sending fails
- Email failures are logged but don't prevent scheduling
- Emails can be resent manually through admin interface

## Database Operations

### Primary Tables Affected

#### `Interview` Table

```sql
INSERT INTO Interview (
  id, applicantId, interviewerId, startTime, endTime,
  location, teamId, isPlaceholder, placeholderName
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
```

#### `Application` Table (if status update needed)

```sql
UPDATE Application
SET status = 'INTERVIEWING', assignedTeam = ?
WHERE id = ?
```

### Transaction Handling

- All database operations wrapped in transaction
- Rollback on any failure to maintain consistency
- Includes conflict checking within transaction scope

## Performance Considerations

### Database Indexes

Critical indexes for performance:

- `Interview(interviewerId, startTime, endTime)` - Conflict detection
- `Interview(applicantId, startTime, endTime)` - Applicant conflicts
- `InterviewerBusyTime(interviewerId, startTime, endTime)` - Busy time checks
- `Application(id, status)` - Status updates

### Optimization Strategies

- Conflict queries use efficient date range lookups
- Minimal data selected in conflict detection queries
- Batch email sending to reduce API overhead
- Database connection pooling for concurrent requests

## Error Handling Strategies

### Validation Errors

- Input validation happens before database queries
- Clear error messages with specific field information
- HTTP 400 status with structured error response

### Conflict Resolution

- Detailed conflict information returned to client
- UI can suggest alternative time slots
- Conflicts checked again just before final insertion

### Recovery Scenarios

- Database rollback on any operation failure
- Email retry mechanism for transient failures
- Logging for debugging scheduling issues

## Example Usage

### Schedule Regular Interview

```typescript
const response = await fetch("/api/schedule-interview", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <token>",
  },
  body: JSON.stringify({
    applicantId: "550e8400-e29b-41d4-a716-446655440000",
    interviewerId: "550e8400-e29b-41d4-a716-446655440001",
    time: "2024-03-15T15:00:00.000Z",
    location: "Zach 420",
    teamId: "SOFTWARE_TEAM",
  }),
});

const interview = await response.json();
```

### Schedule Placeholder

```typescript
const response = await fetch("/api/schedule-interview", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <token>",
  },
  body: JSON.stringify({
    interviewerId: "550e8400-e29b-41d4-a716-446655440001",
    time: "2024-03-15T16:00:00.000Z",
    location: "Zach 420",
    isPlaceholder: true,
    applicantName: "Reserved for VIP",
  }),
});

const placeholder = await response.json();
```

## Testing Considerations

### Test Cases to Cover

1. **Valid Scheduling**: Standard interview creation
2. **Placeholder Booking**: Reserved slots without applicant
3. **Past Time Rejection**: Cannot schedule in past
4. **Business Hours**: Outside 8 AM - 10 PM rejection
5. **Interview Conflicts**: Overlapping interviewer bookings
6. **Applicant Conflicts**: Double-booked applicants
7. **Busy Time Conflicts**: Interviewer unavailable periods
8. **Email Integration**: Verify offset timing
9. **Status Updates**: Applicant status transitions
10. **Edge Cases**: Boundary conditions and error scenarios

### Mock Data Setup

```typescript
// Test interviewer
const interviewer = {
  id: "interviewer-id",
  name: "John Doe",
  email: "john@example.com",
};

// Test applicant
const applicant = {
  id: "applicant-id",
  fullName: "Jane Smith",
  email: "jane@example.com",
  status: "PENDING",
};
```

---

_This endpoint is critical to the interview scheduling system. Changes should be thoroughly tested, especially conflict detection and email notification logic._
