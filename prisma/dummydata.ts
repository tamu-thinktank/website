import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Generate unique identifiers
function generateUniqueEmail(existingEmails: Set<string>, domain = 'tamu.edu'): string {
  let email: string
  do {
    const username = faker.internet.userName() + Math.floor(Math.random() * 1000)
    email = `${username}@${domain}`
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

async function createDummyUsers(numUsers = 8) {
  console.log(`Creating ${numUsers} dummy users...`)
  const existingEmails = new Set<string>()
  
  for (let i = 0; i < numUsers; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: generateUniqueEmail(existingEmails),
        emailVerified: Math.random() > 0.5 ? faker.date.recent() : null,
        image: faker.image.avatar(),
      },
    })
  }
  
  console.log(`✓ Created ${numUsers} users`)
}

async function createDummyTeamsAndResearchAreas() {
  console.log('Creating teams and research areas...')
  
  const teamsData = [
    { id: 'team_tsgc', name: 'TSGC', researchAreas: ['Propulsion Systems', 'Aerodynamics', 'Structures'] },
    { id: 'team_aiaa', name: 'AIAA', researchAreas: ['Flight Dynamics', 'Avionics', 'Mission Design'] },
  ]
  
  for (const teamData of teamsData) {
    await prisma.team.upsert({
      where: { id: teamData.id },
      update: { name: teamData.name },
      create: {
        id: teamData.id,
        name: teamData.name,
        researchAreas: {
          create: teamData.researchAreas.map(areaName => ({
            name: areaName,
          })),
        },
      },
    })
  }
  
  console.log('✓ Created teams and research areas')
}

