'use client';

import { useEffect, useState } from 'react';
import type { Category } from '@/lib/services/categoryService';
import { getCategories } from '@/lib/services/categoryService';
import CategoryDealsBlock from './CategoryDealsBlock';

const CATEGORY_BLOCKS = [
  { slug: 'fashion', title: 'Our Favorite Fashion Deals' },
  { slug: 'electronics', title: 'Top Electronics Deals' },
  { slug: 'travel', title: 'Travel Deals & Offers' },
  { slug: 'home-garden', title: 'Home & Garden Deals' },
] as const;

function CategoryDealsSections() {
  const [categories, setCategories] = useState<Map<string, Category>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        const map = new Map<string, Category>();
        data.forEach((cat) => {
          if (cat.slug) map.set(cat.slug, cat);
        });
        setCategories(map);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="home-section bg-white section-divider">
        <div className="home-container">
          <div className="h-56 bg-gray-50 rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  const blocks = CATEGORY_BLOCKS.filter((b) => categories.has(b.slug));
  if (blocks.length === 0) return null;

  return (
    <section className="home-section bg-white section-divider">
      <div className="home-container">
        {blocks.map((block) => {
          const category = categories.get(block.slug);
          if (!category) return null;
          return (
            <CategoryDealsBlock
              key={block.slug}
              category={category}
              title={block.title}
            />
          );
        })}
      </div>
    </section>
  );
}

export default CategoryDealsSections;
