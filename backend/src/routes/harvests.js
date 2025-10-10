import { Router } from 'express';
import { prisma } from '../prismaClient.js';
import { z } from 'zod';
import { validate, asyncHandler } from '../utils.js';
const r = Router();
const schema = z.object({
  plantingId: z.number().int().positive(),
  date: z.coerce.date(),
  quantityKg: z.number().positive(),
  quality: z.string().optional(),
});
r.get('/', asyncHandler(async (_req, res)=>{
  const items = await prisma.harvest.findMany({ orderBy: { date: 'desc' } });
  res.json(items);
}));
r.post('/', asyncHandler(async (req, res)=>{
  const data = validate(schema, req.body);
  const created = await prisma.harvest.create({ data });
  res.status(201).json(created);
}));
export default r;