async function createDummyApplications(numApplications = 25) {
  console.log(`Creating ${numApplications} dummy applications...`)
  
  const existingEmails = new Set<string>()
  const existingUINs = new Set<number>()
  
  // Get team and research area IDs for preferences
  const teams = await prisma.team.findMany({ include: { researchAreas: true } })
  const teamIds = teams.map(t => t.id)
  const researchAreaIds = teams.flatMap(t => t.researchAreas.map(ra => ra.id))
  
  const applicationTypes = ['DCMEMBER', 'OFFICER', 'MATEROV', 'MINIDC'] as const
  const years = ['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'GRADUATE'] as const
  const majors = ['ENGR', 'OPEN', 'AERO', 'BAEN', 'BMEN', 'CHEN', 'CPEN', 'CSCE', 'CVEN', 'ELEN', 'EVEN', 'ETID', 'ISEN', 'MSEN', 'MEEN', 'MMET', 'MXET', 'NUEN', 'OCEN', 'PETE', 'OTHER'] as const
  const statuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'REJECTED_APP', 'REJECTED_INT', 'INTERVIEWING'] as const
  const interestLevels = ['HIGH', 'MEDIUM', 'LOW'] as const
  const referralSources = ['MSC_OPEN_HOUSE', 'ESO_OPEN_HOUSE', 'MULTISECTION', 'REFERRAL', 'INSTAGRAM', 'FLYERS'] as const
  
  for (let i = 0; i < numApplications; i++) {
    const appType = faker.helpers.arrayElement(applicationTypes)
    const fullName = faker.person.fullName()
    
    // Create the main application
    const application = await prisma.application.create({
      data: {
        applicationType: appType,
        fullName: fullName,
        preferredName: Math.random() > 0.5 ? faker.person.firstName() : null,
        pronouns: Math.random() > 0.5 ? faker.helpers.arrayElement(['he/him', 'she/her', 'they/them']) : null,
        gender: Math.random() > 0.5 ? faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']) : null,
        uin: generateUniqueUIN(existingUINs),
        email: generateUniqueEmail(existingEmails),
        altEmail: Math.random() > 0.5 ? generateUniqueEmail(existingEmails, 'gmail.com') : null,
        phone: faker.phone.number(),
        year: faker.helpers.arrayElement(years),
        major: faker.helpers.arrayElement(majors),
        currentClasses: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => 
          `${faker.lorem.word().toUpperCase()} ${faker.number.int({ min: 100, max: 499 })}`
        ),
        nextClasses: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => 
          `${faker.lorem.word().toUpperCase()} ${faker.number.int({ min: 100, max: 499 })}`
        ),
        meetings: faker.datatype.boolean(),
        weeklyCommitment: faker.datatype.boolean(),
        referral: faker.helpers.arrayElements(referralSources, { min: 1, max: 3 }),
        firstQuestion: faker.lorem.paragraph({ min: 3, max: 8 }).substring(0, 250),
        secondQuestion: faker.lorem.paragraph({ min: 3, max: 8 }).substring(0, 250),
        thirdQuestion: faker.lorem.paragraph({ min: 3, max: 8 }).substring(0, 250),
        resumeId: faker.string.uuid(),
        signatureCommitment: Math.random() > 0.5 ? fullName : null,
        signatureAccountability: Math.random() > 0.5 ? fullName : null,
        signatureQuality: Math.random() > 0.5 ? fullName : null,
        status: faker.helpers.arrayElement(statuses),
        
        // Officer-specific fields
        summerPlans: appType === 'OFFICER' ? faker.lorem.paragraph({ min: 2, max: 5 }).substring(0, 100) : null,
        officerCommitment: appType === 'OFFICER' ? faker.helpers.arrayElement(['YES', 'PARTIAL', 'NO']) : null,
        
        // MATEROV-specific fields
        previousParticipation: appType === 'MATEROV' ? faker.datatype.boolean() : null,
      },
    })
    
    // Add team preferences
    if (teamIds.length > 0) {
      const numTeamPrefs = faker.number.int({ min: 1, max: Math.min(3, teamIds.length) })
      const selectedTeams = faker.helpers.arrayElements(teamIds, numTeamPrefs)
      
      for (const teamId of selectedTeams) {
        await prisma.teamPreference.create({
          data: {
            teamId: teamId,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        })
      }
    }
    
    // Add research preferences
    if (researchAreaIds.length > 0) {
      const numResearchPrefs = faker.number.int({ min: 1, max: Math.min(4, researchAreaIds.length) })
      const selectedResearch = faker.helpers.arrayElements(researchAreaIds, numResearchPrefs)
      
      for (const researchId of selectedResearch) {
        await prisma.researchPreference.create({
          data: {
            researchAreaId: researchId,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        })
      }
    }
    
    // Add commitments
    const commitmentTypes = ['CURRENT', 'PLANNED'] as const
    const numCommitments = faker.number.int({ min: 0, max: 3 })
    
    for (let j = 0; j < numCommitments; j++) {
      const commitmentName = faker.company.name()
      const commitmentType = faker.helpers.arrayElement(commitmentTypes)
      
      await prisma.commitment.create({
        data: {
          name: commitmentName,
          hours: faker.number.int({ min: 1, max: 15 }),
          type: commitmentType,
          applicantId: application.id,
        },
      })
    }
    
    // Add officer position preferences (for officer applications)
    if (appType === 'OFFICER') {
      const officerPositions = ['VICE_PRESIDENT', 'PROJECT_MANAGER', 'MARKETING_SPECIALIST', 'GRAPHIC_DESIGNER', 'WEB_DEV_LEAD', 'TREASURER', 'DC_PROGRAM_MANAGER'] as const
      const numPositionPrefs = faker.number.int({ min: 1, max: 3 })
      const selectedPositions = faker.helpers.arrayElements(officerPositions, numPositionPrefs)
      
      for (const position of selectedPositions) {
        await prisma.positionPreference.create({
          data: {
            position: position,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        })
      }
    }
    
    // Add MATEROV-specific data
    if (appType === 'MATEROV') {
      // Subteam preferences
      const subteams = ['Mechanical', 'Electrical', 'Programming', 'Controls', 'Marketing']
      const numSubteamPrefs = faker.number.int({ min: 1, max: 3 })
      const selectedSubteams = faker.helpers.arrayElements(subteams, numSubteamPrefs)
      
      for (const subteam of selectedSubteams) {
        await prisma.subteamPreference.create({
          data: {
            name: subteam,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        })
      }
      
      // Skills
      const skills = ['CAD Design', 'Programming', 'Electronics', 'Mechanical Assembly', 'Project Management']
      const experienceLevels = ['UNFAMILIAR', 'MARGINAL', 'COMFORTABLE', 'EXPERT'] as const
      const numSkills = faker.number.int({ min: 2, max: 5 })
      const selectedSkills = faker.helpers.arrayElements(skills, numSkills)
      
      for (const skill of selectedSkills) {
        await prisma.skill.create({
          data: {
            name: skill,
            experienceLevel: faker.helpers.arrayElement(experienceLevels),
            applicantId: application.id,
          },
        })
      }
      
      // Learning interests
      const learningAreas = ['Robotics', 'AI/ML', 'Embedded Systems', 'Mechanical Design', 'Business']
      const learningInterestLevels = ['NOT_INTERESTED', 'MILD', 'MODERATE', 'STRONG', 'MOST_INTERESTED'] as const
      const numLearning = faker.number.int({ min: 2, max: 4 })
      const selectedLearning = faker.helpers.arrayElements(learningAreas, numLearning)
      
      for (const area of selectedLearning) {
        await prisma.learningInterest.create({
          data: {
            area: area,
            interestLevel: faker.helpers.arrayElement(learningInterestLevels),
            applicantId: application.id,
          },
        })
      }
    }
  }
  
  console.log(`✓ Created ${numApplications} applications with related data`)
}

async function createDummyAvailability() {
  console.log('Creating dummy availability data...')
  
  // Get application and user IDs
  const applications = await prisma.application.findMany()
  const users = await prisma.user.findMany()
  
  // Create applicant availability
  for (const app of applications) {
    const numTimes = faker.number.int({ min: 5, max: 15 })
    
    for (let i = 0; i < numTimes; i++) {
      const baseTime = faker.date.future({ days: 14 })
      baseTime.setMinutes(0, 0, 0) // Round to nearest hour
      baseTime.setHours(faker.number.int({ min: 9, max: 17 })) // Business hours
      
      const gridTime = baseTime.toISOString()
      
      await prisma.applicantTime.create({
        data: {
          gridTime: gridTime,
          applicantId: app.id,
        },
      }).catch(() => {}) // Ignore conflicts
    }
  }
  
  // Create officer availability
  const availabilityTypes = ['AVAILABLE', 'BUSY'] as const
  
  for (const user of users) {
    const numTimes = faker.number.int({ min: 10, max: 25 })
    
    for (let i = 0; i < numTimes; i++) {
      const baseTime = faker.date.future({ days: 14 })
      baseTime.setMinutes(0, 0, 0)
      baseTime.setHours(faker.number.int({ min: 8, max: 18 }))
      
      const gridTime = baseTime.toISOString()
      const selectedAt = new Date().toISOString()
      const availabilityType = faker.helpers.arrayElement(availabilityTypes)
      
      await prisma.officerTime.create({
        data: {
          gridTime: gridTime,
          officerId: user.id,
          selectedAt: selectedAt,
          type: availabilityType,
          isRecurring: faker.datatype.boolean(),
          reason: availabilityType === 'BUSY' ? faker.lorem.sentence() : null,
        },
      }).catch(() => {}) // Ignore conflicts
    }
  }
  
  console.log('✓ Created availability data')
}

async function main() {
  console.log('Starting dummy data creation...')
  
  try {
    // Create data in order of dependencies
    await createDummyUsers(8)
    await createDummyTeamsAndResearchAreas()
    await createDummyApplications(25)
    await createDummyAvailability()
    
    console.log('\n✅ All dummy data created successfully!')
    console.log('\nSummary:')
    console.log('- 8 officers (users)')
    console.log('- 2 teams with research areas')
    console.log('- 25 applications with preferences, commitments, and related data')
    console.log('- Availability data for both applicants and officers')
    
  } catch (error) {
    console.error('❌ Error creating dummy data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('dummydata.ts')) {
  main().catch(console.error)
}