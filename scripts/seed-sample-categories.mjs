/**
 * Seed sample categories into Supabase.
 *
 * Usage: node scripts/seed-sample-categories.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvFile(resolve(root, '.env'))
loadEnvFile(resolve(root, '.env.local'))

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env / .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function emojiIcon(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="44" text-anchor="middle" font-size="36">${emoji}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const sampleCategories = [
  { name: 'Fashion', slug: 'fashion', emoji: '👗', background_color: '#DE6113' },
  { name: 'Electronics', slug: 'electronics', emoji: '📱', background_color: '#221E1D' },
  { name: 'Beauty', slug: 'beauty', emoji: '💄', background_color: '#DB1F15' },
  { name: 'Sports & Outdoor', slug: 'sports-outdoor', emoji: '⚽', background_color: '#956025' },
  { name: 'Food & Grocery', slug: 'food-grocery', emoji: '🍔', background_color: '#523120' },
  { name: 'Travel', slug: 'travel', emoji: '✈️', background_color: '#DE6113' },
  { name: 'Home & Garden', slug: 'home-garden', emoji: '🏡', background_color: '#956025' },
  { name: 'Footwear', slug: 'footwear', emoji: '👟', background_color: '#DB1F15' },
  { name: 'Kids', slug: 'kids', emoji: '🧸', background_color: '#DE6113' },
  { name: 'Automotive', slug: 'automotive', emoji: '🚗', background_color: '#523120' },
  { name: 'Fitness', slug: 'fitness', emoji: '💪', background_color: '#956025' },
  { name: 'Gift', slug: 'gift', emoji: '🎁', background_color: '#DB1F15' },
  { name: 'Furniture', slug: 'furniture', emoji: '🛋️', background_color: '#523120' },
  { name: 'Office & Stationery', slug: 'office-stationery', emoji: '📝', background_color: '#221E1D' },
  { name: 'E-Commerce', slug: 'e-commerce', emoji: '🛒', background_color: '#DE6113' },
  { name: 'Hotel & Resorts', slug: 'hotel-resorts', emoji: '🏨', background_color: '#956025' },
]

async function main() {
  console.log('Checking existing categories...')
  const { data: existing, error: fetchError } = await supabase
    .from('categories')
    .select('slug')
    .in('slug', sampleCategories.map((c) => c.slug))

  if (fetchError) {
    console.error('Failed to read categories:', fetchError.message)
    process.exit(1)
  }

  const existingSlugs = new Set((existing || []).map((c) => c.slug))
  const toInsert = sampleCategories.filter((c) => !existingSlugs.has(c.slug))

  if (toInsert.length === 0) {
    console.log('All sample categories already exist. Nothing to insert.')
    return
  }

  console.log(`Inserting ${toInsert.length} sample categories...`)

  const rows = toInsert.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    icon_url: emojiIcon(cat.emoji),
    background_color: cat.background_color,
  }))

  const { data: inserted, error: insertError } = await supabase
    .from('categories')
    .insert(rows)
    .select('id, name, slug')

  if (insertError) {
    console.error('Failed to insert categories:', insertError.message)
    if (insertError.code === 'PGRST204') {
      console.error('Hint: run fix_categories_schema.sql in Supabase SQL Editor first.')
    }
    process.exit(1)
  }

  for (const cat of inserted || []) {
    console.log(`  + ${cat.name} (${cat.slug})`)
  }

  console.log(`Done! ${inserted?.length ?? 0} categories added.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
