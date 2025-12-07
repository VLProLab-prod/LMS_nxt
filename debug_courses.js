const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            assignedCourses: {
                include: {
                    course: {
                        include: {
                            sections: {
                                include: {
                                    contents: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    console.log("Users and their courses:");
    users.forEach(user => {
        console.log(`User: ${user.email} (ID: ${user.id})`);
        user.assignedCourses.forEach(assignment => {
            const course = assignment.course;
            const unitCount = course.sections.length;
            const topicCount = course.sections.reduce((acc, s) => acc + s.contents.length, 0);
            console.log(`  - Course: ${course.title} (ID: ${course.id}, Status: ${course.status})`);
            console.log(`    Units: ${unitCount}, Topics: ${topicCount}`);
        });
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
