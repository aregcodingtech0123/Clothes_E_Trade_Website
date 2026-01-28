import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { asyncHandler } from '../utils/asyncHandler'; // Yeni oluşturduğumuz yardımcı fonksiyon
import { JWT_SECRET } from '../config';




declare module 'express' {
  interface Request {
    user?: {
      id: number;
      isAdmin: boolean;
    };
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number, isAdmin: boolean };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: user.id, isAdmin: user.isAdmin };



    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export const adminOnly = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
});