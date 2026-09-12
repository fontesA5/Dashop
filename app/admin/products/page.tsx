"use client"

import { useState } from 'react'
import { PlusIcon, Search, Filter } from 'lucide-react'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Mock products data
  const products = Array(10).fill(null).map((_, i) => ({
    id: `prod-${i}`,
    name: 'Premium Product',
    sku: 'PROD-001',
    price: (Math.random() * 100).toFixed(2),
    inventory: Math.floor(Math.random() * 50),
    category: ['Household', 'Cleaning', 'Personal Care', 'Beauty'][i % 4],
    image: '/images/product-placeholder.jpg',
    is_active: true,
  }))

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog and inventory
          </p>
        </div>

        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2">
          <PlusIcon width="16" height="16" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Categories</option>
          <option value="Household">Household</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Beauty">Beauty</option>
        </select>

        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm gap-2">
          <Filter width="16" height="16" className="text-muted-foreground" />
          <span className="text-muted-foreground">Filters</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Product</th>
              <th className="text-left py-3 px-4 font-medium">SKU</th>
              <th className="text-right py-3 px-4 font-medium">Price</th>
              <th className="text-right py-3 px-4 font-medium">Inventory</th>
              <th className="text-left py-3 px-4 font-medium">Category</th>
              <th className="text-center py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted flex-shrink-0" />
                    <div>
                      <span className="font-medium">{product.name}</span>
                      {!product.is_active && (
                        <span className="ml-2 text-xs text-muted-foreground line-through">Archived</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-muted-foreground">{product.sku}</td>
                <td className="py-3 px-4 text-right font-medium">${Number(product.price).toFixed(2)}</td>
                <td className={`py-3 px-4 text-right ${product.inventory < 10 ? 'text-red-600' : ''}`}>
                  {product.inventory} units
                  {product.inventory < 10 && (
                    <span className="ml-2 text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full">Low</span>
                  )}
                </td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-500/10 text-green-700' : 'bg-gray-500/10 text-gray-700'}`}>
                    {product.is_active ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => editProduct(product)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Showing 1 to {products.length} of {products.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button 
            disabled
            className="rounded-md border px-3 py-1.5 text-sm font-medium opacity-50 cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm">1</span>
          <button 
            disabled
            className="rounded-md border px-3 py-1.5 text-sm font-medium opacity-50 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function editProduct(product: any) {
  window.location.href = `/admin/products/${product.id}`
}

function deleteProduct(id: string) {
  if (confirm('Are you sure you want to delete this product?')) {
    // Delete product logic here
    console.log('Deleting product:', id)
  }
}
