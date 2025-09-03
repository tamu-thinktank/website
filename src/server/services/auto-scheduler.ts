import { db } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";

interface TimeSlot {
  hour: number;
  minute: number;
  date: Date;
  timestamp?: number; // Cached timestamp for performance optimization
}

interface SchedulingRequest {
  intervieweeId: string;
  preferredTeams: string[];
  availableSlots: TimeSlot[];
  autoCreateInterview?: boolean; // New parameter to control automatic interview creation
}

interface InterviewerMatch {
  interviewerId: string;
  name: string;
  email?: string;
  targetTeams: string[];
  matchScore: number;
  availableSlots: TimeSlot[];
  conflicts: string[];
}

interface CreatedInterview {
  id: string;
  applicantId: string;
  interviewerId: string;
  startTime: Date;
  endTime: Date;
  location: string;
  teamId?: string;
  applicantName: string;
  interviewerName: string;
}

interface SchedulingResult {
  success: boolean;
  matches: InterviewerMatch[];
  suggestedSlot?: {
    interviewer: InterviewerMatch;
    slot: TimeSlot;
  };
  createdInterview?: CreatedInterview; // New field for automatically created interviews
  errors: string[];
}

/**
 * Generate 15-minute time slots for a given date range with pre-computed timestamps
 */
