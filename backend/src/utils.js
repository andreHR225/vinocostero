import { z } from 'zod';
export const idParam = z.object({ id: z.coerce.number().int().positive() });
export function validate(schema, data) {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ValidationError');
    e.status = 422;
    e.details = r.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
    throw e;
  }
  return r.data;
}
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next);
