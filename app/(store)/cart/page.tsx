'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MinusIcon, PlusIcon, Trash2 } from 'lucide-react'

interface CartItem {
  id: string
  product_id: string
  name: string
  description: string
  price: number
  quantity: number
  max_quantity: number
  main_image_url: string
  variant?: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load cart from localStorage or Supabase on mount
    const savedCart = localStorage.getItem('dashop-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Cart total calculation
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingThreshold = 50
  const freeShippingEligible = cartTotal >= shippingThreshold

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.max_quantity, item.quantity + delta))
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const proceedToCheckout = () => {
    // Save cart to Supabase and redirect to checkout
    localStorage.removeItem('dashop-cart')
    window.location.href = '/checkout'
  }

  if (!isMounted) {
    return (
      <div className="container px-4 py-8">
        <div className="h-64 rounded-lg bg-muted animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        // Empty Cart State
        <div className="max-w-xl mx-auto text-center py-12">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto text-muted-foreground mb-4"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any products yet.</p>
          
          <Link 
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        // Cart Contents
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id}
                className="flex gap-6 rounded-lg border p-4 bg-card"
              >
                {/* Product Image */}
                <Link href={`/products/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <img 
                    src={item.main_image_url || '/images/product-placeholder.jpg'}
                    alt={item.name}
                    className="h-32 w-32 rounded object-cover"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Link 
                      href={`/products/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-medium hover:underline line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-md border bg-background">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <MinusIcon width="16" height="16" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <PlusIcon width="16" height="16" />
                      </button>
                    </div>

                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 width="16" height="16" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Free Shipping Banner */}
            {!freeShippingEligible && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Free shipping on orders over ${shippingThreshold}</p>
                  <p className="text-sm text-muted-foreground">
                    You're only ${(shippingThreshold - cartTotal).toFixed(2)} away!
                  </p>
                </div>
                <Link 
                  href="/products"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Add more items →
                </Link>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border bg-card p-6 space-y-4 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              {freeShippingEligible ? (
                <div className="flex justify-between text-sm py-2 border-t">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm py-2 border-t">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$9.99</span>
                </div>
              )}

              {/* Tax */}
              <div className="flex justify-between text-sm py-2 border-t">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span>${(cartTotal + 9.99 * (cartTotal < shippingThreshold ? 1 : 0) + cartTotal * 0.08).toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <button 
                  onClick={proceedToCheckout}
                  className="w-full rounded-md bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Proceed to Checkout
                </button>

                <Link 
                  href="/products"
                  className="w-full block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span>100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
