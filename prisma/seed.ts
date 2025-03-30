import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function main() {
  try {
    for (const team of TEAMS) {
      await prisma.team.upsert({
        where: { id: team.id },
        update: { name: team.name },
        create: {
          id: team.id,
          name: team.name,
          researchAreas: {
            create: team.researchAreas.map(area => ({
              id: area.id,
              name: area.name
            }))
          }
        }
      })const TEAMS = [
        {
          id: 1,
          name: 'Team 1',
          researchAreas: [
            { id: 1, name: 'Area 1' },
            { id: 2, name: 'Area 2' },
          ],
        },
        {
          id: 2,
          name: 'Team 2',
          researchAreas: [
            { id: 3, name: 'Area 3' },
            { id: 4, name: 'Area 4' },
          ],
        },
      ];

      async function main() {
        try {
          for (const team of TEAMS) {
            const existingTeam = await prisma.team.findUnique({ where: { id: team.id } });
            if (existingTeam) {
              await prisma.team.update({
                where: { id: team.id },
                data: {
                  name: team.name,
                  researchAreas: {
                    deleteMany: {},
                    create: team.researchAreas.map(area => ({
                      id: area.id,
                      name: area.name,
                    })),
                  },
                },
              });
            } else {
              await prisma.team.create({
                data: {
                  id: team.id,
                  name: team.name,
                  researchAreas: {
                    create: team.researchAreas.map(area => ({
                      id: area.id,
                      name: area.name,
                    })),
                  },
                },
              });
            }
          }
        } catch (error) {
          console.error(error);
          process.exit(1);
        } finally {
          await prisma.$disconnect();
        }
      }

      void main();
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

void main()
