import { existsSync, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

/** Exact / contains brand → DB category name (first priority). */
const BRAND_OVERRIDES = [
  { category: 'E-Commerce', patterns: [/\bamazon\b/i, /\bebay\b/i, /\bwalmart\b/i, /\btarget\b/i, /\bcostco\b/i, /\baliexpress\b/i, /\betsy\b/i] },
  { category: 'Electronics', patterns: [/\bdell\b/i, /\bapple\b/i, /\bsamsung\b/i, /\bsony\b/i, /\bhp\b/i, /\blenovo\b/i, /\bbest\s*buy\b/i, /\bbose\b/i, /\basus\b/i, /\bacer\b/i, /\blg\b/i, /\bmicrosoft\b/i] },
  { category: 'Fashion', patterns: [/\bnike\b/i, /\badidas\b/i, /\bzara\b/i, /\bh&m\b/i, /\bgap\b/i, /\bold\s*navy\b/i, /\bmacy'?s?\b/i, /\bshein\b/i, /\buniqlo\b/i, /\bpuma\b/i, /\blevi'?s?\b/i] },
  { category: 'Beauty', patterns: [/\bsephora\b/i, /\bulta\b/i] },
  { category: 'Home & Garden', patterns: [/\bhome\s*depot\b/i, /\blowe'?s?\b/i, /\bwayfair\b/i, /\bikea\b/i] },
  { category: 'Furniture', patterns: [/\bfurniture\b/i, /\bmattress\b/i] },
  { category: 'Pets', patterns: [/\bchewy\b/i, /\bpetco\b/i, /\bpetsmart\b/i] },
  { category: 'Travel', patterns: [/\bexpedia\b/i, /\bairbnb\b/i, /\bbooking\.com\b/i] },
  { category: 'Hotel & Resorts', patterns: [/\bhotel\b/i, /\bresort\b/i, /\bmarriott\b/i, /\bhilton\b/i] },
  { category: 'Kids', patterns: [/\bkids?\b/i, /\bbaby\b/i, /\btoys?\s*r\s*us\b/i] },
  { category: 'Footwear', patterns: [/\bfootwear\b/i, /\bshoes?\b/i, /\bsneaker/i] },
  { category: 'Sports & Outdoor', patterns: [/\brei\b/i, /\bdick'?s\s*sporting\b/i] },
  { category: 'Fitness', patterns: [/\bgymshark\b/i, /\bpeloton\b/i] },
  { category: 'Gift', patterns: [/\bgift\b/i, /\bflorist\b/i, /\bbloomz\b/i] },
  { category: 'Food & Grocery', patterns: [/\bgrocery\b/i, /\bfood\b/i, /\bkroger\b/i, /\bwhole\s*foods\b/i] },
  { category: 'Automotive', patterns: [/\bautozone\b/i, /\badvance\s*auto\b/i] },
  { category: 'Office & Stationery', patterns: [/\bstaples\b/i, /\boffice\s*depot\b/i] },
];

const CATEGORY_RULES = [
  { category: 'Electronics', patterns: [/\belectronic/i, /\blaptop\b/i, /\bgadget/i, /\bcomputer\b/i, /\btech\b/i, /\bphone\b/i] },
  { category: 'Fashion', patterns: [/\bfashion\b/i, /\bapparel\b/i, /\bclothing\b/i, /\bdress\b/i, /\bboutique\b/i, /\bhandbag\b/i] },
  { category: 'Footwear', patterns: [/\bfootwear\b/i, /\bshoe\b/i, /\bsneaker/i, /\bboot\b/i] },
  { category: 'Beauty', patterns: [/\bbeauty\b/i, /\bcosmetic/i, /\bskincare\b/i, /\bmakeup\b/i, /\bperfume\b/i] },
  { category: 'Food & Grocery', patterns: [/\bseafood\b/i, /\bgrocery\b/i, /\bfood\b/i, /\bsnack\b/i, /\bcoffee\b/i] },
  { category: 'Home & Garden', patterns: [/\bgarden\b/i, /\blawn\b/i, /\bmower\b/i, /\bshed\b/i, /\bpatio\b/i, /\boutdoor\b/i, /\bhome\s*depot\b/i] },
  { category: 'Furniture', patterns: [/\bfurniture\b/i, /\bbeds?\b/i, /\bmattress\b/i, /\bsofa\b/i] },
  { category: 'Travel', patterns: [/\btravel\b/i, /\bflight\b/i, /\bairline\b/i, /\bvaction\b/i, /\bvacation\b/i, /\bcruise\b/i] },
  { category: 'Hotel & Resorts', patterns: [/\bhotel\b/i, /\bresort\b/i] },
  { category: 'Automotive', patterns: [/\bauto\b/i, /\bcar\b/i, /\btyres?\b/i, /\btires?\b/i, /\bvehicle\b/i] },
  { category: 'Gift', patterns: [/\bgift\b/i, /\bflorist\b/i, /\bflower\b/i, /\bbloom\b/i] },
  { category: 'Pets', patterns: [/\bpet\b/i, /\bdog\b/i, /\bcat\b/i] },
  { category: 'Kids', patterns: [/\bkids?\b/i, /\bbaby\b/i, /\btoy\b/i] },
  { category: 'Sports & Outdoor', patterns: [/\bsport\b/i, /\boutdoor\s*gear\b/i] },
  { category: 'Fitness', patterns: [/\bfitness\b/i, /\bgym\b/i] },
  { category: 'Office & Stationery', patterns: [/\boffice\b/i, /\bstationery\b/i] },
  { category: 'E-Commerce', patterns: [/\bmarketplace\b/i, /\bshop\b/i, /\bstore\b/i] },
];

const CATEGORY_ALIASES = {
  'home and garden': 'home & garden',
  'home-and-garden': 'home & garden',
  home: 'home & garden',
  ecommerce: 'e-commerce',
  'e commerce': 'e-commerce',
  food: 'food & grocery',
  grocery: 'food & grocery',
  gifts: 'gift',
  sports: 'sports & outdoor',
  'sports and outdoor': 'sports & outdoor',
  hotel: 'hotel & resorts',
  hotels: 'hotel & resorts',
  tech: 'electronics',
  technology: 'electronics',
  clothing: 'fashion',
  apparel: 'fashion',
  shoes: 'footwear',
  pets: 'pets',
};

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    return Object.fromEntries(
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
        .map((l) => {
          const i = l.indexOf('=');
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
        })
    );
  }
  throw new Error('No .env.local or .env found');
}

function normalizeCategoryKey(name) {
  const key = String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
  return CATEGORY_ALIASES[key] || key;
}

function matchRules(haystack, rules) {
  for (const rule of rules) {
    if (rule.patterns.some((p) => p.test(haystack))) return rule.category;
  }
  return null;
}

function inferCategoryName(store) {
  const haystack = [store.store_name, store.slug?.replace(/-/g, ' '), store.description, store.website_url]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return matchRules(haystack, BRAND_OVERRIDES) || matchRules(haystack, CATEGORY_RULES);
}

function resolveCategoryId(byName, categoryName) {
  const key = normalizeCategoryKey(categoryName);
  if (byName.has(key)) return byName.get(key);

  for (const [name, id] of byName.entries()) {
    if (name === key) return id;
    if (name.includes(key) || key.includes(name)) return id;
  }
  return null;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or service/anon key');
  process.exit(1);
}

const supabase = createClient(url, key);
const force = process.argv.includes('--force');

const { data: categories, error: catErr } = await supabase.from('categories').select('id, name, slug');
if (catErr) {
  console.error(catErr);
  process.exit(1);
}

const byName = new Map();
for (const c of categories || []) {
  byName.set(normalizeCategoryKey(c.name), c.id);
  if (c.slug) byName.set(normalizeCategoryKey(c.slug.replace(/-/g, ' ')), c.id);
}

console.log('Categories in DB:');
for (const c of categories || []) console.log(`  - ${c.name}`);

let query = supabase
  .from('stores')
  .select('id, store_id, store_name, slug, description, website_url, category_id');

if (!force) {
  query = query.is('category_id', null);
}

const { data: stores, error: storeErr } = await query;
if (storeErr) {
  console.error(storeErr);
  process.exit(1);
}

console.log(`\nStores to process: ${(stores || []).length}${force ? ' (force all)' : ' (missing category only)'}\n`);

let updated = 0;
let skipped = 0;
const unmatched = [];

for (const store of stores || []) {
  const categoryName = inferCategoryName(store);
  if (!categoryName) {
    unmatched.push(store.store_name);
    skipped++;
    continue;
  }

  const categoryId = resolveCategoryId(byName, categoryName);
  if (!categoryId) {
    console.log(`SKIP ${store.store_name} — category "${categoryName}" not in DB`);
    skipped++;
    continue;
  }

  if (!force && store.category_id === categoryId) {
    skipped++;
    continue;
  }

  const { error } = await supabase
    .from('stores')
    .update({ category_id: categoryId, updated_at: new Date().toISOString() })
    .eq('id', store.id);

  if (error) {
    console.error(`FAIL ${store.store_name}:`, error.message);
    continue;
  }

  console.log(`OK ${store.store_name} -> ${categoryName}`);
  updated++;
}

console.log(`\nUpdated ${updated}, skipped ${skipped}`);
if (unmatched.length) {
  console.log(`\nNo rule match (${unmatched.length}):`);
  for (const name of unmatched) console.log(`  - ${name}`);
}

// Summary per category
const { data: allStores } = await supabase.from('stores').select('store_name, category_id');
const catNameById = new Map((categories || []).map((c) => [c.id, c.name]));
const counts = {};
let stillNull = 0;
for (const s of allStores || []) {
  if (!s.category_id) {
    stillNull++;
    continue;
  }
  const n = catNameById.get(s.category_id) || 'Unknown';
  counts[n] = (counts[n] || 0) + 1;
}
console.log('\nCoverage by category:');
for (const [name, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${name}: ${count}`);
}
console.log(`  (no category): ${stillNull}`);
