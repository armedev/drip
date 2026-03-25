'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef(new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } }
  }))

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  )
}
