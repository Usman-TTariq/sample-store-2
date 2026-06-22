'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStores, Store } from '@/lib/services/storeService';
import SectionHeader from './SectionHeader';

export default function FeaturedStoresSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores()
      .then((data) => setStores(data.slice(0, 12)))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const getLogo = (store: Store) => {
    if (store.logoUrl) return store.logoUrl;
    const url = store.websiteUrl || store.trackingLink;
    if (url) {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <section className="home-section bg-white section-divider">
      <div className="home-container">
        <SectionHeader
          title="Featured Stores"
          subtitle="Browse coupons from your favorite retailers"
          actionLabel="All Stores"
          actionHref="/stores"
        />

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-50 rounded-lg animate-pulse border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {stores.map((store) => {
              const logo = getLogo(store);
              const href = store.slug ? `/stores/${store.slug}` : store.id ? `/stores/${store.id}` : '/stores';
              return (
                <Link
                  key={store.id}
                  href={href}
                  className="store-card aspect-[4/3] flex items-center justify-center p-4 hover:border-brand-red group"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={store.name}
                      className="max-h-10 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <span className="text-sm font-bold text-brand-navy text-center line-clamp-2">
                      {store.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
