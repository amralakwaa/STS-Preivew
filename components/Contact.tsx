'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, MessageCircle, Phone } from 'lucide-react';
import { services } from '../lib/data';
import { contact, copy, tr, type Lang } from '../lib/i18n';
import { srcset } from '../lib/img';
import FocusText from './FocusText';

const main = services.slice(0, 8).map((s) => s.slug);

export default function Contact({ lang }: { lang: Lang }) {
  const f = copy.form;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean }>({});

  const [copied, setCopied] = useState(false);

  // "Get a quote for this system" on the monitor ticks the system here
  useEffect(() => {
    const on = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      setPicked((p) => (p.includes(slug) ? p : [...p, slug]));
    };
    const onNote = (e: Event) => setNotes((n) => (n.trim() ? n + '\n' : '') + (e as CustomEvent<string>).detail);
    window.addEventListener('sts:quote', on);
    window.addEventListener('sts:note', onNote);
    return () => { window.removeEventListener('sts:quote', on); window.removeEventListener('sts:note', onNote); };
  }, []);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(contact.phone.replace(/\s/g, ''));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard refused: the number stays visible on the page */ }
  };
  const shown = services.filter((x) => main.includes(x.slug) || picked.includes(x.slug));

  const toggle = (slug: string) => setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = { name: !name.trim(), phone: phone.replace(/\D/g, '').length < 9 };
    setErrors(err);
    if (err.name || err.phone) return;
    const systems = services.filter((s) => picked.includes(s.slug)).map((s) => tr(s.title, lang)).join('، ');
    const lines = [
      `${tr(f.name, lang)}: ${name.trim()}`,
      `${tr(f.phone, lang)}: ${phone.trim()}`,
      `${tr(f.type, lang)}: ${tr(f.types[type], lang)}`,
      systems && `${tr(f.systems, lang)}: ${systems}`,
      notes.trim() && `${tr(f.notes, lang)}: ${notes.trim()}`,
    ].filter(Boolean);
    window.location.href = `https://wa.me/${contact.wa}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-10 sm:py-28">
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]">
        <img src="img/ops-center.jpg" srcSet={srcset('ops-center')} sizes="100vw" alt="" decoding="async" className="drift absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-luminosity" loading="lazy" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <FocusText text={tr(f.title, lang)} className="display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />
          <p className="mt-4 max-w-[44ch] text-lg text-mist">{tr(f.sub, lang)}</p>
          <p className="mt-6 max-w-[44ch] text-paper/85">{tr(f.proof, lang)}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="btn !min-h-[46px] !px-5 text-[15px]" data-glass data-magnet><Phone size={17} aria-hidden />{tr(copy.quick.call, lang)}</a>
            <a href={`https://wa.me/${contact.wa}`} target="_blank" rel="noopener noreferrer" className="btn !min-h-[46px] !px-5 text-[15px]" data-glass data-magnet><MessageCircle size={17} aria-hidden />{tr(copy.quick.wa, lang)}</a>
            <button type="button" onClick={copyNumber} className="btn !min-h-[46px] !px-5 text-[15px]" data-glass data-magnet aria-live="polite">
              <Copy size={16} aria-hidden />{tr(copied ? copy.quick.copied : copy.quick.copy, lang)}
            </button>
          </div>
          <dl className="mt-10 grid gap-5 text-[15px]">
            <div><dt className="text-mist">{tr(f.phoneL, lang)}</dt><dd className="mt-0.5 text-lg"><span dir="ltr">{contact.phone}</span></dd></div>
            <div><dt className="text-mist">{tr(f.emailL, lang)}</dt><dd className="mt-0.5 text-lg">{contact.email}</dd></div>
            <div><dt className="text-mist">{tr(f.addressL, lang)}</dt><dd className="mt-0.5">{tr(contact.address, lang)}</dd></div>
            <div><dt className="text-mist">{tr(f.hoursL, lang)}</dt><dd className="mt-0.5">{tr(contact.hours, lang)}</dd></div>
          </dl>
        </div>

        <form onSubmit={submit} noValidate data-glass className="glass glass-refract rim-slow grid gap-6 rounded-[32px] p-6 sm:p-9">
          <span className="rim" aria-hidden />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">{tr(f.name, lang)}</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
              {errors.name && <span id="err-name" className="text-sm text-amber">{tr(f.errName, lang)}</span>}
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">{tr(f.phone, lang)}</span>
              <input className="field" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="05X XXX XXXX" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'err-phone' : undefined} />
              {errors.phone && <span id="err-phone" className="text-sm text-amber">{tr(f.errPhone, lang)}</span>}
            </label>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium">{tr(f.type, lang)}</legend>
            <div role="radiogroup" className="flex flex-wrap gap-2">
              {f.types.map((t, i) => (
                <button key={i} type="button" role="radio" aria-checked={type === i} onClick={() => setType(i)} className="chip">{tr(t, lang)}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-medium">{tr(f.systems, lang)}</legend>
            <div className="flex flex-wrap gap-2">
              {shown.map((s) => (
                <button key={s.slug} type="button" aria-pressed={picked.includes(s.slug)} onClick={() => toggle(s.slug)} className="chip">{tr(s.title, lang)}</button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-2">
            <span className="text-sm font-medium">{tr(f.notes, lang)}</span>
            <textarea className="field min-h-[96px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <div>
            <span className="rim-fire flex w-full rounded-full sm:inline-flex sm:w-auto" data-magnet>
              <span className="rim" aria-hidden />
              <button type="submit" className="btn btn-amber w-full sm:w-auto" data-glass>{tr(f.send, lang)}</button>
            </span>
            <AnimatePresence>
              {picked.length > 0 && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 text-sm text-mist">
                  {lang === 'ar' ? `${picked.length} من الأنظمة محددة` : `${picked.length} selected`}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}
