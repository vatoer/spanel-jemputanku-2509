import { PrismaClient } from '@prisma/client';

export async function seedSubscriptionPlans(prisma: PrismaClient) {
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for small transportation businesses',
      price: 299000, // IDR 299,000 per month
      currency: 'IDR',
      maxVehicles: 5,
      maxDrivers: 10,
      maxRoutes: 3,
      features: [
        'Basic vehicle tracking',
        'Route management',
        'Driver assignment',
        'Basic reporting',
        'Email support'
      ],
      isActive: true,
    },
    {
      name: 'Professional',
      description: 'Ideal for medium-sized fleet operators',
      price: 599000, // IDR 599,000 per month
      currency: 'IDR',
      maxVehicles: 20,
      maxDrivers: 40,
      maxRoutes: 10,
      features: [
        'Advanced vehicle tracking',
        'Real-time GPS monitoring',
        'Route optimization',
        'Maintenance scheduling',
        'Advanced analytics',
        'Priority support',
        'Mobile app access'
      ],
      isActive: true,
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive solution for large operations',
      price: 1299000, // IDR 1,299,000 per month
      currency: 'IDR',
      maxVehicles: 100,
      maxDrivers: 200,
      maxRoutes: 50,
      features: [
        'Unlimited vehicle tracking',
        'Advanced route optimization',
        'Predictive maintenance',
        'Custom integrations',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Custom reporting'
      ],
      isActive: true,
    },
    {
      name: 'Startup',
      description: 'Free trial plan for new businesses',
      price: 0,
      currency: 'IDR',
      maxVehicles: 2,
      maxDrivers: 3,
      maxRoutes: 1,
      features: [
        'Basic vehicle tracking',
        'Single route management',
        'Community support'
      ],
      isActive: true,
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        maxVehicles: plan.maxVehicles,
        maxDrivers: plan.maxDrivers,
        maxRoutes: plan.maxRoutes,
        features: plan.features,
        isActive: plan.isActive,
      },
      create: plan,
    });
  }

  console.log('✅ Subscription plans seeded successfully');
}