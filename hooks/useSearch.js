'use client'
import { useState } from 'react'
import { PRODUCTS } from '@/constants/products'

export function useSearch() {
  const [query, setQuery] = useState('')
  const results = query.length > 1
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []
  return { query, setQuery, results }
}
