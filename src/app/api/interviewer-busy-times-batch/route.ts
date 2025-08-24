import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

// Schema for batch busy time operations
const BatchBusyTimeOperation = z.object({
  operation: z.enum(['create', 'delete']),
  interviewerId: z.string().cuid(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  reason: z.string().optional()
})

const BatchBusyTimeSchema = z.object({
  operations: z.array(BatchBusyTimeOperation)
})

// POST: Batch process busy time operations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = BatchBusyTimeSchema.parse(body)
    
    const results: any[] = []
    const errors: any[] = []
    
    // Process operations in a transaction for consistency
    await db.$transaction(async (tx) => {
      for (const [index, operation] of validatedData.operations.entries()) {
        try {
          const { operation: op, interviewerId, startTime, endTime, reason } = operation
          
          if (op === 'create') {
            if (!startTime || !endTime) {
              errors.push({
                index,
                operation,
                error: "Start time and end time are required for create operations"
              })
              continue
            }
            
            // Validate time range
            const start = new Date(startTime)
            const end = new Date(endTime)
            
            if (start >= end) {
              errors.push({
                index,
                operation,
                error: "End time must be after start time"
              })
              continue
            }
            
            // Check if interviewer exists
            const interviewer = await tx.user.findUnique({
              where: { id: interviewerId },
              select: { id: true, name: true }
            })
            
            if (!interviewer) {
              errors.push({
                index,
                operation,
                error: "Interviewer not found"
              })
              continue
            }
            
            // Check for overlapping busy times
            const overlapping = await tx.interviewerBusyTime.findMany({
              where: {
                interviewerId,
                OR: [
                  {
                    startTime: { lt: end },
                    endTime: { gt: start }
                  }
                ]
              }
            })
            
            if (overlapping.length > 0) {
              // Instead of erroring, try to merge or replace overlapping times
              // For now, we'll delete overlapping times and create the new one
              await tx.interviewerBusyTime.deleteMany({
                where: {
                  id: { in: overlapping.map(b => b.id) }
                }
              })
            }
            
            // Check for interview conflicts
            const conflictingInterviews = await tx.interview.findMany({
              where: {
                interviewerId,
                OR: [
                  {
                    startTime: { lt: end },
                    endTime: { gt: start }
                  }
                ]
              }
            })
            
            if (conflictingInterviews.length > 0) {
              errors.push({
                index,
                operation,
                error: "Busy time conflicts with existing interviews",
                conflicting: conflictingInterviews
              })
              continue
            }
            
            // Create the busy time
            const busyTime = await tx.interviewerBusyTime.create({
              data: {
                interviewerId,
                startTime: start,
                endTime: end,
                reason
              },
              include: {
                interviewer: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            })
            
            results.push({
              index,
              operation: 'create',
              success: true,
              data: busyTime
            })
            
          } else if (op === 'delete') {
            if (startTime && endTime) {
              // Delete specific time range
              const start = new Date(startTime)
              const end = new Date(endTime)
              
              const deleted = await tx.interviewerBusyTime.deleteMany({
                where: {
                  interviewerId,
                  OR: [
                    {
                      startTime: { gte: start },
                      endTime: { lte: end }
                    }
                  ]
                }
              })
              
              results.push({
                index,
                operation: 'delete',
                success: true,
                deleted: deleted.count
              })
            } else {
              // Delete all busy times for the interviewer
              const deleted = await tx.interviewerBusyTime.deleteMany({
                where: {
                  interviewerId
                }
              })
              
              results.push({
                index,
                operation: 'delete',
                success: true,
                deleted: deleted.count
              })
            }
          }
        } catch (operationError) {
          errors.push({
            index,
            operation,
            error: operationError instanceof Error ? operationError.message : 'Unknown error'
          })
        }
      }
    })
    
    return NextResponse.json({
      success: results.length > 0,
      processed: results.length,
      errorsCount: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error processing batch busy times:", error)
    return NextResponse.json(
      { error: "Failed to process batch busy times" },
      { status: 500 }
    )
  }
}

// PUT: Batch update busy times for specific time slots
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log("Batch API PUT request body:", body)
    
    // Schema for bulk time slot busy marking
    const BulkBusyTimeSchema = z.object({
      interviewerId: z.string().cuid(),
      timeSlots: z.array(z.object({
        date: z.string().datetime(),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59)
      })),
      markAsBusy: z.boolean(),
      reason: z.string().optional()
    })
    
    const validatedData = BulkBusyTimeSchema.parse(body)
    console.log("Validated data:", validatedData)
    const { interviewerId, timeSlots, markAsBusy, reason } = validatedData
    
    // Check if interviewer exists
    const interviewer = await db.user.findUnique({
      where: { id: interviewerId },
      select: { id: true, name: true }
    })
    
    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer not found" },
        { status: 404 }
      )
    }
    
    const results: any[] = []
    
    // Process in smaller batches to avoid transaction timeouts
    const BATCH_SIZE = 400; // Process max 400 slots at a time
    
    for (let i = 0; i < timeSlots.length; i += BATCH_SIZE) {
      const batch = timeSlots.slice(i, i + BATCH_SIZE);
      
      await db.$transaction(async (tx) => {
        if (markAsBusy) {
          // Mark time slots as busy by creating busy time entries
          for (const slot of batch) {
            const slotTime = new Date(slot.date)
            slotTime.setHours(slot.hour, slot.minute, 0, 0)
            const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000) // 15-minute slots
            
            // Check if this exact slot is already marked as busy
            const existing = await tx.interviewerBusyTime.findFirst({
              where: {
                interviewerId,
                startTime: { lte: slotTime },
                endTime: { gte: slotEndTime }
              }
            })
            
            if (!existing) {
              const busyTime = await tx.interviewerBusyTime.create({
                data: {
                  interviewerId,
                  startTime: slotTime,
                  endTime: slotEndTime,
                  reason: reason ?? 'Busy'
                }
              })
              
              results.push({
                slot,
                operation: 'marked_busy',
                busyTimeId: busyTime.id
              })
            } else {
              results.push({
                slot,
                operation: 'already_busy',
                busyTimeId: existing.id
              })
            }
          }
        } else {
          // Mark time slots as available by removing busy time entries
          for (const slot of batch) {
            const slotTime = new Date(slot.date)
            slotTime.setHours(slot.hour, slot.minute, 0, 0)
            const slotEndTime = new Date(slotTime.getTime() + 15 * 60 * 1000)
            
            const deleted = await tx.interviewerBusyTime.deleteMany({
              where: {
                interviewerId,
                startTime: { lte: slotTime },
                endTime: { gte: slotEndTime }
              }
            })
            
            results.push({
              slot,
              operation: 'marked_available',
              deleted: deleted.count
            })
          }
        }
      }, {
        timeout: 10000, // 10 second timeout per batch
      })
    }
    
    return NextResponse.json({
      success: true,
      interviewerId,
      interviewer: interviewer.name,
      processed: timeSlots.length,
      operation: markAsBusy ? 'marked_busy' : 'marked_available',
      results
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors)
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error bulk updating busy times:", error)
    return NextResponse.json(
      { 
        error: "Failed to bulk update busy times",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}