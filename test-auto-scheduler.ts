import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAutoScheduler() {
  try {
    console.log('🔍 Testing Auto-Scheduler Setup...\n')
    
    // 1. Check if we have interviewers (users)
    const interviewers = await prisma.user.findMany()
    console.log(`👥 Found ${interviewers.length} interviewers`)
    
    if (interviewers.length === 0) {
      console.log('❌ No interviewers found. Auto-scheduler needs at least one interviewer.')
      return
    }
    
    // 2. Check INTERVIEWING applicants
    const interviewingApplicants = await prisma.application.findMany({
      where: { status: 'INTERVIEWING' },
      include: {
        meetingTimes: true,
      }
    })
    
    console.log(`📝 Found ${interviewingApplicants.length} applications with INTERVIEWING status`)
    
    if (interviewingApplicants.length === 0) {
      console.log('❌ No applicants with INTERVIEWING status found.')
      return
    }
    
    // 3. Check applicant availability
    const applicantsWithAvailability = interviewingApplicants.filter(
      app => app.meetingTimes.length > 0
    )
    
    console.log(`⏰ ${applicantsWithAvailability.length} applicants have availability data`)
    
    // 4. Check interviewer busy times
    const busyTimes = await prisma.interviewerBusyTime.findMany()
    console.log(`🚫 Found ${busyTimes.length} interviewer busy time entries`)
    
    // 5. Show sample data
    if (applicantsWithAvailability.length > 0) {
      const sampleApplicant = applicantsWithAvailability[0]
      console.log(`\n📋 Sample applicant: ${sampleApplicant.fullName}`)
      console.log(`   - Available times: ${sampleApplicant.meetingTimes.length}`)
      console.log(`   - First availability: ${sampleApplicant.meetingTimes[0]?.gridTime}`)
    }
    
    if (interviewers.length > 0) {
      const sampleInterviewer = interviewers[0]
      console.log(`\n👤 Sample interviewer: ${sampleInterviewer.name}`)
      console.log(`   - Target teams: ${sampleInterviewer.targetTeams?.join(', ') || 'None'}`)
    }
    
    console.log('\n✅ Auto-scheduler setup looks good!')
    console.log('\n💡 Next steps:')
    console.log('1. Open http://localhost:3002/admin/scheduler')
    console.log('2. Test the context menu by clicking on time slots')
    console.log('3. Try the auto-scheduler with an INTERVIEWING applicant')
    
  } catch (error) {
    console.error('❌ Error testing auto-scheduler:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAutoScheduler()