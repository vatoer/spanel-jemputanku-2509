import { PrismaClient } from '@prisma/client';

export async function seedTenants(prisma: PrismaClient) {
  const tenants = [
    {
      id: 'tenant-jemputanku-demo',
      name: 'JemputanKu Demo',
      domain: 'demo.jemputanku.com',
      status: 'ACTIVE' as const,
    },
    {
      id: 'tenant-transjakarta',
      name: 'TransJakarta',
      domain: 'transjakarta.jemputanku.com',
      status: 'ACTIVE' as const,
    },
    {
      id: 'tenant-kopaja',
      name: 'Kopaja',
      domain: 'kopaja.jemputanku.com',
      status: 'ACTIVE' as const,
    },
    {
      id: 'tenant-metromini',
      name: 'Metro Mini',
      domain: 'metromini.jemputanku.com',
      status: 'ACTIVE' as const,
    },
    {
      id: 'tenant-busway',
      name: 'Busway Express',
      domain: 'busway.jemputanku.com',
      status: 'TRIAL' as const,
    }
  ];

  // Seed tenants
  for (const tenant of tenants) {
    await prisma.tenant.upsert({
      where: { id: tenant.id },
      update: {
        name: tenant.name,
        domain: tenant.domain,
        status: tenant.status,
      },
      create: tenant,
    });
  }

  // Get subscription plans for creating subscriptions
  const basicPlan = await prisma.subscriptionPlan.findUnique({
    where: { name: 'Basic' }
  });
  const professionalPlan = await prisma.subscriptionPlan.findUnique({
    where: { name: 'Professional' }
  });
  const enterprisePlan = await prisma.subscriptionPlan.findUnique({
    where: { name: 'Enterprise' }
  });
  const startupPlan = await prisma.subscriptionPlan.findUnique({
    where: { name: 'Startup' }
  });

  if (!basicPlan || !professionalPlan || !enterprisePlan || !startupPlan) {
    throw new Error('Subscription plans not found. Please run subscription seeder first.');
  }

  // Create tenant subscriptions
  const subscriptions = [
    {
      tenantId: 'tenant-jemputanku-demo',
      planId: basicPlan.id,
      status: 'ACTIVE' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      autoRenew: true,
      maxVehiclesAtTime: basicPlan.maxVehicles,
      maxDriversAtTime: basicPlan.maxDrivers,
      maxRoutesAtTime: basicPlan.maxRoutes,
      priceAtTime: basicPlan.price,
    },
    {
      tenantId: 'tenant-transjakarta',
      planId: enterprisePlan.id,
      status: 'ACTIVE' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      maxVehiclesAtTime: enterprisePlan.maxVehicles,
      maxDriversAtTime: enterprisePlan.maxDrivers,
      maxRoutesAtTime: enterprisePlan.maxRoutes,
      priceAtTime: enterprisePlan.price,
    },
    {
      tenantId: 'tenant-kopaja',
      planId: professionalPlan.id,
      status: 'ACTIVE' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      maxVehiclesAtTime: professionalPlan.maxVehicles,
      maxDriversAtTime: professionalPlan.maxDrivers,
      maxRoutesAtTime: professionalPlan.maxRoutes,
      priceAtTime: professionalPlan.price,
    },
    {
      tenantId: 'tenant-metromini',
      planId: basicPlan.id,
      status: 'ACTIVE' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      maxVehiclesAtTime: basicPlan.maxVehicles,
      maxDriversAtTime: basicPlan.maxDrivers,
      maxRoutesAtTime: basicPlan.maxRoutes,
      priceAtTime: basicPlan.price,
    },
    {
      tenantId: 'tenant-busway',
      planId: startupPlan.id,
      status: 'TRIAL' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: false,
      maxVehiclesAtTime: startupPlan.maxVehicles,
      maxDriversAtTime: startupPlan.maxDrivers,
      maxRoutesAtTime: startupPlan.maxRoutes,
      priceAtTime: startupPlan.price,
    }
  ];

  for (const subscription of subscriptions) {
    // Check if subscription already exists for this tenant
    const existingSubscription = await prisma.tenantSubscription.findFirst({
      where: {
        tenantId: subscription.tenantId,
        status: 'ACTIVE'
      }
    });

    if (!existingSubscription) {
      await prisma.tenantSubscription.create({
        data: subscription,
      });
    }
  }

  console.log('✅ Tenants and subscriptions seeded successfully');
}