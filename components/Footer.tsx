'use client';
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from 'framer-motion';
import { ArrowUp, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { services } from '../lib/data';
import { contact, copy, social, tr, type Lang } from '../lib/i18n';
import { pickSystem } from './Systems';

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
);
const XLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" /></svg>
);

const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

function Clock24({ lang }: { lang: Lang }) {
  const [now, setNow] = useState('');
  useEffect(() => {
    const f = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' });
    const up = () => setNow(f.format(new Date()));
    up();
    const id = window.setInterval(up, 15000);
    return () => window.clearInterval(id);
  }, [lang]);
  return <span className="tabular-nums" dir="ltr">{now}</span>;
}

/** The signature: STS carved in outline; a glass lens passes over and shows it in thermal colour. */
function Wordmark() {
  const reduce = useReducedMotion();
  const lx = useMotionValue(30);
  const ly = useMotionValue(55);
  const clip = useTransform([lx, ly], ([x, y]) => `circle(clamp(60px, 7.5vw, 110px) at ${x}% ${y}%)`);
  const left = useTransform(lx, (v) => `${v}%`);
  const top = useTransform(ly, (v) => `${v}%`);
  const idle = useRef<AnimationPlaybackControls[]>([]);

  const wander = () => {
    if (reduce) return;
    idle.current.forEach((c) => c.stop());
    idle.current = [
      animate(lx, [lx.get(), 72, 28, lx.get()], { duration: 14, repeat: Infinity, ease: 'easeInOut' }),
      animate(ly, [ly.get(), 40, 62, ly.get()], { duration: 9, repeat: Infinity, ease: 'easeInOut' }),
    ];
  };
  useEffect(() => { wander(); return () => idle.current.forEach((c) => c.stop()); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const follow = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    idle.current.forEach((c) => c.stop());
    const b = e.currentTarget.getBoundingClientRect();
    lx.set(((e.clientX - b.left) / b.width) * 100);
    ly.set(((e.clientY - b.top) / b.height) * 100);
  };

  return (
    <div className="relative select-none overflow-hidden py-4" onPointerMove={follow} onPointerLeave={wander} aria-hidden dir="ltr">
      <p className="wordmark wordmark-outline">STS</p>
      <motion.p className="wordmark wordmark-thermal absolute inset-0" style={{ clipPath: clip }}>STS</motion.p>
      <motion.span className="wordmark-lens" style={{ left, top }} />
    </div>
  );
}

export default function Footer({ lang }: { lang: Lang }) {
  const f = copy.foot;
  const links = [
    { id: 'services', l: copy.nav.services }, { id: 'projects', l: copy.nav.projects },
    { id: 'process', l: copy.nav.process }, { id: 'reviews', l: f.reviews }, { id: 'coverage', l: copy.coverage.nav }, { id: 'contact', l: copy.nav.contact },
  ];
  const tel = contact.phone.replace(/\s/g, '');

  return (
    <footer className="relative z-10 px-3 pb-6 pt-4 sm:px-6">
      <div data-glass className="glass glass-refract rim-slow relative mx-auto max-w-[88rem] overflow-hidden rounded-[40px]">
        <span className="rim" aria-hidden />

        {/* 1. brand and the two actions */}
        <div className="flex flex-col gap-8 px-6 pb-10 pt-10 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:pt-14">
          <div className="max-w-xl">
            <a href="#top" className="inline-flex items-center gap-3.5">
              <span className="relative">
                <img src="img/logo-96.webp" alt="" width={52} height={52} loading="lazy" className="h-[52px] w-[52px] rounded-full object-cover" />
                <span className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_0_0_1px_rgba(255,255,255,0.25),0_0_30px_-6px_rgba(255,178,62,0.6)]" aria-hidden />
              </span>
              <span>
                <span className="display block text-3xl font-semibold leading-none">STS</span>
                <span className="mt-1 block text-sm text-mist">{tr(copy.footer, lang)}</span>
              </span>
            </a>
            <p className="mt-6 max-w-[48ch] leading-relaxed text-mist">{tr(f.about, lang)}</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="display text-xl font-semibold text-paper">{tr(f.ready, lang)}</p>
            <div className="flex flex-wrap gap-2.5">
              <a href="#contact" className="rim-fire inline-flex rounded-full" data-magnet>
                <span className="rim" aria-hidden />
                <span className="btn btn-amber" data-glass>{tr(copy.nav.quote, lang)}</span>
              </a>
              <a href={`https://wa.me/${contact.wa}`} target="_blank" rel="noopener noreferrer" className="btn" data-glass data-magnet>{tr(copy.quick.wa, lang)}</a>
            </div>
          </div>
        </div>

        <div className="foot-rule" aria-hidden />

        {/* 2. columns, separated by hairlines of light */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.35fr_0.85fr_1.25fr_1.15fr] lg:gap-0 lg:px-6 lg:py-12">
          <nav aria-label={tr(f.systems, lang)} className="foot-col">
            <h2 className="foot-h">{tr(f.systems, lang)}</h2>
            <div className="mt-5 grid gap-5">
              {copy.groups.map((g) => (
                <div key={g.t.en}>
                  <p className="text-xs font-medium text-amber/90">{tr(g.t, lang)}</p>
                  <ul className="mt-2 grid gap-1.5 text-[15px]">
                    {g.slugs.slice(0, 2).map((sl) => (
                      <li key={sl}>
                        <a href="#services" onClick={() => pickSystem(sl)} className="foot-link">{tr(bySlug[sl].title, lang)}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <a href="#services" className="foot-link py-2 text-[15px] !text-paper">{tr(f.allSystems, lang)} ({services.length})</a>
            </div>
          </nav>

          <nav aria-label={tr(f.company, lang)} className="foot-col">
            <h2 className="foot-h">{tr(f.company, lang)}</h2>
            <ul className="mt-5 grid gap-2.5 text-[15px]">
              {links.map((l) => (
                <li key={l.id}><a href={`#${l.id}`} className="foot-link">{tr(l.l, lang)}</a></li>
              ))}
            </ul>
          </nav>

          <div className="foot-col col-span-2 lg:col-span-1">
            <h2 className="foot-h">{tr(f.reach, lang)}</h2>
            <ul className="mt-5 grid gap-3.5 text-[15px]">
              <li><a href={`tel:${tel}`} className="foot-contact group"><span className="foot-ico"><Phone size={16} aria-hidden /></span><span dir="ltr" className="text-paper">{contact.phone}</span></a></li>
              <li><a href={`mailto:${contact.email}`} className="foot-contact group"><span className="foot-ico"><Mail size={16} aria-hidden /></span><span className="text-paper">{contact.email}</span></a></li>
              <li className="foot-contact"><span className="foot-ico"><MapPin size={16} aria-hidden /></span><span className="text-mist">{tr(contact.address, lang)}</span></li>
              <li className="foot-contact"><span className="foot-ico"><Clock size={16} aria-hidden /></span><span className="text-mist">{tr(contact.hours, lang)}</span></li>
            </ul>
          </div>

          <div className="foot-col col-span-2 lg:col-span-1">
            <div className="foot-status rounded-[24px] p-5">
              <p className="flex items-center gap-2.5 text-[15px] text-paper">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
                </span>
                {tr(f.status, lang)}
              </p>
              <p className="mt-1.5 text-sm text-mist">{lang === 'ar' ? 'الرياض' : 'Riyadh'} <Clock24 lang={lang} /></p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm text-mist">{tr(f.follow, lang)}</p>
                <div className="mt-3 flex gap-2">
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn !min-h-[44px] !w-11 !px-0" data-glass data-magnet><LinkedIn /></a>
                  <a href={social.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="btn !min-h-[44px] !w-11 !px-0" data-glass data-magnet><XLogo /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. the signature */}
        <div className="px-4 sm:px-8">
          <Wordmark />
        </div>

        {/* 4. the last line */}
        <div className="foot-rule" aria-hidden />
        <div className="flex flex-col-reverse items-start gap-4 px-6 py-5 text-sm text-mist sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <span>© {new Date().getFullYear()} {tr(copy.footer, lang)}. {tr(f.rights, lang)}</span>
          <a href="#top" className="btn !min-h-[42px] !px-4 text-sm" data-glass data-magnet>
            <ArrowUp size={16} aria-hidden />
            {tr(f.top, lang)}
          </a>
        </div>
      </div>
    </footer>
  );
}
