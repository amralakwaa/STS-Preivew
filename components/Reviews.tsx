'use client';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reviews } from '../lib/data';
import { copy, tr, type Lang } from '../lib/i18n';
import FocusText from './FocusText';

const ease = [0.22, 1, 0.36, 1] as const;
const HOLD = 8000;

const initials = (name: string) =>
  name.replace(/^(م\.|أ\.|د\.|الشيخ)\s*/, '').split(' ').filter((w) => w !== 'بن').slice(0, 2).map((w) => w[0]).join('');

/** One large pane of glass; reviews change on their own, pause while the visitor reads or hovers. */
export default function Reviews({ lang }: { lang: Lang }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const r = reviews[i];

  const go = useCallback((n: number, d: number) => { setDir(d); setI((n + reviews.length) % reviews.length); }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setTimeout(() => go(i + 1, 1), HOLD);
    return () => window.clearTimeout(id);
  }, [i, paused, reduce, go]);

  // arrows point the reading way: in Arabic "next" sits on the left
  const rtl = lang === 'ar';
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;

  return (
    <section id="reviews" className="scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <FocusText text={tr(copy.reviews.title, lang)} className="display max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />

        <div
          data-glass
          className="glass glass-refract rim-slow relative mt-12 overflow-hidden rounded-[36px] p-7 sm:p-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <span className="rim" aria-hidden />
          <span aria-hidden className="display pointer-events-none absolute -top-10 end-6 select-none text-[16rem] leading-none text-amber/10 sm:end-12">”</span>

          <div className="relative min-h-[300px] sm:min-h-[260px]" aria-live="polite">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={i + lang}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: (rtl ? -1 : 1) * dir * 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: (rtl ? 1 : -1) * dir * 40, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease }}
              >
                <blockquote className="max-w-[58ch] text-xl leading-relaxed text-paper sm:text-[1.6rem] sm:leading-[1.65]">
                  {tr(r.quote, lang)}
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="glass display grid h-14 w-14 shrink-0 place-items-center rounded-full text-lg text-amber">{initials(r.name)}</span>
                  <span>
                    <span className="block font-semibold text-paper">{r.name}</span>
                    <span className="block text-[15px] text-mist">{r.role}، {r.company}، {r.city}</span>
                  </span>
                  <span className="ms-auto rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-mist">{r.project}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
            <div className="flex gap-2">
              <button className="btn !min-h-[44px] !w-11 !px-0" data-glass onClick={() => go(i - 1, -1)} aria-label={tr(copy.reviews.prev, lang)}><PrevIcon size={20} /></button>
              <button className="btn !min-h-[44px] !w-11 !px-0" data-glass onClick={() => go(i + 1, 1)} aria-label={tr(copy.reviews.next, lang)}><NextIcon size={20} /></button>
            </div>
            <div role="tablist" aria-label={tr(copy.reviews.pick, lang)} className="flex flex-1 items-center gap-1.5">
              {reviews.map((rv, k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={k === i}
                  aria-label={rv.name}
                  onClick={() => go(k, k > i ? 1 : -1)}
                  className="group relative h-8 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/12 transition-colors group-hover:bg-white/25">
                    {k === i && (
                      <motion.span
                        key={`${i}-${paused}`}
                        className="absolute inset-0 origin-[var(--o)] rounded-full bg-amber"
                        style={{ ['--o' as string]: rtl ? 'right' : 'left' }}
                        initial={{ scaleX: reduce || paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduce || paused ? 0 : HOLD / 1000, ease: 'linear' }}
                      />
                    )}
                    {k < i && <span className="absolute inset-0 rounded-full bg-amber/40" />}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-sm tabular-nums text-mist" dir="ltr">{String(i + 1).padStart(2, '0')} / {reviews.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
