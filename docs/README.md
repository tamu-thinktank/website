# Think Tank Application System Documentation

This documentation provides comprehensive guides for new developers and current maintainers of the Think Tank application management system.

## Documentation Structure

### Application Pages

- [`/apply`](./pages/apply/README.md) - General Member Applications
- [`/officer-apply`](./pages/officer-apply/README.md) - Officer Position Applications
- [`/materov-apply`](./pages/materov-apply/README.md) - MateROV Team Applications
- [`/minidc-apply`](./pages/minidc-apply/README.md) - Mini Design Challenge Applications

### 🔧 Admin System

- [`/admin`](./pages/admin/README.md) - Administrative Hub & Infrastructure
- [`/admin/scheduler`](./pages/admin/scheduler/README.md) - Interview Scheduler System
- [`/admin/applicants`](./pages/admin/applicants/README.md) - Applicant Management
- [`/admin/members`](./pages/admin/members/README.md) - Member Management

### API Routes

- [`/api`](./api/README.md) - Complete API Documentation
- [`/api/schedule-interview`](./api/schedule-interview/README.md) - Interview Scheduling
- [`/api/send-interview-email`](./api/send-interview-email/README.md) - Email Notifications
- [`/api/applicants`](./api/applicants/README.md) - Applicant Data Management

### Email System

- [`/emails`](./email-system/README.md) - Email Templates & Service

### Database

- [`/database`](./database/README.md) - Database Schema & Usage
- [`/database/models`](./database/models/README.md) - Prisma Models
- [`/database/operations`](./database/operations/README.md) - Common Queries

### Performance & Caching

- [`/caching`](./caching/README.md) - Redis Caching Strategy
- [`/optimization`](./optimization/README.md) - Performance Optimizations

## Quick Start for New Developers

1. **Read the [Admin System Overview](./pages/admin/README.md)** - Understand the core administrative infrastructure
2. **Review [Database Models](./database/models/README.md)** - Learn the data structure
3. **Study [API Documentation](./api/README.md)** - Understand the API architecture
4. **Check [Scheduler System](./pages/admin/scheduler/README.md)** - Learn the most complex system

## Quick Reference for Maintainers

### Critical Systems

- **Interview Scheduling**: Complex time management with 15-minute offset system
- **Email Notifications**: Dual-recipient system with time differentiation
- **Caching Strategy**: Redis-based performance optimization
- **Application Flow**: Multi-step form with persistence

### Common Tasks

- Adding new application types
- Modifying interview scheduling logic
- Updating email templates
- Managing database migrations
- Optimizing cache strategies

## Architecture Overview

```
Think Tank System
├── Frontend (Next.js App Router)
├── API Layer (REST + tRPC)
├── Database (PostgreSQL + Prisma)
├── Email System (Nodemailer + React Email)
├── Caching (Redis)
└── File Storage (Resume uploads)
```

## Development Workflow

1. **Local Development**: Use `pnpm dev` with local PostgreSQL
2. **Database Changes**: Update Prisma schema → Run migrations
3. **API Changes**: Update tRPC routers or REST endpoints
4. **Frontend Changes**: Modify pages/components with TypeScript
5. **Testing**: Run `pnpm typecheck` and `pnpm lint`

## Support

For questions or issues:

- Check relevant section documentation first
- Review database schema for data relationships
- Test API endpoints with proper request format
- Verify caching behavior in Redis

---

_Last updated: $(date)_
