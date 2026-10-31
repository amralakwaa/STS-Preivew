'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { ArrowUpRight, Languages, ShieldCheck, Send, Sparkles } from 'lucide-react';
import Glass from './Glass';
import GlassDefs from './GlassDefs';
import Stage from './Stage';
import { Lang, hero, nav, projects, services, stats, steps, t, ui } from '../lib/content';

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, delay, ease }}>{children}</motion.div>
  );
}

function Count({ n, suffix }: { n: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const dec = n % 1 ? 1 : 0;
    const c = animate(0, n, { duration: 2, ease, onUpdate: (v) => { if (ref.current) ref.current.textContent = v.toFixed(dec) + suffix; } });
    return () => c.stop();
  }, [inView, n, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function SectionHead({ badge, title, sub }: { badge?: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      {badge && <Glass className="glass-pill mb-5 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider" refract={false}><Sparkles size={14} />{badge}</Glass>}
      <h2 className="text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg text-slate-300/80">{sub}</p>}
    </Reveal>
  );
}

export default function Site() {
  const [lang, setLang] = useState<Lang>('ar');
  const [sent, setSent] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(hp, [0, 1], ['0%', '25%']);
  const cardY = useTransform(hp, [0, 1], ['0%', '-30%']);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <>
      <GlassDefs />
      <Stage />
      <motion.div className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-cyan-300 via-indigo-400 to-fuchsia-400 rtl:origin-right" style={{ scaleX: bar }} />

      {/* NAV */}
      <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease }} className="fixed inset-x-0 top-4 z-50 px-4">
        <Glass className="glass-pill mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <a href="#top" className="flex items-center gap-3">
            <img src="/img/logo.jpg" alt="STS" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-1 ring-white/40" />
            <span className="font-display text-xl font-extrabold tracking-wide">STS</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200/90 transition hover:bg-white/15 hover:text-white">{t(n.label, lang)}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold transition hover:bg-white/20" aria-label="Switch language">
              <Languages size={14} />{lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <a href="#contact" className="btn btn-solid hidden !px-5 !py-2.5 text-sm sm:inline-flex">{t(hero.cta1, lang)}</a>
          </div>
        </Glass>
      </motion.header>

      <main id="top" className="relative z-10">
        {/* HERO */}
        <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-32 sm:px-8">
          <motion.img src="/img/hero.jpg" alt="" style={{ y: imgY }} className="pointer-events-none absolute inset-0 h-[120%] w-full object-cover opacity-30 mix-blend-luminosity" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05061a]/20 via-transparent to-[#05061a]" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Reveal>
                <Glass className="glass-pill mb-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide" refract={false}>
                  <ShieldCheck size={15} className="text-cyan-300" />{t(hero.badge, lang)}
                </Glass>
              </Reveal>
              <Reveal delay={0.1}><h1 className="text-4xl font-black leading-[1.15] sm:text-6xl lg:text-7xl"><span className="grad-text">{t(hero.title, lang)}</span></h1></Reveal>
              <Reveal delay={0.2}><p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200/80">{t(hero.sub, lang)}</p></Reveal>
              <Reveal delay={0.3} className="mt-9 flex flex-wrap gap-4">
                <a href="#contact" className="btn btn-solid">{t(hero.cta1, lang)}<ArrowUpRight size={18} className="rtl:-scale-x-100" /></a>
                <a href="#services" className="btn glass glass-pill !text-white">{t(hero.cta2, lang)}</a>
              </Reveal>
            </div>

            {/* floating glass stack */}
            <motion.div style={{ y: cardY }} className="relative hidden h-[460px] lg:block">
              <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-0 top-0 w-72 rtl:left-0 rtl:right-auto">
                <Glass tilt className="p-6"><div className="mb-3 flex items-center justify-between text-xs font-bold text-cyan-200"><span>LIVE · 4K</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />REC</span></div>
                  <img src="/img/cctv-surveillance-systems.jpg" alt="" className="h-36 w-full rounded-2xl object-cover" /></Glass>
              </motion.div>
              <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-6 left-0 w-64 rtl:left-auto rtl:right-0">
                <Glass tilt className="glass-tint-violet p-6"><div className="text-sm text-slate-200/80">{t(stats[1].label, lang)}</div>
                  <div className="font-display text-5xl font-black">99.4<span className="text-2xl text-cyan-300">%</span></div></Glass>
              </motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute right-10 top-52 w-52 rtl:left-10 rtl:right-auto">
                <Glass tilt className="glass-tint-cyan flex items-center gap-3 p-4"><ShieldCheck className="text-cyan-300" /><div className="text-sm font-bold">{t(stats[3].label, lang)}</div></Glass>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal><Glass className="grid grid-cols-2 gap-6 p-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-4xl font-black sm:text-5xl"><Count n={s.n} suffix={s.suffix} /></div>
                <div className="mt-2 text-sm text-slate-300/80">{t(s.label, lang)}</div>
              </div>
            ))}
          </Glass></Reveal>
        </section>

        {/* SERVICES — bento */}
        <section id="services" className="mx-auto max-w-6xl px-4 py-28 sm:px-8">
          <SectionHead title={t(ui.servicesTitle, lang)} sub={t(ui.servicesSub, lang)} />
          <div className="grid auto-rows-[220px] gap-5 md:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 0.06} className={s.span}>
                <Glass tilt className="group h-full">
                  <img src={`/img/${s.img}.jpg`} alt="" className="absolute inset-0 -z-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-110 group-hover:opacity-80" />
                  <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#05061a]/90 via-[#05061a]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-6">
                    <h3 className="text-xl font-extrabold sm:text-2xl">{t(s.title, lang)}</h3>
                    <p className="mt-1.5 text-sm text-slate-200/85">{t(s.desc, lang)}</p>
                  </div>
                  <span className="glass glass-pill absolute end-4 top-4 z-[2] grid h-10 w-10 place-items-center" style={{ ['--r' as any]: '999px' }}><ArrowUpRight size={18} className="rtl:-scale-x-100" /></span>
                </Glass>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mx-auto max-w-6xl px-4 pb-28 sm:px-8">
          <SectionHead title={t(ui.projectsTitle, lang)} />
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Glass tilt className="group h-[340px]">
                  <img src={`/img/${p.img}.jpg`} alt={t(p.name, lang)} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                  <Glass className="absolute inset-x-4 bottom-4 z-[3] flex items-center justify-between px-5 py-4" style={{ ['--r' as any]: '22px' }}>
                    <div><div className="text-lg font-extrabold">{t(p.name, lang)}</div><div className="text-xs font-semibold text-cyan-200">{t(p.tag, lang)}</div></div>
                    <ArrowUpRight className="rtl:-scale-x-100" />
                  </Glass>
                </Glass>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="mx-auto max-w-6xl px-4 pb-28 sm:px-8">
          <SectionHead title={t(ui.processTitle, lang)} />
          <div className="grid gap-5 md:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Glass tilt className="h-full p-6">
                  <div className="font-display text-5xl font-black text-white/25">0{i + 1}</div>
                  <h3 className="mt-3 text-lg font-extrabold">{t(s.title, lang)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300/85">{t(s.desc, lang)}</p>
                </Glass>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mx-auto max-w-5xl px-4 pb-24 sm:px-8">
          <Reveal>
            <Glass className="glass-tint-violet grid gap-10 p-8 sm:p-12 lg:grid-cols-2" style={{ ['--r' as any]: '40px' }}>
              <div>
                <h2 className="text-3xl font-black leading-tight sm:text-4xl">{t(ui.contactTitle, lang)}</h2>
                <p className="mt-4 text-slate-200/85">{t(ui.contactSub, lang)}</p>
              </div>
              {sent ? (
                <div className="grid place-items-center text-center text-xl font-bold text-cyan-200">{t(ui.sent, lang)}</div>
              ) : (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <input required className="input" placeholder={t(ui.name, lang)} />
                  <input required type="tel" className="input" placeholder={t(ui.phone, lang)} />
                  <textarea rows={3} className="input" placeholder={t(ui.need, lang)} />
                  <button type="submit" className="btn btn-solid w-full justify-center">{t(ui.send, lang)}<Send size={16} className="rtl:-scale-x-100" /></button>
                </form>
              )}
            </Glass>
          </Reveal>
        </section>

        <footer className="px-4 pb-10 text-center text-sm text-slate-400">{t(ui.rights, lang)} © {new Date().getFullYear()}</footer>
      </main>
    </>
  );
}
