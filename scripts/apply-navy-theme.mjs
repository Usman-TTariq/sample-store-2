/**
 * Apply navy / cyan / yellow brand palette across the codebase.
 * Usage: node scripts/apply-navy-theme.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const root = join(import.meta.dirname, '..')

const replacements = [
  // Warm palette → brand palette
  ['#221E1D', '#01345B'],
  ['#221e1d', '#01345B'],
  ['#523120', '#012a47'],
  ['#1a1615', '#001f36'],
  ['#DE6113', '#5CE0D8'],
  ['#de6113', '#5CE0D8'],
  ['#DB1F15', '#FFCF43'],
  ['#db1f15', '#FFCF43'],
  ['#c41a12', '#f5c030'],
  ['#FDF3DA', '#f8fafb'],
  ['#fdf3da', '#f8fafb'],
  ['#E5D7B9', '#eef6f6'],
  ['#99998A', '#64748b'],
  ['#956025', '#024a72'],
  ['rgba(222, 97, 19', 'rgba(92, 224, 216'],
  ['rgba(219, 31, 21', 'rgba(255, 207, 67'],
  ['rgba(34, 30, 29', 'rgba(1, 52, 91'],
  // Tailwind class aliases
  ['text-brand-orange', 'text-brand-yellow'],
  ['bg-brand-orange', 'bg-brand-yellow'],
  ['hover:text-brand-orange', 'hover:text-brand-yellow'],
  ['hover:bg-brand-orange', 'hover:bg-brand-yellow'],
  ['border-brand-orange', 'border-brand-cyan'],
  ['bg-brand-red', 'bg-brand-yellow'],
  ['hover:bg-brand-red', 'hover:bg-brand-yellow-hover'],
  ['text-brand-red', 'text-brand-yellow'],
  ['bg-cream', 'bg-background'],
  ['text-cream', 'text-white'],
  ['border-tan', 'border-brand-cyan/30'],
  ['fill-brand-yellow', 'fill-brand-yellow'],
  ['hover:bg-[#c41a12]', 'hover:bg-brand-yellow-hover'],
]

const allowedExt = new Set(['.tsx', '.ts', '.css', '.svg'])

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next') continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, files)
    else if (allowedExt.has(extname(path))) files.push(path)
  }
  return files
}

let updated = 0
for (const file of walk(root)) {
  if (file.includes('apply-navy-theme') || file.includes('apply-warm-theme')) continue
  let content = readFileSync(file, 'utf8')
  let next = content
  for (const [from, to] of replacements) {
    next = next.split(from).join(to)
  }
  if (next !== content) {
    writeFileSync(file, next, 'utf8')
    updated++
  }
}

console.log(`Updated ${updated} files with navy/cyan/yellow palette.`)
