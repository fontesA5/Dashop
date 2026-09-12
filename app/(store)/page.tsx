import { Suspense } from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container relative z-10 px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center">
            Everything you need,<br />
            <span className="text-muted-foreground">delivered to your door</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground text-center">
            Quality household essentials, cleaning supplies, personal care products, and beauty items at great prices.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Shop All Products
            </Link>
            <Link 
              href="/categories"
              className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-muted"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="container px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary mb-4">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M12 15V21M9 21h6M12 3a6 6 0 0 0-6 6c0 2.12 1.21 4 3 5.37L12 21l3-5.63A5.98 5.98 0 0 0 12 9Z"/>
            </svg>
            <h3 className="font-semibold">Free Shipping</h3>
            <p className="text-sm text-muted-foreground mt-2">On orders over $50</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary mb-4">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h3 className="font-semibold">Quality Products</h3>
            <p className="text-sm text-muted-foreground mt-2">Curated selection for you</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary mb-4">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h3 className="font-semibold">Secure Payment</h3>
            <p className="text-sm text-muted-foreground mt-2">100% secure checkout</p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="container px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
        
        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-40 rounded-lg bg-muted animate-pulse"></div>)}</div>}>
          <CategoriesGrid />
        </Suspense>
      </section>

      {/* Featured Products */}
      <section className="container px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <Link 
              key={i} 
              href={`/products/featured-${i}`}
              className="group block bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                  Coming Soon
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  Featured Product
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground line-clamp-1">Household</span>
                  <span className="text-lg font-semibold">$0.00</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container px-4 py-12">
        <div className="bg-primary/5 border rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Stay in the loop</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive offers and new product updates.
          </p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-input px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button 
              type="submit"
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

// Categories Grid Component
function CategoriesGrid() {
  const categories = [
    { name: 'Household Essentials', href: '/products/household', image: '🏠' },
    { name: 'Cleaning Supplies', href: '/products/cleaning', image: '✨' },
    { name: 'Personal Care', href: '/products/personal-care', image: '💆' },
    { name: 'Beauty Products', href: '/products/beauty', image: '💄' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category, i) => (
        <Link 
          key={i} 
          href={category.href}
          className="group relative rounded-lg overflow-hidden aspect-[4/3] cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/50 flex flex-col items-center justify-center text-center p-4">
            <span className="text-4xl mb-3">{category.image}</span>
            <h3 className="font-medium group-hover:underline decoration-primary underline-offset-4">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
