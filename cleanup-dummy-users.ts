import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDummyUsers() {
  try {
    console.log('🧹 Starting dummy user cleanup...')
    
    // Get all users to see what we're dealing with
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        accounts: true, // Check if user has auth accounts (real user)
      }
    })
    
    console.log(`Found ${allUsers.length} total users:`)
    allUsers.forEach(user => {
      const isReal = user.accounts.length > 0
      console.log(`  - ${user.name} (${user.email}) - ${isReal ? 'REAL USER' : 'DUMMY'}`)
    })
    
    // Identify dummy users (users without auth accounts)
    const dummyUsers = allUsers.filter(user => user.accounts.length === 0)
    const realUsers = allUsers.filter(user => user.accounts.length > 0)
    
    console.log(`\n📊 Summary:`)
    console.log(`  - Real authenticated users: ${realUsers.length}`)
    console.log(`  - Dummy users to delete: ${dummyUsers.length}`)
    
    if (dummyUsers.length === 0) {
      console.log('✅ No dummy users found! Database is already clean.')
      return
    }
    
    console.log('\n🗑️  Deleting dummy users and related data...')
    
    // Delete in order due to foreign key constraints
    const dummyUserIds = dummyUsers.map(u => u.id)
    
    // 1. Delete busy times
    const deletedBusyTimes = await prisma.interviewerBusyTime.deleteMany({
      where: { interviewerId: { in: dummyUserIds } }
    })
    console.log(`  ✓ Deleted ${deletedBusyTimes.count} busy time entries`)
    
    // 2. Delete interviews
    const deletedInterviews = await prisma.interview.deleteMany({
      where: { interviewerId: { in: dummyUserIds } }
    })
    console.log(`  ✓ Deleted ${deletedInterviews.count} interviews`)
    
    // 3. Delete officer times
    const deletedOfficerTimes = await prisma.officerTime.deleteMany({
      where: { officerId: { in: dummyUserIds } }
    })
    console.log(`  ✓ Deleted ${deletedOfficerTimes.count} officer time entries`)
    
    // 4. Finally delete the users themselves
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: dummyUserIds } }
    })
    console.log(`  ✓ Deleted ${deletedUsers.count} dummy users`)
    
    console.log('\n✅ Cleanup complete!')
    
    // Show remaining users
    const remainingUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    })
    
    console.log(`\n👥 Remaining users (${remainingUsers.length}):`)
    remainingUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`)
    })
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDummyUsers()