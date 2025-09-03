# Database Documentation

Complete guide to the database architecture, schema design, and common operations for the Think Tank application system.

## Database Overview

**Database**: PostgreSQL 15+
**ORM**: Prisma 
**Schema Location**: `/prisma/schema.prisma`
**Migrations**: `/prisma/migrations/`

## Architecture

### Database Design Principles

- **Normalized Structure**: Reduces redundancy and maintains data integrity
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Audit Trail**: Timestamps and status tracking for all major entities
- **Performance Optimized**: Strategic indexes for common query patterns
- **Type Safety**: Prisma ensures compile-time type checking

### Connection Management

- **Connection Pooling**: Optimized for concurrent requests
- **Transaction Support**: ACID compliance for data consistency
- **Read Replicas**: Future scaling capability built-in
- **Backup Strategy**: Automated daily backups with point-in-time recovery

## Core Schema Models

### User Management

#### `User` Model

```prisma
model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String    @unique
  emailVerified        DateTime?
  image                String?
  role                 UserRole   @default(USER)
  createdAt            DateTime   @default(now())
  updatedAt            DateTime   @updatedAt
  
  // Relations
  accounts             Account[]
  sessions             Session[]
  interviews           Interview[]
  busyTimes            InterviewerBusyTime[]
  teamPriorities       InterviewerTeamPriority[]
}

enum UserRole {
  USER          // Regular applicant
  INTERVIEWER   // Can conduct interviews  
  OFFICER       // Team leadership
  ADMIN         // Full system access
}
```

**Purpose**: Manages all user accounts including applicants, interviewers, and administrators
**Key Features**: Role-based access control, authentication integration
**Relationships**: One-to-many with interviews, busy times, team priorities

### Application System

#### `Application` Model

```prisma
model Application {
  id                    String             @id @default(cuid())
  fullName             String
  email                String             @unique
  phoneNumber          String?
  major                String
  year                 String
  gpa                  Float?
  status               ApplicationStatus   @default(PENDING)
  assignedTeam         String?
  submittedAt          DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  
  // Application-specific fields
  resumeUrl            String?
  portfolioUrl         String?
  linkedinUrl          String?
  githubUrl            String?
  personalWebsite      String?
  
  // Experience and motivation
  previousExperience   String?
  whyJoinThinkTank    String?
  designExperience     String?
  programmingLanguages String[]
  softwareTools        String[]
  
  // Availability matrix (JSON)
  availability         Json?
  
  // Relations
  interviews           Interview[]
  subteamPreferences   SubteamPreference[]
  notes               InterviewNote[]
}

enum ApplicationStatus {
  PENDING         // Initial application submitted
  UNDER_REVIEW    // Being reviewed by admin
  INTERVIEWING    // Scheduled for interviews
  ACCEPTED        // Accepted to team
  REJECTED_APP    // Rejected at application stage
  REJECTED        // Rejected after interview
  WAITLIST        // On waitlist
  WITHDRAWN       // Applicant withdrew
}
```

**Purpose**: Central model for all application types and their lifecycle
**Key Features**: Status workflow, comprehensive applicant information, availability tracking
**Relationships**: One-to-many with interviews, preferences, notes

#### `SubteamPreference` Model

```prisma
model SubteamPreference {
  id            String      @id @default(cuid())
  applicationId String
  subteam       OfficerPosition
  priority      Int
  
  // Relations  
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  
  @@unique([applicationId, subteam])
  @@index([applicationId, priority])
}
```

**Purpose**: Tracks applicant team preferences with priority ranking
**Key Features**: Priority-based team selection, prevents duplicate preferences

### Interview System

#### `Interview` Model

```prisma
model Interview {
  id              String    @id @default(cuid())
  applicantId     String?
  interviewerId   String
  startTime       DateTime
  endTime         DateTime
  location        String
  teamId          String?
  isPlaceholder   Boolean   @default(false)
  placeholderName String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  applicant       Application? @relation(fields: [applicantId], references: [id], onDelete: Cascade)
  interviewer     User         @relation(fields: [interviewerId], references: [id], onDelete: Cascade)
  notes          InterviewNote[]
  
  @@index([interviewerId, startTime, endTime])
  @@index([applicantId, startTime])
  @@index([startTime])
}
```

**Purpose**: Manages all interview bookings including regular interviews and placeholders
**Key Features**: 45-minute duration, conflict detection, placeholder support
**Critical Indexes**: Time-based queries, conflict detection, interviewer schedules

#### `InterviewerBusyTime` Model

