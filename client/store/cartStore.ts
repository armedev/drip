import { create } from 'zustand'
import { Cart, CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  setCart: (cart: Cart | null) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  setCart: (cart) => {
    const items = cart?.items ?? []
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0)
    set({ items, totalItems, totalPrice })
  },
  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
  totalItems: 0,
  totalPrice: 0,
}))
