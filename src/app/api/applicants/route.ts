import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const applicants = await prisma.application.findMany({
      select: {
        fullName: true,
        major: true,
        year: true,
        preferredTeams: {
          select: { team: { select: { name: true } } }
        },
        researchAreas: {
          select: { researchArea: { select: { name: true } } }
        },
        applicationType: true,
        status: true
      }
    });

    const formattedApplicants = applicants.map(applicant => ({
      name: applicant.fullName,
      interests: applicant.researchAreas.map(pref => pref.researchArea.name),
      teamRankings: applicant.preferredTeams.map(pref => pref.team.name),
      major: applicant.major,
      year: applicant.year,
      rating: applicant.status,
      category: applicant.applicationType
    }));

    return NextResponse.json(formattedApplicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// async function main() {
//   const allUsers = await prisma.application.findMany({
//     include: {
//       preferredTeams: {
//         select: {
//           interest: true,
//           team: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       },
//     },
//   });
//   console.log(JSON.stringify(allUsers, null, 2));
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })