import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.model'
import { createError } from '../middleware/error.middleware'

export const registerUser = async (name: string, email: string, password: string) => {
  const exists = await User.findOne({ email })
  if (exists) throw createError('Email already registered', 409)
  const hashed = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, password: hashed })
  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' } as any)
  return { user: { _id: user._id, name: user.name, email: user.email }, token }
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) throw createError('Invalid credentials', 401)
  const match = await bcrypt.compare(password, user.password)
  if (!match) throw createError('Invalid credentials', 401)
  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' } as any)
  return { user: { _id: user._id, name: user.name, email: user.email }, token }
}
