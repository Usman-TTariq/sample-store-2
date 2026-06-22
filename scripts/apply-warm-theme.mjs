/**
 * Apply warm brand palette across the codebase.
 * Usage: node scripts/apply-warm-theme.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const root = join(import.meta.dirname, '..')

const replacements = [
  ['#01345B', '#221E1D'],
  ['#01345b', '#221E1D'],
  ['#012a47', '#523120'],
  ['#001f36', '#1a1615'],
  ['#024a72', '#523120'],
  ['#063830', '#523120'],
  ['#0f5c4e', '#523120'],
  ['#5CE0D8', '#DE6113'],
  ['#5ce0d8', '#DE6113'],
  ['#FFCF43', '#DB1F15'],
  ['#ffcf43', '#DB1F15'],
  ['#f5c030', '#c41a12'],
  ['#f8fafb', '#FDF3DA'],
  ['#faf9f7', '#E5D7B9'],
  ['#64748b', '#99998A'],
  ['rgba(92, 224, 216', 'rgba(222, 97, 19'],
  ['rgba(1, 52, 91', 'rgba(34, 30, 29'],
  ['rgba(255, 207, 67', 'rgba(219, 31, 21'],
  ['fill-yellow-400', 'fill-brand-yellow'],
  ['text-yellow-400', 'text-brand-yellow'],
  ['hover:bg-[#08352e]', 'hover:bg-brand-navy-dark'],
  ['hover:bg-[#093a32]', 'hover:bg-brand-navy-dark'],
  ['#043830', '#523120'],
  ['#064e42', '#523120'],
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
  if (file.includes('apply-warm-theme') || file.includes('apply-theme')) continue
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

console.log(`Updated ${updated} files with warm palette.`)
