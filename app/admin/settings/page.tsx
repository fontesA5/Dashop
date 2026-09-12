'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState({
    storeName: 'dashop',
    email: 'support@dashop.com',
    phone: '',
    address: '',
    shippingThreshold: 50,
    currency: 'USD',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Store Settings</h1>

      <div className="space-y-6">
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">General Settings</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium mb-1.5">
                Store Name *
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={settings.storeName}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium mb-1.5">
                Currency *
              </label>
              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Support Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                Support Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Shipping Configuration</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="shippingThreshold" className="block text-sm font-medium mb-1.5">
                Free Shipping Threshold ($) *
              </label>
              <input
                type="number"
                id="shippingThreshold"
                name="shippingThreshold"
                value={settings.shippingThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, shippingThreshold: Number(e.target.value) }))}
                step="5"
                min="0"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium mb-1.5">
                Currency Symbol *
              </label>
              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        <button 
          onClick={() => {}}
          className="w-full rounded-md border bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
