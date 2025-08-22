import { db } from "@/lib/db"
import { Challenge } from "@prisma/client"

interface TimeSlot {
  hour: number
  minute: number
  date: Date
}

interface SchedulingRequest {
  intervieweeId: string
  preferredTeams: string[]
  availableSlots: TimeSlot[]
}

interface InterviewerMatch {
  interviewerId: string
  name: string
  email?: string
  targetTeams: string[]
  matchScore: number
  availableSlots: TimeSlot[]
  conflicts: string[]
}

interface SchedulingResult {
  success: boolean
  matches: InterviewerMatch[]
  suggestedSlot?: {
    interviewer: InterviewerMatch
    slot: TimeSlot
  }
  errors: string[]
}

/**
 * Generate 15-minute time slots for a given date range
 */
function generateTimeSlots(startDate: Date, endDate: Date): TimeSlot[] {
  const slots: TimeSlot[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    // Business hours: 8 AM to 10 PM
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push({
          hour,
          minute,
          date: new Date(current)
        })
      }
    }
    current.setDate(current.getDate() + 1)
  }
  
  return slots
}

/**
 * Check if a time slot conflicts with existing interviews or busy times for an interviewer
 */
async function checkSlotConflicts(
  interviewerId: string,
  startTime: Date,
  endTime: Date
): Promise<string[]> {
  const conflicts: string[] = []
  
  // Check interview conflicts for this interviewer
  const conflictingInterviews = await db.interview.findMany({
    where: {
      interviewerId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    },
    include: {
      applicant: {
        select: { fullName: true }
      }
    }
  })
  
  if (conflictingInterviews.length > 0) {
    const applicantName = conflictingInterviews[0]?.applicant?.fullName || conflictingInterviews[0]?.placeholderName || 'Unknown applicant'
    conflicts.push(`Interview conflict: ${applicantName}`)
  }
  
  // Check busy time conflicts
  const conflictingBusyTimes = await db.interviewerBusyTime.findMany({
    where: {
      interviewerId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    }
  })
  
  if (conflictingBusyTimes.length > 0) {
    const reason = conflictingBusyTimes[0]?.reason || 'Busy time'
    conflicts.push(`Busy conflict: ${reason}`)
  }
  
  return conflicts
}

/**
 * Check if an applicant has conflicting interviews at the proposed time
 */
async function checkApplicantConflicts(
  applicantId: string,
  startTime: Date,
  endTime: Date
): Promise<string[]> {
  const conflicts: string[] = []
  
  const conflictingInterviews = await db.interview.findMany({
    where: {
      applicantId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    },
    include: {
      interviewer: {
        select: { name: true }
      }
    }
  })
  
  if (conflictingInterviews.length > 0) {
    const interviewerName = conflictingInterviews[0]?.interviewer?.name || 'Unknown interviewer'
    conflicts.push(`Applicant has conflicting interview with: ${interviewerName}`)
  }
  
  return conflicts
}

/**
 * Batch check interviewer availability for multiple slots
 * Simplified version using direct database calls
 */
async function batchCheckInterviewerAvailability(
  interviewerIds: string[],
  slots: TimeSlot[]
): Promise<Record<string, Record<string, boolean>>> {
  // For simplicity, return empty availability (will fall back to individual checks)
  const fallback: Record<string, Record<string, boolean>> = {}
  for (const interviewerId of interviewerIds) {
    fallback[interviewerId] = {}
    for (const slot of slots) {
      const gridTime = new Date(slot.date)
      gridTime.setHours(slot.hour, slot.minute, 0, 0)
      fallback[interviewerId][gridTime.toISOString()] = false
    }
  }
  return fallback
}

/**
 * Check if interviewer has availability during a time slot
 * Default: All slots 8am-10pm are available unless marked as busy
 */
async function checkInterviewerAvailability(
  interviewerId: string,
  slot: TimeSlot
): Promise<boolean> {
  // Only consider business hours (8am-10pm)
  if (slot.hour < 8 || slot.hour >= 22) {
    return false
  }
  
  // Create the exact time for this slot
  const slotTime = new Date(slot.date)
  slotTime.setHours(slot.hour, slot.minute, 0, 0)
  const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000)
  
  // Check if this time is marked as busy (instead of checking for availability)
  const busyTime = await db.interviewerBusyTime.findFirst({
    where: {
      interviewerId,
      OR: [
        {
          startTime: { lt: slotEndTime },
          endTime: { gt: slotTime }
        }
      ]
    }
  })
  
  // Available if NOT busy
  return busyTime === null
}

