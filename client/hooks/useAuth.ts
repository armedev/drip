import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { getGuestId } from '@/lib/guest'

async function mergeCart() {
  const guestId = getGuestId()
  if (!guestId) return
  try { await api.post('/api/cart/merge', { guestId }) } catch {}
}

export const useLogin = () => {
  const login = useAuthStore(s => s.login)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/api/auth/login', data).then(r => r.data),
    onSuccess: async ({ user, token }) => {
      login(user, token)
      await mergeCart()
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRegister = () => {
  const login = useAuthStore(s => s.login)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      api.post('/api/auth/register', data).then(r => r.data),
    onSuccess: async ({ user, token }) => {
      login(user, token)
      await mergeCart()
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
