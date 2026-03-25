'use client'

import { useEffect, useRef } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-studio-base rounded-t-2xl border-t border-border-studio max-h-[80vh] flex flex-col animate-slide-up"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-studio flex-shrink-0">
          <h2 className="text-text-primary font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-studio-elevated flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-5 pb-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