/**
 * Calculate match score between interviewer and interviewee based on team preferences
 * Uses hierarchical scoring where Priority 1 teams get much higher scores than Priority 2, etc.
 */
function calculateMatchScore(
  interviewerTeams: string[],
  intervieweeTeams: string[]
): number {
  if (interviewerTeams.length === 0 || intervieweeTeams.length === 0) {
    return 0
  }
  
  // Find common teams
  const commonTeams = interviewerTeams.filter(team => 
    intervieweeTeams.includes(team)
  )
  
  if (commonTeams.length === 0) {
    return 0
  }
  
  let totalScore = 0
  
  // Hierarchical scoring: Priority 1 = 1000 points, Priority 2 = 500 points, etc.
  commonTeams.forEach(team => {
    const interviewerPriority = interviewerTeams.indexOf(team)
    const intervieweePriority = intervieweeTeams.indexOf(team)
    
    // Calculate hierarchical base scores (exponentially decreasing)
    const interviewerBaseScore = getHierarchicalScore(interviewerPriority)
    const intervieweeBaseScore = getHierarchicalScore(intervieweePriority)
    
    // The score for this match is the sum of both priority scores
    // This ensures that Priority 1 + Priority 1 matches get highest scores
    const matchScore = interviewerBaseScore + intervieweeBaseScore
    
    // Add bonus for exact priority matches (both have same priority for this team)
    const priorityMatchBonus = interviewerPriority === intervieweePriority ? 200 : 0
    
    totalScore += matchScore + priorityMatchBonus
  })
  
  return totalScore
}

/**
 * Get hierarchical score based on priority position
 * Priority 1 (index 0) = 1000 points
 * Priority 2 (index 1) = 500 points  
 * Priority 3 (index 2) = 250 points
 * Priority 4 (index 3) = 125 points
 * Priority 5+ = 50 points
 */
function getHierarchicalScore(priorityIndex: number): number {
  switch (priorityIndex) {
    case 0: return 1000  // Priority 1
    case 1: return 500   // Priority 2  
    case 2: return 250   // Priority 3
    case 3: return 125   // Priority 4
    default: return 50   // Priority 5+
  }
}

/**
 * Auto-schedule interviews for an interviewee
 */
