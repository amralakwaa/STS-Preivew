'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import Ether from './Ether';
import Filters from './Filters';
import GlassFx from './GlassFx';
import { copy, tr, type Lang } from '../lib/i18n';

/** 404: a lens drifts over a blank, scrambled feed and finds nothing. */
export default function NotFoundView() {
  const [lang, setLang] = useState<Lang>('ar');
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 14 }), sy = useSpring(y, { stiffness: 60, damping: 14 });

  useEffect(() => {
    if (navigator.language && !navigator.language.startsWith('ar')) setLang('en');
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // the lens searches on its own; the pointer can take it over
  useEffect(() => {
    if (reduce) return;
    let t = 0;
    const id = window.setInterval(() => { t += 1; x.set(Math.cos(t * 0.9) * 70); y.set(Math.sin(t * 1.3) * 26); }, 1400);
    return () => window.clearInterval(id);
  }, [reduce, x, y]);

  const home = (() => {
    if (typeof window === 'undefined') return './';
    const base = window.location.pathname.split('/').filter(Boolean)[0];
    return window.location.hostname.endsWith('github.io') && base ? `/${base}/` : '/';
  })();

  const t = copy.notFound;
  return (
    <>
      <Filters />
      <Ether />
      <GlassFx />
      <main className="relative z-10 grid min-h-[100svh] place-items-center px-5 py-16 text-center">
        <div>
          <div
            ref={box}
            className="relative mx-auto h-[min(42vw,220px)] w-[min(86vw,520px)]"
            onPointerMove={(e) => {
              if (e.pointerType !== 'mouse') return;
              const b = e.currentTarget.getBoundingClientRect();
              x.set(e.clientX - b.left - b.width / 2);
              y.set(e.clientY - b.top - b.height / 2);
            }}
          >
            <p className="display select-none text-[min(38vw,210px)] font-bold leading-none text-paper/10" aria-hidden>404</p>
            <motion.div
              style={{ x: sx, y: sy }}
              className="nf-lens absolute left-1/2 top-1/2 -ml-[70px] -mt-[70px] grid h-[140px] w-[140px] place-items-center overflow-hidden rounded-full"
              aria-hidden
            >
              <span className="nf-static absolute inset-0" />
              <span className="relative text-sm font-semibold text-amber">{lang === 'ar' ? 'لا إشارة' : 'No signal'}</span>
            </motion.div>
          </div>
          <h1 className="display mx-auto mt-8 max-w-[22ch] text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">{tr(t.title, lang)}</h1>
          <p className="mx-auto mt-4 max-w-[48ch] text-lg text-mist">{tr(t.sub, lang)}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={home} className="rim-fire inline-flex rounded-full" data-magnet>
              <span className="rim" aria-hidden />
              <span className="btn btn-amber" data-glass>{tr(t.home, lang)}</span>
            </a>
            <button className="btn" data-glass onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} lang={lang === 'ar' ? 'en' : 'ar'}>
              {tr(copy.nav.lang, lang)}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