```prisma
model InterviewerBusyTime {
  id            String   @id @default(cuid())
  interviewerId String
  startTime     DateTime
  endTime       DateTime
  reason        String?
  createdAt     DateTime @default(now())
  
  // Relations
  interviewer   User     @relation(fields: [interviewerId], references: [id], onDelete: Cascade)
  
  @@index([interviewerId, startTime, endTime])
}
```

**Purpose**: Tracks when interviewers are unavailable for scheduling
**Key Features**: Flexible time periods, conflict detection, batch operations

#### `InterviewerTeamPriority` Model

```prisma
model InterviewerTeamPriority {
  id            String         @id @default(cuid())
  interviewerId String
  teamId        OfficerPosition
  priority      Int
  
  // Relations
  interviewer   User           @relation(fields: [interviewerId], references: [id], onDelete: Cascade)
  
  @@unique([interviewerId, teamId])
  @@index([interviewerId, priority])
}
```

**Purpose**: Manages interviewer team assignments and priorities
**Key Features**: Priority-based team assignment, prevents duplicate assignments

#### `InterviewNote` Model

```prisma
model InterviewNote {
  id            String      @id @default(cuid())
  interviewId   String
  applicationId String
  content       String
  rating        Int?        // 1-10 scale
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Relations
  interview     Interview   @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  
  @@index([interviewId])
  @@index([applicationId])
}
```

**Purpose**: Stores interview feedback and ratings
**Key Features**: Numeric rating system, timestamped feedback

### Team Management

#### `OfficerPosition` Enum

```prisma
enum OfficerPosition {
  // Leadership
  PRESIDENT
  VICE_PRESIDENT
  SECRETARY
  TREASURER
  
  // Technical Teams
  SOFTWARE_TEAM
  ELECTRICAL_TEAM  
  MECHANICAL_TEAM
  MATEROV_TEAM
  
  // Functional Teams
  MARKETING_TEAM
  OPERATIONS_TEAM
  OUTREACH_TEAM
  
  // Competition-specific
  MINIDC_TEAM
  
  // Special Roles
  GENERAL_MEMBER
}
```

**Purpose**: Defines all available teams and officer positions
**Usage**: Referenced in preferences, team assignments, interviewer priorities

## Database Relationships

### Key Relationships Diagram

```
User (Interviewer)
├── Interview (many) - Conducts interviews
├── InterviewerBusyTime (many) - Availability management
└── InterviewerTeamPriority (many) - Team assignments

Application (Applicant)  
├── Interview (many) - Scheduled interviews
├── SubteamPreference (many) - Team preferences
└── InterviewNote (many) - Interview feedback

Interview
├── Application (one) - Applicant being interviewed
├── User (one) - Interviewer conducting  
└── InterviewNote (many) - Interview feedback
```

### Cascade Behaviors

- **User Deletion**: Removes associated interviews, busy times, priorities
- **Application Deletion**: Removes interviews, preferences, notes
- **Interview Deletion**: Removes associated notes

## Common Query Patterns

### Application Management

#### Get Pending Applications

```typescript
const pendingApplicants = await prisma.application.findMany({
  where: {
    status: 'PENDING'
  },
  include: {
    subteamPreferences: {
      orderBy: { priority: 'asc' }
    }
  },
  orderBy: { submittedAt: 'asc' }
});
```

#### Update Application Status

```typescript
const updatedApplication = await prisma.application.update({
  where: { id: applicationId },
  data: {
    status: 'INTERVIEWING',
    assignedTeam: teamId,
    updatedAt: new Date()
  }
});
```

### Interview Scheduling

#### Check Interview Conflicts

```typescript
const conflicts = await prisma.interview.findMany({
  where: {
    interviewerId: interviewerId,
    AND: [
      { startTime: { lt: endTime } },
      { endTime: { gt: startTime } }
    ]
  },
  include: {
    applicant: {
      select: { fullName: true }
    }
  }
});
```

#### Get Interviewer Schedule

```typescript
const schedule = await prisma.interview.findMany({
  where: {
    interviewerId: interviewerId,
    startTime: {
      gte: startOfDay,
      lt: endOfDay
    }
  },
  include: {
    applicant: {
      select: { fullName: true, email: true }
    }
  },
  orderBy: { startTime: 'asc' }
});
```

### Availability Management

#### Get Interviewer Busy Times

```typescript
const busyTimes = await prisma.interviewerBusyTime.findMany({
  where: {
    interviewerId: interviewerId,
    AND: [
      { startTime: { gte: startOfWeek } },
      { endTime: { lte: endOfWeek } }
    ]
  },
  orderBy: { startTime: 'asc' }
});
```

#### Batch Update Busy Times

