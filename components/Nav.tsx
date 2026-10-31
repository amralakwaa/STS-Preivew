'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { copy, tr, type Lang } from '../lib/i18n';

const links = ['services', 'projects', 'process', 'contact'] as const;
type Id = (typeof links)[number];

export default function Nav({ lang, onLang }: { lang: Lang; onLang: () => void }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<Id | null>(null);
  const [current, setCurrent] = useState<Id | null>(null);
  const [compact, setCompact] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setCompact(v > 80));

  // which section is being read
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id as Id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    links.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const top = () => window.scrollY < window.innerHeight * 0.5 && setCurrent(null);
    window.addEventListener('scroll', top, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', top); };
  }, []);

  const pill = hover ?? current;

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <nav
        data-glass
        className={`glass glass-refract mx-auto flex items-center justify-between gap-3 rounded-full py-2 pe-2 ps-3 transition-[max-width] duration-700 ease-out sm:ps-4 ${compact ? 'max-w-5xl' : 'max-w-7xl'}`}
        aria-label="Main"
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative">
            <img src="img/logo.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
            <span className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_0_0_1px_rgba(255,255,255,0.25)]" aria-hidden />
          </span>
          <span className="display text-xl font-semibold">STS</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHover(null)}>
          {links.map((id) => (
            <li key={id} className="relative">
              {pill === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_0_0_1px_rgba(255,255,255,0.18),0_6px_20px_-8px_rgba(0,0,0,0.6)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <a
                href={`#${id}`}
                onMouseEnter={() => setHover(id)}
                onFocus={() => setHover(id)}
                onBlur={() => setHover(null)}
                aria-current={current === id ? 'true' : undefined}
                className={`relative block rounded-full px-4 py-2 text-[15px] transition-colors duration-300 ${pill === id ? 'text-paper' : 'text-mist'}`}
              >
                {tr(copy.nav[id], lang)}
                {current === id && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-amber to-transparent" aria-hidden />}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={onLang} data-glass className="btn !min-h-[40px] !px-3.5 text-sm !font-medium" lang={lang === 'ar' ? 'en' : 'ar'} style={{ ['--glint-delay' as string]: '4.2s' }}>
            {tr(copy.nav.lang, lang)}
          </button>
          <a href="#contact" className="rim-fire inline-flex rounded-full" data-magnet>
            <span className="rim" aria-hidden />
            <span className="btn btn-amber !min-h-[40px] !px-4 text-sm" data-glass>{tr(copy.nav.quote, lang)}</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
