import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/session?apikey=${supabaseAnonKey}`)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const data = await response.json()
    const session = data?.data ?? null

    return NextResponse.json({ data: session })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
