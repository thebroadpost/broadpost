import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazyRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function LazyRender({
  children,
  fallback = null,
  rootMargin = '250px 0px',
  threshold = 0,
}: LazyRenderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(marker);

    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return <div ref={markerRef}>{isVisible ? children : fallback}</div>;
}
