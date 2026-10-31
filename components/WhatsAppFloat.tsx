'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { contact, copy, tr, type Lang } from '../lib/i18n';

const WaLogo = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.42 9.42 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.46-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.49A11.32 11.32 0 0 0 12.05.67C5.79.67.69 5.76.69 12.03c0 2 .52 3.95 1.52 5.67L.6 23.33l5.76-1.51a11.34 11.34 0 0 0 5.69 1.45h.01c6.26 0 11.36-5.09 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03z" />
  </svg>
);

/** WhatsApp, always at hand: shows after the hero, steps aside in the contact section. */
export default function WhatsAppFloat({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const check = () => {
      const c = document.getElementById('contact')?.getBoundingClientRect();
      const inContact = c ? c.top < window.innerHeight * 0.6 && c.bottom > window.innerHeight * 0.4 : false;
      const foot = document.querySelector('footer')?.getBoundingClientRect();
      const atFooter = foot ? foot.top < window.innerHeight * 0.85 : false;
      setShow(window.scrollY > window.innerHeight * 0.75 && !inContact && !atFooter);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={`https://wa.me/${contact.wa}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tr(copy.waFloat, lang)}
          data-magnet
          data-glass
          className="wa-float group fixed bottom-5 end-5 z-50 flex items-center gap-3 rounded-full p-2 pe-2 sm:bottom-7 sm:end-7"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <span className="wa-label hidden max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-medium text-paper transition-[max-width,padding] duration-500 ease-out group-hover:max-w-[16rem] group-hover:ps-3 group-focus-visible:max-w-[16rem] group-focus-visible:ps-3 sm:block">
            {tr(copy.waFloat, lang)}
          </span>
          <span className="relative grid h-14 w-14 place-items-center rounded-full text-white">
            {!reduce && <span className="wa-ring" aria-hidden />}
            {!reduce && <span className="wa-ring wa-ring-2" aria-hidden />}
            <span className="wa-orb absolute inset-0 rounded-full" aria-hidden />
            <span className="relative"><WaLogo /></span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
