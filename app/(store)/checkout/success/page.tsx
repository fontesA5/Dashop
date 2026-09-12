'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Simulate email sending
    console.log('Order confirmation email sent!')
  }, [])

  return (
    <div className="container px-4 py-8">
      <div className="max-w-xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 width="40" height="40" className="text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
          
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase, customer! Your order has been successfully placed.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 space-y-3 text-left">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Order Number</span>
              <span className="font-mono font-medium">#DASHOP-2847</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Paid</span>
              <span className="font-medium">$63.15</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Shipping Address</span>
              <span className="font-medium truncate max-w-[200px]">123 Main St, New York</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address with your order details and tracking information.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <Link 
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <ShoppingBag width="18" height="18" />
            Continue Shopping
          </Link>

          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-6 py-4 text-sm font-medium ring-offset-background transition-colors hover:bg-muted"
          >
            Return to Home
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t grid sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 width="16" height="16" className="text-green-600" />
              <span className="text-sm text-muted-foreground">Order Received</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 width="16" height="16" className="text-green-600" />
              <span className="text-sm text-muted-foreground">Email Sent</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 width="16" height="16" className="text-green-600" />
              <span className="text-sm text-muted-foreground">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
