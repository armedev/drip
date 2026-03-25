'use client'

import { useState } from 'react'
import { useLogin, useRegister } from '@/hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const login = useLogin()
  const register = useRegister()

  if (!isOpen) return null

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ email, password })
      reset()
      onClose()
    } catch {}
  }

  const handleRegister = async () => {
    try {
      await register.mutateAsync({ name, email, password })
      reset()
      onClose()
    } catch {}
  }

  const reset = () => { setEmail(''); setPassword(''); setName('') }

  const error = login.error || register.error
  const errorMsg = (error as any)?.response?.data?.message

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-sm gold-glow animate-scale-in">
        <div className="flex gap-1 mb-6 p-1 glass-light rounded-xl">
          <button
            onClick={() => { setTab('login'); reset() }}
            className={`flex-1 py-2 font-mono text-xs rounded-lg transition-all cursor-pointer ${tab === 'login' ? 'btn-gold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('register'); reset() }}
            className={`flex-1 py-2 font-mono text-xs rounded-lg transition-all cursor-pointer ${tab === 'register' ? 'btn-gold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-3">
          {tab === 'register' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') tab === 'login' ? handleLogin() : handleRegister() }}
            className="w-full glass-input rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted"
          />
        </div>

        {errorMsg && (
          <p className="text-error text-xs font-mono mt-3 bg-error/10 px-3 py-2 rounded-lg">{errorMsg}</p>
        )}

        <button
          onClick={tab === 'login' ? handleLogin : handleRegister}
          disabled={login.isPending || register.isPending}
          className="w-full btn-gold font-mono font-bold py-3 rounded-xl text-sm mt-4 disabled:opacity-50"
        >
          {login.isPending || register.isPending ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
        </button>

        <button
          onClick={onClose}
          className="w-full text-text-muted text-xs font-mono mt-3 py-2 hover:text-text-secondary transition-colors cursor-pointer"
        >
          Continue as guest
        </button>
      </div>
    </div>
  )
}
