'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNewsWithLayout, NewsArticle } from '@/lib/services/newsService';
import SectionHeader from './SectionHeader';

export default function SavingsTipsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsWithLayout()
      .then((data) => setArticles(data.filter((a): a is NewsArticle => a !== null).slice(0, 4)))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section className="home-section bg-[var(--background)] section-divider">
      <div className="home-container">
        <SectionHeader
          title="Savings Tips"
          subtitle="Expert advice to help you save more on every purchase"
          actionLabel="Read All Articles"
          actionHref="/blogs"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.id}`}
                className="deal-card flex gap-4 p-4 sm:p-5 group"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brand-cyan/10 shrink-0 border border-[var(--border-subtle)]">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-navy font-bold text-xl">
                      {article.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-brand-navy text-base sm:text-lg line-clamp-2 group-hover:text-brand-red transition-colors">
                    {article.title}
                  </h3>
                  {article.date && (
                    <p className="text-xs text-brand-muted mt-1">{article.date}</p>
                  )}
                  {article.description && (
                    <p className="text-sm text-brand-muted mt-2 line-clamp-2">{article.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
