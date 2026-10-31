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
import Trust from './Trust';
import Reviews from './Reviews';
import Footer from './Footer';
import ContactFab from './ContactFab';
import Coverage from './Coverage';
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
        <Trust lang={lang} />
        <Systems lang={lang} />
        <Projects lang={lang} />
        <Process lang={lang} />
        <Reviews lang={lang} />
        <Coverage lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <ContactFab lang={lang} />
    </MotionConfig>
  );
}
