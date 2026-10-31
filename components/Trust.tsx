'use client';
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { copy, tr, type Lang } from '../lib/i18n';
import { pickSystem } from './Systems';

const ease = [0.22, 1, 0.36, 1] as const;
const settle = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* odometer: every digit is a drum of glass that rolls and settles;    */
/* the units turn three times, the tens twice, the rest once            */
/* ------------------------------------------------------------------ */
function Drum({ d, place, run, spin }: { d: number; place: number; run: boolean; spin: number }) {
  const reduce = useReducedMotion();
  const turns = place === 0 ? 3 : place === 1 ? 2 : 1;
  const total = turns * 10 + d;
  const y = useMotionValue(0);
  const ty = useTransform(y, (v) => `${v * 1.1}em`);

  useEffect(() => {
    if (!run) return;
    if (reduce) { y.set(-total); return; }
    // first run rolls up from zero; a hover re-roll does one quick turn and lands on the same digit
    y.set(spin > 0 ? -(total - 10) : 0);
    const c = animate(y, -total, spin > 0
      ? { duration: 0.8 + (2 - Math.min(place, 2)) * 0.12, ease: settle }
      : { duration: 2.6 + (2 - Math.min(place, 2)) * 0.35, ease: settle });
    return () => c.stop();
  }, [run, spin, total, place, reduce, y]);

  return (
    <span className="odo-slot" aria-hidden>
      <motion.span className="odo-strip" style={{ y: ty }}>
        {Array.from({ length: total + 1 }, (_, k) => <span key={k}>{k % 10}</span>)}
      </motion.span>
    </span>
  );
}

function Readout({ n, suffix, hot, run }: { n: number; suffix: string; hot: boolean; run: boolean }) {
  const value = n.toFixed(n % 1 ? 1 : 0) + suffix;
  const chars = value.split('');
  const [spin, setSpin] = useState(0);
  const landed = useRef(false);

  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(() => { landed.current = true; }, 3400);
    return () => window.clearTimeout(id);
  }, [run]);
  useEffect(() => { if (hot && landed.current) setSpin((v) => v + 1); }, [hot]);

  return (
    <span dir="ltr" className="odo" aria-label={value} role="img">
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={i} className="odo-sym" aria-hidden>{c}</span>;
        const place = chars.slice(i + 1).filter((x) => /\d/.test(x)).length;
        return <Drum key={i} d={+c} place={place} run={run} spin={spin} />;
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* live micro-visuals, one per figure                                  */
/* ------------------------------------------------------------------ */
const draw = (delay = 0) => ({ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1, transition: { duration: 1.4, delay, ease } } });

function Constellation({ hot }: { hot: boolean }) {
  // five cities, roughly where they sit on the map of the Kingdom
  const pts = [[48, 40], [18, 58], [76, 30], [82, 38], [24, 70]];
  const lines = [[0, 1], [0, 2], [2, 3], [1, 4], [0, 4]];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      {lines.map(([a, b], i) => (
        <motion.line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="url(#tg)" strokeWidth={hot ? 1.6 : 1} variants={draw(0.2 + i * 0.12)} />
      ))}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={hot ? 9 : 6} fill="#FFB23E" opacity={0.18} className="pulse-dot" style={{ animationDelay: `${i * 0.4}s` }} />
          <motion.circle cx={x} cy={y} r={2.6} fill="#FFD28A" variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { delay: 0.6 + i * 0.1 } } }} />
        </g>
      ))}
      <defs>
        <linearGradient id="tg" x1="0" x2="1"><stop offset="0" stopColor="#FFB23E" stopOpacity="0.9" /><stop offset="1" stopColor="#E2456F" stopOpacity="0.6" /></linearGradient>
      </defs>
    </svg>
  );
}

function Gauge({ hot, value }: { hot: boolean; value: number }) {
  const C = 2 * Math.PI * 38;
  return (
    <svg viewBox="0 0 100 100" className={`h-full w-full transition-transform duration-700 ${hot ? 'rotate-[18deg]' : ''}`} aria-hidden>
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
      <motion.circle
        cx="50" cy="50" r="38" fill="none" stroke="url(#gg)" strokeWidth="6" strokeLinecap="round"
        transform="rotate(-90 50 50)" strokeDasharray={C}
        variants={{ hidden: { strokeDashoffset: C }, shown: { strokeDashoffset: C * (1 - value / 100), transition: { duration: 2.2, ease } } }}
        style={{ filter: hot ? 'drop-shadow(0 0 6px rgba(79,227,181,0.9))' : 'none' }}
      />
      <defs>
        <linearGradient id="gg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#4FE3B5" /><stop offset="1" stopColor="#FFB23E" /></linearGradient>
      </defs>
    </svg>
  );
}

