export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-accent-gold/20 text-accent-gold rounded px-0.5">{part}</mark>
      : part
  )
}

const RECENT_KEY = 'drip_recent_searches'

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch { return [] }
}

export function addRecentSearch(query: string) {
  if (!query.trim()) return
  const searches = getRecentSearches().filter(s => s !== query)
  searches.unshift(query)
  localStorage.setItem(RECENT_KEY, JSON.stringify(searches.slice(0, 5)))
}

export function removeRecentSearch(query: string) {
  const searches = getRecentSearches().filter(s => s !== query)
  localStorage.setItem(RECENT_KEY, JSON.stringify(searches))
}

export const trendingSearches = ['oversized', 'polo', 'crew neck', 'v-neck', 'crop', 'henley']
