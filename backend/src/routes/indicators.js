import { Router } from 'express';
import { prisma } from '../prismaClient.js';
import { asyncHandler } from '../utils.js';
const r = Router();
r.get('/harvest-readiness/:plantingId', asyncHandler(async (req, res)=>{
  const plantingId = Number(req.params.plantingId);
  const p = await prisma.planting.findUnique({ where: { id: plantingId }, include: { harvests: true } });
  if (!p) return res.status(404).json({ message: 'planting not found' });
  const ready = (p.labBrix ?? 0) >= 22 || (p.harvests?.length ?? 0) > 0;
  res.json({ plantingId, ready, basis: (p.labBrix ?? 0) >= 22 ? 'Brix>=22' : (p.harvests.length>0 ? 'Harvest exists' : 'Not ready') });
}));
export default r;
