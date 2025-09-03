# Caching Strategy Documentation

The Think Tank application uses Redis-based caching to optimize performance for frequently accessed data and reduce database load.

## Overviewps

**Cache Technology**: Redis 7.0+ (uptash)
**Client Library**: `ioredis`
**Cache Location**: `/src/lib/redis.ts`
**Strategy**: Write-through and write-behind caching with TTL expiration

## Cache Architecture

### Connection Management

```typescript
// Redis connection configuration
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true
});
```

### Cache Hierarchy

```
Redis Cache
├── Application Data
│   ├── applicants:pending-rejected (TTL: 5min)
│   ├── applicants:interviewing (TTL: 10min)
│   └── applicants:count:* (TTL: 1hour)
├── Interview Scheduling  
│   ├── interviews:${date}:${interviewerId} (TTL: 1hour)
│   ├── busy-times:${date}:${interviewerId} (TTL: 30min)
│   └── scheduler:conflicts:${hash} (TTL: 5min)
├── Statistics
│   ├── stats:daily:${date} (TTL: 24hours)
│   ├── stats:weekly:${week} (TTL: 7days)
│   └── stats:applications:${type} (TTL: 1hour)
└── Session Data
    ├── session:${userId} (TTL: 24hours)
    └── auth:tokens:${token} (TTL: 1hour)
```

## SchedulerCache Implementation

### Core Class Structure

```typescript
// /src/lib/redis.ts
export class SchedulerCache {
  private static redis = new Redis(config);
  
  // Applicant data caching
  static async getApplicants(status: string): Promise<any[] | null>
  static async setApplicants(status: string, data: any[], ttl?: number): Promise<void>
  
  // Interview scheduling cache
  static async getInterviewSchedule(date: string, interviewerId: string): Promise<any[] | null>
  static async setInterviewSchedule(date: string, interviewerId: string, data: any[]): Promise<void>
  
  // Statistics caching
  static async getStats(key: string): Promise<any | null>
  static async setStats(key: string, data: any, ttl: number): Promise<void>
  
  // Cache invalidation
  static async invalidatePattern(pattern: string): Promise<void>
  static async invalidateApplicants(): Promise<void>
  static async invalidateScheduler(date?: string, interviewerId?: string): Promise<void>
}
```

## Caching Strategies by Data Type

### 1. Application Data Caching

#### Applicant Lists

**Cache Key**: `applicants:pending-rejected`
**TTL**: 5 minutes
**Usage**: Admin applicant review pages

```typescript
// Cache implementation
static async getApplicants(status: string): Promise<Application[] | null> {
  try {
    const cached = await this.redis.get(`applicants:${status}`);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.warn('Cache read failed:', error);
    return null;
  }
}

static async setApplicants(status: string, data: Application[], ttl = 300): Promise<void> {
  try {
    await this.redis.setex(
      `applicants:${status}`,
      ttl,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn('Cache write failed:', error);
  }
}
```

#### Cache Usage Pattern

```typescript
// In /api/applicants/route.ts
export async function GET() {
  try {
    // Try cache first
    const cached = await SchedulerCache.getApplicants("pending-rejected");
    if (cached) {
      console.log("Returning cached applicants data");
      return NextResponse.json(cached);
    }

    // Fallback to database
    const applicants = await prisma.application.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          { status: "REJECTED_APP" },
          { status: "REJECTED" },
        ],
      },
      // ... include statements
    });

    // Cache the result
    await SchedulerCache.setApplicants("pending-rejected", applicants);
    return NextResponse.json(applicants);
  } catch (error) {
    // Error handling
  }
}
```

### 2. Interview Schedule Caching

#### Daily Schedules

**Cache Key**: `interviews:${YYYY-MM-DD}:${interviewerId}`
**TTL**: 1 hour
**Usage**: Scheduler calendar view, conflict detection

```typescript
// Interview schedule caching
static async getInterviewSchedule(date: string, interviewerId: string) {
  const key = `interviews:${date}:${interviewerId}`;
  try {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn(`Failed to get cached schedule for ${key}:`, error);
    return null;
  }
}

static async setInterviewSchedule(date: string, interviewerId: string, data: any[]) {
  const key = `interviews:${date}:${interviewerId}`;
  try {
    await this.redis.setex(key, 3600, JSON.stringify(data)); // 1 hour TTL
  } catch (error) {
    console.warn(`Failed to cache schedule for ${key}:`, error);
  }
}
```

