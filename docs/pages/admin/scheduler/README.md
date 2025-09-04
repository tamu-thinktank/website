# Interview Scheduler System Documentation

The Interview Scheduler is the most complex component of the admin system, providing comprehensive tools for managing interview scheduling across multiple interviewers, time slots, and applicants.

## How the Scheduler Works (Simple Explanation)

Think of the scheduler like a big calendar grid where each row is a different interviewer and each column represents a day of the week. Each cell in this grid represents a 15-minute time slot.

### The Basic Concept

- **Time Slots**: Each day is divided into 15-minute chunks from 8:00 AM to 10:00 PM
- **Interviews**: Each interview takes exactly 45 minutes (3 consecutive 15-minute slots)
- **Color System**:
  - Green = Available for interviews
  - Red = Already has an interview scheduled
  - Yellow = Interviewer marked as busy
  - Gray = Outside business hours or weekends

### What Admins Can Do

1. **Click and Schedule**: Click on any green slot to schedule an interview
2. **Mark Busy**: Right-click to mark times when interviewers aren't available
3. **Bulk Select**: Select multiple slots at once to mark many times busy/available
4. **View Details**: Click on red slots to see interview information

### The Smart Features

- **Conflict Prevention**: System won't let you double-book anyone
- **Email Magic**: Automatically sends different times to interviewer vs interviewee (15-minute buffer)
- **Real-time Updates**: Changes appear immediately for all users
- **Mobile Friendly**: Works on phones and tablets for on-the-go scheduling

## Overview

**Location**: `/src/app/admin/scheduler/`  
**Main Component**: `scheduler-page.tsx`  
**API Endpoints**: Multiple scheduling and management endpoints  
**Time Management**: 15-minute granularity with 45-minute interview blocks

## System Architecture

### Core Components

```
scheduler/
├── scheduler-page.tsx          # Main scheduler interface
├── tableHeader.tsx             # Calendar header component
└── _components/                # Scheduler-specific components
    ├── TimeSlotComponent.tsx   # Individual time slot rendering
    ├── InterviewModal.tsx      # Interview creation/editing
    └── ApplicantModal.tsx      # Applicant details view
```

## Business Logic

### Time Management

- **Granularity**: 15-minute time slots
- **Business Hours**: 8:00 AM - 10:00 PM daily
- **Interview Duration**: 45 minutes (3 consecutive 15-minute slots)
- **Buffer Time**: 15-minute preparation time before interviews

### Interview Types

1. **Regular Interviews**: Scheduled with specific applicants
2. **Placeholder Slots**: Reserved time without assigned applicant
3. **Busy Time**: Marked unavailable periods

### Scheduling Rules

- Cannot schedule interviews in the past (5-minute buffer allowed)
- Must respect business hours (8 AM - 10 PM)
- Check conflicts with existing interviews
- Verify interviewer availability
- Validate applicant availability

## Core Features

### 1. Calendar Interface

#### View Modes

- **Week View**: 7-day calendar grid (default)
- **Day View**: Single-day detailed view
- **Navigation**: Previous/Next week, jump to today

#### Time Slot Display

```
8:00 AM  |  Mon  |  Tue  |  Wed  |  Thu  |  Fri  |  Sat  |  Sun  |
8:15 AM  |   🟢   |   🔴   |   🟡   |   ⬜   |   🟢   |   🟢   |   🟢   |
8:30 AM  |   🟢   |   🔴   |   🟡   |   ⬜   |   🟢   |   🟢   |   🟢   |
...
```

**Color Coding**:

- 🟢 **Green**: Available time slot
- 🔴 **Red**: Scheduled interview
- 🟡 **Yellow**: Marked as busy
- ⬜ **Gray**: Weekend or non-business hours

### 2. Multi-Select Operations

#### Selection Modes

1. **Single Select**: Click individual slots for quick actions
2. **Multi-Select**: Select multiple slots across interviewers
3. **Per-Interviewer**: Select multiple slots for one interviewer
4. **Column Select**: Select entire day for all time slots

#### Bulk Operations

- **Mark Busy/Available**: Update multiple slots simultaneously
- **Schedule Multiple**: Create interviews for selected slots
- **Clear Selection**: Reset all selections

### 3. Interview Management

#### Creating Interviews

