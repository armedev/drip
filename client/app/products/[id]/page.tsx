'use client'

import { Suspense, use, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useAddToCart } from '@/hooks/useCart'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { TShirt3D } from '@/components/TShirt3D'
import { ProductGrid } from '@/components/ProductGrid'
import { useProducts } from '@/hooks/useProducts'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: product, isLoading } = useProduct(id)
  const [qty, setQty] = useState(1)
  const addToCart = useAddToCart()
  const items = useCartStore(s => s.items)
  const [added, setAdded] = useState(false)

  const cartItem = product ? items.find(i => i.productId._id === product._id) : null
  const inCart = cartItem?.quantity ?? 0
  const atMax = product ? inCart + qty > product.quantity : false
  const outOfStock = product?.quantity === 0

  const { data: related } = useProducts({
    gender: product?.gender,
    limit: 3,
  })

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-studio-elevated/50 rounded w-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-studio-elevated/50 rounded-2xl" />
            <div className="space-y-4 py-4">
              <div className="h-8 bg-studio-elevated/50 rounded w-3/4" />
              <div className="h-4 bg-studio-elevated/50 rounded w-1/3" />
              <div className="h-10 bg-studio-elevated/50 rounded w-1/4" />
              <div className="h-12 bg-studio-elevated/50 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center py-20">
        <p className="text-text-secondary text-lg">Product not found</p>
        <Link href="/" className="text-accent-gold font-mono text-sm mt-4 inline-block hover:text-accent-gold-dim">
          ← Back to shop
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product._id, quantity: qty },
      {
        onSuccess: () => {
          setAdded(true)
          setTimeout(() => setAdded(false), 2000)
        },
      }
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-text-muted text-sm font-mono hover:text-accent-gold transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl overflow-hidden glass-card relative">
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[4, 4, 4]} intensity={1} />
              <pointLight position={[-3, 2, 3]} intensity={0.6} color="#e8c27a" />
              <pointLight position={[3, -1, 2]} intensity={0.3} color="#4a90d9" />
              <Suspense fallback={null}>
                <TShirt3D color={getColourHex(product.colour)} autoRotate />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-accent-gold/90 text-studio-base text-[10px] font-mono font-bold px-2 py-1 rounded-full">
              3D PREVIEW
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-text-primary text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-text-muted font-mono text-sm uppercase tracking-wider mb-4">
            {product.type} · {product.gender} · {product.colour}
          </p>
          <p className="text-accent-gold font-mono text-3xl font-bold mb-6">
            {formatPrice(product.price)}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-text-secondary text-sm font-mono">Quantity</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 glass-light rounded-lg text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-text-primary w-12 text-center text-lg">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                disabled={inCart + qty >= product.quantity}
                className="w-9 h-9 glass-light rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {atMax && (
            <p className="text-error text-xs font-mono mb-3">Only {product.quantity - inCart} more available (you have {inCart} in cart)</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={outOfStock || atMax || addToCart.isPending}
            className={`w-full font-mono font-bold py-4 rounded-xl text-sm transition-all duration-300 ${
              added
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'btn-gold disabled:opacity-30 disabled:cursor-not-allowed disabled:after:hidden'
            }`}
          >
            {outOfStock ? 'Out of stock' : addToCart.isPending ? 'Adding...' : added ? '✓ Added to cart' : `Add to Cart — ${formatPrice(product.price * qty)}`}
          </button>

          <div className="mt-8 pt-6 border-t border-border-studio">
            <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">Details</p>
            <ul className="space-y-1.5 text-text-secondary text-sm">
              <li>· Premium cotton blend</li>
              <li>· {product.quantity} in stock</li>
              <li>· Free shipping on orders above ₹999</li>
              <li>· 30-day easy returns</li>
            </ul>
          </div>
        </div>
      </div>

      {related?.products?.length ? (
        <div className="mt-16">
          <h2 className="text-text-primary text-xl font-bold mb-6">You might also like</h2>
          <ProductGrid
            products={related.products.filter((p: any) => p._id !== product._id).slice(0, 3)}
            isLoading={false}
          />
        </div>
      ) : null}
    </div>
  )
}

function getColourHex(colour: string): string {
  const map: Record<string, string> = {
    white: '#f5f5f5', black: '#1a1a1a', grey: '#6b6b6b', navy: '#1e3a5f',
    blue: '#4a90d9', green: '#4a7c59', pink: '#d4738a', orange: '#c47a3a',
    cream: '#f5e6c8',
  }
  return map[colour.toLowerCase()] || '#e8c27a'
}
