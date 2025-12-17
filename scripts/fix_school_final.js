const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Fixing School Names ---");
    const oldName = "School of Management";
    const newName = "School of Commerce, Finance and Accountancy";

    try {
        const oldSchool = await prisma.school.findFirst({ where: { name: oldName } });
        const newSchool = await prisma.school.findFirst({ where: { name: newName } });

        console.log(`Old Exists: ${!!oldSchool} (ID: ${oldSchool?.id})`);
        console.log(`New Exists: ${!!newSchool} (ID: ${newSchool?.id})`);

        if (oldSchool && newSchool) {
            console.log("Both exist. Migrating data from Old -> New...");
            // Move Programs
            await prisma.program.updateMany({
                where: { schoolId: oldSchool.id },
                data: { schoolId: newSchool.id }
            });
            // Move Users
            await prisma.user.updateMany({
                where: { schoolId: oldSchool.id },
                data: { schoolId: newSchool.id }
            });
            // Delete Old
            await prisma.school.delete({ where: { id: oldSchool.id } });
            console.log("Migration Complete. Old school deleted.");
        }
        else if (oldSchool && !newSchool) {
            console.log("Only Old exists. Renaming...");
            await prisma.school.update({
                where: { id: oldSchool.id },
                data: { name: newName }
            });
            console.log("Rename Complete.");
        }
        else {
            console.log("Nothing to do. School of Management doesn't exist anymore.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main()
    .finally(async () => await prisma.$disconnect());
