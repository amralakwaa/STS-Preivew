'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { projectDetails, projects } from '../lib/data';
import { copy, tr, type Lang } from '../lib/i18n';
import { srcset } from '../lib/img';

const ease = [0.22, 1, 0.36, 1] as const;

/** A large pane of glass over the page; the photo flies in from the card that was opened. */
export default function ProjectModal({ slug, lang, onClose, onSlug }: { slug: string; lang: Lang; onClose: () => void; onSlug: (s: string) => void }) {
  const reduce = useReducedMotion();
  const first = useRef(slug);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const idx = projects.findIndex((p) => p.slug === slug);
  const p = projects[idx];
  const d = projectDetails[slug];
  const rtl = lang === 'ar';
  const go = (step: number) => onSlug(projects[(idx + step + projects.length) % projects.length].slug);

  // lock the page, focus the dialog, restore focus to the card on close
  useEffect(() => {
    const opener = document.getElementById(`card-${first.current}`);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => { document.body.style.overflow = prev; opener?.focus({ preventScroll: true }); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
      if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const similar = () => {
    window.dispatchEvent(new CustomEvent('sts:note', { detail: `${tr(copy.proj.note, lang)} ${tr(p.name, lang)} (${tr(p.city, lang)})` }));
    onClose();
    window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 250);
  };

  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;

  return createPortal(
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="proj-title" dir={rtl ? 'rtl' : 'ltr'}>
      <motion.div
        className="absolute inset-0 bg-[#060c18]/70 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />
      <motion.div
        data-glass
        className="glass glass-refract rim-slow relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[36px]"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="rim" aria-hidden />
        <div className="overflow-y-auto">
          <div className="relative p-3">
            <motion.div
              layoutId={slug === first.current ? `proj-${slug}` : undefined}
              className="relative aspect-[16/9] overflow-hidden rounded-[26px] bg-lapis lg:aspect-[21/9]"
              transition={{ duration: 0.6, ease }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={slug}
                  src={`img/${slug}.jpg`}
                  srcSet={srcset(slug)}
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  alt={tr(p.name, lang)}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
                  animate={{ opacity: 1, clipPath: 'circle(80% at 50% 50%)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease }}
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),inset_0_-80px_90px_-50px_rgba(12,22,38,0.85)]" aria-hidden />
            </motion.div>
            <button ref={closeBtn} onClick={onClose} className="btn absolute end-6 top-6 !min-h-[46px] !w-[46px] !px-0" data-glass aria-label={tr(copy.proj.close, lang)}>
              <X size={20} aria-hidden />
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slug + lang}
              initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
              className="grid gap-8 px-6 pb-8 pt-4 sm:px-10 sm:pb-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]"
            >
              <div>
                <p className="text-sm text-amber">{tr(p.sector, lang)}، {tr(p.city, lang)}</p>
                <h2 id="proj-title" className="display mt-2 text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-tight">{tr(p.name, lang)}</h2>
                <p className="mt-4 text-lg leading-relaxed text-paper/90">{tr(p.desc, lang)}</p>
                <p className="mt-4 leading-relaxed text-mist">{tr(d.content, lang)}</p>
              </div>
              <div className="flex flex-col gap-6">
                <dl className="grid gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-5 text-[15px]">
                  <div><dt className="text-mist">{tr(copy.proj.client, lang)}</dt><dd className="mt-0.5 text-paper">{d.client}</dd></div>
                  <div><dt className="text-mist">{tr(copy.proj.place, lang)}</dt><dd className="mt-0.5 text-paper">{d.place}</dd></div>
                  <div><dt className="text-mist">{tr(copy.proj.year, lang)}</dt><dd className="mt-0.5 text-paper tabular-nums">{d.year}</dd></div>
                </dl>
                <button type="button" onClick={similar} className="rim-fire flex rounded-full" data-magnet>
                  <span className="rim" aria-hidden />
                  <span className="btn btn-amber w-full" data-glass>{tr(copy.proj.similar, lang)}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 sm:px-10">
          <button onClick={() => go(-1)} className="btn !min-h-[44px] !px-4 text-sm" data-glass aria-label={tr(copy.proj.prev, lang)}>
            <PrevIcon size={18} aria-hidden />
            <span className="hidden sm:inline">{tr(projects[(idx - 1 + projects.length) % projects.length].name, lang)}</span>
          </button>
          <span className="text-sm tabular-nums text-mist">{idx + 1} {tr(copy.projectOf, lang)} {projects.length}</span>
          <button onClick={() => go(1)} className="btn !min-h-[44px] !px-4 text-sm" data-glass aria-label={tr(copy.proj.next, lang)}>
            <span className="hidden sm:inline">{tr(projects[(idx + 1) % projects.length].name, lang)}</span>
            <NextIcon size={18} aria-hidden />
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
