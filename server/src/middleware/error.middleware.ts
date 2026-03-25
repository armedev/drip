import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  errors?: Record<string, string>
}

export const errorMiddleware = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  const status = err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(err.errors && { errors: err.errors }),
  })
}

export const createError = (message: string, statusCode = 400): AppError => {
  const err: AppError = new Error(message)
  err.statusCode = statusCode
  return err
}
