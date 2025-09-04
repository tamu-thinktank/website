# API Documentation

Complete reference for all API endpoints in the Think Tank application system. The system uses a hybrid approach with both REST endpoints and tRPC procedures.

## API Architecture

### REST Endpoints

Located in `/src/app/api/` - Handle file uploads, external integrations, and system operations

### tRPC Procedures

Located in `/src/server/api/routers/` - Type-safe API calls for frontend-backend communication

## Core API Endpoints

### Interview Management

#### Schedule Interview

- **Endpoint**: `POST /api/schedule-interview`
- **Purpose**: Create new interview bookings with conflict detection
- **Documentation**: [Schedule Interview API](./schedule-interview/README.md)

#### Send Interview Email

- **Endpoint**: `POST /api/send-interview-email`
- **Purpose**: Send interview notifications with 15-minute offset system
- **Documentation**: [Send Interview Email API](./send-interview-email/README.md)

#### Interview Management

- **Endpoint**: `GET /api/interviews`
- **Purpose**: Retrieve scheduled interviews with filtering
- **Endpoint**: `PATCH /api/interviews/[id]`
- **Purpose**: Update interview details
- **Endpoint**: `DELETE /api/interviews/[id]`
- **Purpose**: Cancel interviews

### Applicant Management

#### Get Applicants

- **Endpoint**: `GET /api/applicants`
- **Purpose**: Retrieve applicant data with caching
- **Documentation**: [Applicants API](./applicants/README.md)

#### Get Interviewees

- **Endpoint**: `GET /api/interviewees`
- **Purpose**: Get applicants in interview stage

#### Update Application Status

- **Endpoint**: `PATCH /api/applicants/[id]`
- **Purpose**: Change application status (PENDING → INTERVIEWING → ACCEPTED/REJECTED)

### Interviewer Management

#### Get Interviewers

- **Endpoint**: `GET /api/interviewers`
- **Purpose**: Retrieve interviewer data and availability

#### Update Interviewer Preferences

- **Endpoint**: `PATCH /api/interviewers`
- **Purpose**: Update team priorities and preferences

#### Manage Busy Times

- **Endpoint**: `GET /api/interviewer-busy-times`
- **Purpose**: Retrieve interviewer unavailable periods
- **Endpoint**: `POST /api/interviewer-busy-times`
- **Purpose**: Mark time periods as busy
- **Endpoint**: `PUT /api/interviewer-busy-times-batch`
- **Purpose**: Bulk update multiple time slots

### File Management

#### Resume Upload

- **Endpoint**: `POST /api/upload-resume`
- **Purpose**: Handle PDF resume uploads with validation

#### Get Resume

- **Endpoint**: `GET /api/get-resume/[id]`
- **Purpose**: Retrieve uploaded resume files

### Email System

#### Send Rejection Email

- **Endpoint**: `POST /api/send-rejection-email`
- **Purpose**: Send application rejection notifications

#### General Email

- **Endpoint**: `POST /api/send-email`
- **Purpose**: Send custom emails through the system

### Statistics & Reporting

#### Get Statistics

- **Endpoint**: `GET /api/statistics`
- **Purpose**: Generate application and interview analytics

#### Export Data

- **Endpoint**: `GET /api/export`
- **Purpose**: Export data in various formats

## Authentication

### Required Headers

```typescript
Authorization: Bearer <session-token>
Content-Type: application/json
```

### Session Management

- Uses NextAuth.js for session handling
- Automatic token refresh
- Role-based access control

### Permission Levels

- **PUBLIC**: Application submission endpoints
- **USER**: Personal data access
- **INTERVIEWER**: Interview management for assigned interviews
- **ADMIN**: Full system access

## Request/Response Formats

### Standard Success Response

```typescript
{
  success: true,
  data: any,
  message?: string
}
```

### Standard Error Response

```typescript
{
  success: false,
  error: string,
  details?: any,
  code: number
}
```

### Validation Errors

```typescript
{
  success: false,
  error: "Validation failed",
  details: {
    field: "error message"
  },
  code: 400
}
```

## Rate Limiting

### Default Limits

- **General Endpoints**: 100 requests per minute
- **Upload Endpoints**: 10 requests per minute
- **Email Endpoints**: 20 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Error Codes

### HTTP Status Codes Used

- **200**: Success
- **201**: Created successfully
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (scheduling conflicts, duplicate data)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

### Custom Error Codes

- **INVALID_TIME_SLOT**: Interview scheduling in invalid time
- **APPLICANT_NOT_FOUND**: Applicant ID doesn't exist
- **INTERVIEWER_CONFLICT**: Interviewer double-booked
- **EMAIL_SEND_FAILED**: Email delivery failure
- **CACHE_ERROR**: Redis cache operation failed

## Performance Considerations

### Caching

- **GET requests**: Cached with Redis when appropriate
- **Cache TTL**: Varies by endpoint (5 minutes - 24 hours)
- **Cache Keys**: Structured with consistent naming patterns

### Optimization Tips

1. **Use batch endpoints** when updating multiple records
2. **Implement pagination** for large data sets
3. **Cache responses** on the client side when appropriate
4. **Use ETags** for conditional requests

### Monitoring

- API response times logged
- Error rates tracked by endpoint
- Cache hit rates monitored
- Database query performance analyzed

## Development Guidelines

### Adding New Endpoints

1. **REST Endpoint**:

   ```typescript
   // /src/app/api/new-endpoint/route.ts
   export async function POST(request: Request) {
     // Implementation
   }
   ```

2. **tRPC Procedure**:
   ```typescript
   // /src/server/api/routers/module.ts
   export const moduleRouter = createTRPCRouter({
     newProcedure: publicProcedure
       .input(
         z.object({
           /* validation */
         }),
       )
       .mutation(async ({ input }) => {
         // Implementation
       }),
   });
   ```

### Validation

- Use Zod schemas for all input validation
- Implement runtime type checking
- Provide clear validation error messages

### Testing

- Unit tests for business logic
- Integration tests for API endpoints
- Load testing for performance-critical endpoints

## Common Integration Patterns

### Frontend API Calls

#### Using tRPC (Recommended)

```typescript
const { mutate: scheduleInterview } = api.interviews.schedule.useMutation({
  onSuccess: () => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});
```

#### Using Fetch (REST endpoints)

```typescript
const response = await fetch("/api/schedule-interview", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

if (!response.ok) {
  throw new Error("API call failed");
}

const result = await response.json();
```

### Error Handling Best Practices

```typescript
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  if (error.status === 409) {
    // Handle conflicts
  } else if (error.status === 400) {
    // Handle validation errors
  } else {
    // Handle general errors
  }
}
```

## Security Considerations

### Input Sanitization

- All inputs validated with Zod schemas
- SQL injection prevention through Prisma ORM
- XSS prevention in email templates

### Data Protection

- Sensitive data encrypted in transit and at rest
- Personal information access logged
- GDPR compliance for user data

### API Security

- Rate limiting on all endpoints
- CORS properly configured
- Session token validation on protected routes

---

_For detailed documentation of specific endpoints, see the individual API documentation files._
