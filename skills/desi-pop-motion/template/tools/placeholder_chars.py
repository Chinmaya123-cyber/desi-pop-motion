"""Create labelled placeholder cutouts so the template renders before any AI art exists.

    python tools/placeholder_chars.py

Writes public/char/<pose>.png for every pose the example scenes use, plus
public/img/host_photo.png. Replace them with real Atlabs-generated cutouts
(see references/atlabs-mcp.md in the skill). Existing files are never overwritten.
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
POSES = {  # name: (width, height)
    'point_you': (470, 1240), 'point_self': (550, 1240), 'dance': (620, 1240), 'dj': (820, 1200),
    'swag': (480, 1225), 'shocked': (820, 1230), 'cake': (530, 1250), 'welcome': (830, 1236),
    'sleepy': (840, 970), 'namaste': (430, 1228),
}

def figure(w, h, label, col=(255, 46, 136)):
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = int(min(w, h) * 0.2)
    cx = w // 2
    d.ellipse([cx - r, 10, cx + r, 10 + 2 * r], fill=(176, 120, 86, 255), outline=(20, 10, 31, 255), width=10)
    d.rounded_rectangle([cx - int(w * 0.42), 2 * r + 30, cx + int(w * 0.42), int(h * 0.62)], radius=60, fill=col + (255,), outline=(20, 10, 31, 255), width=10)
    d.rectangle([cx - int(w * 0.3), int(h * 0.62), cx + int(w * 0.3), h - 10], fill=(20, 10, 31, 255))
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', max(28, w // 9))
    except OSError:
        font = ImageFont.load_default()
    tw = d.textlength(label, font=font)
    d.text((cx - tw / 2, int(h * 0.42)), label, font=font, fill=(255, 255, 255, 255), stroke_width=4, stroke_fill=(20, 10, 31, 255))
    return im

for name, (w, h) in POSES.items():
    out = ROOT / 'public' / 'char' / f'{name}.png'
    if not out.exists():
        figure(w, h, name.upper()).save(out)
        print('placeholder', out.name)
hp = ROOT / 'public' / 'img' / 'host_photo.png'
if not hp.exists():
    figure(720, 730, 'HOST PHOTO', (0, 216, 255)).save(hp)
    print('placeholder', hp.name)
