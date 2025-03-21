import { PrismaClient } from '@prisma/client'
import { TEAMS } from '../src/consts/apply-form.js'  // Note the .js extension

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
      })
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

void main()
