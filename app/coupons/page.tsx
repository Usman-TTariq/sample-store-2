import CouponsPageClient from './CouponsPageClient';

export const metadata = {
  title: 'Latest Coupons & Promo Codes',
  description: 'Browse the latest verified coupons and promo codes on Sample Store 2. Updated daily with fresh discounts from top brands.',
  alternates: { canonical: 'https://samplestore2.com/coupons' },
  openGraph: {
    title: 'Latest Coupons & Promo Codes',
    description: 'Browse the latest verified coupons and promo codes on Sample Store 2. Updated daily with fresh discounts from top brands.',
    url: 'https://samplestore2.com/coupons',
  },
};

export default function CouponsPage() {
  return <CouponsPageClient />;
}
