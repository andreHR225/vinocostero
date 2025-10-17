import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient.js';
import { idParam, validate, asyncHandler } from '../utils.js';
import { requireRole } from '../middlewares/simpleAuth.js';

const r = Router();
const schema = z.object({
  name: z.string().min(1),
  notes: z.string().optional()
});

r.get('/', asyncHandler(async (_req,res)=>{
  res.json(await prisma.grapeType.findMany({ orderBy:{ name:'asc' } }));
}));

r.get('/:id', asyncHandler(async (req,res)=>{
  const {id}=validate(idParam, req.params);
  const it=await prisma.grapeType.findUnique({ where:{id} });
  if(!it) return res.status(404).json({message:'grapeType not found'});
  res.json(it);
}));

r.post('/', requireRole('admin'), asyncHandler(async (req,res)=>{
  const data=validate(schema, req.body);
  const created=await prisma.grapeType.create({ data });
  res.status(201).json(created);
}));

r.put('/:id', requireRole('admin'), asyncHandler(async (req,res)=>{
  const {id}=validate(idParam, req.params);
  const data=validate(schema.partial(), req.body);
  const upd=await prisma.grapeType.update({ where:{id}, data });
  res.json(upd);
}));

r.delete('/:id', requireRole('admin'), asyncHandler(async (req,res)=>{
  const {id}=validate(idParam, req.params);
  await prisma.grapeType.delete({ where:{id} });
  res.status(204).end();
}));

export default r;
