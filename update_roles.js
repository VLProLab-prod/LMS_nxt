const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const role = await prisma.role.findUnique({
            where: { roleName: 'Teacher Assistant' },
        });

        if (role) {
            console.log('Found Teacher Assistant role:', role);
            const updated = await prisma.role.update({
                where: { id: role.id },
                data: { canApproveContent: true },
            });
            console.log('Updated Teacher Assistant role:', updated);
        } else {
            console.log('Teacher Assistant role not found.');
            // Create it if it doesn't exist?
            // For now, let's assume it exists or we might need to create it.
            // But usually roles are seeded.
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
