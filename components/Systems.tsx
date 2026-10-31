'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { services } from '../lib/data';
import { copy, tr, type Lang } from '../lib/i18n';
import { srcset } from '../lib/img';
import FocusText from './FocusText';

const ease = [0.22, 1, 0.36, 1] as const;

/** Show a system on the monitor from anywhere on the page (the footer links use this). */
export const pickSystem = (slug: string) => window.dispatchEvent(new CustomEvent('sts:show', { detail: slug }));
/** Jump to the quote form with this system already ticked. */
export const quoteSystem = (slug: string) => {
  window.dispatchEvent(new CustomEvent('sts:quote', { detail: slug }));
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

/** A control room: systems grouped on one side, the chosen one lit up on the monitor. */
export default function Systems({ lang }: { lang: Lang }) {
  const [slug, setSlug] = useState(services[0].slug);
  const reduce = useReducedMotion();
  const s = bySlug[slug];

  useEffect(() => {
    const on = (e: Event) => setSlug((e as CustomEvent<string>).detail);
    window.addEventListener('sts:show', on);
    return () => window.removeEventListener('sts:show', on);
  }, []);

  const hoverPick = (next: string) => window.matchMedia('(hover: hover)').matches && setSlug(next);

  return (
    <section id="services" className="relative scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <FocusText text={tr(copy.services.title, lang)} className="display max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />
        <p className="mt-4 text-lg text-mist">{tr(copy.services.sub, lang)}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* systems, grouped */}
          <div role="tablist" aria-orientation="vertical" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-7 lg:overflow-visible lg:px-0">
            {copy.groups.map((g) => (
              <div key={g.t.en} className="contents lg:block">
                <h3 className="mb-2 hidden items-center gap-3 text-sm font-medium text-amber lg:flex">
                  {tr(g.t, lang)}
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/30 rtl:bg-gradient-to-r" />
                </h3>
                <div className="contents lg:flex lg:flex-col">
                  {g.slugs.map((sl) => {
                    const item = bySlug[sl];
                    const on = sl === slug;
                    return (
                      <button
                        key={sl}
                        role="tab"
                        id={`tab-${sl}`}
                        aria-selected={on}
                        aria-controls="system-monitor"
                        onClick={() => setSlug(sl)}
                        onMouseEnter={() => hoverPick(sl)}
                        className={`chip relative shrink-0 !min-h-[42px] lg:!rounded-2xl lg:!bg-none lg:!shadow-none lg:px-4 lg:py-2.5 lg:text-start lg:text-[1.08rem] ${
                          on ? '' : 'lg:text-mist'
                        }`}
                      >
                        {on && (
                          <motion.span
                            layoutId="sys-glass"
                            className="absolute inset-0 hidden rounded-2xl bg-gradient-to-l from-white/[0.16] to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_0_0_1px_rgba(255,255,255,0.12),0_10px_30px_-14px_rgba(0,0,0,0.7)] lg:block rtl:bg-gradient-to-r"
                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                          >
                            <span className="absolute inset-y-2.5 start-0 w-[3px] rounded-full bg-amber shadow-[0_0_14px_2px_rgba(255,178,62,0.7)]" />
                          </motion.span>
                        )}
                        <span className={`relative lg:text-paper ${on ? 'lg:!text-paper' : 'lg:!text-mist'}`}>{tr(item.title, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* monitor */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div id="system-monitor" role="tabpanel" aria-labelledby={`tab-${s.slug}`} data-glass className="glass glass-refract rim-slow overflow-hidden rounded-[28px] p-3">
              <span className="rim" aria-hidden />
              <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-lapis">
                <div className="drift absolute inset-0">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={s.slug}
                      src={`img/${s.slug}.jpg`}
                      srcSet={srcset(s.slug)}
                      sizes="(max-width: 1023px) 92vw, 760px"
                      alt={tr(s.title, lang)}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at 50% 50%)', scale: 1.08 }}
                      animate={reduce ? { opacity: 1 } : { clipPath: 'circle(75% at 50% 50%)', scale: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.25 } }}
                      transition={{ duration: 0.75, ease }}
                    />
                  </AnimatePresence>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_-60px_80px_-40px_rgba(12,22,38,0.8)]" aria-hidden />
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={s.slug + lang}
                  className="px-4 pb-5 pt-6 sm:px-6"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <h3 className="display text-2xl font-semibold sm:text-[1.75rem]">{tr(s.title, lang)}</h3>
                  <p className="mt-3 max-w-[60ch] text-mist">{tr(s.desc, lang)}</p>
                  <h4 className="mt-6 text-sm font-semibold text-paper/70">{tr(copy.services.includes, lang)}</h4>
                  <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {s.features[lang].map((f) => (
                      <li key={f} className="flex gap-2.5 text-[15px] leading-relaxed">
                        <Check size={18} className="mt-1 shrink-0 text-mint" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <button type="button" onClick={() => quoteSystem(s.slug)} className="rim-fire inline-flex rounded-full" data-magnet>
                      <span className="rim" aria-hidden />
                      <span className="btn btn-amber" data-glass>{tr(copy.pickSystem, lang)}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
