'use client'

import { useFilterStore } from '@/store/filterStore'
import { useProducts } from '@/hooks/useProducts'

export function FilterSidebar() {
  const filters = useFilterStore()
  const { data } = useProducts({ page: 1, limit: 100 })

  const allColours = [...new Set(data?.products.map(p => p.colour) ?? [])]
  const allTypes = [...new Set(data?.products.map(p => p.type) ?? [])]

  const hasActiveFilters = filters.gender || filters.colours.length > 0 || filters.types.length > 0 || filters.minPrice > 0 || filters.maxPrice < 5000 || filters.search

  const genderOptions = ['male', 'female', 'unisex']

  return (
    <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 glass-light p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary font-bold text-lg">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={filters.reset}
            className="text-accent-gold text-xs font-mono hover:text-accent-gold-dim transition-colors px-2 py-1 rounded-lg bg-accent-gold/10 hover:bg-accent-gold/15 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1 h-4 bg-accent-gold rounded-full" />
          Gender
        </label>
        <div className="space-y-1">
          <label className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
            <input
              type="radio"
              name="gender"
              checked={!filters.gender}
              onChange={() => filters.setGender('')}
              className="accent-accent-gold"
            />
            <span className="text-text-primary text-sm">All</span>
          </label>
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/3 transition-colors">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g}
                onChange={() => filters.setGender(g)}
                className="accent-accent-gold"
              />
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
              <input
                type="checkbox"
                checked={filters.colours.includes(c)}
                onChange={() => filters.toggleColour(c)}
                className="accent-accent-gold"
              />
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
              <input
                type="checkbox"
                checked={filters.types.includes(t)}
                onChange={() => filters.toggleType(t)}
                className="accent-accent-gold"
              />
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
          <input
            type="range"
            min={0}
            max={5000}
            value={filters.minPrice}
            onChange={e => filters.setPriceRange(Number(e.target.value), filters.maxPrice)}
            className="w-full accent-accent-gold"
          />
          <input
            type="range"
            min={0}
            max={5000}
            value={filters.maxPrice}
            onChange={e => filters.setPriceRange(filters.minPrice, Number(e.target.value))}
            className="w-full accent-accent-gold"
          />
          <div className="flex justify-between font-mono text-accent-gold text-xs">
            <span>₹{filters.minPrice}</span>
            <span>₹{filters.maxPrice}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
