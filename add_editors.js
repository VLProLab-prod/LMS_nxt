const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Find Editor Role ID
    const editorRole = await prisma.role.findFirst({
        where: { roleName: 'Editor' }
    });

    if (!editorRole) {
        console.error("Editor role not found!");
        return;
    }

    console.log(`Found Editor Role ID: ${editorRole.id}`);

    // 2. Define users to add
    const newEditors = [
        { email: 'messi@CU.in', firstName: 'Lionel', lastName: 'Messi' },
        { email: 'ronaldo@CU.in', firstName: 'Cristiano', lastName: 'Ronaldo' },
        { email: 'Neymar@CU.in', firstName: 'Neymar', lastName: 'Jr' }
    ];

    // 3. Insert users
    for (const editor of newEditors) {
        const existingUser = await prisma.user.findUnique({
            where: { email: editor.email }
        });

        if (existingUser) {
            console.log(`User ${editor.email} already exists.`);
        } else {
            const newUser = await prisma.user.create({
                data: {
                    email: editor.email,
                    passwordHash: 'dummy', // Plaintext as per user request and login logic support
                    firstName: editor.firstName,
                    lastName: editor.lastName,
                    roleId: editorRole.id
                }
            });
            console.log(`Created user: ${newUser.email} (ID: ${newUser.id})`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
