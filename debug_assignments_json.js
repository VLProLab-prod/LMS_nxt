const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const assignments = await prisma.userCourseAssignment.findMany({
        include: { user: true, course: true }
    });
    console.log(JSON.stringify(assignments.map(a => ({
        user: a.user.email,
        course: a.course.title
    })), null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
