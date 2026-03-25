'use client'

import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartSummary() {
  const { totalItems, totalPrice } = useCartStore()

  return (
    <div className="glass rounded-2xl p-6 gold-glow">
      <div className="flex justify-between items-center mb-3">
        <span className="font-mono text-text-secondary text-sm">Total items</span>
        <span className="font-mono text-text-primary font-bold">{totalItems}</span>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border-studio to-transparent mb-3" />
      <div className="flex justify-between items-center mb-6">
        <span className="font-mono text-text-secondary text-sm">Total</span>
        <span className="font-mono text-accent-gold text-2xl font-bold">
          {formatPrice(totalPrice)}
        </span>
      </div>
      <button className="w-full btn-gold font-mono font-bold py-3.5 rounded-xl text-sm tracking-wide">
        Checkout
      </button>
    </div>
  )
}
