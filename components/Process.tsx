'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Ear, FileText, ScanSearch, ShieldCheck, Wrench } from 'lucide-react';
import { copy, tr, type Lang } from '../lib/i18n';
import FocusText from './FocusText';

const ease = [0.22, 1, 0.36, 1] as const;
const icons = [Ear, ScanSearch, FileText, Wrench, ShieldCheck];

/** Five stages. A glass panel beside them follows the one being read: ring, icon, title. */
export default function Process({ lang }: { lang: Lang }) {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const steps = copy.process.steps;

  useEffect(() => {
    const items = list.current?.querySelectorAll('li');
    if (!items) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    items.forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => list.current?.querySelectorAll('li')[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const C = 2 * Math.PI * 54;
  const Icon = icons[active];

  return (
    <section id="process" className="scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FocusText text={tr(copy.process.title, lang)} className="display max-w-[16ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />

          {/* stage panel */}
          <div data-glass className="glass glass-refract rim-slow relative mt-10 hidden overflow-hidden rounded-[32px] p-7 lg:block">
            <span className="rim" aria-hidden />
            <div className="flex items-center gap-7">
              <div className="relative h-36 w-36 shrink-0">
                <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <motion.circle
                    cx="60" cy="60" r="54" fill="none" stroke="url(#stage-g)" strokeWidth="4" strokeLinecap="round" strokeDasharray={C}
                    initial={false}
                    animate={{ strokeDashoffset: C * (1 - (active + 1) / steps.length) }}
                    transition={{ duration: 0.9, ease }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(255,178,62,0.7))' }}
                  />
                  {steps.map((_, k) => {
                    const a = (k / steps.length) * Math.PI * 2;
                    return <circle key={k} cx={60 + Math.cos(a) * 54} cy={60 + Math.sin(a) * 54} r="3.2" fill={k <= active ? '#FFB23E' : 'rgba(255,255,255,0.25)'} />;
                  })}
                  <defs>
                    <linearGradient id="stage-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#FFB23E" /><stop offset="1" stopColor="#E2456F" /></linearGradient>
                  </defs>
                </svg>
                {/* a glass orb with an ember in orbit */}
                <div className="stage-orb absolute inset-[18px] grid place-items-center rounded-full">
                  {!reduce && <span className="stage-ember" aria-hidden />}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active}
                      initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -20, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.3, filter: 'blur(6px)' }}
                      transition={{ duration: 0.5, ease }}
                      className="text-amber"
                    >
                      <Icon size={40} strokeWidth={1.6} aria-hidden />
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-mist" aria-live="polite">
                  {tr(copy.stage.step, lang)} <span className="tabular-nums text-paper">{active + 1}</span> {tr(copy.stage.of, lang)} {steps.length}
                </p>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={active + lang}
                    initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                    transition={{ duration: 0.45, ease }}
                    className="display mt-2 text-[1.9rem] font-semibold leading-tight"
                  >
                    {tr(steps[active].t, lang)}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <ol ref={list} className="relative">
          <div className="absolute bottom-8 top-8 w-px bg-white/12 start-[35px]" aria-hidden>
            <motion.div className="h-full w-full origin-top bg-gradient-to-b from-amber via-amber to-rose shadow-[0_0_12px_rgba(255,178,62,0.8)]" style={{ scaleY: fill }} />
          </div>
          {steps.map((s, i) => {
            const on = i === active, past = i < active;
            const StepIcon = icons[i];
            return (
              <li key={i} data-i={i} className="relative pb-4 last:pb-0">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  data-glass
                  aria-current={on ? 'step' : undefined}
                  className={`step-row group grid w-full grid-cols-[56px_1fr] items-start gap-5 rounded-[26px] p-2 pe-5 text-start sm:gap-6 ${on ? 'is-on' : ''}`}
                >
                  <motion.span
                    className="display relative z-10 grid h-14 w-14 place-items-center rounded-full text-xl font-semibold"
                    animate={{
                      color: on || past ? '#1a1206' : '#C8D4E6',
                      backgroundColor: on ? 'rgba(255,178,62,0.95)' : past ? 'rgba(255,178,62,0.7)' : 'rgba(22,38,61,0.6)',
                      boxShadow: on
                        ? '0 0 0 6px rgba(255,178,62,0.14), 0 0 40px rgba(255,140,60,0.6), inset 0 1px 0 rgba(255,255,255,0.8)'
                        : '0 0 0 0 rgba(255,178,62,0), 0 0 0 rgba(0,0,0,0), inset 0 1px 0 rgba(255,255,255,0.3)',
                      scale: on ? 1.06 : 0.92,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {past ? <StepIcon size={20} strokeWidth={2} aria-hidden /> : i + 1}
                  </motion.span>
                  <span className="block pt-2.5">
                    <span className={`display block text-2xl font-semibold transition-colors duration-500 ${on ? 'text-paper' : 'text-mist/75 group-hover:text-paper'}`}>{tr(s.t, lang)}</span>
                    <span className={`mt-2 block max-w-[52ch] transition-colors duration-500 ${on ? 'text-mist' : 'text-mist/70'}`}>{tr(s.d, lang)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
