import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Generate unique identifiers quickly
function generateUniqueEmail(existingEmails: Set<string>): string {
  let email: string
  do {
    const username = faker.internet.userName() + Math.floor(Math.random() * 1000)
    email = `${username}@tamu.edu`
  } while (existingEmails.has(email))
  
  existingEmails.add(email)
  return email
}

function generateUniqueUIN(existingUINs: Set<number>): number {
  let uin: number
  do {
    uin = Math.floor(Math.random() * 900000000) + 100000000 // 9-digit number
  } while (existingUINs.has(uin))
  
  existingUINs.add(uin)
  return uin
}

async function createTestApplications() {
  console.log('Creating test applications focused on INTERVIEWING status...')
  
  const existingEmails = new Set<string>()
  const existingUINs = new Set<number>()
  
  const years = ['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR'] as const
  const majors = ['AERO', 'MEEN', 'CSCE', 'ELEN', 'CVEN', 'CHEN'] as const
  
  // Create 15 applications: 10 INTERVIEWING, 3 PENDING, 2 others
  const applications: string[] = [
    ...Array(10).fill('INTERVIEWING') as string[],
    ...Array(3).fill('PENDING') as string[], 
    ...Array(2).fill('ACCEPTED') as string[]
  ]
  
  for (const status of applications) {
    const fullName = faker.person.fullName()
    
    const application = await prisma.application.create({
      data: {
        applicationType: 'DCMEMBER',
        fullName: fullName,
        preferredName: faker.person.firstName(),
        uin: generateUniqueUIN(existingUINs),
        email: generateUniqueEmail(existingEmails),
        phone: faker.phone.number(),
        year: faker.helpers.arrayElement(years),
        major: faker.helpers.arrayElement(majors),
        currentClasses: ['ENGR 489', 'MATH 251', 'PHYS 208'],
        nextClasses: ['ENGR 491', 'MATH 308'],
        meetings: true,
        weeklyCommitment: true,
        referral: ['MSC_OPEN_HOUSE'],
        firstQuestion: faker.lorem.paragraph(3),
        secondQuestion: faker.lorem.paragraph(3),
        thirdQuestion: faker.lorem.paragraph(3),
        resumeId: faker.string.uuid(),
        status: status as 'INTERVIEWING' | 'PENDING' | 'ACCEPTED',
      },
    })
    
    // Add availability for INTERVIEWING applicants
    if (status === 'INTERVIEWING') {
      // Add 5-10 available time slots in the next 7 days
      const numTimes = faker.number.int({ min: 5, max: 10 })
      
      for (let j = 0; j < numTimes; j++) {
        const baseTime = new Date()
        baseTime.setDate(baseTime.getDate() + faker.number.int({ min: 1, max: 7 }))
        baseTime.setHours(faker.number.int({ min: 9, max: 17 })) // 9 AM to 5 PM
        baseTime.setMinutes(faker.helpers.arrayElement([0, 15, 30, 45]))
        baseTime.setSeconds(0, 0)
        
        try {
          await prisma.applicantTime.create({
            data: {
              gridTime: baseTime.toISOString(),
              applicantId: application.id,
            },
          })
        } catch (error) {
          // Skip duplicates
        }
      }
    }
    
    console.log(`Created ${status} application: ${fullName}`)
  }
  
  console.log(`✅ Created ${applications.length} test applications`)
}

async function main() {
  try {
    await createTestApplications()
    
    const interviewingCount = await prisma.application.count({ 
      where: { status: 'INTERVIEWING' } 
    })
    
    console.log(`\n📊 Result: ${interviewingCount} applications with INTERVIEWING status`)
    
  } catch (error) {
    console.error('❌ Error creating test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)