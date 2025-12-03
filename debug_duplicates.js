const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        where: { title: { contains: 'Natural Language Processing' } },
        include: {
            _count: {
                select: { sections: true }
            },
            sections: {
                include: {
                    _count: {
                        select: { contents: true }
                    }
                }
            }
        }
    });

    console.log(`Found ${courses.length} courses matching 'Natural Language Processing'`);
    courses.forEach(c => {
        const totalTopics = c.sections.reduce((acc, s) => acc + s._count.contents, 0);
        console.log(`Course ID: ${c.id}, Title: ${c.title}, Status: ${c.status}`);
        console.log(`  Units: ${c._count.sections}, Topics: ${totalTopics}`);
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
