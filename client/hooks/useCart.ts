import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { Cart } from '@/types'

export const useCart = () => {
  const setCart = useCartStore(s => s.setCart)

  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get('/api/cart')
      setCart(data)
      return data
    },
  })
}

export const useAddToCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { productId: string; quantity: number }) =>
      api.post('/api/cart', payload).then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['cart'], data)
      useCartStore.getState().setCart(data)
    },
  })
}

export const useUpdateCartItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.patch(`/api/cart/${productId}`, { quantity }).then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['cart'], data)
      useCartStore.getState().setCart(data)
    },
  })
}

export const useRemoveFromCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) =>
      api.delete(`/api/cart/${productId}`).then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['cart'], data)
      useCartStore.getState().setCart(data)
    },
  })
}

export const useClearCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete('/api/cart').then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['cart'], data)
      useCartStore.getState().setCart(data)
    },
  })
}
