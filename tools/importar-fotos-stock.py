"""
Importa las fotos del stock desde la carpeta descargada de Drive.

Agrupa por vehículo (por el nombre del archivo), ordena, comprime a WebP + JPG
1400px y las deja en img/vehiculos/ con el slug de cada unidad.

Uso puntual: python tools/importar-fotos-stock.py "<carpeta con las fotos>"
"""
import sys
import re
from pathlib import Path
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "img" / "vehiculos"
ORIGEN = Path(sys.argv[1]) if len(sys.argv) > 1 else None

# nombre base del archivo (como viene en Drive)  ->  slug del vehículo
MAPEO = {
    "Fiat Fiorino 2018": "fiat-fiorino-2018",
    "Honda GLH 150": "honda-glh-150-2026",
    "Peugeot 308 sport 2014": "peugeot-308-sport-2014",
    "Renault FLUENCE PH2 2.0 LUXE PACK CUERO": "renault-fluence-luxe-2015",
    "Toyota COROLLA XLI": "toyota-corolla-xli-2014",
    "Toyota YARIS S": "toyota-yaris-s-2019",
    "Volkswagen Amarok 2016": "volkswagen-amarok-2016",
    "Volkswagen VIRTUS HIGHLINE 1": "volkswagen-virtus-highline-2018",
}


def base_de(nombre):
    """'Toyota YARIS S_(2).jpg' -> 'Toyota YARIS S'"""
    n = re.sub(r"\(\d\)", "", nombre)          # saca (1) (2) (3)
    n = re.sub(r"\.(jpe?g|png|6)$", "", n, flags=re.I)  # saca extensión (incl. .6)
    n = n.replace("_", " ")
    return re.sub(r"\s+", " ", n).strip()


def orden_de(nombre):
    """La foto sin número va primera; después (1), (2), (3)."""
    m = re.search(r"\((\d)\)", nombre)
    return int(m.group(1)) if m else 0


def main():
    if not ORIGEN or not ORIGEN.is_dir():
        sys.exit("Pasá la carpeta con las fotos como argumento.")

    DESTINO.mkdir(parents=True, exist_ok=True)

    grupos = {}
    for f in ORIGEN.iterdir():
        if not f.is_file():
            continue
        grupos.setdefault(base_de(f.name), []).append(f)

    for base, archivos in sorted(grupos.items()):
        slug = MAPEO.get(base)
        if not slug:
            print(f"  SIN MAPEO: '{base}' — se omite")
            continue
        archivos.sort(key=lambda p: orden_de(p.name))
        for i, f in enumerate(archivos, 1):
            im = Image.open(f).convert("RGB")
            if im.width > 1400:
                im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
            im.save(DESTINO / f"{slug}-{i}.webp", quality=82, method=6)
            im.save(DESTINO / f"{slug}-{i}.jpg", quality=84, optimize=True, progressive=True)
        print(f"  {slug}: {len(archivos)} fotos")


if __name__ == "__main__":
    main()
