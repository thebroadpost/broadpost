import { useEffect, useId, useRef } from 'react';
import { ADSTERRA_PLACEMENTS, type AdsterraPlacement } from '../../lib/adPlacements';

interface AdsterraAdProps {
  placement: AdsterraPlacement;
  mobilePlacement?: AdsterraPlacement;
  className?: string;
  wrapperClassName?: string;
}

export function AdsterraAd({ placement, mobilePlacement, className = '', wrapperClassName = '' }: AdsterraAdProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const generatedId = useId().replace(/:/g, '');
  const resolvedPlacement = mobilePlacement && typeof window !== 'undefined' && window.innerWidth < 768
    ? mobilePlacement
    : placement;
  const config = ADSTERRA_PLACEMENTS[resolvedPlacement];
  const containerId = config.useContainer ? config.containerId || `container-${generatedId}` : undefined;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (config.options) {
      const setupScript = document.createElement('script');
      setupScript.type = 'text/javascript';
      setupScript.text = `window.atOptions = ${JSON.stringify(config.options)};`;
      wrapper.appendChild(setupScript);
    }

    const externalScript = document.createElement('script');
    externalScript.async = true;
    externalScript.setAttribute('data-cfasync', 'false');
    externalScript.src = config.scriptSrc;
    wrapper.appendChild(externalScript);

    return () => {
      wrapper.innerHTML = containerId ? `<div id="${containerId}" class="${className}"></div>` : `<div class="${className}"></div>`;
    };
  }, [className, config.options, config.scriptSrc, containerId]);

  return (
    <div
      ref={wrapperRef}
      className={`adsterra-ad flex w-full justify-center ${wrapperClassName}`.trim()}
      style={{ minHeight: config.minHeight, maxWidth: config.maxWidth, marginInline: 'auto' }}
    >
      {config.useContainer ? <div id={containerId} className={className} /> : <div className={className} />}
    </div>
  );
}

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: 'iframe';
      height: number;
      width: number;
      params?: Record<string, string>;
    };
  }
}