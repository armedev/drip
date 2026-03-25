import { Request, Response, NextFunction } from 'express'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { registerUser, loginUser } from '../services/auth.service'

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body)
    const result = await registerUser(data.name, data.email, data.password)
    res.status(201).json(result)
  } catch (err) { next(err) }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await loginUser(data.email, data.password)
    res.json(result)
  } catch (err) { next(err) }
}
