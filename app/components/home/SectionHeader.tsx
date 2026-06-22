import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="home-section-title">{title}</h2>
        {subtitle && <p className="text-brand-muted text-sm sm:text-base mt-2">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-outline text-sm shrink-0">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
