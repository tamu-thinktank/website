import { db } from "@/lib/db"
import { Challenge, ApplicationStatus } from "@prisma/client"

interface TimeSlot {
  hour: number
  minute: number
  date: Date
  timestamp?: number  // Cached timestamp for performance optimization
}

interface SchedulingRequest {
  intervieweeId: string
  preferredTeams: string[]
  availableSlots: TimeSlot[]
  autoCreateInterview?: boolean  // New parameter to control automatic interview creation
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

interface CreatedInterview {
  id: string
  applicantId: string
  interviewerId: string
  startTime: Date
  endTime: Date
  location: string
  teamId?: string
  applicantName: string
  interviewerName: string
}

interface SchedulingResult {
  success: boolean
  matches: InterviewerMatch[]
  suggestedSlot?: {
    interviewer: InterviewerMatch
    slot: TimeSlot
  }
  createdInterview?: CreatedInterview  // New field for automatically created interviews
  errors: string[]
}

/**
 * Generate 15-minute time slots for a given date range with pre-computed timestamps
 */
function generateTimeSlots(startDate: Date, endDate: Date): TimeSlot[] {
  const slots: TimeSlot[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    // Business hours: 8 AM to 10 PM
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slotDate = new Date(current)
        const slotTime = new Date(current)
        slotTime.setHours(hour, minute, 0, 0)
        
        slots.push({
          hour,
          minute,
          date: slotDate,
          timestamp: slotTime.getTime()  // Pre-compute timestamp for efficient sorting
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
 * Efficiently checks busy times, interviews, and daily limits for all interviewers and slots at once
 */
async function batchCheckInterviewerAvailability(
  interviewerIds: string[],
  slots: TimeSlot[]
): Promise<Record<string, Record<string, boolean>>> {
  const availability: Record<string, Record<string, boolean>> = {}
  
  // Initialize availability as true for all business hours slots
  for (const interviewerId of interviewerIds) {
    availability[interviewerId] = {}
    for (const slot of slots) {
      // Only check business hours (8am-10pm)
      if (slot.hour >= 8 && slot.hour < 22) {
        const gridTime = new Date(slot.date)
        gridTime.setHours(slot.hour, slot.minute, 0, 0)
        availability[interviewerId][gridTime.toISOString()] = true
      }
    }
  }
  
  // Get all busy times and existing interviews for these interviewers in the relevant date range
  const minDate = new Date(Math.min(...slots.map(s => s.date.getTime())))
  const maxDate = new Date(Math.max(...slots.map(s => s.date.getTime())))
  maxDate.setHours(23, 59, 59, 999) // End of day
  
  const [busyTimes, existingInterviews] = await Promise.all([
    db.interviewerBusyTime.findMany({
      where: {
        interviewerId: { in: interviewerIds },
        startTime: { lte: maxDate },
        endTime: { gte: minDate }
      }
    }),
    db.interview.findMany({
      where: {
        interviewerId: { in: interviewerIds },
        startTime: { lte: maxDate },
        endTime: { gte: minDate }
      }
    })
  ])
  
  // Mark slots as unavailable if they overlap with busy times or existing interviews
  const allConflicts = [...busyTimes, ...existingInterviews]
  
  for (const conflict of allConflicts) {
    const interviewerId = 'interviewerId' in conflict ? conflict.interviewerId : (conflict as any).interviewerId
    
    for (const slot of slots) {
      const slotTime = new Date(slot.date)
      slotTime.setHours(slot.hour, slot.minute, 0, 0)
      const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000)
      
      // Check if slot overlaps with busy time or interview
      if (conflict.startTime < slotEndTime && conflict.endTime > slotTime) {
        const key = slotTime.toISOString()
        if (availability[interviewerId]?.[key] !== undefined) {
          availability[interviewerId][key] = false
        }
      }
    }
  }
  
  // Check daily interview limits for each interviewer on each day
  const uniqueDates = [...new Set(slots.map(s => s.date.toDateString()))]
  const dailyInterviewCounts: Record<string, Record<string, number>> = {}
  
  for (const interviewerId of interviewerIds) {
    dailyInterviewCounts[interviewerId] = {}
    
    for (const dateString of uniqueDates) {
      const date = new Date(dateString)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      
      const interviewsToday = await db.interview.count({
        where: {
          interviewerId,
          startTime: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      })
      
      dailyInterviewCounts[interviewerId][dateString] = interviewsToday
    }
  }
  
  // Mark slots as unavailable if daily limit (4 interviews) is reached
  for (const interviewerId of interviewerIds) {
    for (const slot of slots) {
      const dateString = slot.date.toDateString()
      const interviewsToday = dailyInterviewCounts[interviewerId][dateString] || 0
      
      if (interviewsToday >= 4) {
        const slotTime = new Date(slot.date)
        slotTime.setHours(slot.hour, slot.minute, 0, 0)
        const key = slotTime.toISOString()
        if (availability[interviewerId]?.[key] !== undefined) {
          availability[interviewerId][key] = false
        }
      }
    }
  }
  
  return availability
}

/**
 * Check if interviewer has availability during a time slot
 * Checks busy times, existing interviews, and daily interview limits
 */
async function checkInterviewerAvailability(
  interviewerId: string,
  slot: TimeSlot
): Promise<boolean> {
  // Only consider business hours (8am-10pm)
  if (slot.hour < 8 || slot.hour >= 22) {
    return false
  }
  
  // Create the exact time for this slot - use cached timestamp if available
  const slotTime = slot.timestamp ? new Date(slot.timestamp) : (() => {
    const time = new Date(slot.date)
    time.setHours(slot.hour, slot.minute, 0, 0)
    return time
  })()
  const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000)
  
  // Check if this time is marked as busy
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
  
  if (busyTime) {
    return false // Slot is marked as busy
  }
  
  // Also check for existing interviews that would conflict
  const existingInterview = await db.interview.findFirst({
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
  
  if (existingInterview) {
    return false // Time conflict with existing interview
  }

  // Check daily interview limit (4 interviews per day for auto-scheduler)
  const dayStart = new Date(slot.date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(slot.date)
  dayEnd.setHours(23, 59, 59, 999)
  
  const interviewsToday = await db.interview.count({
    where: {
      interviewerId,
      startTime: {
        gte: dayStart,
        lte: dayEnd
      }
    }
  })
  
  // Auto-scheduler limit: max 4 interviews per day
  if (interviewsToday >= 4) {
    return false // Daily interview limit reached for auto-scheduling
  }
  
  return true
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
  let bestMatchScore = 0
  
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
    const priorityMatchBonus = interviewerPriority === intervieweePriority ? 300 : 0
    
    // Add bonus for high priority matches (Priority 1 or 2)
    const highPriorityBonus = (interviewerPriority < 2 && intervieweePriority < 2) ? 150 : 0
    
    const teamScore = matchScore + priorityMatchBonus + highPriorityBonus
    
    totalScore += teamScore
    bestMatchScore = Math.max(bestMatchScore, teamScore)
  })
  
  // Weight the final score to emphasize the best single match while still rewarding multiple matches
  const finalScore = bestMatchScore * 2 + totalScore
  
  return finalScore
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
 * Automatically create an interview record in the database
 */
async function createInterviewRecord(
  intervieweeId: string,
  interviewer: InterviewerMatch,
  slot: TimeSlot,
  applicantName: string
): Promise<CreatedInterview> {
  const startTime = new Date(slot.date)
  startTime.setHours(slot.hour, slot.minute, 0, 0)
  
  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + 45) // 45-minute interviews
  
  console.log(`🔄 [AUTO-SCHEDULER] Creating interview record for ${applicantName} with ${interviewer.name}`)
  
  // Use a transaction to ensure atomicity
  const result = await db.$transaction(async (tx) => {
    // Update application status to INTERVIEWING
    const updatedApplication = await tx.application.update({
      where: { id: intervieweeId },
      data: { 
        status: ApplicationStatus.INTERVIEWING,
        // Set interview stage to true
        interviewStage: true
      }
    })
    
    console.log(`✅ [AUTO-SCHEDULER] Updated application status: ${updatedApplication.id} -> ${updatedApplication.status}`)
    
    // Create the interview record
    const interview = await tx.interview.create({
      data: {
        applicantId: intervieweeId,
        interviewerId: interviewer.interviewerId,
        startTime,
        endTime,
        location: "To be determined", // Default location
        teamId: null, // No specific team assignment yet
        isPlaceholder: false
      },
      include: {
        applicant: {
          select: { fullName: true }
        },
        interviewer: {
          select: { name: true }
        }
      }
    })
    
    return interview
  })
  
  // Clear any caches that might be showing stale data
  try {
    const { SchedulerCache } = await import('@/lib/redis')
    await SchedulerCache.invalidateApplicant(intervieweeId)
    console.log(`🗑️ [AUTO-SCHEDULER] Cleared cache for applicant: ${intervieweeId}`)
  } catch (cacheError) {
    console.warn('Failed to clear applicant cache:', cacheError)
  }
  
  console.log(`✅ [AUTO-SCHEDULER] Interview created successfully: ${result.id}`)
  
  return {
    id: result.id,
    applicantId: result.applicantId!,
    interviewerId: result.interviewerId,
    startTime: result.startTime,
    endTime: result.endTime,
    location: result.location,
    teamId: result.teamId || undefined,
    applicantName: result.applicant?.fullName || applicantName,
    interviewerName: result.interviewer?.name || interviewer.name
  }
}

/**
 * Auto-schedule interviews for an interviewee
 */
export async function autoScheduleInterview(
  request: SchedulingRequest
): Promise<SchedulingResult> {
  const { intervieweeId, preferredTeams, autoCreateInterview = false } = request
  let { availableSlots } = request
  const errors: string[] = []
  const startTime = Date.now()
  
  console.log(`🚀 [AUTO-SCHEDULER] Starting for applicant: ${intervieweeId}`)
  console.log(`📊 [AUTO-SCHEDULER] Request details: ${preferredTeams.length} preferred teams [${preferredTeams.join(', ')}], ${availableSlots.length} time slots`)
  
  // Limit the number of slots to prevent performance issues
  // Take only the first 500 slots (about 125 hours worth) to keep queries manageable
  if (availableSlots.length > 500) {
    console.log(`⚠️  [AUTO-SCHEDULER] Limiting availableSlots from ${availableSlots.length} to 500 for performance`)
    availableSlots = availableSlots.slice(0, 500)
  }
  
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
    console.log(`🔍 [AUTO-SCHEDULER] Looking up applicant: ${intervieweeId}`)
    const interviewee = await db.application.findUnique({
      where: { id: intervieweeId },
      select: { id: true, fullName: true }
    })
    
    if (!interviewee) {
      console.log(`❌ [AUTO-SCHEDULER] ERROR: Applicant not found: ${intervieweeId}`)
      return {
        success: false,
        matches: [],
        errors: ['Interviewee not found']
      }
    }
    
    console.log(`✓ [AUTO-SCHEDULER] Found applicant: ${interviewee.fullName}`)
    
    // Get all interviewers
    console.log(`👥 [AUTO-SCHEDULER] Fetching interviewers...`)
    const interviewers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
      }
    })
    
    console.log(`👥 [AUTO-SCHEDULER] Found ${interviewers.length} interviewer(s):`)
    interviewers.forEach(interviewer => {
      console.log(`  - ${interviewer.name} (${interviewer.email}) - Teams: [${interviewer.targetTeams?.join(', ') || 'none'}]`)
    })
    
    if (interviewers.length === 0) {
      console.log(`❌ [AUTO-SCHEDULER] ERROR: No interviewers found. Make sure users have logged in.`)
      return {
        success: false,
        matches: [],
        errors: ['No interviewers available. Please ensure at least one user has logged in.']
      }
    }
    
    // Batch check availability for all interviewers and slots at once
    const interviewerIds = interviewers.map(i => i.id)
    console.log(`⏰ [AUTO-SCHEDULER] Batch checking availability for ${interviewerIds.length} interviewers across ${availableSlots.length} slots...`)
    const batchStartTime = Date.now()
    const availabilityBatch = await batchCheckInterviewerAvailability(interviewerIds, availableSlots)
    const batchEndTime = Date.now()
    console.log(`⏰ [AUTO-SCHEDULER] Batch availability check completed in ${batchEndTime - batchStartTime}ms`)
    
    const matches: InterviewerMatch[] = []
    const fallbackMatches: InterviewerMatch[] = []
    
    console.log(`🎯 [AUTO-SCHEDULER] Scoring interviewer matches...`)
    
    // Evaluate each interviewer
    for (const interviewer of interviewers) {
      const matchScore = calculateMatchScore(interviewer.targetTeams, preferredTeams)
      
      console.log(`  - ${interviewer.name}: score ${matchScore} (interviewer teams: [${interviewer.targetTeams?.join(', ') || 'none'}] vs preferred: [${preferredTeams.join(', ')}])`)
      
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
      let slotsChecked = 0
      let conflictsFound = 0
      
      console.log(`📋 [AUTO-SCHEDULER] Checking ${availableSlots.length} slots for ${interviewer.name}...`)
      
      // Check each available slot for this interviewer
      for (const slot of availableSlots) {
        slotsChecked++
        // Check if this slot is in business hours (8am-10pm)
        if (slot.hour < 8 || slot.hour >= 22) {
          continue
        }
        
        // Check if the slot is in the past
        const slotDateTime = new Date(slot.date)
        slotDateTime.setHours(slot.hour, slot.minute, 0, 0)
        const now = new Date()
        if (slotDateTime <= now) {
          continue // Skip past slots
        }
        
        // Check if interviewer has availability for a full 45-minute interview starting at this slot
        let hasAvailability = true
        
        // Check all three 15-minute segments needed for a 45-minute interview
        for (let i = 0; i < 3; i++) {
          const segmentTime = new Date(slot.date)
          segmentTime.setHours(slot.hour, slot.minute + (i * 15), 0, 0)
          const segmentKey = segmentTime.toISOString()
          
          // Use batch data if available, otherwise assume available (default for business hours)
          let segmentAvailable = interviewerAvailability[segmentKey] !== undefined ? 
            interviewerAvailability[segmentKey] : 
            true // Default to available if not in batch data (optimistic approach)
            
          if (!segmentAvailable) {
            hasAvailability = false
            break
          }
        }
        
        if (!hasAvailability) {
          interviewerMatch.conflicts.push('Interviewer not available for full 45-minute block')
          conflictsFound++
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
          conflictsFound++
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
          conflictsFound++
        }
      }
      
      // Sort available slots by date/time (earliest first) for better scheduling
      // Pre-compute timestamps if not already cached
      interviewerMatch.availableSlots.forEach(slot => {
        if (!slot.timestamp) {
          const slotTime = new Date(slot.date)
          slotTime.setHours(slot.hour, slot.minute, 0, 0)
          slot.timestamp = slotTime.getTime()
        }
      })
      
      interviewerMatch.availableSlots.sort((a, b) => {
        return (a.timestamp || 0) - (b.timestamp || 0)
      })
      
      console.log(`  ✓ ${interviewer.name}: ${interviewerMatch.availableSlots.length} available slots, ${conflictsFound} conflicts (${slotsChecked} slots checked)`)
      
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
        const slotA = a.availableSlots[0]!
        const slotB = b.availableSlots[0]!
        
        // Use cached timestamp or compute if missing
        const timestampA = slotA.timestamp || (() => {
          const time = new Date(slotA.date)
          time.setHours(slotA.hour, slotA.minute, 0, 0)
          return time.getTime()
        })()
        
        const timestampB = slotB.timestamp || (() => {
          const time = new Date(slotB.date)
          time.setHours(slotB.hour, slotB.minute, 0, 0)
          return time.getTime()
        })()
        
        if (timestampA !== timestampB) {
          return timestampA - timestampB
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
          const slotA = a.availableSlots[0]!
          const slotB = b.availableSlots[0]!
          
          // Use cached timestamp or compute if missing
          const timestampA = slotA.timestamp || (() => {
            const time = new Date(slotA.date)
            time.setHours(slotA.hour, slotA.minute, 0, 0)
            return time.getTime()
          })()
          
          const timestampB = slotB.timestamp || (() => {
            const time = new Date(slotB.date)
            time.setHours(slotB.hour, slotB.minute, 0, 0)
            return time.getTime()
          })()
          
          const timeDiff = timestampA - timestampB
          if (timeDiff !== 0) return timeDiff
        }
        return b.availableSlots.length - a.availableSlots.length
      })
      
      finalMatches = fallbackMatches
      console.log(`No priority matches found for ${interviewee.fullName}, using ${fallbackMatches.length} fallback interviewers`)
    }
    
