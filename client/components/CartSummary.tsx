'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/utils'
import { AuthModal } from './AuthModal'
import { CheckoutModal } from './CheckoutModal'

export function CartSummary() {
  const { totalItems, totalPrice } = useCartStore()
  const token = useAuthStore(s => s.token)
  const [authOpen, setAuthOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    if (!token) {
      setAuthOpen(true)
      return
    }
    setCheckoutOpen(true)
  }

  return (
    <>
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
        <button
          onClick={handleCheckout}
          className="w-full btn-gold font-mono font-bold py-3.5 rounded-xl text-sm tracking-wide"
        >
          Checkout
        </button>
        {!token && (
          <p className="text-text-muted text-[10px] font-mono text-center mt-2">Login required to checkout</p>
        )}
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
