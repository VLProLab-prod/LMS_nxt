const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Users ---");
    const users = await prisma.user.findMany({
        include: { role: true }
    });
    users.forEach(u => console.log(`${u.id}: ${u.firstName} ${u.lastName} (${u.email}) - Role: ${u.role.roleName}`));

    console.log("\n--- Courses ---");
    const courses = await prisma.course.findMany();
    courses.forEach(c => console.log(`${c.id}: ${c.title} (${c.courseCode})`));

    console.log("\n--- Assignments ---");
    const assignments = await prisma.userCourseAssignment.findMany({
        include: { user: true, course: true }
    });
    assignments.forEach(a => {
        console.log(`User: ${a.user.firstName} ${a.user.lastName} (${a.user.email}) -> Course: ${a.course.title}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
