'use client';

import { useEffect } from 'react';

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      root.dataset.pageReady = 'true';
      document.querySelectorAll<HTMLElement>('.scroll-reveal').forEach((item) => {
        item.dataset.visible = 'true';
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting);
        });
      },
      { threshold: 0.18, rootMargin: '-4% 0px -8%' },
    );

    document.querySelectorAll<HTMLElement>('.scroll-reveal').forEach((item) => {
      revealObserver.observe(item);
    });

    root.dataset.pageReady = 'true';

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  return null;
}
