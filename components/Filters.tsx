'use client';
import { useEffect } from 'react';

/**
 * SVG filters shared by the page:
 *  - thermal / night: recolor the city photo the way our cameras would see it
 *  - refract / refract-strong: bend what sits behind a glass edge (Chromium only;
 *    other browsers keep the plain frosted fallback from CSS)
 */
export default function Filters() {
  useEffect(() => {
    const chromium = /Chrome|Chromium|Edg\//.test(navigator.userAgent);
    if (chromium && CSS.supports('backdrop-filter', 'url(#refract)')) {
      document.documentElement.classList.add('refract');
    }
  }, []);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="thermal" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.4 0.3 0 0  0.3 0.4 0.3 0 0  0.3 0.4 0.3 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.5" intercept="-0.12" />
            <feFuncG type="linear" slope="1.5" intercept="-0.12" />
            <feFuncB type="linear" slope="1.5" intercept="-0.12" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.06 0.22 0.55 0.89 1 1" />
            <feFuncG type="table" tableValues="0.04 0.05 0.1 0.27 0.7 0.97" />
            <feFuncB type="table" tableValues="0.18 0.42 0.55 0.43 0.2 0.78" />
          </feComponentTransfer>
        </filter>

        <filter id="night" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.1 0.15 0.15 0 0  0.35 0.55 0.6 0 0.02  0.12 0.2 0.22 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncG type="linear" slope="1.7" intercept="-0.05" />
            <feFuncR type="linear" slope="1.4" intercept="0" />
            <feFuncB type="linear" slope="1.4" intercept="0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="0.4" result="nv" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0.6  0 0 0 0 0  0 0 0 0.12 0" result="g" />
          <feBlend in="nv" in2="g" mode="screen" />
        </filter>

        <filter id="refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="1" seed="11" result="n" />
          <feGaussianBlur in="n" stdDeviation="2" result="s" />
          <feDisplacementMap in="SourceGraphic" in2="s" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="refract-strong" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="4" result="n" />
          <feGaussianBlur in="n" stdDeviation="1.2" result="s" />
          <feDisplacementMap in="SourceGraphic" in2="s" scale="38" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </defs>
    </svg>
  );
}
