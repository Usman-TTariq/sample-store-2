import StoresPageClient from './StoresPageClient';

export const metadata = {
  title: 'All Stores – Coupons & Cashback',
  description: 'Browse all stores on Sample Store 2 and find the best coupons, discount codes, and cashback deals in one place.',
  alternates: { canonical: 'https://samplestore2.com/stores' },
  openGraph: {
    title: 'All Stores – Coupons & Cashback',
    description: 'Browse all stores on Sample Store 2 and find the best coupons, discount codes, and cashback deals in one place.',
    url: 'https://samplestore2.com/stores',
  },
};

export default function StoresPage() {
  return <StoresPageClient />;
}
