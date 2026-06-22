'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface NewsletterProps {
  variant?: 'banner' | 'footer' | 'default';
}

export default function Newsletter({ variant = 'default' }: NewsletterProps) {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  if (variant === 'banner') {
    return (
      <section className="py-8 sm:py-10 bg-white section-divider">
        <div className="home-container">
          <div className="border-2 border-brand-navy rounded-xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-navy leading-tight">
                Get Today&apos;s Top Deals Straight to Your Inbox
              </h2>
              <p className="text-brand-muted mt-2 text-sm sm:text-base">
                Join thousands of smart shoppers. No spam, unsubscribe anytime.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full md:max-w-md shrink-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-brand flex-1"
                aria-label="Email address"
              />
              <button type="submit" className="btn-cta px-6 py-3 shrink-0 whitespace-nowrap">
                Unlock Deals
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleNewsletterSubmit} className="space-y-3">
        <p className="text-gray-300 text-sm">Get deals in your inbox</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="input-brand text-sm py-2.5"
          aria-label="Email address"
        />
        <button type="submit" className="btn-cta w-full py-2.5 text-sm justify-center">
          Subscribe
        </button>
      </form>
    );
  }

  return (
    <section className="py-12 bg-brand-navy border-t border-brand-navy-dark">
      <div className="home-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-brand-navy-dark/50 border border-brand-cyan/20 rounded-2xl p-8 md:p-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-brand-cyan font-medium">
              Get the best deals delivered to your inbox
            </p>
          </div>
          <div className="flex-1 max-w-md w-full">
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-brand flex-1 bg-white"
              />
              <button type="submit" className="btn-cta px-6 py-3 shrink-0">
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
