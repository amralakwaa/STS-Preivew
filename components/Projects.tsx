'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { projects } from '../lib/data';
import { copy, tr, type Lang } from '../lib/i18n';

/** Vertical scroll drives the strip of projects sideways. */
export default function Projects({ lang }: { lang: Lang }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setShift(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [lang]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const dir = lang === 'ar' ? 1 : -1;
  const x = useTransform(smooth, [0, 1], [0, dir * shift]);
  const bar = useTransform(smooth, [0, 1], [0.08, 1]);

  if (reduce) {
    return (
      <section id="projects" className="scroll-mt-24 px-5 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold">{tr(copy.projects.title, lang)}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">{projects.map((p) => <Card key={p.slug} p={p} lang={lang} />)}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={section} className="relative scroll-mt-0" style={{ height: `calc(100vh + ${shift}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 pt-20 sm:px-10">
          <div>
            <h2 className="display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]">{tr(copy.projects.title, lang)}</h2>
            <p className="mt-2 text-mist">{tr(copy.projects.sub, lang)}</p>
          </div>
          <div className="hidden h-[3px] w-48 overflow-hidden rounded-full bg-white/10 sm:block" aria-hidden>
            <motion.div className="h-full origin-[var(--o)] rounded-full bg-amber" style={{ scaleX: bar, ['--o' as string]: lang === 'ar' ? 'right' : 'left' }} />
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 sm:gap-6 sm:px-10">
          {projects.map((p) => <Card key={p.slug} p={p} lang={lang} />)}
        </motion.div>
      </div>
    </section>
  );
}

function Card({ p, lang }: { p: (typeof projects)[number]; lang: Lang }) {
  return (
    <article className="group relative h-[min(62vh,560px)] w-[86vw] shrink-0 overflow-hidden rounded-[32px] sm:w-[min(64vw,760px)]">
      <img src={`img/${p.slug}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" loading="lazy" />
      <div className="glass glass-refract absolute inset-x-3 bottom-3 rounded-[24px] p-5 sm:inset-x-4 sm:bottom-4 sm:p-6">
        <p className="text-sm text-mist">{tr(p.city, lang)}، {tr(p.sector, lang)}</p>
        <h3 className="display mt-1 text-xl font-semibold leading-snug sm:text-2xl">{tr(p.name, lang)}</h3>
        <p className="mt-2 line-clamp-2 max-w-[62ch] text-[15px] text-paper/80">{tr(p.desc, lang)}</p>
      </div>
    </article>
  );
}
