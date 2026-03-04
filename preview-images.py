import os
from PIL import Image
from pillow_heif import register_heif_opener
register_heif_opener()

SRC = "C:/Users/frede/Downloads/drive-download-20260302T150734Z-1-001/"
DEST = "C:/Users/frede/Projects/slide-forge/public/images/"

# Look at each image to understand what it shows
# Read a sample of the landscape images (most useful for presentation)
files = sorted([f for f in os.listdir(SRC) if f.lower().endswith(('.jpg','.jpeg','.png'))])

# Save thumbnails of the first batch for quick visual review
os.makedirs(os.path.join(DEST, "preview"), exist_ok=True)

for i, f in enumerate(files):
    try:
        path = os.path.join(SRC, f)
        img = Image.open(path)
        w, h = img.size
        # Save small preview
        img.thumbnail((300, 300))
        preview_name = f"{i:03d}_{os.path.splitext(f)[0][:30]}.jpg"
        img.convert("RGB").save(os.path.join(DEST, "preview", preview_name), "JPEG", quality=60)
    except Exception as e:
        pass

print(f"Saved {len(files)} previews to public/images/preview/")
print("View them at http://localhost:5173/images/preview/")
