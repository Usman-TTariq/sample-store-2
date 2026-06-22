'use client';

const messages = [
  'Free shipping on orders over $50',
  'Verified coupons updated daily',
  'Save up to 40% with exclusive codes',
  'Join 120k+ smart shoppers',
];

export default function PromoMarquee() {
  const items = [...messages, ...messages];

  return (
    <div className="promo-marquee py-2.5 border-y border-brand-navy-dark">
      <div className="promo-marquee-track">
        {items.map((msg, i) => (
          <span key={i}>
            {msg}
            <span className="highlight mx-3">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
