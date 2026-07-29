"""
Ton Cars — preparación del video del hero.

Toma el video de _originales/ y genera img/marca/hero.mp4 listo para web:

  - recorta los bordes (saca la marca de agua del grabador de pantalla)
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
DESTINO = RAIZ / "img" / "marca" / "hero.mp4"

# Primer archivo que exista, en orden de preferencia.
CANDIDATOS = [
    "hero-video-potrerillos.webm",
    "hero-video.mp4",
    "hero-video.webm",
]
ORIGEN = next(
    (RAIZ / "_originales" / n for n in CANDIDATOS if (RAIZ / "_originales" / n).exists()),
    None,
)

# ---------------------------------------------------------------- Ajustes
# Tramo a usar, en segundos.
DESDE = 0
DURACION = 10

# Recorte de los bordes. El video de Potrerillos (1246x700, horizontal) trae la
# marca de agua "SEVEN WAYS" arriba a la derecha y el cartel del grabador abajo;
# este crop se queda con la zona central y las deja fuera de cuadro.
#   crop = ancho : alto : desde_x : desde_y   (en fracción del original)
RECORTE = "crop=iw*0.86:ih*0.78:iw*0.07:ih*0.10"

# Tamaño final.
ANCHO = 1280


def main():
    if not shutil.which("ffmpeg"):
        sys.exit("Falta ffmpeg en el PATH. Instalalo y volvé a correr el script.")

    if ORIGEN is None:
        sys.exit(
            "No encuentro el video en _originales/. Dejá uno con alguno de estos "
            "nombres: " + ", ".join(CANDIDATOS)
        )
    print(f"Origen: _originales/{ORIGEN.name}")

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
        "-crf", "22",   # menos compresion = mas nitidez (27 era calidad media)
        "-preset", "slow",
        "-pix_fmt", "yuv420p",          # compatibilidad con Safari
        "-movflags", "+faststart",
        str(DESTINO),
    ]

    print("Codificando el video del hero...")
    subprocess.run(cmd, check=True)

    peso = DESTINO.stat().st_size / 1_000_000
    print(f"  img/marca/hero.mp4 — {peso:.2f} MB, {DURACION}s, {ANCHO}px de ancho")
    if peso > 6:
        print("  AVISO: pesa más de 6 MB. Bajá DURACION o subí el CRF.")


if __name__ == "__main__":
    main()
