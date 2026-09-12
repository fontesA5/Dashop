'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  interface ProductFormData {
    name: string
    slug: string
    description: string
    price: string
    cost: string
    inventory: string
    sku: string
    category: 'household' | 'cleaning' | 'personal-care' | 'beauty'
    is_active: boolean
  }

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    cost: '',
    inventory: '',
    sku: '',
    category: 'household',
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In production: Save to Supabase here
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('Product saved successfully!')
    window.location.href = '/admin/products'
  }

  return (
    <div className="p-4 md:p-8">
      <button 
        onClick={() => window.location.href = '/admin/products'}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft width="16" height="16" />
        Back to Products
      </button>

      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Basic Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., All-Purpose Cleaner"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="all-purpose-cleaner"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1.5">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the product and its features..."
              rows={4}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </section>

        {/* Pricing & Inventory */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Pricing & Inventory
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1.5">
                Selling Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="19.99"
                step="0.01"
                min="0"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium mb-1.5">
                Cost ($) *
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="12.50"
                step="0.01"
                min="0"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="inventory" className="block text-sm font-medium mb-1.5">
                Inventory Count *
              </label>
              <input
                type="number"
                id="inventory"
                name="inventory"
                value={formData.inventory}
                onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                placeholder="50"
                min="0"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sku" className="block text-sm font-medium mb-1.5">
                SKU (Stock Keeping Unit) *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="APC-32OZ"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-input bg-background focus-visible:ring-2 focus-visible:ring-ring"
            />
            <label htmlFor="is_active" className="text-sm">
              Make product active and visible in store
            </label>
          </div>
        </section>

        {/* Category */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Product Category
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1.5">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="household">Household Essentials</option>
                <option value="cleaning">Cleaning Supplies</option>
                <option value="personal-care">Personal Care</option>
                <option value="beauty">Beauty Products</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="main_image" className="block text-sm font-medium mb-1.5">
                Main Image URL
              </label>
              <input
                type="text"
                id="main_image"
                name="main_image"
                placeholder="/images/products/product-image.jpg"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty if you want to upload an image later.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="additional_images" className="block text-sm font-medium mb-1.5">
              Additional Image URLs (comma-separated)
            </label>
            <input
              type="text"
              id="additional_images"
              name="additional_images"
              placeholder="/images/products/product-side.jpg, /images/products/product-back.jpg"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </section>

        {/* SEO Settings */}
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            SEO Settings
          </h2>

          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium mb-1.5">
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              name="meta_title"
              placeholder="Premium All-Purpose Cleaner - Clean Everything Fast"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium mb-1.5">
              Meta Description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              rows={3}
              placeholder="Cuts through grease and grime with eco-friendly ingredients..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <a 
            href="/admin/products"
            className="rounded-md border px-6 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-muted"
          >
            Cancel
          </a>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
