'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Logo } from '@/components/logo/Logo'
import { SearchBar } from './SearchBar'

export function Navbar() {
  const { totalItems } = useCartStore()
  const prevItems = useRef(totalItems)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  if (totalItems !== prevItems.current && badgeRef.current) {
    badgeRef.current.classList.remove('animate-bounce-in')
    void badgeRef.current.offsetWidth
    badgeRef.current.classList.add('animate-bounce-in')
    prevItems.current = totalItems
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-studio-base/90 backdrop-blur-xl border-b border-border-studio">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-text-muted hover:text-accent-gold transition-colors"
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 text-text-muted group-hover:text-accent-gold transition-colors duration-300" />
            {totalItems > 0 && (
              <span
                ref={badgeRef}
                className="absolute -top-2 -right-2 font-mono text-[10px] font-bold bg-accent-gold text-studio-base w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-accent-gold/20"
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-slide-down">
          <SearchBar />
        </div>
      )}
    </nav>
  )
}
