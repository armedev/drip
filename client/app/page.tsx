'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { useFilterStore } from '@/store/filterStore'
import { useProducts } from '@/hooks/useProducts'
import { FilterSidebar } from '@/components/FilterSidebar'
import { ProductGrid } from '@/components/ProductGrid'
import { HeroBanner } from '@/components/HeroBanner'
import { BottomSheet } from '@/components/BottomSheet'

function FilterContent() {
  const filters = useFilterStore()
  const { data } = useProducts({ page: 1, limit: 100 })

  const allColours = [...new Set(data?.products.map(p => p.colour) ?? [])]
  const allTypes = [...new Set(data?.products.map(p => p.type) ?? [])]

  const genderOptions = ['male', 'female', 'unisex']

  return (
    <div>
      <div className="mb-6">
        <label className="flex items-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1 h-4 bg-accent-gold rounded-full" />
          Gender
        </label>
        <div className="space-y-1">
          <label className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
            <input type="radio" name="gender-mobile" checked={!filters.gender} onChange={() => filters.setGender('')} className="accent-accent-gold" />
            <span className="text-text-primary text-sm">All</span>
          </label>
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
              <input type="radio" name="gender-mobile" checked={filters.gender === g} onChange={() => filters.setGender(g)} className="accent-accent-gold" />
              <span className="text-text-primary text-sm capitalize">{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1 h-4 bg-accent-gold rounded-full" />
          Colour
        </label>
        <div className="space-y-1">
          {allColours.map(c => (
            <label key={c} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
              <input type="checkbox" checked={filters.colours.includes(c)} onChange={() => filters.toggleColour(c)} className="accent-accent-gold" />
              <span className="text-text-primary text-sm capitalize">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1 h-4 bg-accent-gold rounded-full" />
          Type
        </label>
        <div className="space-y-1">
          {allTypes.map(t => (
            <label key={t} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
              <input type="checkbox" checked={filters.types.includes(t)} onChange={() => filters.toggleType(t)} className="accent-accent-gold" />
              <span className="text-text-primary text-sm capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1 h-4 bg-accent-gold rounded-full" />
          Price range
        </label>
        <div className="space-y-3 px-3">
          <input type="range" min={0} max={5000} value={filters.minPrice} onChange={e => filters.setPriceRange(Number(e.target.value), filters.maxPrice)} className="w-full accent-accent-gold" />
          <input type="range" min={0} max={5000} value={filters.maxPrice} onChange={e => filters.setPriceRange(filters.minPrice, Number(e.target.value))} className="w-full accent-accent-gold" />
          <div className="flex justify-between font-mono text-accent-gold text-xs">
            <span>₹{filters.minPrice}</span>
            <span>₹{filters.maxPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductListing() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filters = useFilterStore()
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const s = searchParams.get('search') ?? ''
    const g = searchParams.get('gender') ?? ''
    const c = searchParams.get('colours')?.split(',').filter(Boolean) ?? []
    const t = searchParams.get('types')?.split(',').filter(Boolean) ?? []
    const min = Number(searchParams.get('minPrice')) || 0
    const max = Number(searchParams.get('maxPrice')) || 5000
    const p = Number(searchParams.get('page')) || 1

    useFilterStore.setState({ search: s, gender: g, colours: c, types: t, minPrice: min, maxPrice: max, page: p })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.gender) params.set('gender', filters.gender)
    if (filters.colours.length) params.set('colours', filters.colours.join(','))
    if (filters.types.length) params.set('types', filters.types.join(','))
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice < 5000) params.set('maxPrice', String(filters.maxPrice))
    if (filters.page > 1) params.set('page', String(filters.page))
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [filters, router])

  const { data, isLoading } = useProducts({
    search: filters.search || undefined,
    gender: filters.gender || undefined,
    colours: filters.colours.length ? filters.colours : undefined,
    types: filters.types.length ? filters.types : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice < 5000 ? filters.maxPrice : undefined,
    page: filters.page,
  })

  const hasActiveFilters = filters.gender || filters.colours.length > 0 || filters.types.length > 0 || filters.minPrice > 0 || filters.maxPrice < 5000

  return (
    <div className="min-h-screen">
      <FilterSidebar />
      <HeroBanner />
      <div id="products" className="px-4 md:px-6 lg:px-8 pb-12 lg:ml-64">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-text-primary text-lg md:text-2xl font-bold">
              {filters.search ? `Results for "${filters.search}"` : 'All Products'}
            </h2>
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-mono text-text-secondary bg-studio-elevated px-3 py-1.5 rounded-lg border border-border-studio hover:text-accent-gold hover:border-accent-gold/30 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && <span className="w-1.5 h-1.5 bg-accent-gold rounded-full" />}
            </button>
          </div>
          <span className="font-mono text-text-muted text-xs md:text-sm">
            {data?.total ?? 0} items
          </span>
        </div>
        <ProductGrid products={data?.products} isLoading={isLoading} />
        {data && data.totalPages > 1 && (
          <div className="flex justify-center gap-1.5 md:gap-2 mt-8 md:mt-10">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => filters.setPage(p)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl font-mono text-xs md:text-sm transition-all duration-300 ${
                  filters.page === p
                    ? 'btn-gold font-bold'
                    : 'glass text-text-secondary hover:text-accent-gold hover:border-accent-gold/20'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <FilterContent />
        <div className="flex gap-3 pt-4 border-t border-border-studio">
          <button
            onClick={() => { filters.reset(); setFilterOpen(false) }}
            className="flex-1 glass text-text-secondary font-mono text-sm py-3 rounded-xl hover:text-text-primary transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setFilterOpen(false)}
            className="flex-1 btn-gold font-mono text-sm py-3 rounded-xl"
          >
            Apply
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <ProductListing />
    </Suspense>
  )
}
