'use client'

import { useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { TShirtSvg, getColourHex } from '@/components/TShirtSvg'
import { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveFromCart()
  const product = item.productId
  const atMax = item.quantity >= product.quantity

  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4 animate-slide-up">
      <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-studio-elevated border border-border-studio flex items-center justify-center p-2">
        <TShirtSvg color={getColourHex(product.colour)} className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-text-primary font-medium truncate">{product.name}</h3>
        <p className="text-text-muted text-xs font-mono uppercase tracking-wider mt-0.5">
          {product.type} · {product.gender}
        </p>
        <p className="text-accent-gold font-mono font-bold mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            if (item.quantity <= 1) {
              removeItem.mutate(product._id)
            } else {
              updateItem.mutate({ productId: product._id, quantity: item.quantity - 1 })
            }
          }}
          disabled={updateItem.isPending || removeItem.isPending}
          className="w-8 h-8 glass-light rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200 font-mono text-sm cursor-pointer disabled:opacity-30"
        >
          −
        </button>
        <span className="font-mono text-text-primary w-10 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateItem.mutate({ productId: product._id, quantity: item.quantity + 1 })}
          disabled={atMax || updateItem.isPending}
          className="w-8 h-8 glass-light rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-mono text-sm cursor-pointer"
        >
          +
        </button>
      </div>
      {atMax && (
        <p className="text-error text-[10px] font-mono">Max reached</p>
      )}
      <button
        onClick={() => removeItem.mutate(product._id)}
        disabled={removeItem.isPending}
        className="text-text-muted hover:text-error hover:drop-shadow-[0_0_8px_rgba(224,92,92,0.3)] text-lg ml-1 transition-all duration-300 cursor-pointer disabled:opacity-30"
      >
        ×
      </button>
    </div>
  )
}
