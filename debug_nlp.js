const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const nlpCourse = await prisma.course.findFirst({
        where: { title: { contains: 'Natural Language Processing' } },
        include: {
            assignments: {
                include: {
                    user: {
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
                    }
                }
            }
        }
    });

    if (!nlpCourse) {
        console.log("NLP Course not found");
        return;
    }

    console.log(`Found Course: ${nlpCourse.title} (ID: ${nlpCourse.id})`);

    nlpCourse.assignments.forEach(assignment => {
        const user = assignment.user;
        console.log(`Assigned to User: ${user.email} (ID: ${user.id})`);
        console.log(`  This user has ${user.assignedCourses.length} assigned courses:`);

        let totalUnits = 0;
        let totalTopics = 0;

        user.assignedCourses.forEach(ac => {
            const c = ac.course;
            if (c.status !== 'Active') return;

            const uCount = c.sections.length;
            const tCount = c.sections.reduce((acc, s) => acc + s.contents.length, 0);
            totalUnits += uCount;
            totalTopics += tCount;

            console.log(`    - ${c.title} (ID: ${c.id}, Status: ${c.status})`);
            console.log(`      Units: ${uCount}, Topics: ${tCount}`);
        });

        console.log(`  TOTAL Active Stats for User ${user.id}: Units=${totalUnits}, Topics=${totalTopics}`);
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
