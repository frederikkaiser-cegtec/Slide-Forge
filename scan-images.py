import os, sys
from PIL import Image
from pillow_heif import register_heif_opener
register_heif_opener()

SRC = "C:/Users/frede/Downloads/drive-download-20260302T150734Z-1-001/"
DEST = "C:/Users/frede/Projects/slide-forge/public/images/"
os.makedirs(DEST, exist_ok=True)

# Also convert HEIC team photo
try:
    heic = Image.open("C:/Users/frede/Downloads/IMG_9791.HEIC")
    heic = heic.convert("RGB")
    heic.thumbnail((1200, 1200))
    heic.save(os.path.join(DEST, "team-founders.jpg"), "JPEG", quality=80)
    print(f"team-founders.jpg: {heic.size[0]}x{heic.size[1]} (HEIC converted)")
except Exception as e:
    print(f"HEIC error: {e}")

# Scan all images, print size and a preview description
files = sorted([f for f in os.listdir(SRC) if f.lower().endswith(('.jpg','.jpeg','.png'))])
print(f"\n{len(files)} images found. Scanning sizes...\n")

categories = {
    'large_landscape': [],  # Good for backgrounds / hero
    'large_square': [],     # Good for featured images
    'small': [],            # Thumbnails
    'portrait': [],         # Portrait orientation
}

for f in files:
    try:
        path = os.path.join(SRC, f)
        img = Image.open(path)
        w, h = img.size
        size_kb = os.path.getsize(path) // 1024
        ratio = w / h if h > 0 else 1

        cat = 'small'
        if w >= 1000 or h >= 1000:
            if ratio > 1.3:
                cat = 'large_landscape'
            elif ratio < 0.77:
                cat = 'portrait'
            else:
                cat = 'large_square'

        categories[cat].append((f, w, h, size_kb))
    except:
        pass

for cat, items in categories.items():
    print(f"=== {cat.upper()} ({len(items)}) ===")
    for f, w, h, kb in items[:15]:
        print(f"  {w}x{h} {kb}KB  {f}")
    if len(items) > 15:
        print(f"  ... and {len(items)-15} more")
    print()