export async function autoScheduleInterview(
  request: SchedulingRequest
): Promise<SchedulingResult> {
  const { intervieweeId, preferredTeams, availableSlots } = request
  const errors: string[] = []
  
  try {
    // Check cache for recent results
    let cachedResult: SchedulingResult | null = null
    try {
      const { SchedulerCache } = await import('@/lib/redis')
      cachedResult = await SchedulerCache.getAutoSchedulerResult(intervieweeId) as SchedulingResult | null
      
      // Use cached result if it's recent (within 5 minutes) and has the same preferred teams
      if (cachedResult && 
          cachedResult.matches.length > 0 && 
          JSON.stringify(preferredTeams.sort()) === JSON.stringify(cachedResult.matches[0]?.targetTeams?.sort())) {
        console.log(`Using cached auto-scheduler result for ${intervieweeId}`)
        return cachedResult
      }
    } catch (cacheError) {
      console.warn('Failed to check auto-scheduler cache:', cacheError)
    }
    
    // Validate interviewee exists
    const interviewee = await db.application.findUnique({
      where: { id: intervieweeId },
      select: { id: true, fullName: true }
    })
    
    if (!interviewee) {
      return {
        success: false,
        matches: [],
        errors: ['Interviewee not found']
      }
    }
    
    // Get all interviewers
    const interviewers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
      }
    })
    
    // Batch check availability for all interviewers and slots at once
    const interviewerIds = interviewers.map(i => i.id)
    const availabilityBatch = await batchCheckInterviewerAvailability(interviewerIds, availableSlots)
    
    const matches: InterviewerMatch[] = []
    const fallbackMatches: InterviewerMatch[] = []
    
    // Evaluate each interviewer
    for (const interviewer of interviewers) {
      const matchScore = calculateMatchScore(interviewer.targetTeams, preferredTeams)
      
      // Process both priority matches (with team overlap) and fallback matches (all available)
      const isExactMatch = matchScore > 0
      
      const interviewerMatch: InterviewerMatch = {
        interviewerId: interviewer.id,
        name: interviewer.name,
        email: interviewer.email || undefined,
        targetTeams: interviewer.targetTeams,
        matchScore,
        availableSlots: [],
        conflicts: []
      }
      
      const interviewerAvailability = availabilityBatch[interviewer.id] || {}
      
      // Check each available slot for this interviewer
      for (const slot of availableSlots) {
        // Check if this slot is in business hours (8am-10pm)
        if (slot.hour < 8 || slot.hour >= 22) {
          continue
        }
        
        // For now, assume all business hours are available (busy times are checked separately)
        // This can be optimized later to batch check busy times as well
        const hasAvailability = await checkInterviewerAvailability(interviewer.id, slot)
        
        if (!hasAvailability) {
          continue
        }
        
        // Check for conflicts (45-minute interview block)
        const startTime = new Date(slot.date)
        startTime.setHours(slot.hour, slot.minute, 0, 0)
        const endTime = new Date(startTime.getTime() + 45 * 60 * 1000)
        
        // Validate business hours (8 AM - 10 PM, and interview shouldn't extend past 10 PM)
        const startHour = startTime.getHours()
        const endHour = endTime.getHours()
        const endMinute = endTime.getMinutes()
        
        if (startHour < 8 || startHour >= 22 || endHour > 22 || (endHour === 22 && endMinute > 0)) {
          interviewerMatch.conflicts.push('Outside business hours (8 AM - 10 PM)')
          continue
        }
        
        // Check interviewer conflicts (busy times and existing interviews)
        const slotConflicts = await checkSlotConflicts(interviewer.id, startTime, endTime)
        
        // Check applicant conflicts (if this applicant has other interviews at this time)
        const applicantConflicts = await checkApplicantConflicts(intervieweeId, startTime, endTime)
        
        const allConflicts = [...slotConflicts, ...applicantConflicts]
        
        if (allConflicts.length === 0) {
          interviewerMatch.availableSlots.push(slot)
        } else {
          interviewerMatch.conflicts.push(...allConflicts)
        }
      }
      
      // Sort available slots by date/time (earliest first) for better scheduling
      interviewerMatch.availableSlots.sort((a, b) => {
        const dateA = new Date(a.date)
        dateA.setHours(a.hour, a.minute, 0, 0)
        const dateB = new Date(b.date)
        dateB.setHours(b.hour, b.minute, 0, 0)
        return dateA.getTime() - dateB.getTime()
      })
      
      // Add to appropriate list based on team match
      if (isExactMatch) {
        matches.push(interviewerMatch)
      } else {
        // Only add to fallback if interviewer has available slots
        if (interviewerMatch.availableSlots.length > 0) {
          fallbackMatches.push(interviewerMatch)
        }
      }
    }
    
    // Enhanced sorting for priority-based matching:
    // 1. Match score (highest first) - prioritizes closest team matches
    // 2. For same match scores, earliest available slot (soonest first) 
    // 3. Number of available slots (most first) as tiebreaker
    matches.sort((a, b) => {
      // Primary sort: match score (higher is better) - ensures closest priority teams are matched first
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      
      // Secondary sort: earliest available slot (sooner is better) - find first availability for highest relevance
      if (a.availableSlots.length > 0 && b.availableSlots.length > 0) {
        const earliestA = new Date(a.availableSlots[0].date)
        earliestA.setHours(a.availableSlots[0].hour, a.availableSlots[0].minute, 0, 0)
        const earliestB = new Date(b.availableSlots[0].date)
        earliestB.setHours(b.availableSlots[0].hour, b.availableSlots[0].minute, 0, 0)
        
        if (earliestA.getTime() !== earliestB.getTime()) {
          return earliestA.getTime() - earliestB.getTime()
        }
      }
      
      // Tertiary sort: availability (more slots = more flexible) as tiebreaker
      if (b.availableSlots.length !== a.availableSlots.length) {
        return b.availableSlots.length - a.availableSlots.length
      }
      
      return 0
    })
    
    // If no priority matches found, use fallback matches
    let finalMatches = matches
    if (matches.length === 0 && fallbackMatches.length > 0) {
      // Sort fallback matches by earliest available slot and number of slots
      fallbackMatches.sort((a, b) => {
        if (a.availableSlots.length > 0 && b.availableSlots.length > 0) {
          const earliestA = new Date(a.availableSlots[0].date)
          earliestA.setHours(a.availableSlots[0].hour, a.availableSlots[0].minute, 0, 0)
          const earliestB = new Date(b.availableSlots[0].date)
          earliestB.setHours(b.availableSlots[0].hour, b.availableSlots[0].minute, 0, 0)
          
          const timeDiff = earliestA.getTime() - earliestB.getTime()
          if (timeDiff !== 0) return timeDiff
        }
        return b.availableSlots.length - a.availableSlots.length
      })
      
      finalMatches = fallbackMatches
      console.log(`No priority matches found for ${interviewee.fullName}, using ${fallbackMatches.length} fallback interviewers`)
    }
    
    // Find the best suggestion using enhanced selection logic
    let suggestedSlot: SchedulingResult['suggestedSlot']
    
    const bestMatch = finalMatches.find(match => match.availableSlots.length > 0)
    if (bestMatch && bestMatch.availableSlots.length > 0) {
      // Select the earliest available slot from the best interviewer
      const earliestSlot = bestMatch.availableSlots[0] // Already sorted by time
      if (earliestSlot) {
        suggestedSlot = {
          interviewer: bestMatch,
          slot: earliestSlot
        }
      }
    }

    const result: SchedulingResult = {
      success: finalMatches.length > 0,
      matches: finalMatches.slice(0, 5), // Return top 5 matches
      suggestedSlot,
      errors
    }
    
    // Cache the result for future requests (5 minute TTL)
    try {
      const { SchedulerCache } = await import('@/lib/redis')
      await SchedulerCache.setAutoSchedulerResult(intervieweeId, result, 5 * 60) // 5 minutes
    } catch (cacheError) {
      console.warn('Failed to cache auto-scheduler result:', cacheError)
    }
    
    return result
    
  } catch (error) {
    console.error('Auto-scheduling error:', error)
    return {
      success: false,
      matches: [],
      errors: ['Internal server error during scheduling']
    }
  }
}

