'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Expand } from 'lucide-react';
import { projects } from '../lib/data';
import ProjectModal from './ProjectModal';
import { copy, tr, type Lang } from '../lib/i18n';
import FocusText from './FocusText';

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
  const [at, setAt] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const modal = (
    <AnimatePresence>
      {open && <ProjectModal key="modal" slug={open} lang={lang} onClose={() => setOpen(null)} onSlug={setOpen} />}
    </AnimatePresence>
  );
  useMotionValueEvent(smooth, 'change', (v) => setAt(Math.min(projects.length, Math.floor(v * projects.length) + 1)));

  if (reduce) {
    return (
      <section id="projects" className="scroll-mt-24 px-5 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold">{tr(copy.projects.title, lang)}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">{projects.map((p) => <Card key={p.slug} p={p} lang={lang} onOpen={() => setOpen(p.slug)} hidden={open === p.slug} />)}</div>
        </div>
        {modal}
      </section>
    );
  }

  return (
    <section id="projects" ref={section} className="relative scroll-mt-0" style={{ height: `calc(100vh + ${shift}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 pt-20 sm:px-10">
          <div>
            <FocusText text={tr(copy.projects.title, lang)} className="display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />
            <p className="mt-2 text-mist">{tr(copy.projects.sub, lang)}</p>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="text-sm tabular-nums text-mist">{at} {tr(copy.projectOf, lang)} {projects.length}</span>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10" aria-hidden>
              <motion.div className="h-full origin-[var(--o)] rounded-full bg-amber shadow-[0_0_10px_rgba(255,178,62,0.8)]" style={{ scaleX: bar, ['--o' as string]: lang === 'ar' ? 'right' : 'left' }} />
            </div>
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 sm:gap-6 sm:px-10">
          {projects.map((p) => <Card key={p.slug} p={p} lang={lang} onOpen={() => setOpen(p.slug)} hidden={open === p.slug} />)}
        </motion.div>
      </div>
      {modal}
    </section>
  );
}

function Card({ p, lang, onOpen, hidden }: { p: (typeof projects)[number]; lang: Lang; onOpen: () => void; hidden: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${tr(copy.proj.open, lang)}: ${tr(p.name, lang)}`}
      id={`card-${p.slug}`}
      className="group relative h-[min(62vh,560px)] w-[86vw] shrink-0 overflow-hidden rounded-[32px] text-start sm:w-[min(64vw,760px)]"
    >
      <motion.div layoutId={`proj-${p.slug}`} className="absolute inset-0 overflow-hidden rounded-[32px]" style={{ opacity: hidden ? 0 : 1 }}>
        <img src={`img/${p.slug}.jpg`} alt="" className="drift absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.12)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" aria-hidden />
      <span className="btn absolute end-4 top-4 !min-h-[44px] !w-11 !px-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
        <Expand size={18} />
      </span>
      <div data-glass className="glass glass-ink absolute inset-x-3 bottom-3 rounded-[24px] p-5 transition-transform duration-500 group-hover:-translate-y-1.5 sm:inset-x-4 sm:bottom-4 sm:p-6">
        <p className="text-sm text-mist">{tr(p.city, lang)}، {tr(p.sector, lang)}</p>
        <h3 className="display mt-1 text-xl font-semibold leading-snug sm:text-2xl">{tr(p.name, lang)}</h3>
        <p className="mt-2 line-clamp-2 max-w-[62ch] text-[15px] text-paper/80">{tr(p.desc, lang)}</p>
      </div>
    </button>
  );
}
