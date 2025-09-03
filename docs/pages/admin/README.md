# Admin System Documentation

The admin system is the central hub for managing the entire Think Tank application process, from reviewing applications to scheduling interviews and managing members.

## Overview

**Location**: `/src/app/admin/`  
**Main Page**: `page.tsx` - Dashboard with navigation cards  
**Auth Required**: Admin-level authentication  

## System Architecture

### Admin Hub Structure
```
/admin/
├── page.tsx              # Main dashboard
├── applicants/           # Application review system
├── scheduler/            # Interview scheduling system  
├── members/              # Member management
├── interviewees/         # Interview candidate management
└── stats/                # Statistics and analytics
```

## Infrastructure Components

### 1. Admin Dashboard (`/admin`)
**Purpose**: Central navigation hub for all administrative functions

**Features**:
- Card-based navigation interface
- Color-coded modules for visual organization
- Hover effects and responsive design
- Direct routing to specialized admin tools

**Modules Available**:
- **Applicants**: Review and manage application submissions
- **Interviewees**: Manage candidates in interview process
- **Members**: View and manage current team members
- **Scheduler**: Comprehensive interview scheduling system
- **Statistics**: Analytics and reporting dashboard

### 2. API Integration

The admin system integrates with multiple API endpoints:

#### Application Management
- `GET /api/applicants` - Retrieve applicant data with caching
- `PATCH /api/applicants/[id]` - Update application status
- `GET /api/statistics` - Generate reports and analytics

#### Interview Management  
- `GET /api/interviews` - Fetch scheduled interviews
- `POST /api/schedule-interview` - Create new interview bookings
- `GET /api/interviewers` - Manage interviewer availability

#### Email System
- `POST /api/send-interview-email` - Send interview notifications
- `POST /api/send-rejection-email` - Send rejection notifications

### 3. Database Usage

#### Primary Models Used
```prisma
model Application {
  id                String
  fullName         String
  email            String  
  status           ApplicationStatus
  major            String
  year             String
  // ... additional fields
  interviews       Interview[]
  subteamPreferences SubteamPreference[]
}

model Interview {
  id              String
  applicantId     String?
  interviewerId   String
  startTime       DateTime
  endTime         DateTime
  location        String
  isPlaceholder   Boolean
  // ... additional fields
}

model User {
  id              String
  name            String
  email           String
  role            UserRole
  // ... additional fields
  interviews      Interview[]
  busyTimes       InterviewerBusyTime[]
}
```

#### Common Queries
- Filter applications by status (PENDING, INTERVIEWING, ACCEPTED, REJECTED)
- Join applications with team preferences and interview data
- Aggregate statistics across application types and time periods
- Manage interviewer schedules and availability

### 4. Caching Strategy

The admin system uses Redis caching for performance:

#### Cached Data
- **Applicant Lists**: Cached for 5 minutes to reduce database load
- **Interview Schedules**: Real-time updates with cache invalidation
- **Statistics**: Cached daily aggregations for dashboard

#### Cache Keys
- `applicants:pending-rejected` - List of applications needing review
- `interviews:${date}:${interviewerId}` - Daily interview schedules
- `stats:daily:${date}` - Daily application statistics

#### Cache Management
- **Invalidation**: Automatic cache clearing on data updates
- **TTL**: Time-to-live varies by data type (5min - 24hrs)
- **Fallback**: Database queries when cache misses

## Authentication & Authorization

### Access Control
- **Required Role**: `ADMIN` or `OFFICER`
- **Session Management**: NextAuth.js integration
- **Route Protection**: Middleware-based authentication

### Permission Levels
- **ADMIN**: Full access to all admin functions
- **OFFICER**: Limited access to assigned team management
- **INTERVIEWER**: Access to scheduler and assigned interviews

## Performance Optimizations

### 1. Data Loading
- **Lazy Loading**: Components load data as needed
- **Pagination**: Large datasets split into pages
- **Infinite Scroll**: For long lists like applications

### 2. State Management
- **Optimistic Updates**: UI updates before API confirmation
- **Local State**: React state for temporary data
- **Server State**: tRPC/TanStack Query for API data

### 3. Rendering Optimizations
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data tables
- **Code Splitting**: Dynamic imports for heavy modules

## Error Handling

### API Errors
- Graceful degradation when services unavailable
- User-friendly error messages
- Automatic retry for transient failures

### Data Validation
- Zod schemas for all form inputs
- Type checking with TypeScript
- Runtime validation on API boundaries

## Development Guidelines

### For New Features
1. **Database First**: Design schema changes in Prisma
2. **API Design**: Create tRPC procedures or REST endpoints
3. **UI Components**: Build reusable components in `/components`
4. **Testing**: Add tests for critical admin functions

### For Maintenance  
1. **Monitor Performance**: Check Redis cache hit rates
2. **Update Dependencies**: Keep admin UI libraries current
3. **Review Logs**: Monitor API endpoint performance
4. **Database Optimization**: Analyze slow queries

## Common Tasks

### Adding New Admin Module
1. Create directory in `/src/app/admin/[module]/`
2. Add page component with proper authentication
3. Update admin hub navigation in main `page.tsx`
4. Create necessary API routes
5. Add to documentation

### Modifying Application Status
1. Update Prisma schema if new statuses needed
2. Modify API endpoints for status transitions
3. Update UI components to handle new status
4. Add email templates if notifications required

### Performance Troubleshooting
1. Check Redis cache performance and hit rates
2. Analyze database query performance with Prisma logs
3. Monitor API endpoint response times
4. Review React component render performance

---

*For specific subsystem documentation, see the individual README files in each admin module directory.*