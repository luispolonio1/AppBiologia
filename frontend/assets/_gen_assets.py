"""Genera icon.png y splash.png con Pillow. Verde lima de la paleta."""
from PIL import Image, ImageDraw, ImageFont
import os

ASSETS = os.path.dirname(os.path.abspath(__file__))
BRAND = (154, 205, 44)        # #9ACD2C
DARK = (15, 26, 12)           # #0f1a0c
WHITE = (255, 255, 255)


def rounded_rect(draw, xy, radius, fill):
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def draw_leaf(draw, cx, cy, size, color):
    # Hoja estilizada: dos arcos formando una gota
    s = size
    draw.ellipse([cx - s, cy - s * 1.3, cx + s, cy + s * 0.6], fill=color)
    # Tallo
    draw.line([(cx, cy + s * 0.5), (cx, cy + s * 1.4)], fill=color, width=max(2, s // 12))
    # Nervadura central
    draw.line([(cx - s * 0.4, cy + s * 0.2), (cx + s * 0.2, cy - s * 0.6)],
              fill=BRAND, width=max(2, s // 16))


def make_icon(path, size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Fondo con esquinas redondeadas
    radius = int(size * 0.22)
    rounded_rect(d, [0, 0, size - 1, size - 1], radius, BRAND)
    # Hoja centrada
    draw_leaf(d, size // 2, int(size * 0.42), int(size * 0.26), DARK)
    # Texto "Granja"
    try:
        font = ImageFont.truetype("segoeui.ttf", int(size * 0.13))
    except Exception:
        font = ImageFont.load_default()
    text = "Granja"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], int(size * 0.66) - bbox[1]), text,
           font=font, fill=DARK)
    img.save(path, "PNG", optimize=True)
    print("WROTE", path, size)


def make_splash(path, w=1284, h=2778):
    img = Image.new("RGB", (w, h), BRAND)
    d = ImageDraw.Draw(img)
    # Hoja grande en el centro
    draw_leaf(d, w // 2, int(h * 0.42), int(w * 0.30), DARK)
    try:
        font = ImageFont.truetype("segoeui.ttf", int(w * 0.10))
    except Exception:
        font = ImageFont.load_default()
    text = "GranjaApp"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((w - tw) / 2 - bbox[0], int(h * 0.55) - bbox[1]), text,
           font=font, fill=DARK)
    img.save(path, "PNG", optimize=True)
    print("WROTE", path, (w, h))


if __name__ == "__main__":
    make_icon(os.path.join(ASSETS, "icon.png"))
    make_splash(os.path.join(ASSETS, "splash.png"))
