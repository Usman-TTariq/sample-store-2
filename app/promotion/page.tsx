import CouponsPageClient from '../coupons/CouponsPageClient';
import SiteFooter from '@/app/components/SiteFooter';
import { siteConfig } from '@/lib/seo/config';

export const metadata = {
  title: 'Promotions & Verified Deals',
  description:
    'Browse hand-picked promo codes and exclusive deals from top brands on Favento. Verified daily — save more on every purchase.',
  alternates: { canonical: `${siteConfig.url}/promotion` },
  openGraph: {
    title: 'Promotions & Verified Deals',
    description: 'Browse hand-picked promo codes and exclusive deals from top brands. Verified daily.',
    url: `${siteConfig.url}/promotion`,
  },
};

export default function PromotionPage() {
  return (
    <>
      <CouponsPageClient />
      <SiteFooter />
    </>
  );
}
