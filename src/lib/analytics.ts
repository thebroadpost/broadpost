import { track } from '@vercel/analytics';

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsPayload = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function cleanPayload(payload: AnalyticsPayload): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'string') {
      const normalized = value.trim();
      if (!normalized) continue;
      cleaned[key] = normalized.slice(0, 120);
      continue;
    }

    cleaned[key] = value;
  }

  return cleaned;
}

export function trackEvent(name: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;

  const eventName = (name || '').trim();
  if (!eventName) return;

  const eventData = cleanPayload(payload);

  try {
    track(eventName, eventData);
  } catch {
    // Swallow analytics failures so product flows never break.
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  }
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const pagePath = path.trim();
  if (!pagePath) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  });
}
