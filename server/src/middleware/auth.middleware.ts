import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { next(); return }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string; email: string }
    req.user = decoded
    next()
  } catch {
    next()
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) { res.status(401).json({ message: 'Login required' }); return }
  next()
}
