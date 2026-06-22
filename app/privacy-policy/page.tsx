import PrivacyPolicyPageClient from './PrivacyPolicyPageClient';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Read Sample Store 2 privacy policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://samplestore2.com/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy',
    description: 'Read Sample Store 2 privacy policy to understand how we collect, use, and protect your personal information.',
    url: 'https://samplestore2.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient />;
}
