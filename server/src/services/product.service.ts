import Product from '../models/Product.model'
import { CreateProductInput, ProductQuery } from '../schemas/product.schema'
import { createError } from '../middleware/error.middleware'

export const getProducts = async (query: ProductQuery) => {
  const { search, gender, colours, types, minPrice, maxPrice, page, limit } = query
  const filter: Record<string, any> = {}

  if (search) filter.$text = { $search: search }
  if (gender) filter.gender = gender

  if (colours) {
    const arr = Array.isArray(colours) ? colours : [colours]
    if (arr.length) filter.colour = { $in: arr }
  }

  if (types) {
    const arr = Array.isArray(types) ? types : [types]
    if (arr.length) filter.type = { $in: arr }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {}
    if (minPrice !== undefined) filter.price.$gte = minPrice
    if (maxPrice !== undefined) filter.price.$lte = maxPrice
  }

  const skip = (page - 1) * limit
  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ])

  return { products, total, page, totalPages: Math.ceil(total / limit) }
}

export const getProductById = async (id: string) => {
  const product = await Product.findById(id)
  if (!product) throw createError('Product not found', 404)
  return product
}

export const createProduct = async (data: CreateProductInput, imageUrl: string, userId: string) => {
  return Product.create({ ...data, imageUrl, addedBy: userId })
}

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id)
  if (!product) throw createError('Product not found', 404)
  return product
}
