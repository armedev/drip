import { create } from 'zustand'

interface FilterState {
  search: string
  gender: string
  colours: string[]
  types: string[]
  minPrice: number
  maxPrice: number
  page: number
  setSearch: (s: string) => void
  setGender: (g: string) => void
  toggleColour: (c: string) => void
  toggleType: (t: string) => void
  setPriceRange: (min: number, max: number) => void
  setPage: (p: number) => void
  reset: () => void
}

const defaults = { search: '', gender: '', colours: [], types: [], minPrice: 0, maxPrice: 5000, page: 1 }

export const useFilterStore = create<FilterState>((set) => ({
  ...defaults,
  setSearch:    (search)    => set({ search, page: 1 }),
  setGender:    (gender)    => set({ gender, page: 1 }),
  toggleColour: (c)         => set(s => ({
    colours: s.colours.includes(c) ? s.colours.filter(x => x !== c) : [...s.colours, c],
    page: 1,
  })),
  toggleType: (t)           => set(s => ({
    types: s.types.includes(t) ? s.types.filter(x => x !== t) : [...s.types, t],
    page: 1,
  })),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setPage:      (page)      => set({ page }),
  reset:        ()          => set(defaults),
}))
