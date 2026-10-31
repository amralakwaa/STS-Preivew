'use client';
import { useEffect } from 'react';

/**
 * One delegated listener for every glass control:
 *  - [data-glass]  light follows the pointer across the surface (--gx/--gy)
 *  - [data-magnet] leans toward the pointer
 *  - .btn          a ripple spreads from where it was pressed
 */
export default function GlassFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const g = t?.closest<HTMLElement>('[data-glass]');
      if (g) {
        const b = g.getBoundingClientRect();
        g.style.setProperty('--gx', `${e.clientX - b.left}px`);
        g.style.setProperty('--gy', `${e.clientY - b.top}px`);
      }
      if (!fine || reduce) return;
      const m = t?.closest<HTMLElement>('[data-magnet]') ?? null;
      if (magnet && magnet !== m) magnet.style.translate = '';
      magnet = m;
      if (m) {
        const b = m.getBoundingClientRect();
        const dx = (e.clientX - (b.left + b.width / 2)) / b.width;
        const dy = (e.clientY - (b.top + b.height / 2)) / b.height;
        m.style.translate = `${dx * 10}px ${dy * 8}px`;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('.btn');
      if (!btn) return;
      const b = btn.getBoundingClientRect();
      const size = Math.max(b.width, b.height) * 2.2;
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = `${size}px`;
      s.style.left = `${e.clientX - b.left - size / 2}px`;
      s.style.top = `${e.clientY - b.top - size / 2}px`;
      btn.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    };

    const onLeave = () => { if (magnet) magnet.style.translate = ''; magnet = null; };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return null;
}
