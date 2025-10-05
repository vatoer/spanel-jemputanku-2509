import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  // Create admin users for each tenant
  const users = [
    // Demo tenant owner
    {
      id: 'user-demo-owner',
      name: 'Demo Admin',
      email: 'admin@demo.jemputanku.com',
      firebaseUid: 'firebase-demo-admin-uid',
      role: 'TENANT_OWNER',
      tenantId: 'tenant-jemputanku-demo'
    },
    // TransJakarta users
    {
      id: 'user-transjakarta-owner',
      name: 'TransJakarta Owner',
      email: 'owner@transjakarta.com',
      firebaseUid: 'firebase-transjakarta-owner-uid',
      role: 'TENANT_OWNER',
      tenantId: 'tenant-transjakarta'
    },
    {
      id: 'user-transjakarta-admin',
      name: 'TransJakarta Admin',
      email: 'admin@transjakarta.com',
      firebaseUid: 'firebase-transjakarta-admin-uid',
      role: 'TENANT_ADMIN',
      tenantId: 'tenant-transjakarta'
    },
    // Kopaja users
    {
      id: 'user-kopaja-owner',
      name: 'Kopaja Owner',
      email: 'owner@kopaja.com',
      firebaseUid: 'firebase-kopaja-owner-uid',
      role: 'TENANT_OWNER',
      tenantId: 'tenant-kopaja'
    },
    // Metro Mini users
    {
      id: 'user-metromini-owner',
      name: 'Metro Mini Owner',
      email: 'owner@metromini.com',
      firebaseUid: 'firebase-metromini-owner-uid',
      role: 'TENANT_OWNER',
      tenantId: 'tenant-metromini'
    },
    // Busway users
    {
      id: 'user-busway-owner',
      name: 'Busway Owner',
      email: 'owner@busway.com',
      firebaseUid: 'firebase-busway-owner-uid',
      role: 'TENANT_OWNER',
      tenantId: 'tenant-busway'
    },
    // Demo drivers
    {
      id: 'user-driver-1',
      name: 'Ahmad Supri',
      email: 'ahmad.supri@demo.jemputanku.com',
      firebaseUid: 'firebase-driver-1-uid',
      role: 'DRIVER',
      tenantId: 'tenant-jemputanku-demo'
    },
    {
      id: 'user-driver-2',
      name: 'Budi Santoso',
      email: 'budi.santoso@demo.jemputanku.com',
      firebaseUid: 'firebase-driver-2-uid',
      role: 'DRIVER',
      tenantId: 'tenant-jemputanku-demo'
    },
    {
      id: 'user-driver-3',
      name: 'Candra Wijaya',
      email: 'candra.wijaya@transjakarta.com',
      firebaseUid: 'firebase-driver-3-uid',
      role: 'DRIVER',
      tenantId: 'tenant-transjakarta'
    },
    // Platform admin
    {
      id: 'user-platform-admin',
      name: 'Platform Administrator',
      email: 'admin@jemputanku.com',
      firebaseUid: 'firebase-platform-admin-uid',
      role: 'PLATFORM_ADMIN',
      tenantId: null
    }
  ];

  // Create roles first
  const roles = [
    { id: 'TENANT_OWNER', name: 'Tenant Owner', description: 'Owner of the tenant organization' },
    { id: 'TENANT_ADMIN', name: 'Tenant Administrator', description: 'Administrator for tenant operations' },
    { id: 'TENANT_MANAGER', name: 'Tenant Manager', description: 'Manager for tenant operations' },
    { id: 'TENANT_USER', name: 'Tenant User', description: 'Regular user within tenant' },
    { id: 'PLATFORM_ADMIN', name: 'Platform Administrator', description: 'Administrator of the entire platform' },
    { id: 'DRIVER', name: 'Driver', description: 'Vehicle driver' },
    { id: 'GUEST', name: 'Guest', description: 'Guest user with limited access' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id as any },
      update: {
        name: role.name,
        description: role.description,
        updatedBy: 'SEEDER',
      },
      create: {
        ...role,
        id: role.id as any,
        createdBy: 'SEEDER',
      },
    });
  }

  // Create users
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        name: userData.name,
        email: userData.email,
        firebaseUid: userData.firebaseUid,
      },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        firebaseUid: userData.firebaseUid,
      },
    });

    // Assign role to user
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: userData.role as any,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: userData.role as any,
      },
    });

    // Assign user to tenant (if applicable)
    if (userData.tenantId) {
      await prisma.userTenant.upsert({
        where: {
          userId_tenantId: {
            userId: user.id,
            tenantId: userData.tenantId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          tenantId: userData.tenantId,
        },
      });
    }
  }

  console.log('✅ Users, roles, and tenant assignments seeded successfully');
}