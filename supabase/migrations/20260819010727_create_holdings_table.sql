/*
# Create holdings table for crypto portfolio tracker

## Purpose
Stores each user's cryptocurrency holdings — which coin, how much they own, and the average price they paid.
This is a legitimate portfolio tracking tool: users record what they actually own and the app shows current
value based on live market data from CoinGecko. No deposits, no promised returns, no trading.

## New Tables
- `holdings`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid() — the authenticated owner)
  - `coin_id` (text, not null — CoinGecko coin id, e.g. "bitcoin")
  - `symbol` (text, not null — e.g. "BTC")
  - `name` (text, not null — e.g. "Bitcoin")
  - `amount` (numeric, not null — quantity held, must be > 0)
  - `avg_buy_price_usd` (numeric, not null — average purchase price in USD)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Security
- RLS enabled on `holdings`.
- Owner-scoped CRUD: each authenticated user can only see/modify their own holdings.
- 4 separate policies (SELECT, INSERT, UPDATE, DELETE), all scoped to `TO authenticated` with `auth.uid() = user_id`.
- `user_id` defaults to `auth.uid()` so inserts that omit it still succeed.
*/

CREATE TABLE IF NOT EXISTS holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_id text NOT NULL,
  symbol text NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  avg_buy_price_usd numeric NOT NULL CHECK (avg_buy_price_usd >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_holdings_user_id ON holdings(user_id);

ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_holdings" ON holdings;
CREATE POLICY "select_own_holdings"
ON holdings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_holdings" ON holdings;
CREATE POLICY "insert_own_holdings"
ON holdings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_holdings" ON holdings;
CREATE POLICY "update_own_holdings"
ON holdings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_holdings" ON holdings;
CREATE POLICY "delete_own_holdings"
ON holdings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);