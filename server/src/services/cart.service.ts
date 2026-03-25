import Cart from '../models/Cart.model'
import Product from '../models/Product.model'
import { createError } from '../middleware/error.middleware'

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId')
  if (!cart) return { userId, items: [] }
  return cart
}

export const addToCart = async (userId: string, productId: string, quantity: number) => {
  const product = await Product.findById(productId)
  if (!product) throw createError('Product not found', 404)

  let cart = await Cart.findOne({ userId })
  if (!cart) cart = await Cart.create({ userId, items: [] })

  const existingItem = cart.items.find(i => i.productId.toString() === productId)
  const currentQty = existingItem?.quantity ?? 0
  const newQty = currentQty + quantity

  if (newQty > product.quantity) {
    throw createError(`Only ${product.quantity} items available. You already have ${currentQty} in cart.`, 400)
  }

  if (existingItem) {
    existingItem.quantity = newQty
  } else {
    cart.items.push({ productId: product._id, quantity } as any)
  }

  await cart.save()
  return Cart.findOne({ userId }).populate('items.productId')
}

export const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  const product = await Product.findById(productId)
  if (!product) throw createError('Product not found', 404)
  if (quantity > product.quantity) {
    throw createError(`Only ${product.quantity} items available.`, 400)
  }

  const cart = await Cart.findOne({ userId })
  if (!cart) throw createError('Cart not found', 404)

  const item = cart.items.find(i => i.productId.toString() === productId)
  if (!item) throw createError('Item not in cart', 404)

  item.quantity = quantity
  await cart.save()
  return Cart.findOne({ userId }).populate('items.productId')
}

export const removeFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ userId })
  if (!cart) throw createError('Cart not found', 404)
  cart.items = cart.items.filter(i => i.productId.toString() !== productId)
  await cart.save()
  return Cart.findOne({ userId }).populate('items.productId')
}
