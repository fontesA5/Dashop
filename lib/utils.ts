import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to format currency
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Helper to generate random IDs
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}

// Helper to debounce function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        timeout = null
        func(...args)
      }, wait)
    }

    if (timeout === null) {
      later()
    }
  }
}