function Pulse({ hot }: { hot: boolean }) {
  const d = 'M0 50 H22 L28 38 L34 62 L40 20 L47 80 L53 50 H70 L75 42 L80 56 L84 50 H100';
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <path d={d} fill="none" stroke="#4FE3B5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1}
        className="ekg" style={{ animationDuration: hot ? '0.9s' : '2.2s', filter: 'drop-shadow(0 0 4px rgba(79,227,181,0.9))' }} />
    </svg>
  );
}

function Shield({ hot }: { hot: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden style={{ filter: hot ? 'drop-shadow(0 0 8px rgba(255,178,62,0.8))' : 'none' }}>
      <motion.path key={hot ? 'a' : 'b'} d="M50 10 L84 22 V48 C84 70 68 84 50 92 C32 84 16 70 16 48 V22 Z" fill="rgba(255,178,62,0.08)" stroke="#FFB23E" strokeWidth="3" strokeLinejoin="round"
        variants={draw(0.1)} initial={hot ? 'hidden' : undefined} animate={hot ? 'shown' : undefined} />
      <motion.path key={hot ? 'c' : 'd'} d="M35 50 L46 61 L67 38" fill="none" stroke="#4FE3B5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        variants={draw(0.9)} initial={hot ? 'hidden' : undefined} animate={hot ? 'shown' : undefined} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* a tile of glass that leans toward the pointer and does something    */
/* ------------------------------------------------------------------ */
function Tile({ children, label, onGo, className = '' }: { children: (hot: boolean) => ReactNode; label: string; onGo: () => void; className?: string }) {
  const [hot, setHot] = useState(false);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const move = (e: RPointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 12);
    rx.set(((e.clientY - b.top) / b.height - 0.5) * -12);
  };
  const leave = () => { rx.set(0); ry.set(0); setHot(false); };
  return (
    <motion.button
      type="button"
      onClick={onGo}
      onPointerEnter={() => setHot(true)}
      onPointerMove={move}
      onPointerLeave={leave}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      aria-label={label}
      data-glass
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`trust-tile group relative h-full w-full overflow-hidden rounded-[20px] p-4 text-start sm:rounded-[24px] sm:p-7 ${className}`}
    >
      {children(hot)}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* sparks thrown off the pointer as it moves over the card             */
/* ------------------------------------------------------------------ */
function useSparks(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const parts = useRef<{ x: number; y: number; vx: number; vy: number; life: number; hue: number }[]>([]);
  const raf = useRef(0);
  const reduce = useReducedMotion();
  const tick = () => {
    const c = canvasRef.current;
    if (!c) return;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = 'lighter';
    parts.current = parts.current.filter((p) => p.life > 0);
    for (const p of parts.current) {
      p.x += p.vx; p.y += p.vy; p.vy -= 0.03; p.vx *= 0.98; p.life -= 0.018;
      const r = 2.4 * p.life + 0.4;
      const grad = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      grad.addColorStop(0, p.hue ? `rgba(255,120,150,${p.life})` : `rgba(255,205,120,${p.life})`);
      grad.addColorStop(1, 'rgba(255,140,60,0)');
      g.fillStyle = grad;
      g.beginPath(); g.arc(p.x, p.y, r * 4, 0, Math.PI * 2); g.fill();
    }
    raf.current = parts.current.length ? requestAnimationFrame(tick) : 0;
  };
  const emit = (x: number, y: number) => {
    if (reduce) return;
    const c = canvasRef.current;
    if (!c) return;
    const k = window.devicePixelRatio || 1;
    for (let i = 0; i < 2; i++) {
      parts.current.push({ x: x * k, y: y * k, vx: (Math.random() - 0.5) * 1.6 * k, vy: (-Math.random() * 1.4 - 0.3) * k, life: 1, hue: Math.random() < 0.3 ? 1 : 0 });
    }
    if (parts.current.length > 160) parts.current.splice(0, parts.current.length - 160);
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return emit;
}

function RiyadhClock({ lang }: { lang: Lang }) {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const f = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Riyadh' });
    const up = () => setNow(f.format(new Date()));
    up();
    const id = window.setInterval(up, 1000);
    return () => window.clearInterval(id);
  }, [lang]);
  return <span className="tabular-nums" dir="ltr">{now}</span>;
}

/* ------------------------------------------------------------------ */

export default function Trust({ lang }: { lang: Lang }) {
  const t = copy.trust;
  const reduce = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const sparks = useRef<HTMLCanvasElement>(null);
  const emit = useSparks(sparks);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(520px circle at ${x}% ${y}%, rgba(255,178,62,0.16), transparent 45%), radial-gradient(380px circle at ${100 - (x as number)}% ${100 - (y as number)}%, rgba(226,69,111,0.12), transparent 50%), radial-gradient(600px circle at ${x}% 120%, rgba(79,227,181,0.08), transparent 55%)`);
  const loop = [...t.sectors, ...t.sectors];

  // the counters start once the page has opened (after the hero's own entrance),
  // or as soon as the card comes into view if it was below the fold
  const [opened, setOpened] = useState(false);
  const inView = useInView(card, { once: true, amount: 0.35 });
  useEffect(() => { const id = window.setTimeout(() => setOpened(true), 1700); return () => window.clearTimeout(id); }, []);
  const run = opened && inView;

  useEffect(() => {
    const c = sparks.current, el = card.current;
    if (!c || !el) return;
    const ro = new ResizeObserver(() => {
      const k = window.devicePixelRatio || 1;
      c.width = el.offsetWidth * k;
      c.height = el.offsetHeight * k;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - b.left) / b.width) * 100);
    my.set(((e.clientY - b.top) / b.height) * 100);
    if (e.pointerType === 'mouse') emit(e.clientX - b.left, e.clientY - b.top);
  };

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const actions = [
    () => go('projects'),
    () => go('reviews'),
    () => go('contact'),
    () => { pickSystem('fire-alarm-systems'); go('services'); },
  ];
  const visuals = [
    (hot: boolean) => <Constellation hot={hot} />,
    (hot: boolean) => <Gauge hot={hot} value={99.4} />,
    (hot: boolean) => <Pulse hot={hot} />,
    (hot: boolean) => <Shield hot={hot} />,
  ];

  return (
    <section aria-label={tr(t.label, lang)} className="relative px-5 pt-6 sm:px-10">
      <motion.div
        ref={card}
        onPointerMove={onMove}
        initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease }}
        data-glass
        className="glass glass-refract rim-slow relative mx-auto max-w-7xl overflow-hidden rounded-[32px]"
      >
        <span className="rim" aria-hidden />
        <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundImage: glow }} aria-hidden />
        {!reduce && <div className="scan-sweep pointer-events-none absolute inset-y-0 w-1/3" aria-hidden />}
        <canvas ref={sparks} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden />

        <div className="relative flex items-center gap-2.5 border-b border-white/10 px-6 py-3.5 text-sm text-mist sm:px-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
          </span>
          <span className="text-paper">{tr(t.label, lang)}</span>
          <span className="text-mist/70">{lang === 'ar' ? 'الرياض' : 'Riyadh'} <RiyadhClock lang={lang} /></span>
          <span className="ms-auto hidden md:inline">{tr(t.citiesL, lang)} {tr(t.cities, lang)}</span>
        </div>

        <motion.ul
          className="relative grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-10% 0px' }}
        >
          {t.items.map((it, i) => (
            <li key={i} className="grid"><Tile label={`${it.n}${it.suffix} ${tr(it.t, lang)}`} onGo={actions[i]}>
              {(hot) => (
                <>
                  <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
                    <p className="display text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-none text-paper transition-colors duration-500 group-hover:text-amber">
                      <Readout n={it.n} suffix={it.suffix} hot={hot} run={run} />
                    </p>
                    <div className="h-10 w-10 shrink-0 sm:h-16 sm:w-16">{visuals[i](hot)}</div>
                  </div>
                  <p className="mt-3 max-w-[24ch] text-sm leading-snug sm:mt-4 sm:text-[15px] text-mist transition-colors duration-500 group-hover:text-paper">{tr(it.t, lang)}</p>
                  <span className="mt-4 hidden items-center gap-1.5 text-sm text-amber opacity-0 sm:flex transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 rtl:translate-x-2 ltr:-translate-x-2 group-hover:translate-x-0" aria-hidden>
                    {tr(t.go[i], lang)}
                  </span>
                </>
              )}
            </Tile></li>
          ))}
        </motion.ul>

        <div className="relative overflow-hidden border-t border-white/10 py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          <div className={`flex w-max gap-2.5 ${reduce ? '' : 'marquee'}`}>
            {loop.map((s, i) => (
              <span key={i} aria-hidden={i >= t.sectors.length} className="sector-chip whitespace-nowrap rounded-full px-4 py-1.5 text-[15px] text-mist">
                {tr(s, lang)}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
