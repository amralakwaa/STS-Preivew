'use client';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MapPin, Navigation, Phone } from 'lucide-react';
import { projects } from '../lib/data';
import { contact, copy, tr, type Lang } from '../lib/i18n';
import { srcset } from '../lib/img';
import { CITY_XY, KSA, MAP, NEIGHBOURS } from '../lib/map';
import FocusText from './FocusText';

const ease = [0.22, 1, 0.36, 1] as const;
type City = 'riyadh' | 'jeddah' | 'makkah' | 'dammam' | 'khobar';
const CITIES: City[] = ['riyadh', 'jeddah', 'makkah', 'dammam', 'khobar'];
// Jeddah/Makkah and Dammam/Khobar sit close together: each label and each touch zone leans away
// from its neighbour (hx/hy), so the zones never overlap and every city can be tapped.
const LABEL: Record<City, { dx: number; dy: number; anchor: 'start' | 'end' | 'middle'; hx: number; hy: number }> = {
  riyadh: { dx: 0, dy: 52, anchor: 'middle', hx: 0, hy: 0 },
  jeddah: { dx: -26, dy: 8, anchor: 'end', hx: -24, hy: 0 },
  makkah: { dx: 26, dy: 30, anchor: 'start', hx: 24, hy: 6 },
  dammam: { dx: -24, dy: -16, anchor: 'end', hx: -20, hy: -22 },
  khobar: { dx: 24, dy: 30, anchor: 'start', hx: 20, hy: 22 },
};
const cityOf: Record<string, City> = { Riyadh: 'riyadh', Jeddah: 'jeddah', Makkah: 'makkah', Dammam: 'dammam', 'Al-Khobar': 'khobar' };

const openProject = (slug: string) => window.dispatchEvent(new CustomEvent('sts:project', { detail: slug }));