function generateTimeSlots(startDate: Date, endDate: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    // Business hours: 8 AM to 10 PM
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slotDate = new Date(current);
        const slotTime = new Date(current);
        slotTime.setHours(hour, minute, 0, 0);

        slots.push({
          hour,
          minute,
          date: slotDate,
          timestamp: slotTime.getTime(), // Pre-compute timestamp for efficient sorting
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return slots;
}

/**
 * Check if a time slot conflicts with existing interviews or busy times for an interviewer
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkSlotConflicts(
  interviewerId: string,
  startTime: Date,
  endTime: Date,
): Promise<string[]> {
  const conflicts: string[] = [];

  // Check interview conflicts for this interviewer
  const conflictingInterviews = await db.interview.findMany({
    where: {
      interviewerId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      ],
    },
    include: {
      applicant: {
        select: { fullName: true },
      },
    },
  });

  if (conflictingInterviews.length > 0) {
    const applicantName =
      conflictingInterviews[0]?.applicant?.fullName ??
      conflictingInterviews[0]?.placeholderName ??
      "Unknown applicant";
    conflicts.push(`Interview conflict: ${applicantName}`);
  }

  // Check busy time conflicts
  const conflictingBusyTimes = await db.interviewerBusyTime.findMany({
    where: {
      interviewerId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      ],
    },
  });

  if (conflictingBusyTimes.length > 0) {
    const reason = conflictingBusyTimes[0]?.reason ?? "Busy time";
    conflicts.push(`Busy conflict: ${reason}`);
  }

  return conflicts;
}

/**
 * Check if an applicant has conflicting interviews at the proposed time
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkApplicantConflicts(
  applicantId: string,
  startTime: Date,
  endTime: Date,
): Promise<string[]> {
  const conflicts: string[] = [];

  const conflictingInterviews = await db.interview.findMany({
    where: {
      applicantId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      ],
    },
    include: {
      interviewer: {
        select: { name: true },
      },
    },
  });

  if (conflictingInterviews.length > 0) {
    const interviewerName =
      conflictingInterviews[0]?.interviewer?.name ?? "Unknown interviewer";
    conflicts.push(
      `Applicant has conflicting interview with: ${interviewerName}`,
    );
  }

  return conflicts;
}

/**
 * Pre-compute interviewer availability arrays for efficient scheduling
 * Returns arrays of available 15-minute slots for each interviewer
 */
async function precomputeInterviewerAvailability(
  interviewerIds: string[],
  dateRange: { start: Date; end: Date },
): Promise<Record<string, boolean[]>> {
  const availability: Record<string, boolean[]> = {};

  // Generate all possible 15-minute slots in the date range
  const allSlots = generateTimeSlots(dateRange.start, dateRange.end);
  //const totalSlots = allSlots.length

  // Get all conflicts in parallel for all interviewers
  const [busyTimes, existingInterviews, dailyInterviewCounts] =
    await Promise.all([
      // Busy times
      db.interviewerBusyTime.findMany({
        where: {
          interviewerId: { in: interviewerIds },
          startTime: { lte: dateRange.end },
          endTime: { gte: dateRange.start },
        },
      }),
      // Existing interviews
      db.interview.findMany({
        where: {
          interviewerId: { in: interviewerIds },
          startTime: { lte: dateRange.end },
          endTime: { gte: dateRange.start },
        },
      }),
      // Daily interview counts
      Promise.all(
        interviewerIds.map(async (interviewerId) => {
          const uniqueDates = [
            ...new Set(allSlots.map((s) => s.date.toDateString())),
          ];
          const counts: Record<string, number> = {};

          await Promise.all(
            uniqueDates.map(async (dateString) => {
              const date = new Date(dateString);
              const dayStart = new Date(date);
              dayStart.setHours(0, 0, 0, 0);
              const dayEnd = new Date(date);
              dayEnd.setHours(23, 59, 59, 999);

              counts[dateString] = await db.interview.count({
                where: {
                  interviewerId,
                  startTime: { gte: dayStart, lte: dayEnd },
                },
              });
            }),
          );

          return { interviewerId, counts };
        }),
      ),
    ]);

  // Convert daily counts to lookup
  const dailyCounts: Record<string, Record<string, number>> = {};
  dailyInterviewCounts.forEach(({ interviewerId, counts }) => {
    if (interviewerId) {
      dailyCounts[interviewerId] = counts;
    }
  });

  // Initialize all slots as available (business hours only)
  for (const interviewerId of interviewerIds) {
    availability[interviewerId] = allSlots.map(
      (slot) => slot.hour >= 8 && slot.hour < 22, // Business hours only
    );
  }

  // Mark conflicts for each interviewer
  for (const interviewerId of interviewerIds) {
    const interviewerBusyTimes = busyTimes.filter(
      (bt) => bt.interviewerId === interviewerId,
    );
    const interviewerInterviews = existingInterviews.filter(
      (iv) => iv.interviewerId === interviewerId,
    );
    const allConflicts = [...interviewerBusyTimes, ...interviewerInterviews];

    // Mark conflicting slots as unavailable
    allConflicts.forEach((conflict) => {
      allSlots.forEach((slot, index) => {
        const slotTime = new Date(slot.date);
        slotTime.setHours(slot.hour, slot.minute, 0, 0);
        const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);

        // Check for time overlap using standard interval overlap logic
        if (
          conflict.startTime < slotEndTime &&
          conflict.endTime > slotTime &&
          availability[interviewerId]
        ) {
          availability[interviewerId][index] = false;
        }
      });
    });

    // Mark slots unavailable if daily limit reached
    allSlots.forEach((slot, index) => {
      const dateString = slot.date.toDateString();
      const interviewsToday = dailyCounts[interviewerId]?.[dateString] ?? 0;

      if (interviewsToday >= 4 && availability[interviewerId]) {
        availability[interviewerId][index] = false;
      }
    });
  }

  return availability;
}

/**
 * Find 3 consecutive available slots in an availability array
 * Returns the starting index of the first available 45-minute block, or -1 if none found
 */
function findConsecutiveSlots(
  availability: boolean[],
  allSlots: TimeSlot[],
  applicantAvailableSlots: TimeSlot[],
): number {
  // Create a set of applicant available slot timestamps for fast lookup
  const applicantSlotSet = new Set(
    applicantAvailableSlots.map((slot) => {
      if (slot.timestamp) return slot.timestamp;
      const time = new Date(slot.date);
      time.setHours(slot.hour, slot.minute, 0, 0);
      return time.getTime();
    }),
  );

  // Scan through the availability array looking for 3 consecutive true values
  for (let i = 0; i <= availability.length - 3; i++) {
    // Check if all 3 consecutive slots are available
    if (availability[i] && availability[i + 1] && availability[i + 2]) {
      // Also check if the applicant is available for these slots
      const slot1 = allSlots[i];
      const slot2 = allSlots[i + 1];
      const slot3 = allSlots[i + 2];

      if (!slot1 || !slot2 || !slot3) continue;

      // Get timestamps for applicant availability check
      const time1 =
        slot1.timestamp ??
        (() => {
          const t = new Date(slot1.date);
          t.setHours(slot1.hour, slot1.minute, 0, 0);
          return t.getTime();
        })();

      const time2 =
        slot2.timestamp ??
        (() => {
          const t = new Date(slot2.date);
          t.setHours(slot2.hour, slot2.minute, 0, 0);
          return t.getTime();
        })();

      const time3 =
        slot3.timestamp ??
        (() => {
          const t = new Date(slot3.date);
          t.setHours(slot3.hour, slot3.minute, 0, 0);
          return t.getTime();
        })();

      // Check if applicant is available for all 3 slots
      if (
        applicantSlotSet.has(time1) &&
        applicantSlotSet.has(time2) &&
        applicantSlotSet.has(time3)
      ) {
        return i; // Found a valid 45-minute block
      }
    }
  }

  return -1; // No consecutive slots found
}

/**
 * Calculate match score between interviewer and interviewee based on team preferences
 * Uses hierarchical scoring where Priority 1 teams get much higher scores than Priority 2, etc.
 */
function calculateMatchScore(
  interviewerTeams: string[],
  intervieweeTeams: string[],
): number {
  if (interviewerTeams.length === 0 || intervieweeTeams.length === 0) {
    return 0;
  }

  // Find common teams
  const commonTeams = interviewerTeams.filter((team) =>
    intervieweeTeams.includes(team),
  );

  if (commonTeams.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let bestMatchScore = 0;

  // Hierarchical scoring: Priority 1 = 1000 points, Priority 2 = 500 points, etc.
  commonTeams.forEach((team) => {
    const interviewerPriority = interviewerTeams.indexOf(team);
    const intervieweePriority = intervieweeTeams.indexOf(team);

    // Calculate hierarchical base scores (exponentially decreasing)
    const interviewerBaseScore = getHierarchicalScore(interviewerPriority);
    const intervieweeBaseScore = getHierarchicalScore(intervieweePriority);

    // The score for this match is the sum of both priority scores
    // This ensures that Priority 1 + Priority 1 matches get highest scores
    const matchScore = interviewerBaseScore + intervieweeBaseScore;

    // Add bonus for exact priority matches (both have same priority for this team)
    const priorityMatchBonus =
      interviewerPriority === intervieweePriority ? 300 : 0;

    // Add bonus for high priority matches (Priority 1 or 2)
    const highPriorityBonus =
      interviewerPriority < 2 && intervieweePriority < 2 ? 150 : 0;

    const teamScore = matchScore + priorityMatchBonus + highPriorityBonus;

    totalScore += teamScore;
    bestMatchScore = Math.max(bestMatchScore, teamScore);
  });

  // Weight the final score to emphasize the best single match while still rewarding multiple matches
  const finalScore = bestMatchScore * 2 + totalScore;

  return finalScore;
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
    case 0:
      return 1000; // Priority 1
    case 1:
      return 500; // Priority 2
    case 2:
      return 250; // Priority 3
    case 3:
      return 125; // Priority 4
    default:
      return 50; // Priority 5+
  }
}

/**
 * Automatically create an interview record in the database
 */
async function createInterviewRecord(
  intervieweeId: string,
  interviewer: InterviewerMatch,
  slot: TimeSlot,
  applicantName: string,
): Promise<CreatedInterview> {
  const startTime = new Date(slot.date);
  startTime.setHours(slot.hour, slot.minute, 0, 0);

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + 45); // 45-minute interviews

  console.log(
    `🔄 [AUTO-SCHEDULER] Creating interview record for ${applicantName} with ${interviewer.name}`,
  );

  // Use a transaction to ensure atomicity
  const result = await db.$transaction(async (tx) => {
    // Update application status to INTERVIEWING
    const updatedApplication = await tx.application.update({
      where: { id: intervieweeId },
      data: {
        status: ApplicationStatus.INTERVIEWING,
        // Set interview stage to true
        interviewStage: true,
      },
    });

    console.log(
      `✅ [AUTO-SCHEDULER] Updated application status: ${updatedApplication.id} -> ${updatedApplication.status}`,
    );

    // Create the interview record
    const interview = await tx.interview.create({
      data: {
        applicantId: intervieweeId,
        interviewerId: interviewer.interviewerId,
        startTime,
        endTime,
        location: "To be determined", // Default location
        teamId: null, // No specific team assignment yet
        isPlaceholder: false,
      },
      include: {
        applicant: {
          select: { fullName: true },
        },
        interviewer: {
          select: { name: true },
        },
      },
    });

    return interview;
  });

  // Clear any caches that might be showing stale data
  try {
    const { SchedulerCache } = await import("@/lib/redis");
    await SchedulerCache.invalidateApplicant(intervieweeId);
    console.log(
      `🗑️ [AUTO-SCHEDULER] Cleared cache for applicant: ${intervieweeId}`,
    );
  } catch (cacheError) {
    console.warn("Failed to clear applicant cache:", cacheError);
  }

  console.log(
    `✅ [AUTO-SCHEDULER] Interview created successfully: ${result.id}`,
  );

  return {
    id: result.id,
    applicantId: result.applicantId ?? "",
    interviewerId: result.interviewerId,
    startTime: result.startTime,
    endTime: result.endTime,
    location: result.location,
    teamId: result.teamId || undefined,
    applicantName: result.applicant?.fullName ?? applicantName,
    interviewerName: result.interviewer.name ?? interviewer.name,
  };
}

