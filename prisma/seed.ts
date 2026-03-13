import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gearhead.app' },
    update: {},
    create: {
      email: 'admin@gearhead.app',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'EXHIBITOR',
    },
  });

  // Crear evento Night Meet
  const nightMeet = await prisma.event.upsert({
    where: { id: 'seed-event-night-meet' },
    update: {},
    create: {
      id: 'seed-event-night-meet',
      name: 'Night Meet',
      description: 'Encuentro nocturno para amantes del motor. Exóticos, clásicos y proyectos.',
      date: new Date('2025-06-15T21:00:00Z'),
      venue: 'Autódromo Buenos Aires',
      capacity: 500,
      ticketPrice: 25.0,
      status: 'PUBLISHED',
    },
  });

  // Crear 3 autos de prueba
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { id: 'seed-vehicle-ferrari' },
      update: {},
      create: {
        id: 'seed-vehicle-ferrari',
        userId: admin.id,
        brand: 'Ferrari',
        model: '488 Pista',
        year: 2019,
        photos: ['https://placehold.co/800x500/1a1a1a/e53935?text=Ferrari+488+Pista'],
        status: 'APPROVED',
        approvedAt: new Date(),
        mods: {
          engine: 'F154CD twin-turbo V8',
          power: '720 hp',
          suspension: 'Magnetorheological',
        },
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 'seed-vehicle-lambo' },
      update: {},
      create: {
        id: 'seed-vehicle-lambo',
        userId: admin.id,
        brand: 'Lamborghini',
        model: 'Aventador SVJ',
        year: 2020,
        photos: ['https://placehold.co/800x500/1a1a1a/e53935?text=Lamborghini+Aventador+SVJ'],
        status: 'APPROVED',
        approvedAt: new Date(),
        mods: {
          engine: '6.5L V12 naturally aspirated',
          power: '770 hp',
          aero: 'ALA 2.0',
        },
      },
    }),
    prisma.vehicle.upsert({
      where: { id: 'seed-vehicle-skyline' },
      update: {},
      create: {
        id: 'seed-vehicle-skyline',
        userId: admin.id,
        brand: 'Nissan',
        model: 'Skyline R34 GT-R',
        year: 2002,
        photos: ['https://placehold.co/800x500/1a1a1a/e53935?text=Nissan+Skyline+R34+GT-R'],
        status: 'APPROVED',
        approvedAt: new Date(),
        mods: {
          engine: 'RB26DETT twin-turbo',
          power: '280 hp (stock)',
          transmission: '6-speed Getrag',
        },
      },
    }),
  ]);

  // Crear Applications para que los autos participen en Night Meet
  for (const vehicle of vehicles) {
    await prisma.application.upsert({
      where: {
        vehicleId_eventId: {
          vehicleId: vehicle.id,
          eventId: nightMeet.id,
        },
      },
      update: {},
      create: {
        vehicleId: vehicle.id,
        eventId: nightMeet.id,
        status: 'APPROVED',
      },
    });
  }

  console.log('Seed completado:');
  console.log('- Usuario Admin:', admin.email);
  console.log('- Evento:', nightMeet.name);
  console.log('- Autos:', vehicles.map((v) => `${v.brand} ${v.model}`).join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
