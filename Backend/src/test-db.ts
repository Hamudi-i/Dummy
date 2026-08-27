import {prisma} from './infrastructure/prisma';
async function main() {
    const user = await prisma.user.create({
        data: {
            email: `Test_${Date.now()}@prisma.io`,
            name: 'Migration test',
            passwordHash: 'dummyhash123',
        },
    });

    console.log('successfully wrote to DB via prisma', user);

    const count = await prisma.user.count();
    console.log(`There are ${count} users in the database`);
}

main()
    .catch((e) => {
        console.error('prisma connection failed', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })