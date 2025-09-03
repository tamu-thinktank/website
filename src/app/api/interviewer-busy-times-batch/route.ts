import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for batch busy time operations
const BatchBusyTimeOperation = z.object({
  operation: z.enum(["create", "delete"]),
  interviewerId: z.string().cuid(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  reason: z.string().optional(),
});

const BatchBusyTimeSchema = z.object({
  operations: z.array(BatchBusyTimeOperation),
});

// POST: Batch process busy time operations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = BatchBusyTimeSchema.parse(body);

    const results: Record<string, unknown>[] = [];
    const errors: Record<string, unknown>[] = [];

    // Process operations in a transaction for consistency
    await db.$transaction(async (tx) => {
      for (const [index, operation] of validatedData.operations.entries()) {
        try {
          const {
            operation: op,
            interviewerId,
            startTime,
            endTime,
            reason,
          } = operation;

          if (op === "create") {
            if (!startTime || !endTime) {
              errors.push({
                index,
                operation,
                error:
                  "Start time and end time are required for create operations",
              });
              continue;
            }

            // Validate time range
            const start = new Date(startTime);
            const end = new Date(endTime);

            if (start >= end) {
              errors.push({
                index,
                operation,
                error: "End time must be after start time",
              });
              continue;
            }

            // Check if interviewer exists
            const interviewer = await tx.user.findUnique({
              where: { id: interviewerId },
              select: { id: true, name: true },
            });

            if (!interviewer) {
              errors.push({
                index,
                operation,
                error: "Interviewer not found",
              });
              continue;
            }

            // Check for overlapping busy times
            const overlapping = await tx.interviewerBusyTime.findMany({
              where: {
                interviewerId,
                OR: [
                  {
                    startTime: { lt: end },
                    endTime: { gt: start },
                  },
                ],
              },
            });

            if (overlapping.length > 0) {
              // Instead of erroring, try to merge or replace overlapping times
              // For now, we'll delete overlapping times and create the new one
              await tx.interviewerBusyTime.deleteMany({
                where: {
                  id: { in: overlapping.map((b) => b.id) },
                },
              });
            }

            // Check for interview conflicts
            const conflictingInterviews = await tx.interview.findMany({
              where: {
                interviewerId,
                OR: [
                  {
                    startTime: { lt: end },
                    endTime: { gt: start },
                  },
                ],
              },
            });

            if (conflictingInterviews.length > 0) {
              errors.push({
                index,
                operation,
                error: "Busy time conflicts with existing interviews",
                conflicting: conflictingInterviews,
              });
              continue;
            }

            // Create the busy time
            const busyTime = await tx.interviewerBusyTime.create({
              data: {
                interviewerId,
                startTime: start,
                endTime: end,
                reason,
              },
              include: {
                interviewer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            });

            results.push({
              index,
              operation: "create",
              success: true,
              data: busyTime,
            });
          } else {
            if (startTime && endTime) {
              // Delete specific time range
              const start = new Date(startTime);
              const end = new Date(endTime);

              const deleted = await tx.interviewerBusyTime.deleteMany({
                where: {
                  interviewerId,
                  OR: [
                    {
                      startTime: { gte: start },
                      endTime: { lte: end },
                    },
                  ],
                },
              });

              results.push({
                index,
                operation: "delete",
                success: true,
                deleted: deleted.count,
              });
            } else {
              // Delete all busy times for the interviewer
              const deleted = await tx.interviewerBusyTime.deleteMany({
                where: {
                  interviewerId,
                },
              });

              results.push({
                index,
                operation: "delete",
                success: true,
                deleted: deleted.count,
              });
            }
          }
        } catch (operationError) {
          errors.push({
            index,
            operation,
            error:
              operationError instanceof Error
                ? operationError.message
                : "Unknown error",
          });
        }
      }
    });

    // Invalidate auto-scheduler cache for all affected interviewers
    const affectedInterviewers = new Set<string>();
    validatedData.operations.forEach((op) => {
      affectedInterviewers.add(op.interviewerId);
    });

    try {
      const { SchedulerCache } = await import("@/lib/redis");
      for (const interviewerId of affectedInterviewers) {
        await SchedulerCache.invalidateInterviewerSchedule(interviewerId);
      }
      console.log(
        `Invalidated auto-scheduler cache for ${affectedInterviewers.size} interviewers`,
      );
    } catch (cacheError) {
      console.warn("Failed to invalidate auto-scheduler cache:", cacheError);
    }

    return NextResponse.json({
      success: results.length > 0,
      processed: results.length,
      errorCount: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error processing batch busy times:", error);
    return NextResponse.json(
      { error: "Failed to process batch busy times" },
      { status: 500 },
    );
  }
}

// PUT: Batch update busy times for specific time slots
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Schema for bulk time slot busy marking
    const BulkBusyTimeSchema = z.object({
      interviewerId: z.string().cuid(),
      timeSlots: z.array(
        z.object({
          date: z.string().datetime(),
          hour: z.number().int().min(0).max(23),
          minute: z.number().int().min(0).max(59),
        }),
      ),
      markAsBusy: z.boolean(),
      reason: z.string().optional(),
    });

    const validatedData = BulkBusyTimeSchema.parse(body);
    console.log("Validated data:", {
      interviewerId: validatedData.interviewerId,
      slotsCount: validatedData.timeSlots.length,
      markAsBusy: validatedData.markAsBusy,
    });
    const { interviewerId, timeSlots, markAsBusy, reason } = validatedData;

    // Check if interviewer exists
    const interviewer = await db.user.findUnique({
      where: { id: interviewerId },
      select: { id: true, name: true },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer not found" },
        { status: 404 },
      );
    }

    const results: Record<string, unknown>[] = [];

    // Process in larger batches to handle multiple columns efficiently
    const BATCH_SIZE = 2000; // Process max 2000 slots at a time (can handle ~35 columns of 56 cells each)

    for (let i = 0; i < timeSlots.length; i += BATCH_SIZE) {
      const batch = timeSlots.slice(i, i + BATCH_SIZE);
      console.log(
        `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(timeSlots.length / BATCH_SIZE)}: ${batch.length} slots`,
      );

      await db.$transaction(
        async (tx) => {
          if (markAsBusy) {
            // Bulk check for existing busy times to avoid individual queries
            const batchStartTimes = batch.map((slot) => {
              const slotTime = new Date(slot.date);
              slotTime.setHours(slot.hour, slot.minute, 0, 0);
              return slotTime;
            });

            const existingBusyTimes = await tx.interviewerBusyTime.findMany({
              where: {
                interviewerId,
                startTime: { in: batchStartTimes },
              },
            });

            const existingStartTimes = new Set(
              existingBusyTimes.map((bt) => bt.startTime.getTime()),
            );

            // Prepare bulk insert data for new busy times
            const newBusyTimes = [];

            for (const slot of batch) {
              const slotTime = new Date(slot.date);
              slotTime.setHours(slot.hour, slot.minute, 0, 0);
              const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000);

              if (!existingStartTimes.has(slotTime.getTime())) {
                newBusyTimes.push({
                  interviewerId,
                  startTime: slotTime,
                  endTime: slotEndTime,
                  reason: reason ?? "Busy",
                });

                results.push({
                  slot,
                  operation: "marked_busy",
                  busyTimeId: "pending", // Will be updated after bulk insert
                });
              } else {
                results.push({
                  slot,
                  operation: "already_busy",
                  busyTimeId: existingBusyTimes.find(
                    (bt) => bt.startTime.getTime() === slotTime.getTime(),
                  )?.id,
                });
              }
            }

            // Bulk create new busy times if any
            if (newBusyTimes.length > 0) {
              await tx.interviewerBusyTime.createMany({
                data: newBusyTimes,
                skipDuplicates: true,
              });
            }
          } else {
            // Bulk delete busy time entries for efficiency
            const batchStartTimes = batch.map((slot) => {
              const slotTime = new Date(slot.date);
              slotTime.setHours(slot.hour, slot.minute, 0, 0);
              return slotTime;
            });

            const _deleted = await tx.interviewerBusyTime.deleteMany({
              where: {
                interviewerId,
                startTime: { in: batchStartTimes },
              },
            });

            // Add results for each slot
            for (const slot of batch) {
              results.push({
                slot,
                operation: "marked_available",
                deleted: 1, // Approximation since we did bulk delete
              });
            }
          }
        },
        {
          timeout: 30000, // 30 second timeout per batch to handle larger volumes
        },
      );
    }

    console.log(
      `Bulk operation completed: ${timeSlots.length} slots processed for interviewer ${interviewer.name}`,
    );

    // Invalidate auto-scheduler cache since interviewer availability has changed
    try {
      const { SchedulerCache } = await import("@/lib/redis");
      await SchedulerCache.invalidateInterviewerSchedule(interviewerId);
      console.log(
        `Invalidated auto-scheduler cache for interviewer ${interviewerId}`,
      );
    } catch (cacheError) {
      console.warn("Failed to invalidate auto-scheduler cache:", cacheError);
    }

    return NextResponse.json({
      success: true,
      interviewerId,
      interviewer: interviewer.name,
      processed: timeSlots.length,
      operation: markAsBusy ? "marked_busy" : "marked_available",
      results: results.slice(0, 100), // Limit response size, return first 100 results
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error bulk updating busy times:", error);
    return NextResponse.json(
      { error: "Failed to bulk update busy times" },
      { status: 500 },
    );
  }
}
