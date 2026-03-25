import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  hydrated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  login: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
  hydrate: () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try { set({ token, user: JSON.parse(userStr), hydrated: true }) } catch { set({ hydrated: true }) }
    } else {
      set({ hydrated: true })
    }
  },
}))