    // Find the best suggestion using enhanced selection logic
    let suggestedSlot: SchedulingResult['suggestedSlot']
    let createdInterview: CreatedInterview | undefined
    
    const bestMatch = finalMatches.find(match => match.availableSlots.length > 0)
    if (bestMatch && bestMatch.availableSlots.length > 0) {
      // Select the earliest available slot from the best interviewer
      const earliestSlot = bestMatch.availableSlots[0] // Already sorted by time
      if (earliestSlot) {
        suggestedSlot = {
          interviewer: bestMatch,
          slot: earliestSlot
        }
        
        // If auto-create is enabled, automatically create the interview
        if (autoCreateInterview && suggestedSlot) {
          try {
            console.log(`🤖 [AUTO-SCHEDULER] Auto-creating interview for ${interviewee.fullName}`)
            createdInterview = await createInterviewRecord(
              intervieweeId,
              bestMatch,
              earliestSlot,
              interviewee.fullName
            )
            console.log(`✅ [AUTO-SCHEDULER] Interview auto-created: ${createdInterview.id}`)
          } catch (error) {
            console.error(`❌ [AUTO-SCHEDULER] Failed to auto-create interview:`, error)
            errors.push(`Failed to create interview automatically: ${error instanceof Error ? error.message : 'Unknown error'}`)
            // Don't return early - still provide suggestion as fallback
          }
        }
      }
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    console.log(`📊 [AUTO-SCHEDULER] Results Summary:`)
    console.log(`  - Priority matches: ${matches.length}`)
    console.log(`  - Fallback matches: ${fallbackMatches.length}`)
    console.log(`  - Total viable matches: ${finalMatches.length}`)
    
    if (suggestedSlot) {
      const slotDate = new Date(suggestedSlot.slot.date)
      slotDate.setHours(suggestedSlot.slot.hour, suggestedSlot.slot.minute, 0, 0)
      console.log(`✅ [AUTO-SCHEDULER] SUCCESS: Best match found!`)
      console.log(`  - Interviewer: ${suggestedSlot.interviewer.name} (score: ${suggestedSlot.interviewer.matchScore})`)
      console.log(`  - Time slot: ${slotDate.toLocaleDateString()} ${slotDate.toLocaleTimeString()}`)
    } else {
      console.log(`❌ [AUTO-SCHEDULER] No available slots found`)
      if (finalMatches.length > 0) {
        console.log(`  - Found ${finalMatches.length} matching interviewer(s) but no available slots`)
      } else {
        console.log(`  - No interviewers available that match the criteria`)
      }
    }
    
    console.log(`⚡ [AUTO-SCHEDULER] Performance: ${totalTime}ms total`)

    const result: SchedulingResult = {
      success: finalMatches.length > 0,
      matches: finalMatches.slice(0, 5), // Return top 5 matches
      suggestedSlot,
      createdInterview,
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
    const errorTime = Date.now() - startTime
    console.error(`💥 [AUTO-SCHEDULER] FATAL ERROR after ${errorTime}ms:`, error)
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
        date: new Date(date),
        timestamp: current.getTime()  // Pre-compute timestamp for efficient sorting
      })
    }
    
    // Move to next 15-minute increment
    current.setMinutes(current.getMinutes() + 15)
  }
  
  return availableSlots
}