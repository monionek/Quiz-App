import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../utils/jwtGenerator';
import { envConfig } from '../config/config';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  jwt.verify(token, envConfig.jwtSecret, (err, user) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    req.user = user as JwtPayload;
    next();
  });
};
