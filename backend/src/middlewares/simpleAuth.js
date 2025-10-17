import jwt from 'jsonwebtoken';

export function createToken(payload){
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
}

export function jwtCheck(req, res, next){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'missing token' });
  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET); // { email, role, name }
    next();
  } catch {
    return res.status(401).json({ message: 'invalid or expired token' });
  }
}

export function requireRole(...allowed){
  return (req, _res, next) => {
    const role = req.auth?.role;
    if (!role || !allowed.includes(role)) {
      const err = new Error('forbidden: role');
      err.status = 403;
      throw err;
    }
    next();
  };
}
