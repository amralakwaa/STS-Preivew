"""Make responsive WebP copies of every JPG in public/img (480, 800 and 1280 px wide).

Run from the project root:  python3 scripts/images.py
"""
from pathlib import Path
from PIL import Image

WIDTHS = (480, 800, 1280)
root = Path(__file__).resolve().parent.parent / 'public' / 'img'

for jpg in sorted(root.glob('*.jpg')):
    im = Image.open(jpg).convert('RGB')
    for w in WIDTHS:
        out = jpg.with_name(f'{jpg.stem}-{w}.webp')
        h = round(im.height * min(w, im.width) / im.width)
        im.resize((min(w, im.width), h), Image.LANCZOS).save(out, 'WEBP', quality=72, method=6)
    if jpg.stem == 'logo':  # the logo only ever shows small
        im.resize((96, 96), Image.LANCZOS).save(jpg.with_name('logo-96.webp'), 'WEBP', quality=85, method=6)
    print(jpg.name)
