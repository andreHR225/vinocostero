import { Router } from 'express';
import parcels from './parcels.js';
import grapes from './grapes.js';
import diseases from './diseases.js';
import plantings from './plantings.js';
import harvests from './harvests.js';
import indicators from './indicators.js';

const r = Router();
r.use('/parcels', parcels);
r.use('/grapes', grapes);
r.use('/diseases', diseases);
r.use('/plantings', plantings);
r.use('/harvests', harvests);
r.use('/indicators', indicators);
export default r;
