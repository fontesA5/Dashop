'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SearchIcon, Filter, ArrowUpDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      // Set sample data for demo if no products exist yet
      setProducts(Array(8).fill(null).map((_, i) => ({
        id: `prod-${i}`,
        name: 'Product',
        description: 'Sample product',
        price: 0,
        image: '/images/product-placeholder.jpg',
        is_active: true,
      })))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our collection of household essentials, cleaning supplies, personal care, and beauty products.
          </p>
        </div>

        {/* Search Bar */}
        <form method="get" action="/products">
          <div className="relative">
            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full max-w-md rounded-md border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2 border rounded-md p-1 bg-card">
          <button className="px-3 py-1.5 text-sm font-medium rounded hover:bg-muted">All Products</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded hover:bg-muted">Household</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded hover:bg-muted">Cleaning</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded hover:bg-muted">Personal Care</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded hover:bg-muted">Beauty</button>
        </div>

        {/* Sort Dropdown */}
        <select className="rounded-md border border-input bg-background px-4 py-2 text-sm">
          <option>Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-96 rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-muted relative group-hover:opacity-80 transition-opacity">
                {product.main_image_url && (
                  <img 
                    src={product.main_image_url} 
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name || 'Product'}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-semibold">${(product.price || 0).toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">In Stock</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Products Message */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available yet. Add some products via admin panel!</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button disabled className="rounded-md border px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
          Previous
        </button>
        <span className="text-sm">1</span>
        <button disabled className="rounded-md border px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  )
}
