import mongoose, { Document, Schema } from 'mongoose'

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId
  guestId?: string
  items: ICartItem[]
  updatedAt: Date
}

const CartSchema = new Schema<ICart>({
  userId:  { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
  guestId: { type: String, sparse: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity:  { type: Number, required: true, min: 1 },
  }],
}, { timestamps: true })

export default mongoose.model<ICart>('Cart', CartSchema)
