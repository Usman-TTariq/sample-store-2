'use client';

import { useMemo, useState } from 'react';

type StoreLogoProps = {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  trackingLink?: string | null;
  slug?: string | null;
  className?: string;
  imgClassName?: string;
  fallbackClassName?: string;
};

function resolveDomain(
  websiteUrl?: string | null,
  trackingLink?: string | null,
  name?: string,
  slug?: string | null
): string {
  for (const url of [websiteUrl, trackingLink]) {
    if (!url) continue;
    try {
      return new URL(url).hostname.replace(/^www\./i, '');
    } catch {
      // ignore invalid URLs
    }
  }

  const fromSlug = slug?.replace(/-/g, '');
  if (fromSlug && fromSlug.includes('.')) {
    return fromSlug.toLowerCase();
  }

  if (name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('.')) {
      return nameLower.replace(/\s+/g, '');
    }
    return `${nameLower.replace(/\s+/g, '')}.com`;
  }

  return '';
}

function getFaviconUrl(props: StoreLogoProps): string {
  const domain = resolveDomain(props.websiteUrl, props.trackingLink, props.name, props.slug);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export default function StoreLogo({
  name,
  logoUrl,
  websiteUrl,
  trackingLink,
  slug,
  className = 'h-12 w-12',
  imgClassName = 'h-12 w-12 object-contain',
  fallbackClassName = 'h-12 w-12 bg-gradient-to-br from-brand-navy to-brand-navy-light rounded flex items-center justify-center text-white text-lg font-bold',
}: StoreLogoProps) {
  const sources = useMemo(() => {
    const favicon = getFaviconUrl({ name, logoUrl, websiteUrl, trackingLink, slug });
    return [logoUrl, favicon].filter((src): src is string => Boolean(src?.trim()));
  }, [logoUrl, websiteUrl, trackingLink, slug, name]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sourceIndex < sources.length ? sources[sourceIndex] : undefined;
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  if (!src) {
    return (
      <div className={fallbackClassName} aria-label={`${name} logo`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={imgClassName || className}
      onError={() => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((i) => i + 1);
        } else {
          setSourceIndex(sources.length);
        }
      }}
    />
  );
}
