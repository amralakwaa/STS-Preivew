'use client';
import { useRef, type ReactNode, type CSSProperties, type PointerEvent } from 'react';

type Props = {
  children?: ReactNode; className?: string; style?: CSSProperties;
  as?: 'div' | 'section' | 'header' | 'article' | 'form' | 'footer'; tilt?: boolean; refract?: boolean;
};

/** Glass panel: pointer-tracked specular rim + light, optional 3D tilt and lens refraction. */
export default function Glass({ children, className = '', style, as: Tag = 'div', tilt = false, refract = true }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`); el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--ang', `${Math.atan2(y - r.height / 2, x - r.width / 2) * 57.3 + 90}deg`);
    el.style.setProperty('--lit', '1');
    if (tilt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = `perspective(1000px) rotateX(${((y / r.height) - 0.5) * -8}deg) rotateY(${((x / r.width) - 0.5) * 8}deg) translateZ(0)`;
    }
  };
  const onLeave = () => { const el = ref.current; if (!el) return; el.style.setProperty('--lit', '0.55'); el.style.transform = ''; };
  const Comp = Tag as any;
  return (
    <Comp ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}
      className={`glass ${refract ? 'refract' : ''} ${className}`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)', ...style }}>
      {children}
    </Comp>
  );
}
