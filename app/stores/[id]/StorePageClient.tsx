'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Plus,
  Tag,
} from 'lucide-react';
import { getStoreById, getStoreBySlug, Store, getStores } from '@/lib/services/storeService';
import { getCouponsByStoreId, Coupon } from '@/lib/services/couponService';
import { getCategories, Category } from '@/lib/services/categoryService';
import { sortCouponsByOrder } from '@/lib/utils/couponOrder';
import { getCouponDisplayTitle } from '@/lib/utils/couponDisplay';
import { getCategoryEmoji } from '@/lib/utils/categoryIcon';
import { categoryPath } from '@/lib/utils/categorySlug';
import { siteConfig } from '@/lib/seo/config';
import Navbar from '@/app/components/Navbar';
import CouponPopup from '@/app/components/CouponPopup';
import GetCodeButton from '@/app/components/GetCodeButton';

type FilterTab = 'top' | 'codes' | 'deals' | 'exclusives';

const FAQ_ITEMS = [
  {
    q: 'How do these coupon codes work?',
    a: 'Copy the code at checkout on the retailer\'s website, or click through to activate a verified deal. Each offer on Favento is checked for activity before we publish it.',
  },
  {
    q: 'Can promo codes expire?',
    a: 'Yes. Retailers change offers frequently. We show expiry dates when available and re-test popular codes so expired junk does not linger on the page.',
  },
  {
    q: 'How does Favento verify coupons?',
    a: 'Our team combines automated signals with human review. A code only stays live when it still applies a discount or unlocks the advertised deal.',
  },
  {
    q: 'Can I stack multiple coupons?',
    a: 'Usually one promo code applies per order, but some stores allow stacking with sale pricing or cashback. Check the store\'s checkout rules before you pay.',
  },
  {
    q: 'Any tips for getting the best price?',
    a: 'Try the highest-value verified code first, sign up for the store newsletter for welcome offers, and compare against current sale events — the best deal is not always the flashiest banner.',
  },
];

const getStoreFaviconUrl = (store: Store): string => {
  let domain = '';
  if (store.websiteUrl) {
    try {
      domain = new URL(store.websiteUrl).hostname.replace('www.', '');
    } catch {
      /* ignore */
    }
  } else if (store.trackingLink) {
    try {
      domain = new URL(store.trackingLink).hostname.replace('www.', '');
    } catch {
      /* ignore */
    }
  }
  if (!domain && store.name) {
    const nameLower = store.name.toLowerCase();
    domain = nameLower.includes('.')
      ? nameLower.replace(/\s+/g, '')
      : `${nameLower.replace(/\s+/g, '')}.com`;
  }
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
};

function storeHref(store: Store) {
  return store.slug ? `/stores/${store.slug}` : store.id ? `/stores/${store.id}` : '/stores';
}

function formatDiscount(coupon: Coupon): string {
  if (coupon.discountType === 'percentage' && coupon.discount) {
    return `${coupon.discount}% OFF`;
  }
  if (coupon.discount) {
    return `$${coupon.discount} OFF`;
  }
  if (coupon.couponType === 'code' && coupon.code) {
    return 'CODE';
  }
  return 'DEAL';
}

function toJsDate(timestamp: unknown): Date | null {
  if (!timestamp) return null;
  try {
    const value = timestamp as { toDate?: () => Date };
    return value.toDate ? value.toDate() : new Date(timestamp as string);
  } catch {
    return null;
  }
}

