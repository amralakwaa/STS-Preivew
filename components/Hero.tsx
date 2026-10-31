'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform,
} from 'framer-motion';
import { Scan } from 'lucide-react';
import { contact, copy, tr, type Lang } from '../lib/i18n';
import { srcset } from '../lib/img';

type Mode = 'thermal' | 'night';
const MAG = 1.22;

// What the lens can pick out, as points in % of the 1376x768 hero photo.
const targets = [
  { id: 'tower', x: 62.4, y: 27 },
  { id: 'cam', x: 74.2, y: 31.5 },
  { id: 'fire', x: 73.8, y: 63 },
  { id: 'road', x: 53, y: 73 },
  { id: 'gate', x: 33.4, y: 42 },
] as const;

// Until someone takes over, the lens tours the targets.
const tour = targets.map((t) => [t.x / 100, t.y / 100] as const);

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const size = useRef({ w: 1, h: 1 });
  const touched = useRef(false);
  const [mode, setMode] = useState<Mode>('thermal');
  const [locked, setLocked] = useState<string[]>([]);
  const [coarse, setCoarse] = useState(false);

  const fx = useMotionValue<number>(tour[0][0]);
  const fy = useMotionValue<number>(tour[0][1]);
  const spring = { stiffness: 140, damping: 22, mass: 0.7 };
  const sx = useSpring(fx, spring);
  const sy = useSpring(fy, spring);
  const r = useMotionValue(0);

  // the ring moves by transform (not left/top) so its travel never counts as a layout shift
  const fw = useMotionValue(0);
  const fh = useMotionValue(0);
  const ringX = useTransform([sx, fw], ([v, w]) => (v as number) * (w as number) - 150);
  const ringY = useTransform([sy, fh], ([v, h]) => (v as number) * (h as number) - 150);
  // the ring keeps a fixed box and scales, so opening the lens never shifts layout
  const ringScale = useTransform(r, (v) => v / 150);
  const clip = useTransform([sx, sy, r], ([x, y, rr]) => `circle(${(rr as number) / MAG}px at ${(x as number) * 100}% ${(y as number) * 100}%)`);
  const origin = useTransform([sx, sy], ([x, y]) => `${(x as number) * 100}% ${(y as number) * 100}%`);

  // Which detections are inside the lens right now.
  const check = () => {
    const { w, h } = size.current;
    const cx = sx.get() * w, cy = sy.get() * h, reach = r.get() / MAG;
    const next = targets
      .filter((t) => Math.hypot(cx - (t.x / 100) * w, cy - (t.y / 100) * h) < reach * 0.45)
      .map((t) => t.id);
    setLocked((prev) => (prev.join() === next.join() ? prev : next));
  };
  useMotionValueEvent(sx, 'change', check);
  useMotionValueEvent(sy, 'change', check);
  useMotionValueEvent(r, 'change', check);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      size.current = { w: el.offsetWidth, h: el.offsetHeight };
      fw.set(el.offsetWidth);
      fh.set(el.offsetHeight);
    });
    ro.observe(el);
    const mq = window.matchMedia('(pointer: coarse)');
    setCoarse(mq.matches);
    return () => ro.disconnect();
  }, []);

  // Opening: the iris opens once the photo has come into focus.
  useEffect(() => {
    const radius = window.innerWidth < 640 ? 118 : 150;
    const c = animate(r, radius, reduce ? { duration: 0 } : { delay: 1.1, type: 'spring', stiffness: 70, damping: 13 });
    const onResize = () => r.set(window.innerWidth < 640 ? 118 : 150);
    window.addEventListener('resize', onResize);
    return () => { c.stop(); window.removeEventListener('resize', onResize); };
  }, [r, reduce]);

  // The lens tours the detections until the visitor moves it.
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = window.setInterval(() => {
      if (touched.current || !frameRef.current) return;
      // only visit targets that are on screen and, on phones, clear of the headline
      const b = frameRef.current.getBoundingClientRect();
      const lo = -b.left / b.width + 0.02, hi = (window.innerWidth - b.left) / b.width - 0.01;
      const maxY = window.innerWidth < 768 ? 0.6 : 1;
      for (let n = 0; n < tour.length; n++) {
        i = (i + 1) % tour.length;
        if (tour[i][0] > lo && tour[i][0] < hi && tour[i][1] < maxY) break;
      }
      fx.set(tour[i][0]);
      fy.set(tour[i][1]);
    }, 2800);
    return () => window.clearInterval(id);
  }, [fx, fy, reduce]);

  const moveTo = (e: PointerEvent) => {
    const el = frameRef.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const x = Math.min(0.98, Math.max(0.02, (e.clientX - b.left) / b.width));
    const y = Math.min(0.98, Math.max(0.02, (e.clientY - b.top) / b.height));
    touched.current = true;
    if (reduce) { sx.jump(x); sy.jump(y); }
    fx.set(x);
    fy.set(y);
  };

  // the whole scene leans gently against the pointer
  const px = useSpring(0, { stiffness: 40, damping: 20 });
  const py = useSpring(0, { stiffness: 40, damping: 20 });
  const lean = (e: PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    px.set((e.clientX / window.innerWidth - 0.5) * -28);
    py.set((e.clientY / window.innerHeight - 0.5) * -18);
  };

  const words = tr(copy.hero.title, lang).split(' ');
  const glow = mode === 'thermal' ? 'rgba(255,178,62,0.55)' : 'rgba(79,227,181,0.5)';

  return (
    <section
      className={`hero relative overflow-hidden ${mode === 'night' ? 'mode-night' : ''}`}
      onPointerMove={(e) => { if (e.pointerType === 'mouse') { moveTo(e); lean(e); } }}
      onPointerDown={(e) => e.pointerType !== 'mouse' && moveTo(e)}
      aria-label={tr(copy.hero.title, lang)}
    >
      <motion.div className={`absolute inset-0 ${reduce ? '' : 'breathe'}`} style={{ x: px, y: py, WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent)', maskImage: 'linear-gradient(to bottom, #000 72%, transparent)' }}>
      <div ref={frameRef} className="hero-frame">
        {/* the city, pulling into focus on load */}
        <img
          src="img/hero-city.jpg"
          srcSet={srcset('hero-city')}
          sizes="(max-width: 767px) 260vw, 100vw"
          alt=""
          className="intro-focus absolute inset-0 h-full w-full select-none"
          style={{ filter: 'brightness(0.7)', opacity: 0.86 }}
          draggable={false}
          fetchPriority="high"
        />

        {/* what the system sees: recolored, magnified, clipped to the lens */}
        <motion.div className="absolute inset-0" style={{ clipPath: clip, transformOrigin: origin, scale: MAG }} aria-hidden>
          <img
            src="img/hero-city.jpg"
            srcSet={srcset('hero-city')}
            sizes="(max-width: 767px) 260vw, 100vw"
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ filter: `url(#${mode})` }}
            draggable={false}
          />
          {targets.map((t) => {
            const on = locked.includes(t.id);
            const d = copy.detect[t.id];
            return (
              <motion.div
                key={t.id}
                className="det"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                initial={false}
                animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="det-tag">
                  <div className="font-semibold text-paper">{tr(d.t, lang)}</div>
                  <div className={mode === 'thermal' ? 'text-amber' : 'text-mint'}>{tr(d.s, lang)}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* the glass itself */}
        <motion.div
          className="lens-ring"
          style={{ left: 0, top: 0, x: ringX, y: ringY, width: 300, height: 300, scale: ringScale, ['--lens-glow' as string]: glow }}
          aria-hidden
        >
          <span className="lens-tick" style={{ top: 10, left: '50%', width: 2, height: 10, marginLeft: -1 }} />
          <span className="lens-tick" style={{ bottom: 10, left: '50%', width: 2, height: 10, marginLeft: -1 }} />
          <span className="lens-tick" style={{ left: 10, top: '50%', height: 2, width: 10, marginTop: -1 }} />
          <span className="lens-tick" style={{ right: 10, top: '50%', height: 2, width: 10, marginTop: -1 }} />
        </motion.div>
      </div>
      </motion.div>

      <div className="hero-scrim pointer-events-none absolute inset-0" />

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-10 sm:px-10 sm:pb-14">
        <h1
          className={`display font-bold text-paper ${
            lang === 'ar' ? 'max-w-[14ch] text-[clamp(3rem,9vw,7rem)] leading-[1.12]' : 'max-w-[13ch] text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[1.04]'
          }`}
        >
          {words.map((w, i) => (
            <span key={`${lang}-${i}`} className="intro-word sheen-word inline-block" style={{ ['--i' as string]: i }}>
              {w}{i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <div className="intro-rise mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="max-w-[46ch] text-lg text-mist sm:text-xl">{tr(copy.hero.sub, lang)}</p>
            <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
              <a href="#contact" className="rim-fire inline-flex rounded-full" data-magnet>
                <span className="rim" aria-hidden />
                <span className="btn btn-amber" data-glass>{tr(copy.nav.quote, lang)}</span>
              </a>
              <a href={`https://wa.me/${contact.wa}`} target="_blank" rel="noopener noreferrer" className="btn" data-glass data-magnet style={{ ['--glint-delay' as string]: '3.4s' }}>
                {tr(copy.hero.whatsapp, lang)}
              </a>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col items-start gap-3 lg:items-end">
            <p className="flex items-center gap-2 text-sm text-mist">
              <Scan size={16} className="text-amber" aria-hidden />
              {tr(coarse ? copy.hero.hintTouch : copy.hero.hintMouse, lang)}
            </p>
            <div role="radiogroup" aria-label={tr(copy.hero.modeLabel, lang)} className="glass flex rounded-full p-1" data-glass>
              {(['thermal', 'night'] as Mode[]).map((m) => (
                <button
                  key={m}
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className="relative min-h-[40px] rounded-full px-4 text-sm font-semibold"
                >
                  {mode === m && (
                    <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  <span className={`relative ${mode === m ? 'text-ink' : 'text-mist'}`}>{tr(m === 'thermal' ? copy.hero.thermal : copy.hero.night, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
