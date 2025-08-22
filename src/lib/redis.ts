import { Redis } from '@upstash/redis'

// Initialize Redis client with Upstash configuration
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache key generators
export const CacheKeys = {
  // Interviewer data with priority teams
  interviewer: (id: string) => `scheduler:interviewer:${id}`,
  
  // All interviewers list
  allInterviewers: () => `scheduler:interviewers:all`,
  
  // Busy times for specific interviewer and date
  busyTimes: (interviewerId: string, date: string) => `scheduler:busy:${interviewerId}:${date}`,
  
  // All busy times for an interviewer (for bulk operations)
  allBusyTimes: (interviewerId: string) => `scheduler:busy:${interviewerId}:*`,
  
  // Interview schedules for a specific date
  interviews: (date: string) => `scheduler:interviews:${date}`,
  
  // All interviews for date range
  interviewsRange: (startDate: string, endDate: string) => `scheduler:interviews:${startDate}:${endDate}`,
  
  // Pre-computed availability matrix for an interviewer and date
  availability: (interviewerId: string, date: string) => `scheduler:availability:${interviewerId}:${date}`,
  
  // Auto-scheduler priority matches cache
  autoScheduler: (applicantId: string) => `scheduler:auto:${applicantId}`,
  
  // Priority team assignments for interviewer
  priorityTeams: (interviewerId: string) => `scheduler:priority:${interviewerId}`,
  
  // Applicants list caching
  applicants: (status?: string) => `applicants:${status || 'all'}`,
  
  // Individual applicant details
  applicant: (id: string) => `applicant:${id}`,
}

// Cache TTL values (in seconds)
export const CacheTTL = {
  SHORT: 5 * 60,        // 5 minutes - for real-time data
  MEDIUM: 15 * 60,      // 15 minutes - for frequently changing data
  LONG: 60 * 60,        // 1 hour - for computed/static data
  DAILY: 24 * 60 * 60,  // 24 hours - for daily aggregates
}

// Utility functions for caching operations
export class SchedulerCache {
  
  /**
   * Cache interviewer data including priority teams
   */
  static async setInterviewer(id: string, data: any, ttl: number = CacheTTL.SHORT) {
    return redis.set(CacheKeys.interviewer(id), data, { ex: ttl })
  }
  
  static async getInterviewer(id: string) {
    return redis.get(CacheKeys.interviewer(id))
  }
  
  /**
   * Cache all interviewers list
   */
  static async setAllInterviewers(data: any[], ttl: number = CacheTTL.SHORT) {
    return redis.set(CacheKeys.allInterviewers(), data, { ex: ttl })
  }
  
  static async getAllInterviewers() {
    return redis.get(CacheKeys.allInterviewers())
  }
  
  /**
   * Cache busy times for specific interviewer and date
   */
  static async setBusyTimes(interviewerId: string, date: string, busyTimes: any[], ttl: number = CacheTTL.SHORT) {
    return redis.set(CacheKeys.busyTimes(interviewerId, date), busyTimes, { ex: ttl })
  }
  
  static async getBusyTimes(interviewerId: string, date: string) {
    return redis.get(CacheKeys.busyTimes(interviewerId, date))
  }
  
  /**
   * Cache interview schedules for a specific date
   */
  static async setInterviews(date: string, interviews: any[], ttl: number = CacheTTL.SHORT) {
    return redis.set(CacheKeys.interviews(date), interviews, { ex: ttl })
  }
  
  static async getInterviews(date: string) {
    return redis.get(CacheKeys.interviews(date))
  }
  
  /**
   * Cache pre-computed availability matrix
   */
  static async setAvailability(interviewerId: string, date: string, availability: boolean[][], ttl: number = CacheTTL.MEDIUM) {
    return redis.set(CacheKeys.availability(interviewerId, date), availability, { ex: ttl })
  }
  
  static async getAvailability(interviewerId: string, date: string) {
    return redis.get(CacheKeys.availability(interviewerId, date))
  }
  
  /**
   * Cache priority team assignments
   */
  static async setPriorityTeams(interviewerId: string, teams: any[], ttl: number = CacheTTL.MEDIUM) {
    return redis.set(CacheKeys.priorityTeams(interviewerId), teams, { ex: ttl })
  }
  
  static async getPriorityTeams(interviewerId: string) {
    return redis.get(CacheKeys.priorityTeams(interviewerId))
  }
  
