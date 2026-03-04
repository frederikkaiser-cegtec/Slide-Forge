import os
from PIL import Image
from pillow_heif import register_heif_opener
register_heif_opener()

SRC = "C:/Users/frede/Downloads/drive-download-20260302T150734Z-1-001/"
DEST = "C:/Users/frede/Projects/slide-forge/public/images/"
os.makedirs(DEST, exist_ok=True)

# NUR Gewerbedächer — keine Wohnhäuser
SELECTIONS = [
    # s01: Hero — Gewerbedach Flachdach mit Solar, blauer Himmel (Drohne)
    ("2ede7227-5291-4da3-a4e0-4737958006e0.JPG", "hero-gewerbedach.jpg", 1400, 80),
    # s02: Potenzial — Große Gewerbehalle Drohne-Aufnahme
    ("dji_fly_20250514_155328_0045_1747296832990_photo.jpg", "aerial-gewerbedach.jpg", 1400, 80),
    # s03: Über uns — Sonnenuntergang über Gewerbedach
    ("IMG_6307.PNG", "sunset-gewerbedach.jpg", 1400, 80),
    # s04: Pachtvarianten — Lagerhalle mit Dach-Solar (Drohne)
    ("IMG_2409.PNG", "lagerhalle-solar.jpg", 1200, 75),
    # s05: Einnahmebeispiele — Gewerbedach mit Stadtblick
    ("4a98e978-293d-4895-acac-0025dec88ea1(1).JPG", "gewerbedach-cityview.jpg", 1200, 75),
    # s06: Rahmenbedingungen — Flachdach Montageschienen (Vorbereitung)
    ("IMG_7992.JPG", "montageschienen.jpg", 1200, 75),
    # s07: Vorteile — Fertige Anlage, schöne Wolken, Flachdach
    ("IMG_8010.JPG", "flachdach-fertig.jpg", 1200, 75),
    # s08: Absicherung — Dramatische Wolken über Gewerbedach-Solar
    ("IMG_8006.JPG", "dramatisch-gewerbedach.jpg", 1200, 75),
    # s09: Qualität — Nahaufnahme Panels Gewerbedach + Große Installation
    ("A924013B-7532-4ED1-B252-C465EB101E33.jpg", "closeup-gewerbepanels.jpg", 1000, 75),
    ("IMG_7997.JPG", "grosse-installation.jpg", 1000, 75),
    # s10: Referenzprojekt — Gewerbegebäude Drohne (Hallendach)
    ("dji_fly_20250514_155542_0051_1747296804032_photo.jpg", "referenz-hallendach.jpg", 1200, 75),
    # s11: Referenzkunden — Gewerbe-Drohnenaufnahme
    ("dji_fly_20250514_155434_0048_1747296820219_photo.jpg", "referenz-gewerbe-aerial.jpg", 1200, 75),
    # s12: Alles aus einer Hand — Installation auf Flachdach (Montagephase)
    ("IMG_7995.JPG", "installation-montage.jpg", 1200, 75),
    # s13: 4 Schritte — Sonnenuntergang Flachdach Installation
    ("IMG_8001.JPG", "installation-sunset.jpg", 1200, 75),
    # s14: Closing — Gewerbedach Drohne, mehrere Gebäude
    ("dji_fly_20250514_155510_0050_1747296810749_photo.jpg", "closing-gewerbe-aerial.jpg", 1400, 80),
    # Extra: Großes Gewerbedach mit Panels, bewölkt aber eindrucksvoll
    ("5ccceeeb-4ea5-415f-b56c-d08d84de324d(1).JPG", "gewerbedach-gross.jpg", 1200, 75),
    # Extra: Flachdach fertige Anlage, dramatischer Himmel
    ("IMG_8008.JPG", "flachdach-dramatisch.jpg", 1200, 75),
    # Extra: Flachdach von oben, Sonnenuntergang
    ("IMG_8014.JPG", "flachdach-sunset2.jpg", 1200, 75),
    # Extra: Dachkante mit Panels, Abendstimmung
    ("IMG_8016.JPG", "dachkante-abend.jpg", 1200, 75),
]

total = 0
for src_name, dest_name, max_size, quality in SELECTIONS:
    src_path = os.path.join(SRC, src_name)
    dest_path = os.path.join(DEST, dest_name)
    try:
        img = Image.open(src_path)
        img = img.convert("RGB")
        img.thumbnail((max_size, max_size))
        img.save(dest_path, "JPEG", quality=quality)
        w, h = img.size
        kb = os.path.getsize(dest_path) // 1024
        print(f"  {dest_name}: {w}x{h} ({kb}KB)")
        total += 1
    except Exception as e:
        print(f"  ERROR {src_name}: {e}")

print(f"\nDone! {total} Gewerbe-Bilder saved to public/images/")
