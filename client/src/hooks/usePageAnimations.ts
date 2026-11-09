import { useEffect } from 'react';

/**
 * Auto-observes every [data-animate] element in the page
 * and adds `.in-view` when it enters the viewport.
 * Call once from AppLayout — it covers all child pages.
 */
export function usePageAnimations() {
  useEffect(() => {
    const run = () => {
      const elements = document.querySelectorAll('[data-animate]');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target); // animate once
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    };

    // Small defer so the DOM has fully painted
    const id = setTimeout(run, 50);
    return () => clearTimeout(id);
  });
}