```typescript
// API Call Structure
POST /api/schedule-interview
{
  applicantId?: string,      // Optional for placeholders
  interviewerId: string,     // Required
  time: string,             // ISO timestamp
  location: string,         // Physical or virtual location
  teamId?: string,          // Team assignment
  isPlaceholder?: boolean,  // Reserve without applicant
  applicantName?: string    // For placeholder naming
}
```

#### Interview Features

- **Applicant Selection**: Search and select from INTERVIEWING status applicants
- **Location Specification**: Physical rooms or virtual meeting links
- **Team Assignment**: Associate with specific teams
- **Placeholder Booking**: Reserve time without specific applicant

### 4. Conflict Detection

#### Types of Conflicts Checked

1. **Interviewer Conflicts**: Double-booked interviewer
2. **Applicant Conflicts**: Applicant already has interview at overlapping time
3. **Busy Time Conflicts**: Interviewer marked unavailable
4. **Business Hours**: Outside 8 AM - 10 PM window

#### Conflict Resolution

- **Real-time Validation**: Check conflicts before saving
- **Visual Indicators**: Show conflicting slots in UI
- **Error Messages**: Detailed conflict information
- **Alternative Suggestions**: Propose available time slots

## Email Notification System

### 15-Minute Offset Logic

When an interview is scheduled, two different emails are sent:

#### Interviewer Email

- **Time Displayed**: Actual interview start time
- **Example**: Interview at 3:00 PM → Email shows "3:00 PM"
- **Purpose**: Interviewer needs actual start time for preparation

#### Interviewee Email

- **Time Displayed**: Start time + 15 minutes
- **Example**: Interview at 3:00 PM → Email shows "3:15 PM"
- **Purpose**: Ensures interviewee arrives after interviewer preparation

#### Implementation

```typescript
// In send-interview-email API
const baseStartTime = new Date(startTime);
const intervieweeStartTime = new Date(baseStartTime.getTime() + 15 * 60000);

// Different times formatted for each recipient
const interviewerTime = formatCentralTime(baseStartTime);
const intervieweeTime = formatCentralTime(intervieweeStartTime);
```

#### Edge Cases Handled

- **Short Interviews**: If interview < 15 minutes, no offset applied
- **Late Evening**: If offset would extend past 10 PM, no offset applied
- **Time Zones**: All times converted to Central Time for display

### Automatic Email Triggers

- **New Interview**: Sends to both interviewer and interviewee
- **Interview Update**: Notifications for time/location changes
- **Interview Deletion**: Cancellation notifications

## Performance Optimizations

### 1. Data Management

#### Caching Strategy

```typescript
// Redis Cache Keys
scheduler:interviews:${date}:${interviewerId}
scheduler:busy-times:${date}:${interviewerId}
scheduler:applicants:interviewing
```

#### Cache Invalidation

- **Interview Changes**: Clear interviewer and date caches
- **Status Updates**: Refresh applicant caches
- **Bulk Operations**: Batch invalidation for performance

### 2. UI Optimizations

#### React Performance

- **Memoization**: `React.memo` for TimeSlotComponent
- **Callback Optimization**: `useCallback` for event handlers
- **State Optimization**: Minimize re-renders with proper state structure

#### Rendering Strategy

```typescript
// Memoized time slot component
const TimeSlotComponent = React.memo(({ timeSlot, interviewer, date }) => {
  // Component logic with optimized rendering
});
```

### 3. API Optimization

#### Batch Operations

- **Bulk Busy Time Updates**: Single API call for multiple slots
- **Conflict Checking**: Efficient database queries with proper indexing
- **Data Fetching**: Load only necessary date ranges

#### Request Optimization

- **Debouncing**: Delay API calls for rapid user actions
- **Optimistic Updates**: Update UI before API confirmation
- **Error Recovery**: Automatic retry with exponential backoff

## Database Operations

### Primary Queries

#### Interview Scheduling

```sql
-- Check for conflicts
SELECT * FROM Interview
WHERE interviewerId = ?
  AND startTime < ?
  AND endTime > ?;

-- Get interviewer availability
SELECT * FROM InterviewerBusyTime
WHERE interviewerId = ?
  AND date BETWEEN ? AND ?;
```

#### Applicant Management

```sql
-- Get interviewing applicants
SELECT id, fullName, email, major, year
FROM Application
WHERE status = 'INTERVIEWING'
ORDER BY fullName;
```

### Database Indexes

Critical indexes for scheduler performance:

- `Interview(interviewerId, startTime, endTime)`
- `InterviewerBusyTime(interviewerId, date)`
- `Application(status, fullName)`

