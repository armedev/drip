import { Request, Response, NextFunction } from 'express'
import { createProductSchema, productQuerySchema } from '../schemas/product.schema'
import { getProducts, getProductById, createProduct, deleteProduct } from '../services/product.service'

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = productQuerySchema.parse(req.query)
    const result = await getProducts(query as any)
    res.json(result)
  } catch (err) { next(err) }
}

export const detail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await getProductById(req.params.id as string)
    res.json(product)
  } catch (err) { next(err) }
}

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createProductSchema.parse(req.body)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''
    const product = await createProduct(data, imageUrl, '000000000000000000000001')
    res.status(201).json(product)
  } catch (err) { next(err) }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteProduct(req.params.id as string)
    res.json({ message: 'Product deleted' })
  } catch (err) { next(err) }
}
