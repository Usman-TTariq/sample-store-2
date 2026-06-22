/**
 * Seed sample stores (and coupons) into Supabase.
 *
 * Usage: node scripts/seed-sample-stores.mjs
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

const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const sampleStores = [
  {
    store_name: 'Amazon',
    slug: 'amazon',
    description: 'Shop millions of products with verified Amazon coupon codes and limited-time deals.',
    store_logo_url: favicon('amazon.com'),
    website_url: 'https://www.amazon.com',
    tracking_link: 'https://www.amazon.com',
    voucher_text: 'Up to 40% Off',
    seoTitle: 'Amazon Coupons & Promo Codes',
    seoDescription: 'Save on Amazon with verified coupon codes, lightning deals, and exclusive discounts.',
    isTrending: true,
    layout_position: 1,
    coupons: [
      { title: '20% Off Electronics', code: 'AMZSAVE20', description: 'Save 20% on select electronics.', discount: '20% Off', coupon_type: 'code' },
      { title: 'Free Shipping on $35+', code: 'FREESHIP35', description: 'Free shipping on orders over $35.', discount: 'Free Shipping', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'Nike',
    slug: 'nike',
    description: 'Get the latest Nike sneakers, apparel, and sportswear at discounted prices.',
    store_logo_url: favicon('nike.com'),
    website_url: 'https://www.nike.com',
    tracking_link: 'https://www.nike.com',
    voucher_text: '25% Off Sitewide',
    seoTitle: 'Nike Coupons & Promo Codes',
    seoDescription: 'Find Nike promo codes for shoes, hoodies, and athletic gear.',
    isTrending: true,
    layout_position: 2,
    coupons: [
      { title: '25% Off Your Order', code: 'NIKE25', description: 'Extra 25% off select styles.', discount: '25% Off', coupon_type: 'code' },
      { title: 'Student Discount', code: 'STUDENT10', description: '10% off for verified students.', discount: '10% Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'Walmart',
    slug: 'walmart',
    description: 'Everyday low prices on groceries, home essentials, and electronics at Walmart.',
    store_logo_url: favicon('walmart.com'),
    website_url: 'https://www.walmart.com',
    tracking_link: 'https://www.walmart.com',
    voucher_text: 'Save $10 Today',
    seoTitle: 'Walmart Coupons & Deals',
    seoDescription: 'Browse Walmart coupons for groceries, home, and tech.',
    isTrending: true,
    layout_position: 3,
    coupons: [
      { title: '$10 Off $50 Purchase', code: 'SAVE10NOW', description: 'Get $10 off when you spend $50 or more.', discount: '$10 Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'Target',
    slug: 'target',
    description: 'Target deals on fashion, home decor, beauty, and everyday essentials.',
    store_logo_url: favicon('target.com'),
    website_url: 'https://www.target.com',
    tracking_link: 'https://www.target.com',
    voucher_text: '15% Off Online',
    seoTitle: 'Target Coupons & Promo Codes',
    seoDescription: 'Verified Target promo codes and Circle offers.',
    isTrending: true,
    layout_position: 4,
    coupons: [
      { title: '15% Off Home Decor', code: 'TARGET15', description: 'Save on home and furniture items.', discount: '15% Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'Best Buy',
    slug: 'best-buy',
    description: 'Top deals on laptops, TVs, gaming, and smart home devices at Best Buy.',
    store_logo_url: favicon('bestbuy.com'),
    website_url: 'https://www.bestbuy.com',
    tracking_link: 'https://www.bestbuy.com',
    voucher_text: 'Up to $200 Off',
    seoTitle: 'Best Buy Coupons & Deals',
    seoDescription: 'Best Buy coupon codes for tech and appliances.',
    isTrending: true,
    layout_position: 5,
    coupons: [
      { title: '$50 Off Laptops', code: 'BBLAPTOP50', description: 'Save $50 on select laptop models.', discount: '$50 Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'Apple',
    slug: 'apple',
    description: 'Official Apple deals on iPhone, Mac, iPad, and accessories.',
    store_logo_url: favicon('apple.com'),
    website_url: 'https://www.apple.com',
    tracking_link: 'https://www.apple.com',
    voucher_text: 'Trade-In Bonus',
    seoTitle: 'Apple Deals & Offers',
    seoDescription: 'Apple store offers, trade-in bonuses, and seasonal savings.',
    isTrending: true,
    layout_position: 6,
    coupons: [
      { title: 'Free AirPods with Mac', code: null, description: 'Limited-time education offer on Mac purchases.', discount: 'Free Gift', coupon_type: 'deal' },
    ],
  },
  {
    store_name: 'Sephora',
    slug: 'sephora',
    description: 'Beauty favorites from top brands with Sephora promo codes and rewards.',
    store_logo_url: favicon('sephora.com'),
    website_url: 'https://www.sephora.com',
    tracking_link: 'https://www.sephora.com',
    voucher_text: '20% Off Beauty',
    seoTitle: 'Sephora Coupons & Promo Codes',
    seoDescription: 'Sephora coupon codes for makeup, skincare, and fragrance.',
    isTrending: true,
    layout_position: 7,
    coupons: [
      { title: '20% Off Sitewide', code: 'BEAUTY20', description: 'Save on your favorite beauty brands.', discount: '20% Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'Adidas',
    slug: 'adidas',
    description: 'Adidas sportswear, running shoes, and lifestyle collections at great prices.',
    store_logo_url: favicon('adidas.com'),
    website_url: 'https://www.adidas.com',
    tracking_link: 'https://www.adidas.com',
    voucher_text: '30% Off Outlet',
    seoTitle: 'Adidas Coupons & Promo Codes',
    seoDescription: 'Adidas discount codes for shoes and activewear.',
    isTrending: true,
    layout_position: 8,
    coupons: [
      { title: '30% Off Outlet Items', code: 'ADIDAS30', description: 'Extra savings on outlet styles.', discount: '30% Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'eBay',
    slug: 'ebay',
    description: 'Auction and buy-it-now deals across electronics, fashion, and collectibles.',
    store_logo_url: favicon('ebay.com'),
    website_url: 'https://www.ebay.com',
    tracking_link: 'https://www.ebay.com',
    voucher_text: '15% Off Select Items',
    seoTitle: 'eBay Coupons & Promo Codes',
    seoDescription: 'eBay coupon codes for top categories and sellers.',
    isTrending: false,
    layout_position: null,
    coupons: [
      { title: '15% Off Select Categories', code: 'EBAY15', description: 'Save on eligible listings.', discount: '15% Off', coupon_type: 'code' },
    ],
  },
  {
    store_name: 'H&M',
    slug: 'hm',
    description: 'Affordable fashion for men, women, and kids from H&M.',
    store_logo_url: favicon('hm.com'),
    website_url: 'https://www.hm.com',
    tracking_link: 'https://www.hm.com',
    voucher_text: '20% Off New Arrivals',
    seoTitle: 'H&M Coupons & Promo Codes',
    seoDescription: 'H&M discount codes for clothing and accessories.',
    isTrending: false,
    layout_position: null,
    coupons: [
      { title: '20% Off New Arrivals', code: 'HMNEW20', description: 'Discount on latest fashion drops.', discount: '20% Off', coupon_type: 'code' },
    ],
  },
]

async function main() {
  console.log('Checking existing stores...')
  const { data: existing, error: fetchError } = await supabase
    .from('stores')
    .select('slug')
    .in('slug', sampleStores.map((s) => s.slug))

  if (fetchError) {
    console.error('Failed to read stores:', fetchError.message)
    process.exit(1)
  }

  const existingSlugs = new Set((existing || []).map((s) => s.slug))
  const toInsert = sampleStores.filter((s) => !existingSlugs.has(s.slug))

  if (toInsert.length === 0) {
    console.log('All sample stores already exist. Nothing to insert.')
    return
  }

  console.log(`Inserting ${toInsert.length} sample stores...`)

  for (const store of toInsert) {
    const { coupons, ...storeRow } = store
    const { data: inserted, error: storeError } = await supabase
      .from('stores')
      .insert({
        ...storeRow,
        country: 'US',
        status: 'active',
      })
      .select('id, store_name')
      .single()

    if (storeError) {
      console.error(`Failed to insert ${store.store_name}:`, storeError.message)
      continue
    }

    console.log(`  + ${inserted.store_name}`)

    if (coupons?.length) {
      const couponRows = coupons.map((c) => ({
        store_id: inserted.id,
        store_name: inserted.store_name,
        store_ids: [inserted.id],
        title: c.title,
        code: c.code,
        description: c.description,
        discount: c.discount,
        coupon_type: c.coupon_type,
        logo_url: store.store_logo_url,
        url: store.website_url,
        status: 'active',
        featured: store.isTrending,
      }))

      const { error: couponError } = await supabase.from('coupons').insert(couponRows)
      if (couponError) {
        console.error(`    coupons failed for ${inserted.store_name}:`, couponError.message)
      } else {
        console.log(`    ${couponRows.length} coupon(s) added`)
      }
    }
  }

  console.log('Done!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
