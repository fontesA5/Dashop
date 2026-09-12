'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

// Cart item type
export interface CartItem {
  id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  variant?: string
  main_image_url?: string
}

// Initialize cart with local storage on client side
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    initializeCart()
  }, [])

  // Load cart from localStorage or Supabase
  const initializeCart = async () => {
    try {
      const savedCart = localStorage.getItem('dashop-cart')
      
      if (savedCart) {
        setCart(JSON.parse(savedCart))
        return
      }

      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user?.id) {
        // Fetch cart from Supabase for authenticated users
        const { data: cartData } = await supabase
          .from('cart_sessions')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (cartData) {
          setCart(JSON.parse(cartData.items || '[]'))
        }
      }
    } catch (error) {
      console.error('Error initializing cart:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Add item to cart
  const addToCart = useCallback((product: any, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.product_id === product.id && 
        (item.variant || '') === (product.variants?.[0]?.name || '')
      )

      if (existingItem) {
        // Update quantity if exists
        return prev.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
            : item
        )
      }

      // Add new item
      return [...prev, {
        id: `cart-${product.id}-${Date.now()}`,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: quantity,
        variant: product.variants?.[0]?.name || '',
        main_image_url: product.main_image_url,
      }]
    })

    // Save to localStorage
    saveCartToLocalStorage()
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
    saveCartToLocalStorage()
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.quantity + delta, 99))
        return { ...item, quantity: newQty }
      }
      return item
    }))
    saveCartToLocalStorage()
  }, [])

  // Save cart to localStorage for persistence
  const saveCartToLocalStorage = () => {
    try {
      localStorage.setItem('dashop-cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([])
    localStorage.removeItem('dashop-cart')
  }, [])

  // Get cart total
  const getTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  // Get items count
  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  // Sync cart when user logs in/out
  supabase.auth.onAuthStateChange(async () => {
    await initializeCart()
  })

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    isSyncing,
  }
}
