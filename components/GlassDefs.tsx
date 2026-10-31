'use client';
import { useEffect } from 'react';

/** SVG displacement filter that bends whatever sits behind a glass panel, like a real lens. */
export default function GlassDefs() {
  useEffect(() => {
    try {
      const chromium = /Chrome|Chromium|Edg\//.test(navigator.userAgent);
      if (chromium && CSS.supports('backdrop-filter', 'url(#liquid)')) document.documentElement.classList.add('refract');
    } catch {}
  }, []);
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="liquid" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise">
            <animate attributeName="baseFrequency" dur="24s" values="0.012 0.018;0.018 0.012;0.012 0.018" repeatCount="indefinite" />
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="1.5" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
