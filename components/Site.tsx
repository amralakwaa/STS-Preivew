'use client';
import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Filters from './Filters';
import Ether from './Ether';
import GlassFx from './GlassFx';
import Nav from './Nav';
import Hero from './Hero';
import Systems from './Systems';
import Projects from './Projects';
import Process from './Process';
import Contact from './Contact';
import { copy, tr, type Lang } from '../lib/i18n';

export default function Site() {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <MotionConfig reducedMotion="user">
      <Filters />
      <Ether />
      <GlassFx />
      <Nav lang={lang} onLang={() => setLang(lang === 'ar' ? 'en' : 'ar')} />
      <main id="top" className="relative z-10">
        <Hero lang={lang} />
        <Systems lang={lang} />
        <Projects lang={lang} />
        <Process lang={lang} />
        <Contact lang={lang} />
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-ink/40 px-5 py-8 backdrop-blur-md sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-mist">
          <span className="flex items-center gap-2.5">
            <img src="img/logo.jpg" alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
            {tr(copy.footer, lang)}
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </MotionConfig>
  );
}
