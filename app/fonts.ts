import localFont from 'next/font/local';

// Self-hosted, subset fonts. Only the small Reem Kufi Arabic files (the headings, ~9 KB each) are preloaded.
// Body text uses display 'optional': on a slow first visit the phone's own Arabic font is used with no swap
// (no layout shift, nothing blocking), and the cached Plex font is used from the next page view on.
export const plexAr = localFont({
  src: [
    { path: './fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2', weight: '400' },
    { path: './fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2', weight: '500' },
    { path: './fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2', weight: '600' },
  ],
  variable: '--f-plex-ar',
  display: 'optional',
  preload: false,
});
export const plexLa = localFont({
  src: [
    { path: './fonts/ibm-plex-sans-arabic-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/ibm-plex-sans-arabic-latin-500-normal.woff2', weight: '500' },
    { path: './fonts/ibm-plex-sans-arabic-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--f-plex-la',
  display: 'optional',
  preload: false,
});
export const kufiAr = localFont({
  src: [
    { path: './fonts/reem-kufi-arabic-600-normal.woff2', weight: '600' },
    { path: './fonts/reem-kufi-arabic-700-normal.woff2', weight: '700' },
  ],
  variable: '--f-kufi-ar',
  display: 'swap',
});
export const kufiLa = localFont({
  src: [
    { path: './fonts/reem-kufi-latin-600-normal.woff2', weight: '600' },
    { path: './fonts/reem-kufi-latin-700-normal.woff2', weight: '700' },
  ],
  variable: '--f-kufi-la',
  display: 'swap',
  preload: false,
});
