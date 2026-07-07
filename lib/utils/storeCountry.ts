const SLUG_SUFFIX_TO_COUNTRY: Record<string, string> = {
  us: 'US',
  uk: 'UK',
  ca: 'CA',
  au: 'AU',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  nl: 'NL',
  in: 'IN',
  ae: 'AE',
  sa: 'SA',
  sg: 'SG',
  nz: 'NZ',
  ie: 'IE',
  br: 'BR',
  mx: 'MX',
  jp: 'JP',
};

const TLD_TO_COUNTRY: Record<string, string> = {
  'co.uk': 'UK',
  'com.au': 'AU',
  'co.nz': 'NZ',
  'co.za': 'ZA',
  'com.br': 'BR',
  'com.mx': 'MX',
  uk: 'UK',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  nl: 'NL',
  ca: 'CA',
  au: 'AU',
  in: 'IN',
  ae: 'AE',
  ie: 'IE',
  jp: 'JP',
};

function normalizeCountry(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase();
  if (!code || code.length < 2) return null;
  return code.slice(0, 2);
}

/** Infer a 2-letter country code from slug or store name (bulk upload helper). */
export function inferCountryCode(
  slug?: string | null,
  storeName?: string | null
): string | null {
  const haystack = [slug, storeName].filter(Boolean).join(' ').toLowerCase();
  if (!haystack) return null;

  for (const [tld, country] of Object.entries(TLD_TO_COUNTRY)) {
    if (haystack.includes(`.${tld}`)) return country;
  }

  for (const [suffix, country] of Object.entries(SLUG_SUFFIX_TO_COUNTRY)) {
    const pattern = new RegExp(`(?:^|[-_])${suffix}(?:$|[-_])`);
    if (pattern.test(haystack)) return country;
  }

  const explicit = haystack.match(/(?:^|[\s_-])([a-z]{2})(?:$|[\s_.-])/);
  if (explicit) {
    return normalizeCountry(explicit[1]);
  }

  return null;
}
