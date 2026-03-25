import { Request, Response, NextFunction } from 'express'
import { addToCartSchema, updateCartSchema } from '../schemas/cart.schema'
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/cart.service'

const USER_ID = '000000000000000000000001'

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await getCart(USER_ID)
    res.json(cart)
  } catch (err) { next(err) }
}

export const add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = addToCartSchema.parse(req.body)
    const cart = await addToCart(USER_ID, body.productId, body.quantity)
    res.json(cart)
  } catch (err) { next(err) }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = updateCartSchema.parse(req.body)
    const cart = await updateCartItem(USER_ID, req.params.productId as string, body.quantity)
    res.json(cart)
  } catch (err) { next(err) }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await removeFromCart(USER_ID, req.params.productId as string)
    res.json(cart)
  } catch (err) { next(err) }
}
