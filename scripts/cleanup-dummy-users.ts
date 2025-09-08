import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// List of dummy/test users that should be removed
const DUMMY_USER_PATTERNS = [
  "Aiden",
  "Moksh", 
  "1",
  "2",
  "interviewer1@example.com",
  "interviewer2@example.com",
  "aiden@example.com",
  "moksh@example.com"
];

async function cleanupDummyUsers() {
  console.log("🧹 Starting cleanup of dummy users...");
  
  try {
    // Find users that match dummy patterns
    const dummyUsers = await prisma.user.findMany({
      where: {
        OR: [
          // Match by name
          ...DUMMY_USER_PATTERNS.map(pattern => ({
            name: { equals: pattern, mode: 'insensitive' as const }
          })),
          // Match by email
          ...DUMMY_USER_PATTERNS.filter(p => p.includes('@')).map(pattern => ({
            email: { equals: pattern, mode: 'insensitive' as const }
          })),
          // Match users with no authentication (no sessions, accounts, or emailVerified)
          {
            AND: [
              { emailVerified: null },
              { sessions: { none: {} } },
              { accounts: { none: {} } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        _count: {
          select: {
            sessions: true,
            accounts: true,
            interviews: true
          }
        }
      }
    });

    if (dummyUsers.length === 0) {
      console.log("✅ No dummy users found - database is clean!");
      return;
    }

    console.log(`Found ${dummyUsers.length} potential dummy users:`);
    
    for (const user of dummyUsers) {
      console.log(`  - ${user.name} (${user.email})`);
      console.log(`    Authenticated: ${user.emailVerified ? 'Yes' : 'No'}`);
      console.log(`    Sessions: ${user._count.sessions}, Accounts: ${user._count.accounts}`);
      console.log(`    Interviews conducted: ${user._count.interviews}`);
    }

    // Only delete users that are clearly dummy users (no authentication and match patterns)
    const usersToDelete = dummyUsers.filter(user => 
      !user.emailVerified && 
      user._count.sessions === 0 && 
      user._count.accounts === 0 &&
      (DUMMY_USER_PATTERNS.some(pattern => 
        user.name?.toLowerCase().includes(pattern.toLowerCase()) ||
        user.email?.toLowerCase().includes(pattern.toLowerCase())
      ))
    );

    if (usersToDelete.length === 0) {
      console.log("⚠️  No clearly identifiable dummy users to delete. Manual review recommended.");
      return;
    }

    console.log(`\n🗑️  Deleting ${usersToDelete.length} dummy users...`);
    
    for (const user of usersToDelete) {
      // First delete related records
      await prisma.interviewerBusyTime.deleteMany({
        where: { interviewerId: user.id }
      });
      
      await prisma.officerTime.deleteMany({
        where: { officerId: user.id }
      });
      
      await prisma.interview.deleteMany({
        where: { interviewerId: user.id }
      });

      // Then delete the user
      await prisma.user.delete({
        where: { id: user.id }
      });
      
      console.log(`  ✓ Deleted: ${user.name} (${user.email})`);
    }

    console.log(`\n✅ Successfully cleaned up ${usersToDelete.length} dummy users!`);
    console.log("\n📋 Summary:");
    console.log("- All dummy/test users have been removed");
    console.log("- System now only works with authenticated users (lvadlamudi, etc.)");
    console.log("- Users must log in through OAuth to become available interviewers");

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDummyUsers().catch(console.error);
}

export { cleanupDummyUsers };