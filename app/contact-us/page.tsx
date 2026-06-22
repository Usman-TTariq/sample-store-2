import ContactUsPageClient from './ContactUsPageClient';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Sample Store 2 team. We are available 24/7 to help with coupons, cashback, and account support.',
  alternates: { canonical: 'https://samplestore2.com/contact-us' },
  openGraph: {
    title: 'Contact Us',
    description: 'Get in touch with the Sample Store 2 team. We are available 24/7 to help with coupons, cashback, and account support.',
    url: 'https://samplestore2.com/contact-us',
  },
};

export default function ContactUsPage() {
  return <ContactUsPageClient />;
}
