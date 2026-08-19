import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
})

export type Holding = {
  id: string
  user_id: string
  coin_id: string
  symbol: string
  name: string
  amount: number
  avg_buy_price_usd: number
  created_at: string
  updated_at: string
}
