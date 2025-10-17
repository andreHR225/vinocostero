import { Router } from 'express';
import auth from './auth.js';
import parcels from './parcels.js';
import grapes from './grapes.js';
import diseases from './diseases.js';
import plantings from './plantings.js';
import harvests from './harvests.js';
import indicators from './indicators.js';
import { jwtCheck } from '../middlewares/simpleAuth.js';

const r = Router();

r.use('/auth', auth);   // público: /auth/login, /auth/me

// a partir de aquí, todo protegido
r.use(jwtCheck);
r.use('/parcels', parcels);
r.use('/grapes', grapes);
r.use('/diseases', diseases);
r.use('/plantings', plantings);
r.use('/harvests', harvests);
r.use('/indicators', indicators);

export default r;

