import { useEffect } from 'react';

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor navigation timing
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation Performance:', {
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });

      // Monitor LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
      };
    }
  }, []);
}

// Web Vitals reporting
export function reportWebVitals(metric: any) {
  console.log('Web Vital:', metric);
}