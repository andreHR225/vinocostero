import { Router } from 'express';
import { z } from 'zod';
import { users } from '../config/users.js';
import { createToken, jwtCheck } from '../middlewares/simpleAuth.js';

const r = Router();
const credSchema = z.object({ email: z.string().email(), password: z.string().min(3) });

r.post('/login', (req, res) => {
  const creds = credSchema.safeParse(req.body);
  if (!creds.success) return res.status(400).json({ message: 'invalid credentials' });
  const { email, password } = creds.data;
  const u = users.find(x => x.email === email && x.password === password);
  if (!u) return res.status(401).json({ message: 'email or password incorrect' });
  const token = createToken({ email: u.email, role: u.role, name: u.name });
  res.json({ token, profile: { email: u.email, name: u.name, role: u.role } });
});

r.get('/me', jwtCheck, (req, res) => {
  const { email, role, name, exp } = req.auth || {};
  res.json({ email, role, name, exp });
});

export default r;
