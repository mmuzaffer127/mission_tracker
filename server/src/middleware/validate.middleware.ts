import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
        });
      }
      return res.status(400).json({ error: 'Malformed request payload' });
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Query parameter validation failed',
          issues: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
        });
      }
      return res.status(400).json({ error: 'Malformed query parameters' });
    }
  };
}
