'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPopularCoupons, getCoupons, Coupon } from '@/lib/services/couponService';
import SectionHeader from './SectionHeader';
import DealCard from './DealCard';

export default function FeaturedDealsSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const popular = await getPopularCoupons();
        const fromPopular = popular.filter((c): c is Coupon => c !== null);

        if (fromPopular.length >= 4) {
          setCoupons(fromPopular.slice(0, 10));
        } else {
          const all = await getCoupons();
          const active = all.filter((c) => c.isActive);
          const merged = [...fromPopular];
          for (const c of active) {
            if (merged.length >= 10) break;
            if (!merged.some((m) => m.id === c.id)) merged.push(c);
          }
          setCoupons(merged.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching featured deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <section className="home-section bg-[var(--background)]">
      <div className="home-container">
        <SectionHeader
          title="Coupons and Deals From Stores You Love"
          subtitle="Verified codes updated daily from top retailers"
          actionLabel="View All Deals"
          actionHref="/coupons"
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl border border-[var(--border-subtle)] animate-pulse" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <p className="text-center text-brand-muted py-8">No deals available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {coupons.map((coupon) => (
              <DealCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/coupons" className="btn-outline text-sm">
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
