'use client';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { services } from '../lib/data';
import { copy, tr, type Lang } from '../lib/i18n';
import FocusText from './FocusText';

const ease = [0.22, 1, 0.36, 1] as const;

/** A control room: pick a system on one side, its monitor lights up on the other. */
export default function Systems({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const s = services[active];

  return (
    <section id="services" className="relative scroll-mt-24 px-5 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <FocusText text={tr(copy.services.title, lang)} className="display max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />
        <p className="mt-4 text-lg text-mist">{tr(copy.services.sub, lang)}</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* system list */}
          <div role="tablist" aria-orientation="vertical" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {services.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.slug}
                  role="tab"
                  id={`tab-${item.slug}`}
                  aria-selected={on}
                  aria-controls="system-monitor"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setActive(i)}
                  className={`relative shrink-0 rounded-full border px-4 py-2 text-start text-[15px] transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-white/10 lg:px-0 lg:py-4 lg:ps-6 lg:text-[1.35rem] ${
                    on ? 'border-paper bg-paper text-ink lg:bg-transparent lg:text-paper' : 'border-white/15 text-mist hover:text-paper'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="sys-glass"
                      className="absolute inset-y-1 -start-2 end-0 hidden rounded-2xl bg-gradient-to-l from-white/[0.12] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.1)] lg:block rtl:bg-gradient-to-r"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    >
                      <span className="absolute inset-y-3 start-0 w-[3px] rounded-full bg-amber shadow-[0_0_14px_2px_rgba(255,178,62,0.7)]" />
                    </motion.span>
                  )}
                  <span className="relative transition-transform duration-500 lg:display lg:inline-block lg:group-hover:translate-x-0" style={on ? { translate: lang === 'ar' ? '-6px 0' : '6px 0' } : undefined}>{tr(item.title, lang)}</span>
                </button>
              );
            })}
          </div>

          {/* monitor */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div id="system-monitor" role="tabpanel" aria-labelledby={`tab-${s.slug}`} data-glass className="glass glass-refract rim-slow overflow-hidden rounded-[28px] p-3">
              <span className="rim" aria-hidden />
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-lapis">
                <div className="drift absolute inset-0">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={s.slug}
                    src={`img/${s.slug}.jpg`}
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
