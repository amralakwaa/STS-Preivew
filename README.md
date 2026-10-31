# STS Glass

Next.js (React 19) + Tailwind + Framer Motion rebuild of the STS Smart Tech Systems website with a liquid-glass design.

- Arabic (RTL) and English
- Hero: a glass lens that follows the cursor and shows the city in thermal or night vision, with detection markers
- Control-room services picker, scroll-driven projects strip, scroll-linked process rail, WhatsApp quote form
- `npm run build` writes a static site to `out/` for a root domain; `npm run build:pages` builds it for
  GitHub Pages under `/STS-Preivew` (set `BASE_PATH` for any other sub-folder)
- Photos: put a JPG in `public/img`, then run `python3 scripts/images.py` to make the 480/800/1280 WebP copies
- Mobile first: phones get self-hosted subset fonts, responsive WebP, CSS-only entrance, a still smoke frame,
  no SVG refraction and no continuous effects

```bash
npm install
npm run dev
```
