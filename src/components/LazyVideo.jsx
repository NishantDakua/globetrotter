import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyVideo component for viewport-triggered video loading & background playback.
 */
export default function LazyVideo({
  src,
  poster,
  priority = false,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  ...props
}) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // If priority is true, delay video source instantiation by 1.5s to let FCP/LCP poster render first
    if (priority) {
      const timer = setTimeout(() => setInView(true), 1500);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, inView]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-slate-950 ${className}`}>
      {inView ? (
        <video
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          poster={poster}
          preload={priority ? 'metadata' : 'none'}
          className="w-full h-full object-cover"
          {...props}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        poster && (
          <img
            src={poster}
            alt="Video Poster Preview"
            className="w-full h-full object-cover filter brightness-75"
            loading="lazy"
            decoding="async"
          />
        )
      )}
    </div>
  );
}