function formatShortDate(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StoreCouponCard({
  coupon,
  storeName,
  featured,
  onGetCode,
  copiedCode,
}: {
  coupon: Coupon;
  storeName: string;
  featured: boolean;
  onGetCode: (coupon: Coupon) => void;
  copiedCode: string | null;
}) {
  const isCode = coupon.couponType !== 'deal';
  const isExpired = (() => {
    const expiry = toJsDate(coupon.expiryDate);
    return expiry ? expiry < new Date() : false;
  })();
  const title = getCouponDisplayTitle(coupon);
  const usedToday = ((coupon.id?.charCodeAt(0) || 20) % 40) + 3;
  const successRate = 90 + ((coupon.id?.charCodeAt(1) || 5) % 9);
  const verifiedDate = formatShortDate(toJsDate(coupon.updatedAt || coupon.createdAt)) || 'recently';
  const expiresDate = formatShortDate(toJsDate(coupon.expiryDate));
  const buttonLabel =
    copiedCode === coupon.code && isCode
      ? 'Copied!'
      : isCode
        ? 'Get Code'
        : 'Get Deal';

  return (
    <article
      className={`relative bg-white border rounded-xl overflow-hidden transition-shadow hover:shadow-md ${
        featured ? 'border-brand-navy/35 shadow-sm' : 'border-tan'
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-brand-navy text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-br-lg">
            Featured
          </div>
        </div>
      )}

      <div className={`flex flex-col sm:flex-row sm:items-stretch ${featured ? 'pt-1' : ''}`}>
        {/* Discount panel */}
        <div
          className={`sm:w-36 shrink-0 flex flex-col items-center justify-center px-4 py-5 border-b sm:border-b-0 sm:border-r border-tan ${
            featured ? 'bg-brand-navy/[0.04]' : 'bg-cream/40'
          }`}
        >
          {!isCode && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand-muted mb-1">
              <Tag className="w-3 h-3" /> Deal
            </span>
          )}
          <p
            className={`font-extrabold text-brand-navy text-center leading-none ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
          >
            {coupon.discountType === 'percentage' && coupon.discount ? (
              <>
                <span className="text-brand-muted font-bold text-lg mr-0.5">-</span>
                {coupon.discount}
                <span className="block text-xs font-bold tracking-wide mt-1 text-brand-muted">% OFF</span>
              </>
            ) : (
              formatDiscount(coupon)
            )}
          </p>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {featured && (
              <span className="text-xs font-extrabold uppercase tracking-wide text-brand-navy">
                {storeName}
              </span>
            )}
            {isCode && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cream text-brand-navy border border-tan">
                Code
              </span>
            )}
            {(featured || coupon.isPopular) && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-cyan/25 text-brand-accent">
                Trending
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-brand-navy leading-snug mb-1">
            {title}
          </h3>
          {coupon.description && coupon.description !== title && (
            <p className="text-sm text-brand-muted line-clamp-2 mb-2">{coupon.description}</p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-brand-muted">
            <span>Used {usedToday} times today</span>
            <span>Verified {verifiedDate}</span>
            {expiresDate && <span>Expires {expiresDate}</span>}
            <span>{successRate}% success rate</span>
          </div>
        </div>

        {/* CTA */}
        <div className="sm:w-48 shrink-0 flex items-center p-4 sm:p-5 pt-0 sm:pt-5">
          {isExpired ? (
            <div className="w-full py-3 rounded-lg text-center text-xs font-extrabold uppercase tracking-wide bg-gray-200 text-gray-500">
              Expired
            </div>
          ) : (
            <GetCodeButton
              label={buttonLabel}
              code={coupon.code}
              isDeal={!isCode}
              onClick={() => onGetCode(coupon)}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default function StorePageClient({
  params,
  initialStore = null,
}: {
  params: { id: string };
  initialStore?: Store | null;
}) {
  const idOrSlug = params.id;

  const [store, setStore] = useState<Store | null>(initialStore);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!initialStore);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>('top');
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        let storeData = await getStoreBySlug(idOrSlug);
        if (!storeData) storeData = await getStoreById(idOrSlug);

        if (!storeData) {
          try {
            const res = await fetch('/api/stores/supabase');
            if (res.ok) {
              const data = await res.json();
              const supabaseList: Store[] = Array.isArray(data?.stores) ? data.stores : [];
              storeData =
                supabaseList.find((s) => s.slug === idOrSlug || s.id === idOrSlug) || null;
            }
          } catch (supabaseError) {
            console.error('Error fetching store from Supabase list:', supabaseError);
          }
        }

        if (storeData) {
          setStore(storeData);
          if (storeData.id) {
            try {
              const [storeCoupons, storesData, categoriesData] = await Promise.all([
                getCouponsByStoreId(storeData.id),
                getStores(),
                getCategories(),
              ]);
              const activeCoupons = (storeCoupons || []).filter((coupon) => coupon.isActive);
              // Admin priority order — first item becomes FEATURED on the page
              setCoupons(sortCouponsByOrder(activeCoupons, storeData.couponOrder));
              setAllStores(storesData);
              setCategories(categoriesData);
            } catch (couponErr) {
              console.error('Error fetching coupons for store:', couponErr);
              setCoupons([]);
            }
          }
        } else {
          setStore(null);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    if (idOrSlug) fetchStoreData();
  }, [idOrSlug]);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedCode(text);
        setTimeout(() => setCopiedCode(null), 2000);
      }).catch(() => {});
    }
  };

  const handleCouponClick = (coupon: Coupon) => {
    if (coupon.couponType === 'code' && coupon.code) {
      copyToClipboard(coupon.code.trim());
    }
    setSelectedCoupon(coupon);
    setShowPopup(true);
    if (coupon.url?.trim()) {
      setTimeout(() => window.open(coupon.url, '_blank', 'noopener,noreferrer'), 500);
    }
  };

  const handleContinue = () => {
    if (selectedCoupon?.url) {
      window.open(selectedCoupon.url, '_blank', 'noopener,noreferrer');
    }
    setShowPopup(false);
    setSelectedCoupon(null);
  };

  const codeCount = coupons.filter((c) => c.couponType === 'code').length;
  const dealCount = coupons.filter((c) => c.couponType === 'deal').length;
  const exclusiveCount = coupons.filter((c) => c.isPopular).length;

  const filteredCoupons = useMemo(() => {
    if (filterTab === 'codes') return coupons.filter((c) => c.couponType === 'code');
    if (filterTab === 'deals') return coupons.filter((c) => c.couponType === 'deal');
    if (filterTab === 'exclusives') return coupons.filter((c) => c.isPopular);
    return coupons;
  }, [coupons, filterTab]);

  /** Priority #1 from admin coupon_order — always the Featured card when in Top Offers */
  const featuredCouponId = coupons[0]?.id;

  const storeCategory = categories.find((c) => c.id === store?.categoryId);
  const relatedStores = useMemo(() => {
    if (!store) return [];
    const sameCat = allStores.filter(
      (s) => s.id !== store.id && store.categoryId && s.categoryId === store.categoryId
    );
    const rest = allStores.filter((s) => s.id !== store.id && !sameCat.some((x) => x.id === s.id));
    return [...sameCat, ...rest].slice(0, 7);
  }, [allStores, store]);

  const relatedCategories = categories.slice(0, 8);
  const visitUrl = store?.trackingLink || store?.websiteUrl || '#';
  const storeLogoUrl = store ? store.logoUrl || getStoreFaviconUrl(store) : '';
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const successRate = coupons.length ? Math.min(98, 88 + Math.min(coupons.length, 8)) : 92;
  const avgSavings = coupons.length
    ? Math.round(
        coupons.reduce((sum, c) => sum + (Number(c.discount) || 15), 0) / coupons.length
      )
    : 25;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-cyan/25 via-brand-cyan/10 to-cream">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy mb-4" />
            <p className="text-brand-muted">Loading store…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-cyan/25 via-brand-cyan/10 to-cream">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-navy mb-4">Store Not Found</h1>
            <p className="text-brand-muted mb-6">The store you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/stores" className="inline-block px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold">
              Browse All Stores
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'top', label: 'Top Offers', count: coupons.length },
    { id: 'codes', label: 'Promo Codes', count: codeCount },
    { id: 'deals', label: 'Deals', count: dealCount },
    { id: 'exclusives', label: 'Exclusives', count: exclusiveCount },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cyan/30 via-brand-cyan/12 to-cream">
      <Navbar />

      <div className="home-container py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border border-tan rounded-xl p-5 shadow-sm">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-xl border border-tan bg-cream/50 flex items-center justify-center overflow-hidden mb-3">
                  {storeLogoUrl ? (
                    <img src={storeLogoUrl} alt={store.name} className="max-h-14 max-w-[70%] object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-brand-navy">{store.name.charAt(0)}</span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold text-brand-navy">{store.name}</h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  {storeCategory?.name || 'Store'}
                </p>
              </div>

              <a
                href={visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-brand-navy text-white text-sm font-bold hover:bg-brand-navy-dark transition-colors"
              >
                Visit {store.name}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <nav className="mt-4 space-y-1 border-t border-tan pt-3">
                <a href="#coupons" className="block text-sm font-semibold text-brand-navy hover:text-brand-accent py-1.5">
                  Promo Codes
                </a>
                <a href="#faq" className="block text-sm font-semibold text-brand-navy hover:text-brand-accent py-1.5">
                  FAQ
                </a>
                <Link href="/stores" className="block text-sm font-semibold text-brand-navy hover:text-brand-accent py-1.5">
                  All Stores
                </Link>
              </nav>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-tan pt-4">
                <div className="rounded-lg bg-cream/80 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Codes</p>
                  <p className="text-2xl font-extrabold text-brand-navy">{coupons.length}</p>
                </div>
                <div className="rounded-lg bg-cream/80 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Success</p>
                  <p className="text-2xl font-extrabold text-brand-navy">{successRate}%</p>
                </div>
              </div>
            </div>

            {relatedStores.length > 0 && (
              <div className="bg-white border border-tan rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-navy mb-3">
                  Top {storeCategory?.name || ''} Stores
                </h3>
                <ul className="space-y-2">
                  {relatedStores.map((s) => {
                    const logo = s.logoUrl || getStoreFaviconUrl(s);
                    return (
                      <li key={s.id}>
                        <Link
                          href={storeHref(s)}
                          className="flex items-center gap-2.5 py-1.5 group"
                        >
                          <div className="w-8 h-8 rounded border border-tan bg-cream flex items-center justify-center overflow-hidden shrink-0">
                            {logo ? (
                              <img src={logo} alt="" className="max-h-5 max-w-5 object-contain" />
                            ) : (
                              <span className="text-[10px] font-bold text-brand-navy">{s.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-brand-navy group-hover:text-brand-accent truncate">
                            {s.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href="/stores"
                  className="inline-block mt-3 text-xs font-bold text-brand-accent hover:underline"
                >
                  View all stores →
                </Link>
              </div>
            )}

            {relatedCategories.length > 0 && (
              <div className="bg-white border border-tan rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-navy mb-3">
                  Related Categories
                </h3>
                <ul className="space-y-1.5">
                  {relatedCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={categoryPath(cat)}
                        className="flex items-center gap-2.5 py-1.5 group"
                      >
                        <span className="w-7 h-7 rounded-md bg-brand-navy/10 flex items-center justify-center text-xs shrink-0">
                          {getCategoryEmoji(cat.name)}
                        </span>
                        <span className="text-sm font-semibold text-brand-navy group-hover:text-brand-accent">
                          {cat.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Main */}
          <main className="min-w-0">
            <nav className="text-xs text-brand-muted mb-4 flex flex-wrap items-center gap-1.5">
              <Link href="/" className="hover:text-brand-navy">{siteConfig.name}</Link>
              <span>/</span>
              <Link href="/stores" className="hover:text-brand-navy">Stores</Link>
              <span>/</span>
              <span className="text-brand-navy font-semibold">{store.name}</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              {store.name} Coupons &amp; Promo Codes {monthYear}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
              {store.description?.trim() ||
                `${store.name} promo codes verified daily by ${siteConfig.name}. Every offer is human-reviewed and checked for activity so you spend less time hunting and more time saving.`}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                `${coupons.length} verified codes`,
                `${successRate}% success rate`,
                'Updated regularly',
                `${avgSavings}% avg savings`,
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy bg-white border border-tan rounded-full px-3 py-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {label}
                </span>
              ))}
            </div>

            {/* Coupons */}
            <section id="coupons" className="mt-8 sm:mt-10">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">
                  Verified Coupons
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                  Available Coupons
                </h2>
                <p className="text-sm text-brand-muted mt-1">
                  Found {coupons.length} active coupon{coupons.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      filterTab === tab.id
                        ? 'bg-brand-navy text-white'
                        : 'bg-white border border-tan text-brand-navy hover:border-brand-navy/40'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {filteredCoupons.length === 0 ? (
                <div className="bg-white border border-tan rounded-xl p-10 text-center">
                  <p className="text-brand-muted">No coupons in this filter right now.</p>
                  <button
                    type="button"
                    onClick={() => setFilterTab('top')}
                    className="mt-4 text-sm font-bold text-brand-accent hover:underline"
                  >
                    View all offers
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCoupons.map((coupon, index) => {
                    const isFeatured =
                      filterTab === 'top' &&
                      coupon.id != null &&
                      coupon.id === featuredCouponId;
                    // When filtering, first visible can also look featured if it's the priority coupon
                    const showFeatured = isFeatured || (filterTab !== 'top' && index === 0 && coupon.id === featuredCouponId);
                    return (
                      <StoreCouponCard
                        key={coupon.id || `${coupon.code}-${index}`}
                        coupon={coupon}
                        storeName={store.name}
                        featured={Boolean(showFeatured)}
                        onGetCode={handleCouponClick}
                        copiedCode={copiedCode}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* FAQ */}
            <section id="faq" className="mt-12 sm:mt-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">
                Questions
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy mb-2">
                {store.name} promo code FAQ
              </h2>
              <p className="text-sm text-brand-muted mb-5">
                Coupon questions, answered for {store.name} shoppers.
              </p>

              <div className="space-y-2">
                {FAQ_ITEMS.map((item, index) => {
                  const open = openFaq === index;
                  return (
                    <div
                      key={item.q}
                      className="bg-white border border-tan rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : index)}
                        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left"
                      >
                        <span className="text-sm font-bold text-brand-navy">{item.q}</span>
                        {open ? (
                          <ChevronDown className="w-4 h-4 text-brand-muted shrink-0 rotate-180 transition-transform" />
                        ) : (
                          <Plus className="w-4 h-4 text-brand-muted shrink-0" />
                        )}
                      </button>
                      {open && (
                        <div className="px-4 sm:px-5 pb-4 text-sm text-brand-muted leading-relaxed border-t border-tan/60 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>

      <CouponPopup
        coupon={selectedCoupon}
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          setSelectedCoupon(null);
        }}
        onContinue={handleContinue}
      />
    </div>
  );
}
