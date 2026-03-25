import { Request, Response, NextFunction } from 'express'
import { addToCartSchema, updateCartSchema } from '../schemas/cart.schema'
import { getCart, addToCart, updateCartItem, removeFromCart, mergeGuestCart } from '../services/cart.service'

const getFilter = (req: Request) => {
  if (req.user) return { userId: req.user._id }
  const guestId = req.headers['x-guest-id'] as string
  if (guestId) return { guestId }
  return null
}

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = getFilter(req)
    if (!filter) { res.json({ items: [] }); return }
    const cart = await getCart(filter)
    res.json(cart)
  } catch (err) { next(err) }
}

export const add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = getFilter(req)
    if (!filter) { res.status(400).json({ message: 'No identity' }); return }
    const body = addToCartSchema.parse(req.body)
    const cart = await addToCart(filter, body.productId, body.quantity)
    res.json(cart)
  } catch (err) { next(err) }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = getFilter(req)
    if (!filter) { res.status(400).json({ message: 'No identity' }); return }
    const body = updateCartSchema.parse(req.body)
    const cart = await updateCartItem(filter, req.params.productId as string, body.quantity)
    res.json(cart)
  } catch (err) { next(err) }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = getFilter(req)
    if (!filter) { res.status(400).json({ message: 'No identity' }); return }
    const cart = await removeFromCart(filter, req.params.productId as string)
    res.json(cart)
  } catch (err) { next(err) }
}

export const merge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ message: 'Login required' }); return }
    const { guestId } = req.body
    if (!guestId) { res.status(400).json({ message: 'guestId required' }); return }
    const cart = await mergeGuestCart(req.user._id, guestId)
    res.json(cart)
  } catch (err) { next(err) }
}
