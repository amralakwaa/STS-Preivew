'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { copy, tr, type Lang } from '../lib/i18n';

const links = ['services', 'projects', 'process', 'contact'] as const;

export default function Nav({ lang, onLang }: { lang: Lang; onLang: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <nav className="glass glass-refract mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full py-2 pe-2 ps-3 sm:ps-4" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="img/logo.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
          <span className="display text-xl font-semibold">STS</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className="rounded-full px-4 py-2 text-[15px] text-mist transition-colors hover:bg-white/10 hover:text-paper">
                {tr(copy.nav[id], lang)}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={onLang} className="min-h-[40px] rounded-full px-3 text-sm text-mist transition-colors hover:bg-white/10 hover:text-paper" lang={lang === 'ar' ? 'en' : 'ar'}>
            {tr(copy.nav.lang, lang)}
          </button>
          <a href="#contact" className="btn btn-amber !min-h-[40px] !px-4 text-sm">{tr(copy.nav.quote, lang)}</a>
        </div>
      </nav>
    </motion.header>
  );
}
