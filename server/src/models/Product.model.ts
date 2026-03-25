import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  type: string
  gender: 'male' | 'female' | 'unisex'
  colour: string
  price: number
  quantity: number
  imageUrl: string
  addedBy: mongoose.Types.ObjectId
  createdAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name:     { type: String, required: true, trim: true },
  type:     { type: String, required: true, trim: true },
  gender:   { type: String, required: true, enum: ['male', 'female', 'unisex'] },
  colour:   { type: String, required: true, trim: true },
  price:    { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  addedBy:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

ProductSchema.index({ name: 'text', type: 'text', gender: 'text' })

export default mongoose.model<IProduct>('Product', ProductSchema)
