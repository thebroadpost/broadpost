import { CSSProperties, useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layout?: 'in-article';
  layoutKey?: string;
  center?: boolean;
  responsive?: boolean;
  className?: string;
}

/**
 * AdUnit Component for Google AdSense
 * 
 * Usage:
 * <AdUnit slot="YOUR_SLOT_ID" format="auto" />
 * 
 * Get slot IDs from: https://adsense.google.com/
 * Under Ads > By size, create ad units and copy the data-ad-slot value
 */
export function AdUnit({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  center = false,
  responsive = true,
  className = '',
}: AdUnitProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [slot]);

  const style: CSSProperties = {
    display: 'block',
    ...(center ? { textAlign: 'center' } : {}),
  };

  return (
    <ins
      className={`adsbygoogle my-6 ${className}`.trim()}
      style={style}
      data-ad-client="ca-pub-3571784073808010"
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-ad-layout-key={layoutKey}
      data-full-width-responsive={format === 'auto' ? (responsive ? 'true' : 'false') : undefined}
    />
  );
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
