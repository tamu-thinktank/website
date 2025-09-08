import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Generate unique identifiers
function generateUniqueEmail(
  existingEmails: Set<string>,
  domain = "tamu.edu",
): string {
  let email: string;
  do {
    const username =
      faker.internet.userName() + Math.floor(Math.random() * 1000);
    email = `${username}@${domain}`;
  } while (existingEmails.has(email));

  existingEmails.add(email);
  return email;
}

function generateUniqueUIN(existingUINs: Set<number>): number {
  let uin: number;
  do {
    uin = Math.floor(Math.random() * 900000000) + 100000000; // 9-digit number
  } while (existingUINs.has(uin));

  existingUINs.add(uin);
  return uin;
}

async function _createDummyUsers(numUsers = 8) {
  console.log(`Creating ${numUsers} dummy users...`);
  const existingEmails = new Set<string>();

  // Available teams for target assignment - broader set including specialties and positions
  const availableTeams = [
    "TSGC",
    "AIAA",
    "VICE_PRESIDENT",
    "PROJECT_MANAGER",
    "COMPUTATION_COMMUNICATIONS",
    "ELECTRICAL_POWER",
    "FLUIDS_PROPULSION",
    "GNC",
    "THERMAL_MECHANISMS_STRUCTURES",
    "MATE_ROV_LEADERSHIP",
  ] as const;

  for (let i = 0; i < numUsers; i++) {
    // Assign 1-2 target teams randomly
    const numTargetTeams = faker.number.int({ min: 1, max: 2 });
    const targetTeams = faker.helpers.arrayElements(
      availableTeams,
      numTargetTeams,
    );

    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: generateUniqueEmail(existingEmails),
        emailVerified: Math.random() > 0.5 ? faker.date.recent() : null,
        image: faker.image.avatar(),
        targetTeams: targetTeams,
      },
    });
  }

  console.log(`✓ Created ${numUsers} users`);
}

async function createDummyTeamsAndResearchAreas() {
  console.log("Creating teams and research areas...");

  const teamsData = [
    {
      id: "team_tsgc",
      name: "TSGC",
      researchAreas: ["Propulsion Systems", "Aerodynamics", "Structures"],
    },
    {
      id: "team_aiaa",
      name: "AIAA",
      researchAreas: ["Flight Dynamics", "Avionics", "Mission Design"],
    },
  ];

  for (const teamData of teamsData) {
    await prisma.team.upsert({
      where: { id: teamData.id },
      update: { name: teamData.name },
      create: {
        id: teamData.id,
        name: teamData.name,
        researchAreas: {
          create: teamData.researchAreas.map((areaName) => ({
            name: areaName,
          })),
        },
      },
    });
  }

  console.log("✓ Created teams and research areas");
}

