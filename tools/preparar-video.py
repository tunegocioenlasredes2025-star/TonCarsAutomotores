"""
Ton Cars — preparación del video del hero.

Toma _originales/hero-video.mp4 y genera img/marca/hero.mp4 listo para web:

  - recorta la franja central en 16:9 (el original es vertical, de celular)
  - le saca el audio (el hero va silenciado igual)
  - lo acorta al tramo elegido, para que el archivo pese poco
  - baja a 30 fps y mueve el índice al principio (faststart), así empieza a
    reproducirse sin esperar la descarga completa

Uso:  python tools/preparar-video.py
Requiere ffmpeg en el PATH.
"""
import shutil
import subprocess
import sys
from pathlib import Path

# La consola de Windows usa cp1252 y revienta con acentos o flechas.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "_originales" / "hero-video.mp4"
DESTINO = RAIZ / "img" / "marca" / "hero.mp4"

# ---------------------------------------------------------------- Ajustes
# Tramo a usar, en segundos. El arranque muestra la salida del túnel, que es
# el momento más lindo y además engancha con la foto de fondo.
DESDE = 0
DURACION = 14

# Recorte del original vertical (464x832) a una franja 16:9.
# El desplazamiento vertical elige qué se ve: más chico sube hacia el cielo,
# más grande baja hacia la ruta.
RECORTE = "crop=iw:iw*9/16:0:300"

# Tamaño final. El original es de 464 px de ancho: no tiene sentido salir muy
# por encima, porque agrandar no inventa detalle y sólo suma peso.
ANCHO = 1280


def main():
    if not shutil.which("ffmpeg"):
        sys.exit("Falta ffmpeg en el PATH. Instalalo y volvé a correr el script.")

    if not ORIGEN.exists():
        sys.exit(f"No encuentro {ORIGEN.relative_to(RAIZ)}")

    DESTINO.parent.mkdir(parents=True, exist_ok=True)

    filtros = (
        f"{RECORTE},"
        f"scale={ANCHO}:-2:flags=lanczos,"
        f"unsharp=5:5:0.7:5:5:0.0,"   # compensa el reescalado
        f"fps=30"
    )

    cmd = [
        "ffmpeg", "-v", "error", "-y",
        "-ss", str(DESDE), "-t", str(DURACION),
        "-i", str(ORIGEN),
        "-an",                          # sin audio
        "-vf", filtros,
        "-c:v", "libx264",
        "-profile:v", "high",
        "-crf", "27",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",          # compatibilidad con Safari
        "-movflags", "+faststart",
        str(DESTINO),
    ]

    print("Codificando el video del hero...")
    subprocess.run(cmd, check=True)

    peso = DESTINO.stat().st_size / 1_000_000
    print(f"  img/marca/hero.mp4 — {peso:.2f} MB, {DURACION}s, {ANCHO}px de ancho")
    if peso > 4:
        print("  AVISO: pesa más de 4 MB. Bajá DURACION o subí el CRF.")


if __name__ == "__main__":
    main()
