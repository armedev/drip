'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef(new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } }
  }))
  const hydrate = useAuthStore(s => s.hydrate)

  useEffect(() => { hydrate() }, [hydrate])

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  )
}
