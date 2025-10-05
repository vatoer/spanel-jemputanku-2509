import { PrismaClient } from '@prisma/client';

export async function seedVehicles(prisma: PrismaClient) {
  const vehicles = [
    // Demo tenant vehicles
    {
      tenantId: 'tenant-jemputanku-demo',
      licensePlate: 'B 1234 ABC',
      model: 'Isuzu ELF',
      manufacturer: 'Isuzu',
      year: 2022,
      color: 'Biru',
      capacity: 25,
      status: 'ACTIVE' as const,
      chassisNumber: 'ISUZU123456789',
      engineNumber: 'ENG123456',
      stnkDate: '2025-12-31',
      kirDate: '2025-06-30',
      taxDate: '2025-03-31',
      features: ['Air Conditioning', 'GPS', 'WiFi Hotspot'],
      notes: 'Kendaraan dalam kondisi baik',
      driverId: 'user-driver-1'
    },
    {
      tenantId: 'tenant-jemputanku-demo',
      licensePlate: 'B 5678 DEF',
      model: 'Mitsubishi Colt Diesel',
      manufacturer: 'Mitsubishi',
      year: 2021,
      color: 'Putih',
      capacity: 30,
      status: 'ACTIVE' as const,
      chassisNumber: 'MITSU987654321',
      engineNumber: 'ENG789012',
      stnkDate: '2025-11-30',
      kirDate: '2025-05-31',
      taxDate: '2025-02-28',
      features: ['Air Conditioning', 'Dashcam'],
      notes: 'Baru selesai service rutin',
      driverId: 'user-driver-2'
    },
    // TransJakarta vehicles
    {
      tenantId: 'tenant-transjakarta',
      licensePlate: 'B 7001 TJ',
      model: 'Mercedes-Benz Citaro',
      manufacturer: 'Mercedes-Benz',
      year: 2023,
      color: 'Orange',
      capacity: 85,
      status: 'ACTIVE' as const,
      chassisNumber: 'MB2023001',
      engineNumber: 'MBENG001',
      stnkDate: '2026-01-31',
      kirDate: '2025-07-31',
      taxDate: '2025-04-30',
      features: ['Air Conditioning', 'GPS', 'WiFi Hotspot', 'Dashcam', 'CCTV'],
      notes: 'Bus TransJakarta koridor 1',
      driverId: 'user-driver-3'
    },
    {
      tenantId: 'tenant-transjakarta',
      licensePlate: 'B 7002 TJ',
      model: 'Scania K320IB',
      manufacturer: 'Scania',
      year: 2023,
      color: 'Orange',
      capacity: 90,
      status: 'ACTIVE' as const,
      chassisNumber: 'SCANIA2023002',
      engineNumber: 'SCANENG002',
      stnkDate: '2026-02-28',
      kirDate: '2025-08-31',
      taxDate: '2025-05-31',
      features: ['Air Conditioning', 'GPS', 'WiFi Hotspot', 'Dashcam'],
      notes: 'Bus TransJakarta koridor 2'
    },
    {
      tenantId: 'tenant-transjakarta',
      licensePlate: 'B 7003 TJ',
      model: 'Volvo B7RLE',
      manufacturer: 'Volvo',
      year: 2022,
      color: 'Orange',
      capacity: 80,
      status: 'MAINTENANCE' as const,
      chassisNumber: 'VOLVO2022003',
      engineNumber: 'VOLVOENG003',
      stnkDate: '2025-12-31',
      kirDate: '2025-06-30',
      taxDate: '2025-03-31',
      features: ['Air Conditioning', 'GPS'],
      notes: 'Sedang maintenance AC'
    },
    // Kopaja vehicles
    {
      tenantId: 'tenant-kopaja',
      licensePlate: 'B 9001 KJ',
      model: 'Hino Dutro',
      manufacturer: 'Hino',
      year: 2020,
      color: 'Hijau',
      capacity: 20,
      status: 'ACTIVE' as const,
      chassisNumber: 'HINO2020001',
      engineNumber: 'HINOENG001',
      stnkDate: '2025-10-31',
      kirDate: '2025-04-30',
      taxDate: '2025-01-31',
      features: ['Air Conditioning'],
      notes: 'Kopaja trayek Blok M - Kota'
    },
    // Metro Mini vehicles
    {
      tenantId: 'tenant-metromini',
      licensePlate: 'B 8001 MM',
      model: 'Suzuki Carry',
      manufacturer: 'Suzuki',
      year: 2019,
      color: 'Kuning',
      capacity: 12,
      status: 'ACTIVE' as const,
      chassisNumber: 'SUZUKI2019001',
      engineNumber: 'SUZENG001',
      stnkDate: '2025-09-30',
      kirDate: '2025-03-31',
      taxDate: '2024-12-31',
      features: [],
      notes: 'Metro Mini trayek Tanah Abang - Senen'
    },
    // Busway vehicles
    {
      tenantId: 'tenant-busway',
      licensePlate: 'B 6001 BW',
      model: 'Isuzu NQR',
      manufacturer: 'Isuzu',
      year: 2021,
      color: 'Merah',
      capacity: 35,
      status: 'ACTIVE' as const,
      chassisNumber: 'ISUZU2021001',
      engineNumber: 'ISUZUENG001',
      stnkDate: '2025-08-31',
      kirDate: '2025-02-28',
      taxDate: '2024-11-30',
      features: ['Air Conditioning', 'GPS'],
      notes: 'Busway Express rute Jakarta - Bogor'
    }
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { licensePlate: vehicle.licensePlate },
      update: {
        model: vehicle.model,
        manufacturer: vehicle.manufacturer,
        year: vehicle.year,
        color: vehicle.color,
        capacity: vehicle.capacity,
        status: vehicle.status,
        chassisNumber: vehicle.chassisNumber,
        engineNumber: vehicle.engineNumber,
        stnkDate: vehicle.stnkDate,
        kirDate: vehicle.kirDate,
        taxDate: vehicle.taxDate,
        features: vehicle.features,
        notes: vehicle.notes,
        driverId: vehicle.driverId,
      },
      create: vehicle,
    });
  }

  // Create some vehicle service records
  const serviceRecords = [
    {
      vehicleId: await getVehicleIdByLicensePlate(prisma, 'B 1234 ABC'),
      type: 'MAINTENANCE' as const,
      category: 'ENGINE' as const,
      title: 'Ganti Oli Mesin',
      description: 'Penggantian oli mesin rutin setiap 5000 km',
      serviceDate: new Date('2024-09-15'),
      cost: 150000,
      mileage: 45000,
      nextDueDate: new Date('2024-12-15'),
      vendor: 'Bengkel Jaya Motor',
      invoice: 'INV-2024-001',
      status: 'COMPLETED' as const
    },
    {
      vehicleId: await getVehicleIdByLicensePlate(prisma, 'B 7003 TJ'),
      type: 'REPAIR' as const,
      category: 'AC_HEATING' as const,
      title: 'Perbaikan AC',
      description: 'AC tidak dingin, perlu isi freon dan cek kompresor',
      serviceDate: new Date('2024-10-01'),
      cost: 850000,
      mileage: 78000,
      vendor: 'AC Mobil Specialist',
      invoice: 'INV-2024-002',
      status: 'IN_PROGRESS' as const
    }
  ];

  for (const record of serviceRecords) {
    if (record.vehicleId) {
      await prisma.vehicleServiceRecord.create({
        data: {
          ...record,
          vehicleId: record.vehicleId
        }
      });
    }
  }

  console.log('✅ Vehicles and service records seeded successfully');
}

// Helper function to get vehicle ID by license plate
async function getVehicleIdByLicensePlate(prisma: PrismaClient, licensePlate: string): Promise<string | null> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { licensePlate },
    select: { id: true }
  });
  return vehicle?.id || null;
}