#### Busy Time Caching

**Cache Key**: `busy-times:${YYYY-MM-DD}:${interviewerId}`
**TTL**: 30 minutes
**Usage**: Availability checking, conflict detection

### 3. Statistics Caching

#### Daily Statistics

**Cache Key**: `stats:daily:${YYYY-MM-DD}`
**TTL**: 24 hours
**Usage**: Admin dashboard analytics

```typescript
// Statistics caching implementation
static async getStats(key: string) {
  try {
    const cached = await this.redis.get(`stats:${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to get cached stats:', error);
    return null;
  }
}

static async setStats(key: string, data: any, ttl: number) {
  try {
    await this.redis.setex(`stats:${key}`, ttl, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache stats:', error);
  }
}
```

#### Application Count Aggregations

**Cache Key**: `stats:applications:${type}`
**TTL**: 1 hour
**Usage**: Dashboard counters, reporting

## Cache Invalidation

### Automatic Invalidation Triggers

#### Application Status Changes

```typescript
// When application status changes
await SchedulerCache.invalidateApplicants();
```

#### Interview Modifications

```typescript
// When interviews are created/updated/deleted
await SchedulerCache.invalidateScheduler(date, interviewerId);
```

#### Bulk Operations

```typescript
// Pattern-based invalidation for bulk updates
await SchedulerCache.invalidatePattern("busy-times:*");
```

### Manual Invalidation API

**Endpoint**: `POST /api/cache/invalidate`
**Purpose**: Manual cache clearing for debugging/maintenance

```typescript
// Implementation example
export async function POST(request: Request) {
  const { type, keys } = await request.json();
  
  switch (type) {
    case 'applicants':
      await SchedulerCache.invalidateApplicants();
      break;
    case 'scheduler':
      await SchedulerCache.invalidatePattern('interviews:*');
      await SchedulerCache.invalidatePattern('busy-times:*');
      break;
    case 'stats':
      await SchedulerCache.invalidatePattern('stats:*');
      break;
    case 'specific':
      for (const key of keys) {
        await SchedulerCache.redis.del(key);
      }
      break;
  }
  
  return NextResponse.json({ success: true });
}
```

## Cache Performance Monitoring

### Key Metrics Tracked

#### Hit Rates

```typescript
// Cache performance tracking
class CacheMetrics {
  static hits = 0;
  static misses = 0;
  
  static recordHit() { this.hits++; }
  static recordMiss() { this.misses++; }
  
  static getHitRate() {
    return this.hits / (this.hits + this.misses);
  }
}
```

#### Response Times

- **Cache Hit**: < 5ms average
- **Cache Miss + DB**: 50-200ms average
- **Cache Write**: < 10ms average

#### Memory Usage

- **Peak Usage**: ~50MB for full dataset
- **Average Usage**: ~20MB during normal operations
- **Eviction Policy**: LRU with max memory limit

### Monitoring Implementation

```typescript
// Cache monitoring wrapper
static async getWithMetrics<T>(key: string): Promise<T | null> {
  const startTime = performance.now();
  
  try {
    const result = await this.redis.get(key);
    const duration = performance.now() - startTime;
  
    if (result) {
      CacheMetrics.recordHit();
      console.log(`Cache HIT for ${key} (${duration.toFixed(2)}ms)`);
      return JSON.parse(result);
    } else {
      CacheMetrics.recordMiss();
      console.log(`Cache MISS for ${key} (${duration.toFixed(2)}ms)`);
      return null;
    }
  } catch (error) {
    console.error(`Cache error for ${key}:`, error);
    return null;
  }
}
```

## Optimization Strategies

### 1. Data Structure Optimization

#### Efficient Serialization

```typescript
// Optimized data storage
static async setOptimized(key: string, data: any, ttl: number) {
  // Remove unnecessary fields before caching
  const optimizedData = this.stripUnnecessaryFields(data);
  
  // Compress large datasets
  const compressed = this.compress(JSON.stringify(optimizedData));
  
  await this.redis.setex(key, ttl, compressed);
}

private static stripUnnecessaryFields(data: any[]) {
  return data.map(item => ({
    // Only keep fields needed by the UI
    id: item.id,
    fullName: item.fullName,
    status: item.status,
    major: item.major,
    year: item.year
    // Remove: notes, detailed preferences, etc.
  }));
}
```

### 2. Cache Warming

#### Preload Critical Data

```typescript
// Cache warming strategy
class CacheWarmer {
  static async warmCriticalData() {
    // Pre-load today's interviews for all active interviewers
    const today = new Date().toISOString().split('T')[0];
    const interviewers = await getActiveInterviewers();
  
    for (const interviewer of interviewers) {
      await this.preloadInterviewSchedule(today, interviewer.id);
    }
  
    // Pre-load pending applicants for admin dashboard
    await this.preloadPendingApplicants();
  }
  
  static async preloadInterviewSchedule(date: string, interviewerId: string) {
    const interviews = await getInterviewsFromDB(date, interviewerId);
    await SchedulerCache.setInterviewSchedule(date, interviewerId, interviews);
  }
}
```

### 3. Cache Partitioning

#### Separate Hot and Cold Data

```typescript
// Hot data - frequently accessed, short TTL
const HOT_CACHE_TTL = 300; // 5 minutes

// Warm data - moderately accessed, medium TTL  
const WARM_CACHE_TTL = 3600; // 1 hour

// Cold data - rarely accessed, long TTL
const COLD_CACHE_TTL = 86400; // 24 hours

// Usage example
static async setWithTier(key: string, data: any, tier: 'hot' | 'warm' | 'cold') {
  const ttl = tier === 'hot' ? HOT_CACHE_TTL : 
               tier === 'warm' ? WARM_CACHE_TTL : 
               COLD_CACHE_TTL;
  
  await this.redis.setex(`${tier}:${key}`, ttl, JSON.stringify(data));
}
```

## Error Handling and Fallbacks

### Cache Failure Handling

```typescript
static async getWithFallback<T>(key: string, fallbackFn: () => Promise<T>): Promise<T> {
  try {
    // Try cache first
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.warn(`Cache read failed for ${key}:`, cacheError);
  }
  
  // Fallback to database
  try {
    const fresh = await fallbackFn();
  
    // Try to cache the result (don't fail if cache write fails)
    try {
      await this.setWithTTL(key, fresh, 300);
    } catch (cacheWriteError) {
      console.warn(`Cache write failed for ${key}:`, cacheWriteError);
    }
  
    return fresh;
  } catch (dbError) {
    console.error(`Both cache and database failed for ${key}:`, dbError);
    throw dbError;
  }
}
```

### Graceful Degradation

- **Cache Unavailable**: Fall back to database queries
- **Cache Corruption**: Clear corrupted keys and rebuild
- **Memory Pressure**: Implement LRU eviction
- **Network Issues**: Retry with exponential backoff

## Development Guidelines

### When to Cache

✅ **Good Candidates:**

- Frequently requested data (>10 requests/minute)
- Expensive database queries (>100ms)
- Aggregated statistics and counts
- User session data
- Static reference data

❌ **Avoid Caching:**

- Rapidly changing data
- Large binary files
- User-specific sensitive data
- Real-time data requirements

### Cache Key Naming Conventions

```typescript
// Pattern: {category}:{subcategory}:{identifier}
'applicants:pending-rejected'           // Application lists
'interviews:2024-03-15:user123'        // Interview schedules  
'busy-times:2024-03-15:user123'        // Busy time blocks
'stats:daily:2024-03-15'               // Daily statistics
'session:user123'                      // User sessions
```

### TTL Selection Guidelines

- **Real-time Data**: 1-5 minutes
- **Frequently Updated**: 10-30 minutes
- **Moderately Updated**: 1-6 hours
- **Daily Aggregates**: 24 hours
- **Static Data**: 7+ days

### Testing Cache Logic

```typescript
// Mock Redis for testing
jest.mock('ioredis', () => {
  return class MockRedis {
    private store = new Map();
  
    async get(key: string) {
      return this.store.get(key) || null;
    }
  
    async setex(key: string, ttl: number, value: string) {
      this.store.set(key, value);
    }
  
    async del(key: string) {
      this.store.delete(key);
    }
  };
});
```

---

*Effective caching is crucial for application performance. Monitor cache hit rates and adjust TTL values based on usage patterns.*
