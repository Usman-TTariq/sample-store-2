import FaqsPageClient from './FaqsPageClient';

export const metadata = {
  title: 'Support & FAQs',
  description: 'Find answers to common questions about Sample Store 2 coupons, cashback, and account management.',
  alternates: { canonical: 'https://samplestore2.com/faqs' },
  openGraph: {
    title: 'Support & FAQs',
    description: 'Find answers to common questions about Sample Store 2 coupons, cashback, and account management.',
    url: 'https://samplestore2.com/faqs',
  },
};

export default function FAQsPage() {
  return <FaqsPageClient />;
}
