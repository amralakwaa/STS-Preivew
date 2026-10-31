'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const orbs = [
  { c: 'radial-gradient(circle,#22d3ee,transparent 65%)', s: '46vw', t: '-8vw', l: '58vw', k: 0.05, d: 22 },
  { c: 'radial-gradient(circle,#6366f1,transparent 65%)', s: '52vw', t: '28vh', l: '-14vw', k: -0.04, d: 28 },
  { c: 'radial-gradient(circle,#d946ef,transparent 65%)', s: '38vw', t: '60vh', l: '52vw', k: 0.07, d: 26 },
  { c: 'radial-gradient(circle,#2dd4bf,transparent 65%)', s: '30vw', t: '8vh', l: '18vw', k: -0.06, d: 32 },
];

export default function Stage() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 }), sy = useSpring(my, { stiffness: 40, damping: 18 });
  useEffect(() => {
    const f = (e: PointerEvent) => { mx.set(e.clientX - innerWidth / 2); my.set(e.clientY - innerHeight / 2); };
    window.addEventListener('pointermove', f); return () => window.removeEventListener('pointermove', f);
  }, [mx, my]);
  return (
    <>
      <div className="stage" aria-hidden>
        {orbs.map((o, i) => <Orb key={i} o={o} sx={sx} sy={sy} />)}
        <div className="grid-lines" />
      </div>
      <div className="grain" aria-hidden />
    </>
  );
}

function Orb({ o, sx, sy }: { o: (typeof orbs)[number]; sx: any; sy: any }) {
  const x = useTransform(sx, (v: number) => v * o.k * 6), y = useTransform(sy, (v: number) => v * o.k * 6);
  return (
    <motion.div className="orb" style={{ background: o.c, width: o.s, height: o.s, top: o.t, left: o.l, x, y, opacity: 0.55 }}
      animate={{ scale: [1, 1.18, 0.94, 1], rotate: [0, 40, -20, 0] }} transition={{ duration: o.d, repeat: Infinity, ease: 'easeInOut' }} />
  );
}
