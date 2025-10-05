import { PrismaClient } from '@prisma/client';

export async function seedRoutes(prisma: PrismaClient) {
  const routes = [
    // Demo tenant routes
    {
      id: 'route-demo-1',
      tenantId: 'tenant-jemputanku-demo',
      name: 'Rute Demo 1: Bekasi - Jakarta',
      description: 'Rute dari Terminal Bekasi ke Terminal Kampung Melayu',
      isActive: true,
      direction: {
        totalDistance: '25.5 km',
        estimatedDuration: '45 menit',
        waypoints: [
          { lat: -6.2383, lng: 106.9756, name: 'Terminal Bekasi' },
          { lat: -6.2297, lng: 106.8618, name: 'Jalan Raya Bekasi' },
          { lat: -6.2088, lng: 106.8456, name: 'Terminal Kampung Melayu' }
        ]
      }
    },
    // TransJakarta routes
    {
      id: 'route-transjakarta-1',
      tenantId: 'tenant-transjakarta',
      name: 'Koridor 1: Blok M - Kota',
      description: 'Rute TransJakarta Koridor 1 dari Blok M hingga Kota',
      isActive: true,
      direction: {
        totalDistance: '12.9 km',
        estimatedDuration: '35 menit',
        waypoints: [
          { lat: -6.2297, lng: 106.7998, name: 'Halte Blok M' },
          { lat: -6.2114, lng: 106.8229, name: 'Halte Dukuh Atas' },
          { lat: -6.1754, lng: 106.8272, name: 'Halte Bundaran HI' },
          { lat: -6.1372, lng: 106.8153, name: 'Halte Kota' }
        ]
      }
    },
    {
      id: 'route-transjakarta-2',
      tenantId: 'tenant-transjakarta',
      name: 'Koridor 2: Harmoni - Pulogadung',
      description: 'Rute TransJakarta Koridor 2 dari Harmoni hingga Pulogadung',
      isActive: true,
      direction: {
        totalDistance: '18.2 km',
        estimatedDuration: '50 menit',
        waypoints: [
          { lat: -6.1669, lng: 106.8078, name: 'Halte Harmoni' },
          { lat: -6.1744, lng: 106.8456, name: 'Halte Matraman' },
          { lat: -6.1891, lng: 106.8897, name: 'Halte Pulogadung' }
        ]
      }
    },
    // Kopaja routes
    {
      id: 'route-kopaja-1',
      tenantId: 'tenant-kopaja',
      name: 'Trayek S12: Blok M - Kota',
      description: 'Kopaja trayek S12 dari Blok M ke Kota via Sudirman',
      isActive: true,
      direction: {
        totalDistance: '14.5 km',
        estimatedDuration: '40 menit',
        waypoints: [
          { lat: -6.2297, lng: 106.7998, name: 'Terminal Blok M' },
          { lat: -6.2088, lng: 106.8229, name: 'Senayan' },
          { lat: -6.1754, lng: 106.8272, name: 'Bundaran HI' },
          { lat: -6.1372, lng: 106.8153, name: 'Pasar Baru' }
        ]
      }
    },
    // Metro Mini routes
    {
      id: 'route-metromini-1',
      tenantId: 'tenant-metromini',
      name: 'Trayek 64: Tanah Abang - Senen',
      description: 'Metro Mini trayek 64 dari Tanah Abang ke Senen',
      isActive: true,
      direction: {
        totalDistance: '8.3 km',
        estimatedDuration: '25 menit',
        waypoints: [
          { lat: -6.1872, lng: 106.8089, name: 'Stasiun Tanah Abang' },
          { lat: -6.1744, lng: 106.8229, name: 'Pasar Tanah Abang' },
          { lat: -6.1572, lng: 106.8372, name: 'Stasiun Senen' }
        ]
      }
    },
    // Busway routes
    {
      id: 'route-busway-1',
      tenantId: 'tenant-busway',
      name: 'Jakarta - Bogor Express',
      description: 'Rute ekspres dari Jakarta ke Bogor via tol Jagorawi',
      isActive: true,
      direction: {
        totalDistance: '45.2 km',
        estimatedDuration: '75 menit',
        waypoints: [
          { lat: -6.2088, lng: 106.8456, name: 'Terminal Kampung Melayu' },
          { lat: -6.3728, lng: 106.8372, name: 'Tol Jagorawi KM 15' },
          { lat: -6.5972, lng: 106.8006, name: 'Terminal Baranangsiang Bogor' }
        ]
      }
    }
  ];

  // Create routes
  for (const route of routes) {
    await prisma.route.upsert({
      where: { id: route.id },
      update: {
        name: route.name,
        description: route.description,
        isActive: route.isActive,
        direction: route.direction,
      },
      create: route,
    });
  }

  // Create route points for each route
  const routePoints = [
    // Demo route points
    {
      routeId: 'route-demo-1',
      points: [
        { latitude: -6.2383, longitude: 106.9756, order: 1, name: 'Terminal Bekasi', type: 'ORIGIN' as const },
        { latitude: -6.2297, longitude: 106.8618, order: 2, name: 'Jalan Raya Bekasi', type: 'STOP' as const },
        { latitude: -6.2088, longitude: 106.8456, order: 3, name: 'Terminal Kampung Melayu', type: 'DESTINATION' as const }
      ]
    },
    // TransJakarta Koridor 1 points
    {
      routeId: 'route-transjakarta-1',
      points: [
        { latitude: -6.2297, longitude: 106.7998, order: 1, name: 'Halte Blok M', type: 'ORIGIN' as const },
        { latitude: -6.2114, longitude: 106.8229, order: 2, name: 'Halte Dukuh Atas', type: 'STOP' as const },
        { latitude: -6.1754, longitude: 106.8272, order: 3, name: 'Halte Bundaran HI', type: 'STOP' as const },
        { latitude: -6.1372, longitude: 106.8153, order: 4, name: 'Halte Kota', type: 'DESTINATION' as const }
      ]
    },
    // TransJakarta Koridor 2 points
    {
      routeId: 'route-transjakarta-2',
      points: [
        { latitude: -6.1669, longitude: 106.8078, order: 1, name: 'Halte Harmoni', type: 'ORIGIN' as const },
        { latitude: -6.1744, longitude: 106.8456, order: 2, name: 'Halte Matraman', type: 'STOP' as const },
        { latitude: -6.1891, longitude: 106.8897, order: 3, name: 'Halte Pulogadung', type: 'DESTINATION' as const }
      ]
    },
    // Kopaja route points
    {
      routeId: 'route-kopaja-1',
      points: [
        { latitude: -6.2297, longitude: 106.7998, order: 1, name: 'Terminal Blok M', type: 'ORIGIN' as const },
        { latitude: -6.2088, longitude: 106.8229, order: 2, name: 'Senayan', type: 'STOP' as const },
        { latitude: -6.1754, longitude: 106.8272, order: 3, name: 'Bundaran HI', type: 'STOP' as const },
        { latitude: -6.1372, longitude: 106.8153, order: 4, name: 'Pasar Baru', type: 'DESTINATION' as const }
      ]
    },
    // Metro Mini route points
    {
      routeId: 'route-metromini-1',
      points: [
        { latitude: -6.1872, longitude: 106.8089, order: 1, name: 'Stasiun Tanah Abang', type: 'ORIGIN' as const },
        { latitude: -6.1744, longitude: 106.8229, order: 2, name: 'Pasar Tanah Abang', type: 'STOP' as const },
        { latitude: -6.1572, longitude: 106.8372, order: 3, name: 'Stasiun Senen', type: 'DESTINATION' as const }
      ]
    },
    // Busway route points
    {
      routeId: 'route-busway-1',
      points: [
        { latitude: -6.2088, longitude: 106.8456, order: 1, name: 'Terminal Kampung Melayu', type: 'ORIGIN' as const },
        { latitude: -6.3728, longitude: 106.8372, order: 2, name: 'Tol Jagorawi KM 15', type: 'STOP' as const },
        { latitude: -6.5972, longitude: 106.8006, order: 3, name: 'Terminal Baranangsiang Bogor', type: 'DESTINATION' as const }
      ]
    }
  ];

  // Create route points
  for (const routePointGroup of routePoints) {
    for (const point of routePointGroup.points) {
      await prisma.routePoint.upsert({
        where: {
          routeId_order: {
            routeId: routePointGroup.routeId,
            order: point.order
          }
        },
        update: {
          latitude: point.latitude,
          longitude: point.longitude,
          name: point.name,
          type: point.type,
          isActive: true,
        },
        create: {
          routeId: routePointGroup.routeId,
          latitude: point.latitude,
          longitude: point.longitude,
          order: point.order,
          name: point.name,
          type: point.type,
          isActive: true,
        },
      });
    }
  }

  // Update routes with origin and destination references
  for (const routePointGroup of routePoints) {
    const originPoint = await prisma.routePoint.findFirst({
      where: {
        routeId: routePointGroup.routeId,
        type: 'ORIGIN'
      }
    });

    const destinationPoint = await prisma.routePoint.findFirst({
      where: {
        routeId: routePointGroup.routeId,
        type: 'DESTINATION'
      }
    });

    if (originPoint && destinationPoint) {
      await prisma.route.update({
        where: { id: routePointGroup.routeId },
        data: {
          originId: originPoint.id,
          destinationId: destinationPoint.id
        }
      });
    }
  }

  // Create some vehicle route assignments
  const assignments = [
    {
      vehicleId: await getVehicleIdByLicensePlate(prisma, 'B 1234 ABC'),
      routeId: 'route-demo-1',
      assignedBy: 'user-demo-owner'
    },
    {
      vehicleId: await getVehicleIdByLicensePlate(prisma, 'B 7001 TJ'),
      routeId: 'route-transjakarta-1',
      assignedBy: 'user-transjakarta-owner'
    },
    {
      vehicleId: await getVehicleIdByLicensePlate(prisma, 'B 7002 TJ'),
      routeId: 'route-transjakarta-2',
      assignedBy: 'user-transjakarta-owner'
    }
  ];

  for (const assignment of assignments) {
    if (assignment.vehicleId) {
      await prisma.vehicleRouteAssignment.upsert({
        where: {
          vehicleId_routeId: {
            vehicleId: assignment.vehicleId,
            routeId: assignment.routeId
          }
        },
        update: {
          isActive: true,
          assignedBy: assignment.assignedBy,
          unassignedAt: null,
          unassignedBy: null
        },
        create: {
          vehicleId: assignment.vehicleId,
          routeId: assignment.routeId,
          assignedBy: assignment.assignedBy,
          isActive: true
        }
      });
    }
  }

  console.log('✅ Routes and route assignments seeded successfully');
}

// Helper function to get vehicle ID by license plate
async function getVehicleIdByLicensePlate(prisma: PrismaClient, licensePlate: string): Promise<string | null> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { licensePlate },
    select: { id: true }
  });
  return vehicle?.id || null;
}