  /**
   * Cache auto-scheduler results
   */
  static async setAutoSchedulerResult(applicantId: string, result: any, ttl: number = CacheTTL.MEDIUM) {
    return redis.set(CacheKeys.autoScheduler(applicantId), result, { ex: ttl })
  }
  
  static async getAutoSchedulerResult(applicantId: string) {
    return redis.get(CacheKeys.autoScheduler(applicantId))
  }
  
  /**
   * Invalidate cache patterns
   */
  static async invalidateInterviewer(interviewerId: string) {
    const keys = [
      CacheKeys.interviewer(interviewerId),
      CacheKeys.priorityTeams(interviewerId),
      CacheKeys.allInterviewers(),
    ]
    
    // Also invalidate availability cache for this interviewer
    const pattern = `scheduler:availability:${interviewerId}:*`
    const availabilityKeys = await redis.keys(pattern)
    keys.push(...availabilityKeys)
    
    // Invalidate busy times pattern
    const busyPattern = `scheduler:busy:${interviewerId}:*`
    const busyKeys = await redis.keys(busyPattern)
    keys.push(...busyKeys)
    
    if (keys.length > 0) {
      return redis.del(...keys)
    }
  }
  
  static async invalidateInterviews(date?: string) {
    if (date) {
      return redis.del(CacheKeys.interviews(date))
    } else {
      // Invalidate all interview caches
      const pattern = 'scheduler:interviews:*'
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        return redis.del(...keys)
      }
    }
  }
  
  static async invalidateBusyTimes(interviewerId: string, date?: string) {
    if (date) {
      return redis.del(CacheKeys.busyTimes(interviewerId, date))
    } else {
      // Invalidate all busy times for this interviewer
      const pattern = `scheduler:busy:${interviewerId}:*`
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        return redis.del(...keys)
      }
    }
  }
  
  /**
   * Bulk invalidation for major updates
   */
  static async invalidateAll() {
    const pattern = 'scheduler:*'
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      return redis.del(...keys)
    }
  }
  
  /**
   * Health check - test Redis connection
   */
  static async healthCheck() {
    try {
      await redis.ping()
      return { status: 'connected', timestamp: new Date().toISOString() }
    } catch (error) {
      return { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      }
    }
  }
  
  /**
   * Cache applicants list
   */
  static async setApplicants(data: any[], status: string = 'all', ttl: number = CacheTTL.MEDIUM) {
    return redis.set(CacheKeys.applicants(status), data, { ex: ttl })
  }
  
  static async getApplicants(status: string = 'all') {
    return redis.get(CacheKeys.applicants(status))
  }
  
  /**
   * Cache individual applicant details
   */
  static async setApplicant(id: string, data: any, ttl: number = CacheTTL.LONG) {
    return redis.set(CacheKeys.applicant(id), data, { ex: ttl })
  }
  
  static async getApplicant(id: string) {
    return redis.get(CacheKeys.applicant(id))
  }
  
  /**
   * Invalidate applicants cache
   */
  static async invalidateApplicants() {
    const pattern = 'applicants:*'
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      return redis.del(...keys)
    }
  }
  
  static async invalidateApplicant(id: string) {
    const keys = [CacheKeys.applicant(id)]
    // Also invalidate applicants list cache since individual changes affect the list
    const listPattern = 'applicants:*'
    const listKeys = await redis.keys(listPattern)
    keys.push(...listKeys)
    
    if (keys.length > 0) {
      return redis.del(...keys)
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats() {
    try {
      const patterns = ['scheduler:*', 'applicants:*', 'applicant:*']
      let allKeys: string[] = []
      
      for (const pattern of patterns) {
        const keys = await redis.keys(pattern)
        allKeys.push(...keys)
      }
      
      const stats = {
        totalKeys: allKeys.length,
        keysByType: {
          interviewers: allKeys.filter(k => k.includes(':interviewer:')).length,
          busyTimes: allKeys.filter(k => k.includes(':busy:')).length,
          interviews: allKeys.filter(k => k.includes(':interviews:')).length,
          availability: allKeys.filter(k => k.includes(':availability:')).length,
          priority: allKeys.filter(k => k.includes(':priority:')).length,
          autoScheduler: allKeys.filter(k => k.includes(':auto:')).length,
          applicants: allKeys.filter(k => k.startsWith('applicants:')).length,
          applicant: allKeys.filter(k => k.startsWith('applicant:')).length,
        }
      }
      return stats
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Export default redis instance for direct usage
export default redis