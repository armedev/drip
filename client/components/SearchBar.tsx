"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";
import { useFilterStore } from "@/store/filterStore";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils";
import {
  highlightMatch,
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  trendingSearches,
} from "@/lib/search";
import { TShirtSvg, getColourHex } from "@/components/TShirtSvg";

export function SearchBar() {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const setSearch = useFilterStore((s) => s.setSearch);

  const { data, isFetching } = useProducts({ search: query, limit: 5 });

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const debouncedSetQuery = useCallback(
    debounce((q: string) => {
      setQuery(q);
    }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    addRecentSearch(term.trim());
    setRecent(getRecentSearches());
    setSearch(term.trim());
    setValue(term.trim());
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const products = data?.products ?? [];
  const showResults = isOpen && query.length > 0 && products.length > 0;
  const showRecent = isOpen && !query && recent.length > 0;
  const showTrending = isOpen && !query;
  const showNoResults =
    isOpen && query.length > 0 && !isFetching && products.length === 0;

  const totalItems =
    (showResults ? products.length : 0) +
    (showRecent ? recent.length : 0) +
    (showTrending && !showRecent ? trendingSearches.length : 0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, totalItems - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      if (showResults && activeIndex < products.length) {
        handleSearch(products[activeIndex].name);
      } else if (showRecent) {
        const idx = activeIndex - (showResults ? products.length : 0);
        if (idx >= 0 && idx < recent.length) handleSearch(recent[idx]);
      } else if (showTrending && !showRecent) {
        const idx = activeIndex - (showResults ? products.length : 0);
        if (idx >= 0 && idx < trendingSearches.length)
          handleSearch(trendingSearches[idx]);
      }
    }
    if (e.key === "Enter" && activeIndex === -1) handleSearch(value);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  let itemIdx = -1;

  return (
    <div className="relative flex-1 max-w-xl mx-8" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              debouncedSetQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-text-primary text-sm placeholder:text-text-muted"
          />
          {isFetching && query ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted animate-spin" />
          ) : value ? (
            <button
              onClick={() => {
                setValue("");
                setQuery("");
                setIsOpen(false);
                setSearch("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
        <button
          className="search-button-container btn-gold font-mono font-bold px-5 py-2.5 rounded-xl text-sm flex-shrink-0"
          onClick={() => handleSearch(value)}
        >
          Search
        </button>
      </div>

      {isOpen &&
        (showResults || showRecent || showTrending || showNoResults) && (
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-border-studio overflow-hidden shadow-2xl shadow-black/40 animate-slide-down z-50">
            {showResults && (
              <div className="p-2">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-3 py-1.5">
                  Products
                </p>
                {products.map((p) => {
                  itemIdx++;
                  const isActive = activeIndex === itemIdx;
                  return (
                    <button
                      key={p._id}
                      onClick={() => handleSearch(p.name)}
                      onMouseEnter={() => setActiveIndex(-1)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${isActive ? "bg-accent-gold/10" : "hover:bg-white/3"} cursor-pointer`}
                    >
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-studio-elevated border border-border-studio flex items-center justify-center p-1">
                        <TShirtSvg
                          color={getColourHex(p.colour)}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate">
                          {highlightMatch(p.name, query)}
                        </p>
                        <p className="text-xs text-text-muted font-mono">
                          {p.type} · {p.gender}
                        </p>
                      </div>
                      <span className="text-accent-gold font-mono text-sm font-bold flex-shrink-0">
                        {formatPrice(p.price)}
                      </span>
                      <Link
                        href={`/products/${p._id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                        }}
                        className="text-text-muted hover:text-accent-gold text-xs font-mono ml-1"
                      >
                        View →
                      </Link>
                    </button>
                  );
                })}
              </div>
            )}

            {showRecent && (
              <div className="p-2 border-t border-border-studio">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-3 py-1.5">
                  Recent
                </p>
                {recent.map((r) => {
                  itemIdx++;
                  const isActive = activeIndex === itemIdx;
                  return (
                    <div
                      key={r}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg group ${isActive ? "bg-accent-gold/10" : "hover:bg-white/3"}`}
                      onMouseEnter={() => setActiveIndex(-1)}
                    >
                      <button
                        onClick={() => handleSearch(r)}
                        className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-sm text-text-primary">{r}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(r);
                          setRecent(getRecentSearches());
                        }}
                        className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {showTrending && !showRecent && (
              <div className="p-2 border-t border-border-studio">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-3 py-1.5">
                  Trending
                </p>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {trendingSearches.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSearch(t)}
                      className="flex items-center gap-1.5 text-xs font-mono text-text-secondary bg-studio-elevated/60 px-3 py-1.5 rounded-full hover:text-accent-gold hover:bg-accent-gold/10 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-3 h-3" />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showNoResults && (
              <div className="p-6 text-center">
                <p className="text-text-secondary text-sm">
                  No results for &quot;{query}&quot;
                </p>
                <p className="text-text-muted text-xs mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