/**
 * Find available 45-minute slots for an interviewer on a specific date
 */
export async function findAvailableSlots(
  interviewerId: string,
  date: Date
): Promise<TimeSlot[]> {
  const availableSlots: TimeSlot[] = []
  
  // Generate all possible 45-minute slots for the day
  const dayStart = new Date(date)
  dayStart.setHours(8, 0, 0, 0) // 8 AM
  
  const dayEnd = new Date(date)
  dayEnd.setHours(21, 15, 0, 0) // 9:15 PM (last possible start for 45-min slot)
  
  // Check every 15-minute increment
  const current = new Date(dayStart)
  while (current <= dayEnd) {
    const endTime = new Date(current.getTime() + 45 * 60 * 1000)
    
    // Check if this 45-minute block is available
    const conflicts = await checkSlotConflicts(interviewerId, current, endTime)
    
    // Also check if interviewer marked these time slots as available
    let hasAvailability = true
    for (let i = 0; i < 3; i++) { // Check all three 15-minute segments
      const segmentTime = new Date(current.getTime() + (i * 15 * 60 * 1000))
      const available = await checkInterviewerAvailability(interviewerId, {
        hour: segmentTime.getHours(),
        minute: segmentTime.getMinutes(),
        date: new Date(date)
      })
      
      if (!available) {
        hasAvailability = false
        break
      }
    }
    
    if (conflicts.length === 0 && hasAvailability) {
      availableSlots.push({
        hour: current.getHours(),
        minute: current.getMinutes(),
        date: new Date(date)
      })
    }
    
    // Move to next 15-minute increment
    current.setMinutes(current.getMinutes() + 15)
  }
  
  return availableSlots
}