## Context Menu System

### Available Actions

- **Available Slots**:
  - Mark as Busy
  - Schedule Interview
- **Busy Slots**:
  - Mark as Available
  - Schedule Interview (override)
- **Scheduled Interviews**:
  - View Interview Details
  - Edit Interview
  - Delete Interview

### Implementation

```typescript
// Context menu state management
const [contextMenu, setContextMenu] = useState<{
  x: number;
  y: number;
  interviewerId: string;
  date: Date;
  timeSlot: TimeSlot;
  interview?: Interview;
} | null>(null);
```

## Error Handling

### Client-Side Errors

- **Network Failures**: Retry with exponential backoff
- **Validation Errors**: Show field-specific error messages
- **Conflict Errors**: Highlight conflicting slots and suggest alternatives

### Server-Side Errors

- **Database Conflicts**: Transaction rollback and detailed error reporting
- **Email Failures**: Interview creation succeeds, email marked for retry
- **Cache Failures**: Fallback to direct database queries

## Development Guidelines

### Adding New Features

1. **Time Slot Modifications**

   - Update business hours validation
   - Modify time slot generation logic
   - Test conflict detection thoroughly

2. **New Interview Types**

   - Extend Interview model if needed
   - Update scheduling API validation
   - Add UI components for new type

3. **Email Customization**
   - Modify send-interview-email API
   - Update email templates in `/emails/`
   - Test offset logic for edge cases

### Testing Strategies

#### Unit Tests

- Time conflict detection algorithms
- Email offset calculation logic
- Date/time manipulation functions

#### Integration Tests

- Interview scheduling workflow
- Email sending pipeline
- Cache invalidation scenarios

#### User Experience Tests

- Multi-select operations
- Context menu interactions
- Error recovery flows

## Troubleshooting Common Issues

### Quick Fixes for Common Problems

#### "Cannot Schedule Interviews in the Past" Error

**What it means**: The system thinks you're trying to schedule an interview for a time that has already passed.

**Common causes**:

- Your computer's clock is wrong
- Timezone confusion (server vs local time)
- Clicking on a slot that's actually in the past due to page not refreshing

**How to fix**:

1. Refresh the page and try again
2. Check your computer's date/time settings
3. Make sure you're clicking on future time slots
4. If problem persists, contact IT support

#### Interviews Not Showing Up

**What to check**:

1. Make sure you're looking at the right date/week
2. Check if the interviewer filter is set correctly
3. Refresh the page - sometimes cache needs updating
4. Verify the interview was actually saved (check for confirmation message)

#### Emails Not Being Sent

**Possible reasons**:

1. Email service might be temporarily down
2. Invalid email addresses in the system
3. Emails might be going to spam folders
4. Network connectivity issues

**Solutions**:

1. Check spam/junk folders first
2. Verify email addresses are correct
3. Try resending from the admin interface
4. Contact system administrator if problem continues

#### Slow Loading or Freezing

**Performance tips**:

1. Close other browser tabs to free up memory
2. Clear browser cache and cookies
3. Try using a different browser
4. Check internet connection speed
5. Avoid having multiple admin users modifying schedule simultaneously

### Technical Troubleshooting

#### For Developers/IT Support

**Scheduling Problems**

1. **"Cannot schedule in past" errors**: Check timezone handling in API validation
2. **Conflict detection failures**: Verify database indexes on Interview table
3. **Email offset issues**: Test edge cases near business hours (9:45 PM interviews)

**Performance Issues**

1. **Slow calendar loading**: Check Redis cache hit rates and TTL settings
2. **UI lag during selection**: Profile React renders and component re-mounting
3. **API timeouts**: Analyze database query performance and connection pooling

**Data Consistency**

1. **Missing interviews**: Check transaction rollback scenarios and error handling
2. **Duplicate emails**: Verify idempotency in email service and retry logic
3. **Cache staleness**: Review cache invalidation logic and timing

#### Emergency Procedures

1. **System completely down**: Check server status, database connectivity, and Redis cache
2. **Critical interview lost**: Check database backups and transaction logs
3. **Mass email failure**: Verify email service credentials and rate limits
4. **Data corruption**: Restore from latest backup and replay transactions if possible

---

_The scheduler system is complex but well-architected. When making changes, always test the full interview workflow from scheduling to email delivery. For urgent issues during application season, contact system administrator immediately._
