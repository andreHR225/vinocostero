import { Router } from 'express';
import { prisma } from '../prismaClient.js';
import { z } from 'zod';
import { idParam, validate, asyncHandler } from '../utils.js';
const r = Router();
const createSchema = z.object({
  parcelId: z.number().int().positive(),
  grapeTypeId: z.number().int().positive(),
  sowDate: z.coerce.date(),
  labBrix: z.number().optional(),
  status: z.enum(['ACTIVE','SICK','HARVESTED']).optional(),
});
r.get('/', asyncHandler(async (_req, res)=>{
  const items = await prisma.planting.findMany({ orderBy: { id: 'desc' }, include: { Parcel: true, GrapeType: true, diseases: { include: { Disease: true } }, harvests: true } });
  res.json(items);
}));
r.get('/:id', asyncHandler(async (req, res)=>{
  const { id } = validate(idParam, req.params);
  const item = await prisma.planting.findUnique({ where: { id }, include: { Parcel: true, GrapeType: true, diseases: { include: { Disease: true } }, harvests: true } });
  if(!item) return res.status(404).json({ message: 'planting not found' });
  res.json(item);
}));
r.post('/', asyncHandler(async (req, res)=>{
  const data = validate(createSchema, req.body);
  const created = await prisma.planting.create({ data });
  res.status(201).json(created);
}));
r.put('/:id', asyncHandler(async (req, res)=>{
  const { id } = validate(idParam, req.params);
  const data = validate(createSchema.partial(), req.body);
  const updated = await prisma.planting.update({ where: { id }, data });
  res.json(updated);
}));
r.post('/:id/diseases/:diseaseId', asyncHandler(async (req, res)=>{
  const { id } = validate(idParam, req.params);
  const diseaseId = Number(req.params.diseaseId);
  await prisma.plantingDisease.upsert({ where: { plantingId_diseaseId: { plantingId: id, diseaseId } }, update: {}, create: { plantingId: id, diseaseId } });
  res.status(204).end();
}));
export default r;