```typescript
await prisma.$transaction([
  // Delete existing busy times for the slots
  prisma.interviewerBusyTime.deleteMany({
    where: {
      interviewerId: interviewerId,
      // Complex date range conditions
    }
  }),
  // Insert new busy times
  prisma.interviewerBusyTime.createMany({
    data: busyTimeSlots.map(slot => ({
      interviewerId: interviewerId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      reason: 'Marked as busy'
    }))
  })
]);
```

## Performance Optimization

### Critical Indexes

#### Interview Conflict Detection

```sql
CREATE INDEX idx_interview_conflict ON Interview (interviewerId, startTime, endTime);
CREATE INDEX idx_applicant_conflict ON Interview (applicantId, startTime, endTime);
```

#### Scheduler Performance

```sql
CREATE INDEX idx_busy_times ON InterviewerBusyTime (interviewerId, startTime, endTime);
CREATE INDEX idx_application_status ON Application (status, submittedAt);
CREATE INDEX idx_team_priorities ON InterviewerTeamPriority (interviewerId, priority);
```

#### Analytics Queries

```sql
CREATE INDEX idx_interviews_date ON Interview (startTime);
CREATE INDEX idx_application_submitted ON Application (submittedAt, status);
```

### Query Optimization Strategies

#### Use Appropriate Includes

```typescript
// Good - Only include what you need
const applications = await prisma.application.findMany({
  include: {
    subteamPreferences: {
      select: { subteam: true, priority: true }
    }
  }
});

// Bad - Includes unnecessary data
const applications = await prisma.application.findMany({
  include: {
    subteamPreferences: true,
    interviews: true,
    notes: true
  }
});
```

#### Pagination for Large Results

```typescript
const applications = await prisma.application.findMany({
  skip: page * pageSize,
  take: pageSize,
  orderBy: { submittedAt: 'desc' }
});
```

#### Efficient Counting

```typescript
// Use aggregate for counts
const stats = await prisma.application.aggregate({
  _count: {
    id: true
  },
  where: { status: 'PENDING' }
});
```

## Transaction Management

### Interview Scheduling Transaction

```typescript
const interview = await prisma.$transaction(async (tx) => {
  // Check for conflicts within transaction
  const conflicts = await tx.interview.findMany({
    where: {
      interviewerId: data.interviewerId,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } }
      ]
    }
  });
  
  if (conflicts.length > 0) {
    throw new Error('Time conflict detected');
  }
  
  // Create interview
  const newInterview = await tx.interview.create({
    data: interviewData
  });
  
  // Update application status if needed
  if (!data.isPlaceholder) {
    await tx.application.update({
      where: { id: data.applicantId },
      data: { status: 'INTERVIEWING' }
    });
  }
  
  return newInterview;
});
```

### Bulk Operations

```typescript
await prisma.$transaction([
  // Multiple related operations
  prisma.interviewerBusyTime.deleteMany({
    where: { interviewerId: id }
  }),
  prisma.interviewerBusyTime.createMany({
    data: newBusyTimes
  }),
  prisma.interviewerTeamPriority.updateMany({
    where: { interviewerId: id },
    data: { priority: newPriority }
  })
]);
```

## Data Migration Strategies

### Schema Changes

1. **Generate Migration**: `npx prisma migrate dev --name description`
2. **Review SQL**: Check generated SQL for correctness
3. **Test Migration**: Run on development data
4. **Deploy Migration**: Apply to production with `prisma migrate deploy`

### Data Seeding

```typescript
// prisma/seed.ts
const seedData = async () => {
  await prisma.officerPosition.createMany({
    data: [
      { name: 'SOFTWARE_TEAM', displayName: 'Software Team' },
      { name: 'MECHANICAL_TEAM', displayName: 'Mechanical Team' },
      // ... more teams
    ]
  });
};
```

## Backup and Recovery

### Automated Backups

- **Daily Backups**: Full database backup every 24 hours
- **Point-in-Time Recovery**: WAL archiving for granular recovery
- **Cross-Region Replication**: Geographic backup distribution

### Manual Backup Commands

```bash
# Create backup
pg_dump -h host -U user -d database > backup.sql

# Restore backup  
psql -h host -U user -d database < backup.sql
```

## Monitoring and Maintenance

### Performance Monitoring

- **Slow Query Log**: Queries taking >1 second logged
- **Connection Pool**: Monitor active/idle connections
- **Index Usage**: Track index efficiency and usage patterns
- **Table Statistics**: Monitor table sizes and growth

### Regular Maintenance Tasks

- **VACUUM ANALYZE**: Weekly database optimization
- **Reindex**: Monthly index rebuilding for large tables
- **Statistics Update**: Ensure query planner has current data
- **Log Rotation**: Manage log file sizes

---

*Database schema changes should always be reviewed by the team and tested thoroughly before deployment to production.*
