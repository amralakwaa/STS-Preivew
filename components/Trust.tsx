'use client';
import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { copy, tr, type Lang } from '../lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

function Count({ n, suffix }: { n: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !seen) return;
    const dec = n % 1 ? 1 : 0;
    if (reduce) { el.textContent = n.toFixed(dec) + suffix; return; }
    const c = animate(0, n, { duration: 2.2, ease, onUpdate: (v) => { el.textContent = v.toFixed(dec) + suffix; } });
    return () => c.stop();
  }, [seen, n, suffix, reduce]);
  return <span ref={ref} dir="ltr">0{suffix}</span>;
}

/** A status console right under the hero: the company's numbers reported like monitored systems. */
export default function Trust({ lang }: { lang: Lang }) {
  const t = copy.trust;
  const reduce = useReducedMotion();
  const loop = [...t.sectors, ...t.sectors];

  return (
    <section aria-label={tr(t.label, lang)} className="relative px-5 pt-6 sm:px-10">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease }}
        data-glass
        className="glass glass-refract rim-slow mx-auto max-w-7xl overflow-hidden rounded-[32px]"
      >
        <span className="rim" aria-hidden />
        <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-3.5 text-sm text-mist sm:px-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
          </span>
          {tr(t.label, lang)}
          <span className="ms-auto hidden sm:inline">{tr(t.citiesL, lang)} {tr(t.cities, lang)}</span>
        </div>

        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {t.items.map((it, i) => (
            <div key={i} className={`group relative px-6 py-7 sm:px-8 sm:py-9 ${i % 2 ? 'border-s border-white/10' : ''} ${i > 1 ? 'border-t border-white/10 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-s' : ''}`}>
              <dt className="sr-only">{tr(it.t, lang)}</dt>
              <dd>
                <div className="display text-[clamp(2.2rem,4.4vw,3.4rem)] font-semibold leading-none text-paper transition-colors duration-500 group-hover:text-amber">
                  <Count n={it.n} suffix={it.suffix} />
                </div>
                <p className="mt-3 max-w-[22ch] text-[15px] leading-snug text-mist">{tr(it.t, lang)}</p>
              </dd>
              <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-[var(--o)] scale-x-0 bg-gradient-to-r from-transparent via-amber to-transparent transition-transform duration-700 group-hover:scale-x-100" style={{ ['--o' as string]: 'center' }} aria-hidden />
            </div>
          ))}
        </dl>

        <div className="relative overflow-hidden border-t border-white/10 py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <div className={`flex w-max gap-3 ${reduce ? '' : 'marquee'}`}>
            {loop.map((s, i) => (
              <span key={i} aria-hidden={i >= t.sectors.length} className="flex items-center gap-3 whitespace-nowrap text-[15px] text-mist">
                <span className="h-1 w-1 rounded-full bg-amber/80" />
                {tr(s, lang)}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
