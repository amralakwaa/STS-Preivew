'use client';
import { ArrowUp } from 'lucide-react';
import { services } from '../lib/data';
import { contact, copy, social, tr, type Lang } from '../lib/i18n';
import { pickSystem } from './Systems';

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
);
const XLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" /></svg>
);

export default function Footer({ lang }: { lang: Lang }) {
  const f = copy.foot;
  const links = [
    { id: 'services', l: copy.nav.services }, { id: 'projects', l: copy.nav.projects },
    { id: 'process', l: copy.nav.process }, { id: 'reviews', l: f.reviews }, { id: 'contact', l: copy.nav.contact },
  ];

  return (
    <footer className="relative z-10 px-5 pb-8 pt-4 sm:px-10">
      <div data-glass className="glass glass-refract mx-auto max-w-7xl rounded-[36px] px-6 pb-6 pt-10 sm:px-10 sm:pt-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <img src="img/logo.jpg" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <span className="display text-2xl font-semibold">STS</span>
            </a>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-mist">{tr(f.about, lang)}</p>
            <div className="mt-6 flex gap-2">
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn !min-h-[44px] !w-11 !px-0" data-glass data-magnet><LinkedIn /></a>
              <a href={social.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="btn !min-h-[44px] !w-11 !px-0" data-glass data-magnet><XLogo /></a>
            </div>
          </div>

          <nav aria-label={tr(f.systems, lang)}>
            <h2 className="display text-lg font-semibold">{tr(f.systems, lang)}</h2>
            <ul className="mt-4 grid gap-2.5 text-[15px]">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <a href="#services" onClick={() => pickSystem(s.slug)} className="link-glow text-mist">{tr(s.title, lang)}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tr(f.company, lang)}>
            <h2 className="display text-lg font-semibold">{tr(f.company, lang)}</h2>
            <ul className="mt-4 grid gap-2.5 text-[15px]">
              {links.map((l) => (
                <li key={l.id}><a href={`#${l.id}`} className="link-glow text-mist">{tr(l.l, lang)}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="display text-lg font-semibold">{tr(f.reach, lang)}</h2>
            <ul className="mt-4 grid gap-3 text-[15px] text-mist">
              <li><span dir="ltr" className="text-paper">{contact.phone}</span></li>
              <li className="text-paper">{contact.email}</li>
              <li>{tr(contact.address, lang)}</li>
              <li>{tr(contact.hours, lang)}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-mist">
          <span>© {new Date().getFullYear()} {tr(copy.footer, lang)}. {tr(f.rights, lang)}</span>
          <a href="#top" className="btn !min-h-[40px] !px-4 text-sm" data-glass data-magnet>
            <ArrowUp size={16} aria-hidden />
            {tr(f.top, lang)}
          </a>
        </div>
      </div>
    </footer>
  );
}
