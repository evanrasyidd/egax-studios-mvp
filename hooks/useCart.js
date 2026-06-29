'use client'
import { useCartStore } from '@/store/cartStore'

export function useCart() {
  const { items, addItem, removeItem, updateQty, clearCart, getTotalPrice, getTotalItems } = useCartStore()
  return { items, addItem, removeItem, updateQty, clearCart, getTotalPrice, getTotalItems }
}
