import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ProductFilters, PaginatedProducts } from '@/types'

export const useProducts = (filters: ProductFilters) => {
  return useQuery<PaginatedProducts>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (filters.search)   params.search   = filters.search
      if (filters.gender)   params.gender   = filters.gender
      if (filters.colours?.length) params.colours = filters.colours
      if (filters.types?.length)   params.types   = filters.types
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      params.page  = filters.page  ?? 1
      params.limit = filters.limit ?? 12
      const { data } = await api.get('/api/products', { params })
      return data
    },
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/products/${id}`)
      return data
    },
    enabled: !!id,
  })
}
