"""
Ton Cars — preparación de imágenes.
Recorta el logo, quita el fondo negro, genera favicons y comprime las fotos
de vehículos a WebP + JPG (fallback).

Uso:  python tools/preparar-imagenes.py
Requiere: pip install pillow
"""
from PIL import Image, ImageDraw
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "_originales"
IMG = RAIZ / "img"
FAV = RAIZ / "favicon"


def recortar_borde_negro(im, umbral=26):
    """Devuelve la imagen sin las bandas oscuras de los bordes."""
    gris = im.convert("L")
    w, h = gris.size
    px = gris.load()

    def fila_vacia(y):
        return max(px[x, y] for x in range(0, w, 4)) < umbral

    def col_vacia(x):
        return max(px[x, y] for y in range(0, h, 4)) < umbral

    top = 0
    while top < h - 1 and fila_vacia(top):
        top += 1
    bottom = h - 1
    while bottom > top and fila_vacia(bottom):
        bottom -= 1
    left = 0
    while left < w - 1 and col_vacia(left):
        left += 1
    right = w - 1
    while right > left and col_vacia(right):
        right -= 1
    return im.crop((left, top, right + 1, bottom + 1))


def logo():
    src = Image.open(ORIG / "logo.png").convert("RGBA")
    src = recortar_borde_negro(src)

    # El logo viene sobre un fondo casi negro texturado: lo volvemos transparente
    # con una rampa suave para no comerse el brillo de los bordes.
    datos = []
    for r, g, b, a in src.getdata():
        lum = max(r, g, b)
        if lum <= 30:
            datos.append((r, g, b, 0))
        elif lum < 78:
            datos.append((r, g, b, int((lum - 30) / 48 * 255)))
        else:
            datos.append((r, g, b, a))
    src.putdata(datos)
    src = src.crop(src.getbbox())

    ancho = 900
    alto = round(src.height * ancho / src.width)
    grande = src.resize((ancho, alto), Image.LANCZOS)
    grande.save(IMG / "marca" / "logo.png", optimize=True)
    grande.save(IMG / "marca" / "logo.webp", quality=92, method=6)

    chico = src.resize((360, round(src.height * 360 / src.width)), Image.LANCZOS)
    chico.save(IMG / "marca" / "logo-nav.png", optimize=True)
    chico.save(IMG / "marca" / "logo-nav.webp", quality=92, method=6)
    print(f"logo: {ancho}x{alto}")
    return src


def favicons(logo_rgba):
    """Marca 'TC' sobre disco oscuro: legible incluso a 16px."""
    FAV.mkdir(exist_ok=True)
    base = 512
    lienzo = Image.new("RGBA", (base, base), (0, 0, 0, 0))
    d = ImageDraw.Draw(lienzo)
    d.rounded_rectangle([0, 0, base - 1, base - 1], radius=112, fill=(10, 13, 20, 255))
    d.rounded_rectangle([0, 0, base - 1, base - 1], radius=112, outline=(220, 11, 8, 255), width=10)

    # Recuadramos sólo el monograma superior del logo original.
    mono = logo_rgba.crop((0, 0, logo_rgba.width, int(logo_rgba.height * 0.46)))
    mono = mono.crop(mono.getbbox())
    escala = (base * 0.72) / mono.width
    mono = mono.resize((int(mono.width * escala), int(mono.height * escala)), Image.LANCZOS)
    lienzo.alpha_composite(mono, ((base - mono.width) // 2, (base - mono.height) // 2))

    lienzo.save(FAV / "favicon-512.png", optimize=True)
    lienzo.resize((192, 192), Image.LANCZOS).save(FAV / "favicon-192.png", optimize=True)
    lienzo.resize((180, 180), Image.LANCZOS).save(FAV / "apple-touch-icon.png", optimize=True)
    lienzo.resize((32, 32), Image.LANCZOS).save(FAV / "favicon-32.png", optimize=True)
    lienzo.save(
        FAV / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48)],
        format="ICO",
    )
    print("favicons: ok")


def foto(origen, destino, ancho=1400):
    im = Image.open(origen).convert("RGB")
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im.save(IMG / "vehiculos" / f"{destino}.webp", quality=82, method=6)
    im.save(IMG / "vehiculos" / f"{destino}.jpg", quality=84, optimize=True, progressive=True)
    print(f"{destino}: {im.width}x{im.height}")


def og(logo_rgba):
    """Imagen 1200x630 para Open Graph."""
    w, h = 1200, 630
    lienzo = Image.new("RGB", (w, h), (8, 10, 15))
    d = ImageDraw.Draw(lienzo)
    for y in range(h):  # degradado diagonal rojo -> azul muy sutil
        t = y / h
        d.line([(0, y), (w, y)], fill=(int(8 + 26 * (1 - t)), int(10 + 8 * t), int(15 + 42 * t)))
    d.rectangle([0, h - 12, w, h], fill=(220, 11, 8))
    d.rectangle([0, h - 12, w // 2, h], fill=(19, 66, 164))

    escala = (w * 0.62) / logo_rgba.width
    marca = logo_rgba.resize(
        (int(logo_rgba.width * escala), int(logo_rgba.height * escala)), Image.LANCZOS
    )
    lienzo.paste(marca, ((w - marca.width) // 2, (h - marca.height) // 2 - 10), marca)
    lienzo.save(IMG / "marca" / "og.jpg", quality=88, optimize=True)
    print("og: 1200x630")


if __name__ == "__main__":
    l = logo()
    favicons(l)
    og(l)
    foto(ORIG / "imagen auto.png", "toyota-yaris-01")
    foto(ORIG / "imagen moto.png", "honda-cb125-01")
    foto(ORIG / "informacion.png", "../marca/local", ancho=1000)
