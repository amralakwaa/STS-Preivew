'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { copy, tr, type Lang } from '../lib/i18n';
import FocusText from './FocusText';

export default function Process({ lang }: { lang: Lang }) {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <FocusText text={tr(copy.process.title, lang)} className="display max-w-[16ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />
        </div>
        <ol ref={list} className="relative">
          <div className="absolute bottom-6 top-6 w-px bg-white/12 start-[27px]" aria-hidden>
            <motion.div className="h-full w-full origin-top bg-gradient-to-b from-amber via-amber to-rose shadow-[0_0_12px_rgba(255,178,62,0.8)]" style={{ scaleY: fill }} />
          </div>
          {copy.process.steps.map((s, i) => <Step key={i} i={i} t={tr(s.t, lang)} d={tr(s.d, lang)} />)}
        </ol>
      </div>
    </section>
  );
}

function Step({ i, t, d }: { i: number; t: string; d: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { margin: '0px 0px -40% 0px' });
  return (
    <li ref={ref} className="relative grid grid-cols-[56px_1fr] gap-6 pb-14 last:pb-0">
      <motion.span
        className="glass display relative z-10 grid h-14 w-14 place-items-center rounded-full text-xl font-semibold"
        animate={{
          color: seen ? '#1a1206' : '#C8D4E6',
          backgroundColor: seen ? 'rgba(255,178,62,0.92)' : 'rgba(22,38,61,0.35)',
          boxShadow: seen
            ? '0 0 0 6px rgba(255,178,62,0.12), 0 0 36px rgba(255,140,60,0.55), inset 0 1px 0 rgba(255,255,255,0.8)'
            : '0 0 0 0 rgba(255,178,62,0), 0 0 0 rgba(0,0,0,0), inset 0 1px 0 rgba(255,255,255,0.35)',
          scale: seen ? 1 : 0.9,
        }}
        transition={{ duration: 0.5 }}
      >
        {i + 1}
      </motion.span>
      <div className="pt-2.5">
        <h3 className={`display text-2xl font-semibold transition-colors duration-500 ${seen ? 'text-paper' : 'text-mist/70'}`}>{t}</h3>
        <p className="mt-2 max-w-[52ch] text-mist">{d}</p>
      </div>
    </li>
  );
}
