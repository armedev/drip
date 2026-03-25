'use client'

import { Product } from '@/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[] | undefined
  isLoading: boolean
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl md:rounded-2xl animate-pulse">
            <div className="aspect-square bg-studio-elevated/50" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-studio-elevated/50 rounded-lg w-3/4" />
              <div className="h-3 bg-studio-elevated/50 rounded-lg w-1/2" />
              <div className="h-5 bg-studio-elevated/50 rounded-lg w-1/3" />
              <div className="h-10 bg-studio-elevated/50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-studio-elevated/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-text-secondary text-lg font-medium">No products found</p>
        <p className="text-text-muted text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </div>
  )
}
