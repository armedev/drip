import Cart from '../models/Cart.model'
import Product from '../models/Product.model'
import { createError } from '../middleware/error.middleware'

type CartFilter = { userId: string } | { guestId: string }

const populate = (query: any) => query.populate('items.productId')

export const getCart = async (filter: CartFilter) => {
  const cart = await populate(Cart.findOne(filter))
  if (!cart) return { ...filter, items: [] }
  return cart
}

export const addToCart = async (filter: CartFilter, productId: string, quantity: number) => {
  const product = await Product.findById(productId)
  if (!product) throw createError('Product not found', 404)

  let cart = await Cart.findOne(filter)
  if (!cart) cart = await Cart.create({ ...filter, items: [] })

  const existingItem = cart.items.find(i => i.productId.toString() === productId)
  const currentQty = existingItem?.quantity ?? 0
  const newQty = currentQty + quantity

  if (newQty > product.quantity) {
    throw createError(`Only ${product.quantity} available. You have ${currentQty} in cart.`, 400)
  }

  if (existingItem) {
    existingItem.quantity = newQty
  } else {
    cart.items.push({ productId: product._id, quantity } as any)
  }

  await cart.save()
  return populate(Cart.findOne(filter))
}

export const updateCartItem = async (filter: CartFilter, productId: string, quantity: number) => {
  const product = await Product.findById(productId)
  if (!product) throw createError('Product not found', 404)
  if (quantity > product.quantity) throw createError(`Only ${product.quantity} available.`, 400)

  const cart = await Cart.findOne(filter)
  if (!cart) throw createError('Cart not found', 404)

  const item = cart.items.find(i => i.productId.toString() === productId)
  if (!item) throw createError('Item not in cart', 404)

  item.quantity = quantity
  await cart.save()
  return populate(Cart.findOne(filter))
}

export const removeFromCart = async (filter: CartFilter, productId: string) => {
  const cart = await Cart.findOne(filter)
  if (!cart) throw createError('Cart not found', 404)
  cart.items = cart.items.filter(i => i.productId.toString() !== productId)
  await cart.save()
  return populate(Cart.findOne(filter))
}

export const mergeGuestCart = async (userId: string, guestId: string) => {
  const guestCart = await Cart.findOne({ guestId })
  if (!guestCart || guestCart.items.length === 0) {
    await Cart.deleteMany({ guestId })
    return getCart({ userId })
  }

  let userCart = await Cart.findOne({ userId })
  if (!userCart) userCart = await Cart.create({ userId, items: [] })

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(i => i.productId.toString() === guestItem.productId.toString())
    if (existing) {
      existing.quantity = Math.max(existing.quantity, guestItem.quantity)
    } else {
      userCart.items.push(guestItem)
    }
  }

  await userCart.save()
  await Cart.deleteMany({ guestId })
  return populate(Cart.findOne({ userId }))
}
