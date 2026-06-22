import CategoriesPageClient from './CategoriesPageClient';

export const metadata = {
  title: 'Coupon Categories – Shop by Deal Type',
  description: 'Explore coupon categories on Sample Store 2. Find deals on fashion, electronics, food, travel, and more.',
  alternates: { canonical: 'https://samplestore2.com/categories' },
  openGraph: {
    title: 'Coupon Categories – Shop by Deal Type',
    description: 'Explore coupon categories on Sample Store 2. Find deals on fashion, electronics, food, travel, and more.',
    url: 'https://samplestore2.com/categories',
  },
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
