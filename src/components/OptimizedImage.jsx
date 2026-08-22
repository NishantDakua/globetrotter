import React, { useState } from 'react';

/**
 * OptimizedImage component for fast, responsive, and CLS-proof image rendering.
 */
export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  // Generate WebP path variants if local image path
  const isLocal = src && src.startsWith('/images/');
  const filename = isLocal ? src.replace('/images/', '').replace(/\.(jpg|jpeg|png)$/, '') : null;

  const webpSrc = isLocal ? `/images/optimized/${filename}.webp` : src;

  const srcSet = isLocal
    ? [480, 768, 1200, 1920]
        .map((w) => `/images/optimized/${filename}-${w}.webp ${w}w`)
        .join(', ')
    : undefined;

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/60 ${className}`}
      style={{
        aspectRatio: aspectRatio || (width && height ? `${width} / ${height}` : undefined),
      }}
    >
      <img
        src={webpSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
