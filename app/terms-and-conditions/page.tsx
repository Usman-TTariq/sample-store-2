import TermsAndConditionsPageClient from './TermsAndConditionsPageClient';

export const metadata = {
  title: 'Terms and Conditions',
  description: 'Review the terms and conditions for using Sample Store 2 coupon and cashback platform.',
  alternates: { canonical: 'https://samplestore2.com/terms-and-conditions' },
  openGraph: {
    title: 'Terms and Conditions',
    description: 'Review the terms and conditions for using Sample Store 2 coupon and cashback platform.',
    url: 'https://samplestore2.com/terms-and-conditions',
  },
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsPageClient />;
}