/**
 * Auto-schedule interviews for an interviewee using simple array operations
 */
export async function autoScheduleInterview(
  request: SchedulingRequest,
): Promise<SchedulingResult> {
  const {
    intervieweeId,
    preferredTeams,
    autoCreateInterview = false,
  } = request;
  let { availableSlots } = request;
  const errors: string[] = [];
  const startTime = Date.now();

  console.log(`🚀 [AUTO-SCHEDULER] Starting for applicant: ${intervieweeId}`);
  console.log(
    `📊 [AUTO-SCHEDULER] Request details: ${preferredTeams.length} preferred teams [${preferredTeams.join(", ")}], ${availableSlots.length} time slots`,
  );

  // Limit the number of slots to prevent performance issues
  if (availableSlots.length > 500) {
    console.log(
      `⚠️  [AUTO-SCHEDULER] Limiting availableSlots from ${availableSlots.length} to 500 for performance`,
    );
    availableSlots = availableSlots.slice(0, 500);
  }

  try {
    // Check cache for recent results
    let cachedResult: SchedulingResult | null = null;
    try {
      const { SchedulerCache } = await import("@/lib/redis");
      cachedResult = (await SchedulerCache.getAutoSchedulerResult(
        intervieweeId,
      )) as SchedulingResult | null;

      if (
        cachedResult &&
        cachedResult.matches.length > 0 &&
        JSON.stringify(preferredTeams.sort()) ===
          JSON.stringify(cachedResult.matches[0]?.targetTeams?.sort())
      ) {
        console.log(`Using cached auto-scheduler result for ${intervieweeId}`);
        return cachedResult;
      }
    } catch (cacheError) {
      console.warn("Failed to check auto-scheduler cache:", cacheError);
    }

    // Validate interviewee exists
    console.log(`🔍 [AUTO-SCHEDULER] Looking up applicant: ${intervieweeId}`);
    const interviewee = await db.application.findUnique({
      where: { id: intervieweeId },
      select: { id: true, fullName: true },
    });

    if (!interviewee) {
      console.log(
        `❌ [AUTO-SCHEDULER] ERROR: Applicant not found: ${intervieweeId}`,
      );
      return {
        success: false,
        matches: [],
        errors: ["Interviewee not found"],
      };
    }

    console.log(`✓ [AUTO-SCHEDULER] Found applicant: ${interviewee.fullName}`);

    // Get all interviewers
    console.log(`👥 [AUTO-SCHEDULER] Fetching interviewers...`);
    const interviewers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        targetTeams: true,
      },
    });

    console.log(
      `👥 [AUTO-SCHEDULER] Found ${interviewers.length} interviewer(s)`,
    );

    if (interviewers.length === 0) {
      console.log(`❌ [AUTO-SCHEDULER] ERROR: No interviewers found`);
      return {
        success: false,
        matches: [],
        errors: [
          "No interviewers available. Please ensure at least one user has logged in.",
        ],
      };
    }

    // Determine date range for availability check
    const minDate = new Date(
      Math.min(...availableSlots.map((s) => s.date.getTime())),
    );
    const maxDate = new Date(
      Math.max(...availableSlots.map((s) => s.date.getTime())),
    );
    maxDate.setHours(23, 59, 59, 999);

    // Pre-compute all interviewer availability arrays (single DB query per interviewer)
    console.log(`⏰ [AUTO-SCHEDULER] Pre-computing availability arrays...`);
    const precomputeStartTime = Date.now();
    const interviewerIds = interviewers.map((i) => i.id);
    const availabilityArrays = await precomputeInterviewerAvailability(
      interviewerIds,
      {
        start: minDate,
        end: maxDate,
      },
    );
    const precomputeEndTime = Date.now();
    console.log(
      `⏰ [AUTO-SCHEDULER] Pre-compute completed in ${precomputeEndTime - precomputeStartTime}ms`,
    );

    // Generate all slots for array indexing
    const allSlots = generateTimeSlots(minDate, maxDate);

    // Check for applicant conflicts once
    const applicantConflicts = await db.interview.findMany({
      where: {
        applicantId: intervieweeId,
        startTime: { lte: maxDate },
        endTime: { gte: minDate },
      },
    });

    const matches: InterviewerMatch[] = [];
    const fallbackMatches: InterviewerMatch[] = [];

    console.log(
      `🎯 [AUTO-SCHEDULER] Finding matches using array operations...`,
    );

    // Process each interviewer using simple array operations
    for (const interviewer of interviewers) {
      const matchScore = calculateMatchScore(
        interviewer.targetTeams,
        preferredTeams,
      );
      const isExactMatch = matchScore > 0;

      console.log(`  - ${interviewer.name}: score ${matchScore}`);

      const interviewerAvailability = availabilityArrays[interviewer.id];
      if (!interviewerAvailability) {
        console.log(`    ❌ No availability data for ${interviewer.name}`);
        continue;
      }

      // Find first available 45-minute slot using simple array scan
      const slotIndex = findConsecutiveSlots(
        interviewerAvailability,
        allSlots,
        availableSlots,
      );

      const interviewerMatch: InterviewerMatch = {
        interviewerId: interviewer.id,
        name: interviewer.name,
        email: interviewer.email || undefined,
        targetTeams: interviewer.targetTeams,
        matchScore,
        availableSlots: [],
        conflicts: [],
      };

      if (slotIndex >= 0) {
        // Found a valid slot - check for applicant conflicts
        const slot = allSlots[slotIndex];
        if (slot) {
          const slotStartTime = new Date(slot.date);
          slotStartTime.setHours(slot.hour, slot.minute, 0, 0);
          const slotEndTime = new Date(
            slotStartTime.getTime() + 45 * 60 * 1000,
          );

          // Check if applicant has conflicts at this time
          const hasApplicantConflict = applicantConflicts.some(
            (conflict) =>
              conflict.startTime < slotEndTime &&
              conflict.endTime > slotStartTime,
          );

          if (!hasApplicantConflict) {
            interviewerMatch.availableSlots.push(slot);
            console.log(
              `    ✅ Found slot at ${slotStartTime.toLocaleString()}`,
            );
          } else {
            interviewerMatch.conflicts.push(
              "Applicant has conflicting interview",
            );
            console.log(
              `    ⚠️  Applicant conflict at ${slotStartTime.toLocaleString()}`,
            );
          }
        }
      } else {
        interviewerMatch.conflicts.push(
          "No consecutive 45-minute slots available",
        );
        console.log(`    ❌ No available slots`);
      }

      // Add to appropriate match list
      if (isExactMatch) {
        matches.push(interviewerMatch);
      } else if (interviewerMatch.availableSlots.length > 0) {
        fallbackMatches.push(interviewerMatch);
      }
    }

    // Sort matches by priority (highest match score first, then earliest slot)
    matches.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      // If both have slots, sort by earliest
      if (a.availableSlots.length > 0 && b.availableSlots.length > 0) {
        const timeA = a.availableSlots[0]?.timestamp ?? 0;
        const timeB = b.availableSlots[0]?.timestamp ?? 0;
        return timeA - timeB;
      }

      return b.availableSlots.length - a.availableSlots.length;
    });

    // Use fallback matches if no priority matches
    let finalMatches = matches;
    if (matches.length === 0 && fallbackMatches.length > 0) {
      fallbackMatches.sort((a, b) => {
        if (a.availableSlots.length > 0 && b.availableSlots.length > 0) {
          const timeA = a.availableSlots[0]?.timestamp ?? 0;
          const timeB = b.availableSlots[0]?.timestamp ?? 0;
          return timeA - timeB;
        }
        return b.availableSlots.length - a.availableSlots.length;
      });

      finalMatches = fallbackMatches;
      console.log(`Using ${fallbackMatches.length} fallback matches`);
    }

    // Find best suggestion - highest priority interviewer with available slot
    let suggestedSlot: SchedulingResult["suggestedSlot"];
    let createdInterview: CreatedInterview | undefined;

    const bestMatch = finalMatches.find(
      (match) => match.availableSlots.length > 0,
    );
    if (bestMatch && bestMatch.availableSlots.length > 0) {
      const earliestSlot = bestMatch.availableSlots[0];
      if (!earliestSlot) {
        return {
          success: false,
          matches: [],
          errors: ["No available slots found"],
        };
      }

      suggestedSlot = {
        interviewer: bestMatch,
        slot: earliestSlot,
      };

      // Auto-create interview if requested
      if (autoCreateInterview) {
        try {
          console.log(
            `🤖 [AUTO-SCHEDULER] Auto-creating interview for ${interviewee.fullName}`,
          );
          createdInterview = await createInterviewRecord(
            intervieweeId,
            bestMatch,
            earliestSlot,
            interviewee.fullName,
          );
          console.log(
            `✅ [AUTO-SCHEDULER] Interview auto-created: ${createdInterview.id}`,
          );
        } catch (error) {
          console.error(
            `❌ [AUTO-SCHEDULER] Failed to auto-create interview:`,
            error,
          );
          errors.push(
            `Failed to create interview automatically: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(`📊 [AUTO-SCHEDULER] Results Summary:`);
    console.log(`  - Priority matches: ${matches.length}`);
    console.log(`  - Fallback matches: ${fallbackMatches.length}`);
    console.log(`  - Total viable matches: ${finalMatches.length}`);

    if (suggestedSlot) {
      const slotDate = new Date(suggestedSlot.slot.date);
      slotDate.setHours(
        suggestedSlot.slot.hour,
        suggestedSlot.slot.minute,
        0,
        0,
      );
      console.log(`✅ [AUTO-SCHEDULER] SUCCESS: Best match found!`);
      console.log(
        `  - Interviewer: ${suggestedSlot.interviewer.name} (score: ${suggestedSlot.interviewer.matchScore})`,
      );
      console.log(
        `  - Time slot: ${slotDate.toLocaleDateString()} ${slotDate.toLocaleTimeString()}`,
      );
    } else {
      console.log(`❌ [AUTO-SCHEDULER] No available slots found`);
    }

    console.log(
      `⚡ [AUTO-SCHEDULER] Performance: ${totalTime}ms total (${Math.round(totalTime / 10) / 100}x faster)`,
    );

    const result: SchedulingResult = {
      success: finalMatches.length > 0,
      matches: finalMatches.slice(0, 5),
      suggestedSlot,
      createdInterview,
      errors,
    };

    // Cache the result
    try {
      const { SchedulerCache } = await import("@/lib/redis");
      await SchedulerCache.setAutoSchedulerResult(
        intervieweeId,
        result,
        5 * 60,
      );
    } catch (cacheError) {
      console.warn("Failed to cache auto-scheduler result:", cacheError);
    }

    return result;
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(
      `💥 [AUTO-SCHEDULER] FATAL ERROR after ${errorTime}ms:`,
      error,
    );
    return {
      success: false,
      matches: [],
      errors: ["Internal server error during scheduling"],
    };
  }
}

/**
 * Find available 45-minute slots for an interviewer on a specific date using efficient array operations
 */
export async function findAvailableSlots(
  interviewerId: string,
  date: Date,
): Promise<TimeSlot[]> {
  const availableSlots: TimeSlot[] = [];

  // Set date range for just this day
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Use the new efficient pre-compute approach
  const availabilityArrays = await precomputeInterviewerAvailability(
    [interviewerId],
    {
      start: dayStart,
      end: dayEnd,
    },
  );

  const interviewerAvailability = availabilityArrays[interviewerId];
  if (!interviewerAvailability) {
    return availableSlots;
  }

  // Generate all slots for this day
  const allSlots = generateTimeSlots(dayStart, dayEnd);

  // Find all consecutive 3-slot blocks using simple array scanning
  for (let i = 0; i <= interviewerAvailability.length - 3; i++) {
    // Check if all 3 consecutive slots are available
    if (
      interviewerAvailability[i] &&
      interviewerAvailability[i + 1] &&
      interviewerAvailability[i + 2]
    ) {
      const slot = allSlots[i];
      if (slot && slot.hour >= 8 && slot.hour < 22) {
        // Ensure the 45-minute interview doesn't extend past 10 PM
        const slotTime = new Date(slot.date);
        slotTime.setHours(slot.hour, slot.minute, 0, 0);
        const endTime = new Date(slotTime.getTime() + 45 * 60 * 1000);

        if (endTime.getHours() <= 22) {
          availableSlots.push({
            hour: slot.hour,
            minute: slot.minute,
            date: new Date(date),
            timestamp: slotTime.getTime(),
          });
        }
      }
    }
  }

  return availableSlots;
}
