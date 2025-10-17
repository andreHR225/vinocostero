import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient.js';
import { idParam, validate, asyncHandler } from '../utils.js';
import { requireRole } from '../middlewares/simpleAuth.js';

const r = Router();

const baseSchema = z.object({
  parcelId: z.number().int().positive(),
  grapeTypeId: z.number().int().positive(),
  sowDate: z.coerce.date(),
  labBrix: z.number().optional(),
  status: z.enum(['ACTIVE','SICK','HARVESTED']).optional(),
});

r.get('/', asyncHandler(async (_req,res)=>{
  const items = await prisma.planting.findMany({
    orderBy: { id: 'desc' },
    include: {
      Parcel: true,
      GrapeType: true,
      diseases: { include: { Disease: true } },
      harvests: true
    }
  });
  res.json(items);
}));

r.get('/:id', asyncHandler(async (req,res)=>{
  const { id } = validate(idParam, req.params);
  const it = await prisma.planting.findUnique({
    where: { id },
    include: {
      Parcel: true, GrapeType: true,
      diseases: { include: { Disease: true } },
      harvests: true
    }
  });
  if(!it) return res.status(404).json({ message: 'planting not found' });
  res.json(it);
}));

r.post('/', requireRole('admin'), asyncHandler(async (req,res)=>{
  const data = validate(baseSchema, req.body);
  const created = await prisma.planting.create({ data });
  res.status(201).json(created);
}));

r.put('/:id', requireRole('admin'), asyncHandler(async (req,res)=>{
  const { id } = validate(idParam, req.params);
  const data = validate(baseSchema.partial(), req.body);
  const updated = await prisma.planting.update({ where: { id }, data });
  res.json(updated);
}));



// Asociar una enfermedad a la siembra (N:M)
r.post('/:id/diseases/:diseaseId', requireRole('admin'), asyncHandler(async (req,res)=>{
  const { id } = validate(idParam, req.params);
  const diseaseId = z.coerce.number().int().positive().parse(req.params.diseaseId);
  await prisma.plantingDisease.upsert({
    where: { plantingId_diseaseId: { plantingId: id, diseaseId } },
    update: {},
    create: { plantingId: id, diseaseId }
  });
  res.status(204).end();
}));


// ...imports y rutas que ya tienes arriba

// Eliminar siembra (borra dependencias primero por seguridad)
r.delete('/:id', requireRole('admin'), asyncHandler(async (req,res)=>{
  const id = z.coerce.number().int().positive().parse(req.params.id);
  await prisma.$transaction([
    prisma.plantingDisease.deleteMany({ where:{ plantingId:id } }),
    prisma.harvest.deleteMany({ where:{ plantingId:id } }),
    prisma.planting.delete({ where:{ id } })
  ]);
  res.status(204).end();
}));

export default r;
