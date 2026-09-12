'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CreditCard, MapPin, User } from 'lucide-react'

interface CheckoutFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: 'US' | 'CA' | 'UK'
  cardNumber: string
  expiryDate: string
  cvv: string
}

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // In production:
    // 1. Create order in Supabase
    // 2. Process payment (Stripe/PayPal - optional)
    // 3. Send email confirmation
    // 4. Clear cart and redirect to success page

    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsProcessing(false)
    alert('Order placed successfully! Check your email for confirmation.')
    // Redirect after order confirmation
    window.location.href = '/checkout/success'
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Cart Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Your Order</h2>
            <p className="text-sm text-muted-foreground">
              Review your order before placing it. We'll send a confirmation email shortly.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm py-2 border-b">
                <span>Subtotal</span>
                <span>$58.47</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span>Tax (estimated)</span>
                <span>$4.68</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span>$63.15</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CreditCard width="14" height="14" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User width="14" height="14" />
                <span>No Account Required</span>
              </div>
            </div>
          </div>

          <Link 
            href="/cart"
            className="inline-flex items-center justify-center w-full rounded-md border px-4 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-muted"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <section className="rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User width="18" height="18" />
                Contact Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name *"
                  required
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name *"
                  required
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address *"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number (optional)"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </section>

            {/* Shipping Address */}
            <section className="rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin width="18" height="18" />
                Shipping Address
              </h2>

              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Address *"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2 || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City *"
                  required
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State/Province *"
                  required
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP/Postal Code *"
                  required
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </section>

            {/* Payment Information */}
            <section className="rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard width="18" height="18" />
                Payment Information
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Card number *"
                  required
                  maxLength={19}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY *"
                    required
                    maxLength={5}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="CVV *"
                    required
                    maxLength={4}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Your payment information is encrypted and secure. We don't store your card details.
                </p>
              </div>
            </section>

            {/* Order Notes */}
            <section className="rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Notes (Optional)</h2>

              <textarea
                name="notes"
                placeholder="Any special instructions for your order..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />

              <p className="text-xs text-muted-foreground">
                We'll include this information with your order.
              </p>
            </section>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms"
                required
                className="mt-1 rounded border-input bg-background focus-visible:ring-2 focus-visible:ring-ring"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="/terms" className="text-primary underline hover:text-primary/80">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary underline hover:text-primary/80">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full rounded-md bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.062 1.135 5.827 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Place Order - $${(63.15).toFixed(2)}`
              )}
            </button>

            {/* Trust Badges */}
            <div className="pt-6 border-t grid sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted-foreground">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-xs text-muted-foreground">SSL Secure</span>
              </div>

              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted-foreground">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span className="text-xs text-muted-foreground">256-bit Encryption</span>
              </div>

              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted-foreground">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                </svg>
                <span className="text-xs text-muted-foreground">Safe Checkout</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
