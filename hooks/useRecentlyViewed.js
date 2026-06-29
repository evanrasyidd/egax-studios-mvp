'use client'
import { useState, useEffect } from 'react'
import { getProductBySlug } from '@/constants/products'

const KEY = 'egax-recently-viewed'

export function useRecentlyViewed(currentSlug) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (currentSlug) {
      const updated = [currentSlug, ...stored.filter((s) => s !== currentSlug)].slice(0, 6)
      localStorage.setItem(KEY, JSON.stringify(updated))
    }
    const slugs = currentSlug
      ? JSON.parse(localStorage.getItem(KEY) || '[]').filter((s) => s !== currentSlug)
      : stored
    setItems(slugs.map(getProductBySlug).filter(Boolean).slice(0, 4))
  }, [currentSlug])

  return items
}
