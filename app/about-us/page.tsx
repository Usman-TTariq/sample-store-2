import AboutUsPageClient from './AboutUsPageClient';

export const metadata = {
  title: 'About Sample Store 2 – Our Story & Mission',
  description: 'Learn about Sample Store 2 – the platform dedicated to bringing you the best coupons, cashback, and exclusive deals every day.',
  alternates: { canonical: 'https://samplestore2.com/about-us' },
  openGraph: {
    title: 'About Sample Store 2 – Our Story & Mission',
    description: 'Learn about Sample Store 2 – the platform dedicated to bringing you the best coupons, cashback, and exclusive deals every day.',
    url: 'https://samplestore2.com/about-us',
  },
};

export default function AboutUsPage() {
  return <AboutUsPageClient />;
}
