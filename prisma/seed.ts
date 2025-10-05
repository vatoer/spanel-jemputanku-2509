import { PrismaClient } from '@prisma/client';
import { seedRoutes } from './seeds/route-seeder';
import { seedSubscriptionPlans } from './seeds/subscription-seeder';
import { seedTenants } from './seeds/tenant-seeder';
import { seedUsers } from './seeds/user-seeder';
import { seedVehicles } from './seeds/vehicle-seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Seed subscription plans first (referenced by tenant subscriptions)
    console.log('📋 Seeding subscription plans...');
    await seedSubscriptionPlans(prisma);

    // 2. Seed tenants
    console.log('🏢 Seeding tenants...');
    await seedTenants(prisma);

    // 3. Seed users (including tenant owners and drivers)
    console.log('👥 Seeding users...');
    await seedUsers(prisma);

    // 4. Seed vehicles for tenants
    console.log('🚐 Seeding vehicles...');
    await seedVehicles(prisma);

    // 5. Seed routes for tenants
    console.log('🗺️ Seeding routes...');
    await seedRoutes(prisma);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });