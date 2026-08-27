import prisma from "../src/infrastructure/prisma";
import { Util } from "../src/common/utils";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const adminName = "Super Admin";

  console.log("🌱 Seeding database...");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      password: Util.hashPassword(adminPassword),
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user ready: ${admin.email}`);
  console.log(`🔑 Default credentials: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
