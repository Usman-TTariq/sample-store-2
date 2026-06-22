'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Phone } from 'lucide-react';
import Newsletter from './Newsletter';

interface FooterProps {
  showNewsletter?: boolean;
}

export default function Footer({ showNewsletter = false }: FooterProps) {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="home-container">
        <div className="py-12 border-b border-white/10">
          <div className={`grid grid-cols-1 md:grid-cols-2 ${showNewsletter ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8`}>
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Sample Store 2 brings you verified coupon codes, exclusive deals, and savings from
                hundreds of top retailers — so you save more on every purchase.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 shrink-0" />
                <span>(302) 555-0107</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about-us', label: 'About Us' },
                  { href: '/contact-us', label: 'Contact Us' },
                  { href: '/privacy-policy', label: 'Privacy Policy' },
                  { href: '/coupons', label: 'Browse Deals' },
                  { href: '/stores', label: 'Stores' },
                  { href: '/categories', label: 'Categories' },
                  { href: '/blogs', label: 'Blog' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-brand-red transition text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <a href="mailto:demo@gmail.com" className="text-gray-300 hover:text-brand-red transition">
                    demo@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold mb-1">Location</p>
                  <p className="text-gray-300">
                    1901 Thornridge Cir. Hawaii
                    <br />
                    54126
                  </p>
                </div>
              </div>
            </div>

            {showNewsletter && (
              <div>
                <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                <Newsletter variant="footer" />
              </div>
            )}
          </div>
        </div>

        <div className="py-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/sample-store-2-icon.svg" alt="Sample Store 2" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold tracking-tight">
                Sample Store <span className="text-brand-orange">2</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 mr-1 hidden sm:inline">Follow us</span>
              {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 bg-brand-navy-dark rounded-full flex items-center justify-center hover:bg-brand-red hover:text-white transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6">
          <p className="text-sm text-gray-400 text-center md:text-left">
            Copyright © 2025{' '}
            <span className="text-brand-orange font-semibold">Sample Store 2</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
