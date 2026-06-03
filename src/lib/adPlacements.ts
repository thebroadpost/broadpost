export type AdsterraPlacement =
  | 'leaderboard'
  | 'compactBanner'
  | 'mobileBanner'
  | 'skyscraper'
  | 'mediumRectangle'
  | 'rectangle'
  | 'nativeWidget'
  | 'directScript'
  | 'directScriptAlt';

export type AdsterraPlacementConfig = {
  options?: {
    key: string;
    format: 'iframe';
    height: number;
    width: number;
    params?: Record<string, string>;
  };
  scriptSrc: string;
  useContainer?: boolean;
  containerId?: string;
  maxWidth?: string;
  minHeight?: string;
};

export const ADSTERRA_PROMO_URL = 'https://heavenlysuspicious.com/p1b9wqihu?key=3a4b0f20ede05eb12c7695ddc664e1f7';

export const ADSTERRA_PLACEMENTS: Record<AdsterraPlacement, AdsterraPlacementConfig> = {
  leaderboard: {
    options: {
      key: '694ca8e224f9bf78fb45fb235f77e317',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    },
    scriptSrc: 'https://heavenlysuspicious.com/694ca8e224f9bf78fb45fb235f77e317/invoke.js',
    maxWidth: '728px',
    minHeight: '90px',
  },
  compactBanner: {
    options: {
      key: '63dd1006f4023aa6910a062d5ab77a53',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    },
    scriptSrc: 'https://heavenlysuspicious.com/63dd1006f4023aa6910a062d5ab77a53/invoke.js',
    maxWidth: '468px',
    minHeight: '60px',
  },
  mobileBanner: {
    options: {
      key: '2e3059cddcc1998d17c93b15253873e5',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {},
    },
    scriptSrc: 'https://heavenlysuspicious.com/2e3059cddcc1998d17c93b15253873e5/invoke.js',
    maxWidth: '320px',
    minHeight: '50px',
  },
  skyscraper: {
    options: {
      key: 'e0bce1c60054fefd026c1340ff3909d0',
      format: 'iframe',
      height: 600,
      width: 160,
      params: {},
    },
    scriptSrc: 'https://heavenlysuspicious.com/e0bce1c60054fefd026c1340ff3909d0/invoke.js',
    maxWidth: '160px',
    minHeight: '600px',
  },
  mediumRectangle: {
    options: {
      key: '379dac924b25ffdea59160350c9f774c',
      format: 'iframe',
      height: 300,
      width: 160,
      params: {},
    },
    scriptSrc: 'https://heavenlysuspicious.com/379dac924b25ffdea59160350c9f774c/invoke.js',
    maxWidth: '160px',
    minHeight: '300px',
  },
  rectangle: {
    options: {
      key: '024f90f12158463434c63e80805f4c2d',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    },
    scriptSrc: 'https://heavenlysuspicious.com/024f90f12158463434c63e80805f4c2d/invoke.js',
    maxWidth: '300px',
    minHeight: '250px',
  },
  nativeWidget: {
    scriptSrc: 'https://heavenlysuspicious.com/ef31366a8e06fa714d6f2814b6dda19e/invoke.js',
    useContainer: true,
    containerId: 'container-ef31366a8e06fa714d6f2814b6dda19e',
    minHeight: '250px',
  },
  directScript: {
    scriptSrc: 'https://heavenlysuspicious.com/76/80/50/768050c92c1648d1b980647507bb4c9e.js',
    minHeight: '1px',
  },
  directScriptAlt: {
    scriptSrc: 'https://heavenlysuspicious.com/57/8e/45/578e450c2e6076e7e4a468cb81f7d929.js',
    minHeight: '1px',
  },
};