/** An interactive map of the Kingdom: lines of light run from the head office to every city with a project. */
export default function Coverage({ lang }: { lang: Lang }) {
  const [city, setCity] = useState<City>('riyadh');
  const reduce = useReducedMotion();
  const c = copy.coverage;
  const [hx, hy] = CITY_XY.hq;
  const inCity = projects.filter((p) => cityOf[p.city.en] === city);
  const count = (k: City) => projects.filter((p) => cityOf[p.city.en] === k).length;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('King Abdulaziz Road, Al Yasmin, Riyadh')}`;

  return (
    <section id="coverage" className="scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <FocusText text={tr(c.title, lang)} className="display max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.2]" />
        <p className="mt-4 text-lg text-mist">{tr(c.sub, lang)}</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-6">
          {/* the map */}
          <div data-glass className="glass glass-refract relative overflow-hidden rounded-[32px] p-2 sm:p-4">
            <svg viewBox={`0 0 ${MAP.w} ${MAP.h}`} className="map block h-auto w-full" style={{ direction: 'ltr' }} role="group" aria-label={tr(c.pick, lang)}>
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="ksa-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#1d3354" />
                  <stop offset="1" stopColor="#13233a" />
                </linearGradient>
                <radialGradient id="hq-glow">
                  <stop offset="0" stopColor="rgba(255,178,62,0.55)" />
                  <stop offset="1" stopColor="rgba(255,178,62,0)" />
                </radialGradient>
              </defs>

              <rect width={MAP.w} height={MAP.h} fill="url(#map-grid)" />
              {NEIGHBOURS.map((d, i) => <path key={i} d={d} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />)}

              <motion.path
                d={KSA}
                fill="url(#ksa-fill)"
                stroke="rgba(255,178,62,0.55)"
                strokeWidth="2"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0, fillOpacity: 0 }}
                whileInView={{ pathLength: 1, fillOpacity: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ pathLength: { duration: 2, ease }, fillOpacity: { duration: 1, delay: 1.1 } }}
                style={{ filter: 'drop-shadow(0 0 18px rgba(255,160,60,0.25))' }}
              />

              <circle cx={hx} cy={hy} r="120" fill="url(#hq-glow)" />

              {/* lines of light from the head office */}
              {CITIES.filter((k) => k !== 'riyadh').map((k) => {
                const [x, y] = CITY_XY[k];
                const mx = (hx + x) / 2, my = (hy + y) / 2 - Math.abs(hx - x) * 0.22;
                const on = k === city;
                return (
                  <g key={k}>
                    <path d={`M${hx} ${hy} Q${mx} ${my} ${x} ${y}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    <path
                      d={`M${hx} ${hy} Q${mx} ${my} ${x} ${y}`}
                      fill="none"
                      stroke={on ? '#FFB23E' : 'rgba(79,227,181,0.7)'}
                      strokeWidth={on ? 3.5 : 2.5}
                      strokeLinecap="round"
                      className="map-flow"
                      style={{ filter: on ? 'drop-shadow(0 0 6px rgba(255,178,62,0.9))' : undefined }}
                    />
                  </g>
                );
              })}

              {/* cities */}
              {CITIES.map((k) => {
                const [x, y] = k === 'riyadh' ? [hx, hy] : CITY_XY[k];
                const on = k === city;
                const l = LABEL[k];
                return (
                  <g
                    key={k}
                    role="button"
                    tabIndex={0}
                    aria-label={`${tr(c.cities[k], lang)}: ${count(k)} ${tr(count(k) > 1 ? c.projectsMany : c.projects, lang)}`}
                    aria-pressed={on}
                    onClick={() => setCity(k)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setCity(k))}
                    className={`map-city ${on ? 'is-on' : ''}`}
                  >
                    <circle cx={x + l.hx} cy={y + l.hy} r={k === 'riyadh' ? 40 : 30} fill="transparent" />
                    {!reduce && <circle cx={x} cy={y} r="10" className="map-pulse" fill="none" stroke={k === 'riyadh' ? '#FFB23E' : '#4FE3B5'} strokeWidth="2" />}
                    {on && (
                      <circle cx={x} cy={y} r="24" fill="none" stroke="#FFB23E" strokeWidth="2" strokeDasharray="6 7" className="map-reticle" />
                    )}
                    <circle cx={x} cy={y} r={k === 'riyadh' ? 11 : 8} className={k === 'riyadh' ? 'map-dot map-dot-hq' : 'map-dot'} fill={k === 'riyadh' ? '#FFB23E' : on ? '#FFD28A' : '#4FE3B5'} stroke="#0C1626" strokeWidth="3" />
                    <text x={x + l.dx} y={y + l.dy} textAnchor={l.anchor} className="map-label">{tr(c.cities[k], lang)}</text>
                    {k === 'riyadh' && (
                      <text x={x} y={y + 52 + 34} textAnchor="middle" className="map-label map-label-sub">{tr(c.hq, lang)}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* the chosen city */}
          <div className="flex min-w-0 flex-col gap-5">
            <div role="tablist" aria-label={tr(c.pick, lang)} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
              {CITIES.map((k) => (
                <button key={k} role="tab" aria-selected={k === city} onClick={() => setCity(k)} className="chip shrink-0 !min-h-[44px]">
                  {tr(c.cities[k], lang)} <span className="tabular-nums opacity-70">({count(k)})</span>
                </button>
              ))}
            </div>

            <div data-glass className="glass rim-slow relative flex-1 overflow-hidden rounded-[28px] p-5 sm:p-6" role="tabpanel">
              <span className="rim" aria-hidden />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={city + lang}
                  initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <p className="flex items-center gap-2 text-sm text-amber">
                    <MapPin size={16} aria-hidden />
                    {inCity.length} {tr(inCity.length > 1 ? c.projectsMany : c.projects, lang)}
                  </p>
                  <h3 className="display mt-1 text-3xl font-semibold">{tr(c.cities[city], lang)}</h3>
                  <ul className="mt-5 grid gap-3">
                    {inCity.map((p) => (
                      <li key={p.slug}>
                        <button type="button" onClick={() => openProject(p.slug)} className="map-proj group flex w-full items-center gap-4 rounded-[20px] p-2 pe-4 text-start" data-glass>
                          <img src={`img/${p.slug}-480.webp`} srcSet={srcset(p.slug)} sizes="96px" alt="" loading="lazy" className="h-16 w-24 shrink-0 rounded-[14px] object-cover" />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-paper">{tr(p.name, lang)}</span>
                            <span className="block text-sm text-mist">{tr(p.sector, lang)}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {/* the head office, always at hand */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-mist">{tr(c.hq, lang)}</p>
                <p className="mt-1 text-paper">{tr(contact.address, lang)}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rim-fire inline-flex rounded-full" data-magnet>
                    <span className="rim" aria-hidden />
                    <span className="btn btn-amber !min-h-[46px] !px-5 text-[15px]" data-glass><Navigation size={16} aria-hidden />{tr(c.directions, lang)}</span>
                  </a>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="btn !min-h-[46px] !px-5 text-[15px]" data-glass data-magnet><Phone size={16} aria-hidden />{tr(c.call, lang)}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
