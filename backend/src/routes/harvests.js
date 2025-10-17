import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient.js';
import { validate, asyncHandler } from '../utils.js';
import { requireRole } from '../middlewares/simpleAuth.js';

const r = Router();
const schema = z.object({
  plantingId: z.number().int().positive(),
  date: z.coerce.date(),
  quantityKg: z.number().positive(),
  quality: z.string().optional(),
});

r.get('/', asyncHandler(async (_req,res)=>{
  const items = await prisma.harvest.findMany({ orderBy: { date: 'desc' } });
  res.json(items);
}));

r.post('/', requireRole('admin'), asyncHandler(async (req,res)=>{
  const data = validate(schema, req.body);
  const created = await prisma.harvest.create({ data });
  res.status(201).json(created);
}));

// ...imports + schema ya existentes

r.put('/:id', requireRole('admin'), asyncHandler(async (req,res)=>{
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const data = validate(schema.partial(), req.body);
  const upd = await prisma.harvest.update({ where:{ id }, data });
  res.json(upd);
}));

r.delete('/:id', requireRole('admin'), asyncHandler(async (req,res)=>{
  const id = z.coerce.number().int().positive().parse(req.params.id);
  await prisma.harvest.delete({ where:{ id }});
  res.status(204).end();
}));

export default r;