async function createDummyApplications(numApplications = 25) {
  console.log(`Creating ${numApplications} dummy applications...`);

  const existingEmails = new Set<string>();
  const existingUINs = new Set<number>();

  // Get team and research area IDs for preferences
  const teams = await prisma.team.findMany({
    include: { researchAreas: true },
  });
  const teamIds = teams.map((t) => t.id);
  const researchAreaIds = teams.flatMap((t) =>
    t.researchAreas.map((ra) => ra.id),
  );

  const applicationTypes = [
    "DCMEMBER",
    "OFFICER",
    "MATEROV",
    "MINIDC",
  ] as const;
  const years = [
    "FRESHMAN",
    "SOPHOMORE",
    "JUNIOR",
    "SENIOR",
    "GRADUATE",
  ] as const;
  const majors = [
    "ENGR",
    "OPEN",
    "AERO",
    "BAEN",
    "BMEN",
    "CHEN",
    "CPEN",
    "CSCE",
    "CVEN",
    "ELEN",
    "EVEN",
    "ETID",
    "ISEN",
    "MSEN",
    "MEEN",
    "MMET",
    "MXET",
    "NUEN",
    "OCEN",
    "PETE",
    "OTHER",
  ] as const;
  // Weighted status distribution - more PENDING and INTERVIEWING for testing
  const getRandomStatus = () => {
    const rand = Math.random();
    if (rand < 0.4) return "PENDING"; // 40% pending
    if (rand < 0.7) return "INTERVIEWING"; // 30% interviewing
    if (rand < 0.8) return "ACCEPTED"; // 10% accepted
    if (rand < 0.9) return "REJECTED"; // 10% rejected
    if (rand < 0.95) return "REJECTED_APP"; // 5% rejected app
    return "REJECTED_INT"; // 5% rejected interview
  };
  const interestLevels = ["HIGH", "MEDIUM", "LOW"] as const;
  const referralSources = [
    "MSC_OPEN_HOUSE",
    "ESO_OPEN_HOUSE",
    "MULTISECTION",
    "REFERRAL",
    "INSTAGRAM",
    "FLYERS",
  ] as const;

  for (let i = 0; i < numApplications; i++) {
    const appType = faker.helpers.arrayElement(applicationTypes);
    const fullName = faker.person.fullName();

    // Create the main application
    const application = await prisma.application.create({
      data: {
        applicationType: appType,
        fullName: fullName,
        preferredName: Math.random() > 0.5 ? faker.person.firstName() : null,
        pronouns:
          Math.random() > 0.5
            ? faker.helpers.arrayElement(["he/him", "she/her", "they/them"])
            : null,
        gender:
          Math.random() > 0.5
            ? faker.helpers.arrayElement([
                "Male",
                "Female",
                "Non-binary",
                "Prefer not to say",
              ])
            : null,
        uin: generateUniqueUIN(existingUINs),
        email: generateUniqueEmail(existingEmails),
        altEmail:
          Math.random() > 0.5
            ? generateUniqueEmail(existingEmails, "gmail.com")
            : null,
        phone: faker.phone.number(),
        year: faker.helpers.arrayElement(years),
        major: faker.helpers.arrayElement(majors),
        currentClasses: Array.from(
          { length: faker.number.int({ min: 3, max: 6 }) },
          () =>
            `${faker.lorem.word().toUpperCase()} ${faker.number.int({ min: 100, max: 499 })}`,
        ),
        nextClasses: Array.from(
          { length: faker.number.int({ min: 3, max: 6 }) },
          () =>
            `${faker.lorem.word().toUpperCase()} ${faker.number.int({ min: 100, max: 499 })}`,
        ),
        meetings: faker.datatype.boolean(),
        weeklyCommitment: faker.datatype.boolean(),
        referral: faker.helpers.arrayElements(referralSources, {
          min: 1,
          max: 3,
        }),
        firstQuestion: faker.lorem
          .paragraph({ min: 3, max: 8 })
          .substring(0, 250),
        secondQuestion: faker.lorem
          .paragraph({ min: 3, max: 8 })
          .substring(0, 250),
        thirdQuestion: faker.lorem
          .paragraph({ min: 3, max: 8 })
          .substring(0, 250),
        resumeId: faker.string.uuid(),
        signatureCommitment: Math.random() > 0.5 ? fullName : null,
        signatureAccountability: Math.random() > 0.5 ? fullName : null,
        signatureQuality: Math.random() > 0.5 ? fullName : null,
        status: getRandomStatus(),

        // Officer-specific fields
        summerPlans:
          appType === "OFFICER"
            ? faker.lorem.paragraph({ min: 2, max: 5 }).substring(0, 100)
            : null,
        officerCommitment:
          appType === "OFFICER"
            ? faker.helpers.arrayElement(["YES", "PARTIAL", "NO"])
            : null,

        // MATEROV-specific fields
        previousParticipation:
          appType === "MATEROV" ? faker.datatype.boolean() : null,
      },
    });

    // Add team preferences
    if (teamIds.length > 0) {
      const numTeamPrefs = faker.number.int({
        min: 1,
        max: Math.min(3, teamIds.length),
      });
      const selectedTeams = faker.helpers.arrayElements(teamIds, numTeamPrefs);

      for (const teamId of selectedTeams) {
        await prisma.teamPreference.create({
          data: {
            teamId: teamId,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        });
      }
    }

    // Add research preferences
    if (researchAreaIds.length > 0) {
      const numResearchPrefs = faker.number.int({
        min: 1,
        max: Math.min(4, researchAreaIds.length),
      });
      const selectedResearch = faker.helpers.arrayElements(
        researchAreaIds,
        numResearchPrefs,
      );

      for (const researchId of selectedResearch) {
        await prisma.researchPreference.create({
          data: {
            researchAreaId: researchId,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        });
      }
    }

    // Add commitments
    const commitmentTypes = ["CURRENT", "PLANNED"] as const;
    const numCommitments = faker.number.int({ min: 0, max: 3 });

    for (let j = 0; j < numCommitments; j++) {
      const commitmentName = faker.company.name();
      const commitmentType = faker.helpers.arrayElement(commitmentTypes);

      await prisma.commitment.create({
        data: {
          name: commitmentName,
          hours: faker.number.int({ min: 1, max: 15 }),
          type: commitmentType,
          applicantId: application.id,
        },
      });
    }

    // Add officer position preferences (for officer applications)
    if (appType === "OFFICER") {
      const officerPositions = [
        "VICE_PRESIDENT",
        "PROJECT_MANAGER",
        "MARKETING_SPECIALIST",
        "GRAPHIC_DESIGNER",
        "WEB_DEV_LEAD",
        "TREASURER",
        "DC_PROGRAM_MANAGER",
      ] as const;
      const numPositionPrefs = faker.number.int({ min: 1, max: 3 });
      const selectedPositions = faker.helpers.arrayElements(
        officerPositions,
        numPositionPrefs,
      );

      for (const position of selectedPositions) {
        await prisma.positionPreference.create({
          data: {
            position: position,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        });
      }
    }

    // Add MATEROV-specific data
    if (appType === "MATEROV") {
      // Subteam preferences
      const subteams = [
        "Mechanical",
        "Electrical",
        "Programming",
        "Controls",
        "Marketing",
      ];
      const numSubteamPrefs = faker.number.int({ min: 1, max: 3 });
      const selectedSubteams = faker.helpers.arrayElements(
        subteams,
        numSubteamPrefs,
      );

      for (const subteam of selectedSubteams) {
        await prisma.subteamPreference.create({
          data: {
            name: subteam,
            interest: faker.helpers.arrayElement(interestLevels),
            applicantId: application.id,
          },
        });
      }

      // Skills
      const skills = [
        "CAD Design",
        "Programming",
        "Electronics",
        "Mechanical Assembly",
        "Project Management",
      ];
      const experienceLevels = [
        "UNFAMILIAR",
        "MARGINAL",
        "COMFORTABLE",
        "EXPERT",
      ] as const;
      const numSkills = faker.number.int({ min: 2, max: 5 });
      const selectedSkills = faker.helpers.arrayElements(skills, numSkills);

      for (const skill of selectedSkills) {
        await prisma.skill.create({
          data: {
            name: skill,
            experienceLevel: faker.helpers.arrayElement(experienceLevels),
            applicantId: application.id,
          },
        });
      }

      // Learning interests
      const learningAreas = [
        "Robotics",
        "AI/ML",
        "Embedded Systems",
        "Mechanical Design",
        "Business",
      ];
      const learningInterestLevels = [
        "NOT_INTERESTED",
        "MILD",
        "MODERATE",
        "STRONG",
        "MOST_INTERESTED",
      ] as const;
      const numLearning = faker.number.int({ min: 2, max: 4 });
      const selectedLearning = faker.helpers.arrayElements(
        learningAreas,
        numLearning,
      );

      for (const area of selectedLearning) {
        await prisma.learningInterest.create({
          data: {
            area: area,
            interestLevel: faker.helpers.arrayElement(learningInterestLevels),
            applicantId: application.id,
          },
        });
      }
    }
  }

  console.log(`✓ Created ${numApplications} applications with related data`);
}

async function createDummyAvailability() {
  console.log("Creating dummy availability data...");

  // Get application and user IDs
  const applications = await prisma.application.findMany();
  const users = await prisma.user.findMany();

  // Create applicant availability
  for (const app of applications) {
    const numTimes = faker.number.int({ min: 5, max: 15 });

    for (let i = 0; i < numTimes; i++) {
      const baseTime = faker.date.soon({ days: 14 });
      baseTime.setMinutes(0, 0, 0); // Round to nearest hour
      baseTime.setHours(faker.number.int({ min: 8, max: 21 })); // Business hours 8am-10pm

      const gridTime = baseTime.toISOString();

      await prisma.applicantTime
        .create({
          data: {
            gridTime: gridTime,
            applicantId: app.id,
          },
        })
        .catch(() => {}); // Ignore conflicts
    }
  }

  // Create officer availability (using updated schema) - reduced since default is now available
  for (const user of users) {
    const numTimes = faker.number.int({ min: 5, max: 15 }); // Reduced since default is available

    for (let i = 0; i < numTimes; i++) {
      const baseTime = faker.date.soon({ days: 14 });
      baseTime.setMinutes(0, 0, 0);
      baseTime.setHours(faker.number.int({ min: 8, max: 21 })); // Business hours 8am-10pm

      const gridTime = baseTime.toISOString();
      const selectedAt = new Date().toISOString();

      await prisma.officerTime
        .create({
          data: {
            gridTime: gridTime,
            officerId: user.id,
            selectedAt: selectedAt,
          },
        })
        .catch(() => {}); // Ignore conflicts
    }
  }

  console.log("✓ Created availability data");
}

async function _createDummyBusyTimes() {
  console.log("Creating dummy busy times for interviewers...");

  const users = await prisma.user.findMany();

  for (const user of users) {
    // Create 2-5 busy time periods for each interviewer
    const numBusyTimes = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < numBusyTimes; i++) {
      const baseTime = faker.date.soon({ days: 14 });

      // Set to business hours (8 AM to 6 PM)
      baseTime.setHours(faker.number.int({ min: 8, max: 18 }));
      baseTime.setMinutes(faker.helpers.arrayElement([0, 15, 30, 45])); // 15-minute increments
      baseTime.setSeconds(0, 0);

      const startTime = new Date(baseTime);

      // Create busy periods of 45 minutes, 1.5 hours, or 3 hours
      const durationOptions = [45, 90, 180]; // minutes
      const duration = faker.helpers.arrayElement(durationOptions);
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

      // Ensure we don't go past business hours (6 PM)
      const businessEnd = new Date(startTime);
      businessEnd.setHours(18, 0, 0, 0);

      if (endTime > businessEnd) {
        endTime.setTime(businessEnd.getTime());
      }

      // Skip if the busy time is too short (less than 30 minutes)
      if (endTime.getTime() - startTime.getTime() < 30 * 60 * 1000) {
        continue;
      }

      const reasons = [
        "Class: ENGR 489",
        "Meeting with advisor",
        "Lab work",
        "Other commitments",
        "Personal appointment",
        "Research meeting",
        "Study group",
        null, // Some busy times without reason
      ];

      await prisma.interviewerBusyTime
        .create({
          data: {
            interviewerId: user.id,
            startTime: startTime,
            endTime: endTime,
            reason: faker.helpers.arrayElement(reasons),
          },
        })
        .catch(() => {}); // Ignore conflicts (overlapping times)
    }
  }

  console.log("✓ Created busy time data");
}

async function main() {
  console.log("Starting dummy data creation...");

  try {
    // Create data in order of dependencies
    // NOTE: Removed createDummyUsers() - only real authenticated users should exist
    await createDummyTeamsAndResearchAreas();
    await createDummyApplications(40);
    await createDummyAvailability();
    // NOTE: Removed createDummyBusyTimes() - no dummy users to create busy times for

    console.log("\n✅ All dummy data created successfully!");
    console.log("\nSummary:");
    console.log("- 2 teams with research areas");
    console.log(
      "- 40 applications with preferences, commitments, and related data (40% PENDING, 30% INTERVIEWING)",
    );
    console.log("- Availability data for applicants only");
    console.log(
      "- No dummy users or interviewers created (use real authenticated users only)",
    );
  } catch (error) {
    console.error("❌ Error creating dummy data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (process.argv[1]?.endsWith("dummydata.ts")) {
  main().catch(console.error);
}
