import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const chardonnay = await prisma.grapeType.upsert({
    where: { name: 'Chardonnay' },
    update: {},
    create: { name: 'Chardonnay' }
  });
  const sauvignon = await prisma.grapeType.upsert({
    where: { name: 'Sauvignon Blanc' },
    update: {},
    create: { name: 'Sauvignon Blanc' }
  });
  const p1 = await prisma.parcel.create({ data: { name: 'Parcela 1', location: 'Leyda Norte' } });
  const oidium = await prisma.disease.upsert({
    where: { name: 'Oídio' },
    update: {},
    create: { name: 'Oídio', severity: 'Media' }
  });
  const planting = await prisma.planting.create({
    data: { parcelId: p1.id, grapeTypeId: chardonnay.id, sowDate: new Date('2025-08-01'), labBrix: 14.2 }
  });
  await prisma.plantingDisease.create({ data: { plantingId: planting.id, diseaseId: oidium.id, notes: 'Manchas iniciales' } });
  await prisma.harvest.create({
    data: { plantingId: planting.id, date: new Date('2025-09-18'), quantityKg: 820.5, quality: 'A' }
  });
  console.log('Seed OK');
}

main().finally(async ()=> prisma.$disconnect());
