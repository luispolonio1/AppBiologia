"""Convierte pig.png (que es webp disfrazado) a PNG real,
redimensionado a 400x400 para no pesar tanto.
Tambien elimina icono2.jpg que ya no se usa."""
import os
from PIL import Image

ASSETS = r"C:\Users\Luis\OneDrive\Escritorio\AppBiologia\frontend\assets"

# Fix pig.png: cargar como lo que es (webp), guardar como png real
pig_path = os.path.join(ASSETS, "pig.png")
img = Image.open(pig_path)
print(f"pig.png actual: formato={img.format}, tam={img.size}, modo={img.mode}")
img = img.convert("RGB")  # PNG no soporta CMYK
img = img.resize((400, 400), Image.LANCZOS)
img.save(pig_path, "PNG", optimize=True)
print(f"pig.png nuevo: tam=400x400, modo=RGB")

# Borra icono2.jpg (no se usa, era webp disfrazado de jpg)
icono2 = os.path.join(ASSETS, "icono2.jpg")
if os.path.exists(icono2):
    os.remove(icono2)
    print("Eliminado icono2.jpg (no se usaba)")

# Verificacion final
import subprocess
subprocess.run(["python", os.path.join(ASSETS, "_check.py")])
