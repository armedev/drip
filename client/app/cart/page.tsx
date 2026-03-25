'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/CartItem'
import { CartSummary } from '@/components/CartSummary'

export default function CartPage() {
  const { data, isLoading } = useCart()

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-text-primary text-3xl font-bold">Your Cart</h1>
        <Link href="/" className="text-text-muted text-sm font-mono hover:text-accent-gold transition-colors">
          ← Continue shopping
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-studio-elevated/50 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-studio-elevated/50 rounded-lg w-1/2" />
                  <div className="h-3 bg-studio-elevated/50 rounded-lg w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data?.items?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {data.items.map(item => (
              <CartItem key={item.productId._id} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-studio-elevated/50 flex items-center justify-center">
            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-text-secondary text-lg font-medium mb-1">Your cart is empty</p>
          <p className="text-text-muted text-sm mb-6">Add some products to get started</p>
          <Link href="/" className="btn-gold font-mono px-6 py-3 rounded-xl text-sm inline-block">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  )
}
