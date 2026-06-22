import type { Banner } from '@/lib/services/bannerService';

export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  accent: 'red' | 'orange' | 'brown';
}

export const ACCENT_STYLES = {
  red: {
    ring: 'border-[#DB1F15]/30',
    glow: 'from-[#DB1F15]/20 to-transparent',
    pill: 'bg-[#DB1F15]/10 text-[#DB1F15] border-[#DB1F15]/25',
    blob: 'bg-[#DB1F15]/[0.08]',
  },
  orange: {
    ring: 'border-[#DE6113]/35',
    glow: 'from-[#DE6113]/25 to-transparent',
    pill: 'bg-[#DE6113]/12 text-[#956025] border-[#DE6113]/30',
    blob: 'bg-[#DE6113]/[0.1]',
  },
  brown: {
    ring: 'border-[#956025]/35',
    glow: 'from-[#956025]/20 to-transparent',
    pill: 'bg-[#956025]/12 text-[#523120] border-[#956025]/30',
    blob: 'bg-[#956025]/[0.08]',
  },
} as const;

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'fashion',
    eyebrow: 'Editor\'s Pick',
    headline: 'Your wardrobe deserves',
    highlight: 'better prices',
    description: 'Hand-verified fashion codes from H&M, Nike & top brands — updated every morning.',
    ctaText: 'Shop Fashion Deals',
    ctaHref: '/coupons',
    imageUrl: '/og-image.svg',
    imageAlt: 'Fashion savings',
    badge: '50% OFF',
    accent: 'red',
  },
  {
    id: 'tech',
    eyebrow: 'This Week',
    headline: 'Tech gear at',
    highlight: 'smarter prices',
    description: 'Laptops, phones & smart home — exclusive promo codes, zero guesswork.',
    ctaText: 'Browse Tech Deals',
    ctaHref: '/coupons',
    imageUrl: '/sample-store-2-icon.svg',
    imageAlt: 'Tech deals',
    badge: 'HOT',
    accent: 'orange',
  },
  {
    id: 'stores',
    eyebrow: '500+ Stores',
    headline: 'Every shop you love,',
    highlight: 'one place',
    description: 'Starbucks to eBay — find verified coupons without jumping between sites.',
    ctaText: 'Explore All Stores',
    ctaHref: '/stores',
    imageUrl: '/og-image.svg',
    imageAlt: 'All stores',
    badge: 'NEW',
    accent: 'brown',
  },
  {
    id: 'shipping',
    eyebrow: 'Limited Time',
    headline: 'Free shipping plus',
    highlight: 'extra savings',
    description: 'Stack delivery offers with sitewide codes for maximum checkout savings.',
    ctaText: 'Claim Free Shipping',
    ctaHref: '/coupons',
    imageUrl: '/sample-store-2-icon.svg',
    imageAlt: 'Free shipping',
    badge: 'FREE',
    accent: 'orange',
  },
];

export const quickLinks = [
  { label: 'Top Coupons', href: '/coupons' },
  { label: 'All Stores', href: '/stores' },
  { label: 'Categories', href: '/categories' },
  { label: 'Starbucks', href: '/stores/starbucks' },
];

const CMS_DESCRIPTIONS = [
  'Exclusive verified deals — save more on every purchase.',
  'Limited-time offers from top brands. Act fast!',
  'Hand-picked promotions updated throughout the day.',
];

export function resolveHeroSlides(banners?: (Banner | null)[]): HeroSlide[] {
  const cms = (banners ?? [])
    .filter((b): b is Banner => Boolean(b?.imageUrl && b.imageUrl.length > 10))
    .map((banner, i) => ({
      id: banner.id ?? `cms-${i}`,
      eyebrow: 'Featured',
      headline: banner.title || defaultHeroSlides[i]?.headline || 'Save more on',
      highlight: defaultHeroSlides[i]?.highlight || 'every order',
      description: CMS_DESCRIPTIONS[i] ?? CMS_DESCRIPTIONS[0],
      ctaText: defaultHeroSlides[i]?.ctaText ?? 'Shop Now',
      ctaHref: defaultHeroSlides[i]?.ctaHref ?? '/coupons',
      imageUrl: banner.imageUrl,
      imageAlt: banner.title || 'Promotion',
      badge: 'DEAL',
      accent: defaultHeroSlides[i]?.accent ?? 'red',
    }));

  if (cms.length >= 3) return cms.slice(0, 4);

  return defaultHeroSlides.map((slide, i) => {
    const c = cms[i];
    if (!c) return slide;
    return { ...slide, headline: c.headline || slide.headline, imageUrl: c.imageUrl, imageAlt: c.imageAlt };
  });
}
