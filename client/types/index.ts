export interface Product {
  _id: string
  name: string
  type: string
  gender: 'male' | 'female' | 'unisex'
  colour: string
  price: number
  quantity: number
  imageUrl: string
  addedBy: string
  createdAt: string
}

export interface ProductFilters {
  search?: string
  gender?: string
  colours?: string[]
  types?: string[]
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export interface CartItem {
  productId: Product
  quantity: number
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
}
