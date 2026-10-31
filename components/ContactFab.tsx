'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Mail, MapPin, Phone, X } from 'lucide-react';
import { contact, copy, tr, type Lang } from '../lib/i18n';

const WaLogo = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.42 9.42 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.46-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.49A11.32 11.32 0 0 0 12.05.67C5.79.67.69 5.76.69 12.03c0 2 .52 3.95 1.52 5.67L.6 23.33l5.76-1.51a11.34 11.34 0 0 0 5.69 1.45h.01c6.26 0 11.36-5.09 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03z" />
  </svg>
);

/**
 * One contact button for the whole site. Tapped, it opens into four ways to reach the office:
 * call, WhatsApp, email and the map. Shows after the hero, steps aside in the contact section and the footer.
 */
export default function ContactFab({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const f = copy.fab;

  useEffect(() => {
    const check = () => {
      const c = document.getElementById('contact')?.getBoundingClientRect();
      const inContact = c ? c.top < window.innerHeight * 0.6 && c.bottom > window.innerHeight * 0.4 : false;
      const foot = document.querySelector('footer')?.getBoundingClientRect();
      const atFooter = foot ? foot.top < window.innerHeight * 0.85 : false;
      const next = window.scrollY > window.innerHeight * 0.75 && !inContact && !atFooter;
      setShow(next);
      if (!next) setOpen(false);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', away);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', away); };
  }, [open]);

  const items = [
    { href: `tel:${contact.phone.replace(/\s/g, '')}`, label: f.call, icon: <Phone size={19} aria-hidden />, tone: 'fab-amber', sub: contact.phone },
    { href: `https://wa.me/${contact.wa}`, label: f.wa, icon: <WaLogo />, tone: 'fab-green', ext: true },
    { href: `mailto:${contact.email}`, label: f.mail, icon: <Mail size={19} aria-hidden />, tone: 'fab-glass', sub: contact.email },
    { href: '#coverage', label: f.map, icon: <MapPin size={19} aria-hidden />, tone: 'fab-glass' },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={root}
          className="fixed bottom-4 end-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-7 sm:end-7"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          <AnimatePresence>
            {open && (
              <motion.ul id="fab-menu" className="flex flex-col items-end gap-2.5" initial="hidden" animate="shown" exit="hidden">
                {items.map((it, i) => (
                  <motion.li
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 16, scale: 0.85, transition: { duration: 0.15, delay: (items.length - 1 - i) * 0.03 } },
                      shown: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 26, delay: (items.length - 1 - i) * 0.05 } },
                    }}
                  >
                    <a
                      href={it.href}
                      target={it.ext ? '_blank' : undefined}
                      rel={it.ext ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className="fab-item flex min-h-[52px] items-center gap-3 rounded-full py-1.5 pe-1.5 ps-5"
                      data-glass
                    >
                      <span className="text-start">
                        <span className="block text-[15px] font-semibold text-paper">{tr(it.label, lang)}</span>
                        {it.sub && <span className="block text-xs text-mist" dir="ltr">{it.sub}</span>}
                      </span>
                      <span className={`fab-dot ${it.tone} grid h-11 w-11 place-items-center rounded-full`}>{it.icon}</span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="fab-menu"
            aria-label={tr(open ? f.close : f.open, lang)}
            className="fab-main relative grid h-16 w-16 place-items-center rounded-full"
            data-magnet
          >
            {!reduce && !open && <span className="fab-ring" aria-hidden />}
            {!reduce && !open && <span className="fab-ring fab-ring-2" aria-hidden />}
            <span className="fab-orb absolute inset-0 rounded-full" aria-hidden />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'p'}
                className="relative text-[#1a1206]"
                initial={reduce ? false : { rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X size={26} aria-hidden /> : <Phone size={26} aria-hidden className="fab-shake" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
