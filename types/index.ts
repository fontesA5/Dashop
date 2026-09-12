// Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  cost?: number
  inventory: number
  category_id: string
  main_image_url: string
  images?: Array<{ url: string; alt: string }>
  variants?: Array<{
    name: string
    price: number
    inventory: number
    options?: { color?: string; size?: string }[]
  }>
  sku?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
}

// Order Types
export interface Order {
  id: string
  user_id: string | null
  is_guest: boolean
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: {
    name: string
    address_line1: string
    address_line2?: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  total: number
  items_count: number
  notes?: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  name: string
  sku?: string
  price: number
  quantity: number
  subtotal: number
  created_at: string
}

// Cart Types
export interface CartItem {
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  variant?: string
  main_image_url?: string
}

// Analytics Types
export interface AnalyticsEvent {
  event_type: 'view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'search'
  payload: any
  created_at: string
}

// Admin Dashboard Types
export interface DashboardStats {
  total_sales: number
  total_orders: number
  total_products: number
  low_stock_count: number
  visitors_24h: number
  orders_today: number
}
