"""Diagnostica el formato real de las imagenes."""
import os
from PIL import Image

ASSETS = r"C:\Users\Luis\OneDrive\Escritorio\AppBiologia\frontend\assets"
for fn in sorted(os.listdir(ASSETS)):
    if not fn.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        continue
    path = os.path.join(ASSETS, fn)
    size = os.path.getsize(path)
    try:
        with Image.open(path) as img:
            img.verify()
        with Image.open(path) as img:
            fmt = img.format
            mode = img.mode
            sz = img.size
        print(f"OK   {fn:20s} {size//1024:4d} KB  {fmt} {sz} {mode}")
    except Exception as e:
        print(f"BAD  {fn:20s} {size//1024:4d} KB  ERROR: {e}")
