"""Blur ONLY personal contact info in SlideForge screenshot assets.

Per user feedback: messaging sequences, ICP configs, playbook settings,
insights, company names — all stay VISIBLE. Only person-level contact
info gets blurred:
  - Person names (first + last)
  - Person emails (e.g. ondrej.kun@dampsoft.de)
  - Phone numbers
  - LinkedIn person URLs

Reads originals from Pictures/Screenshots/, writes blurred versions
to public/assets/. Idempotent.
"""
from pathlib import Path
from PIL import Image, ImageFilter

SRC = Path(r"C:/Users/frede/Pictures/Screenshots")
OUT = Path(r"C:/Users/frede/Projects/slide-forge/public/assets")
BLUR_RADIUS = 14


def blur_to(src_name: str, out_path: Path, rects: list[tuple[int, int, int, int]]):
    img = Image.open(SRC / src_name).convert("RGBA")
    for rect in rects:
        x1, y1, x2, y2 = rect
        x1, x2 = max(0, x1), min(img.width, x2)
        y1, y2 = max(0, y1), min(img.height, y2)
        if x2 <= x1 or y2 <= y1:
            continue
        region = img.crop((x1, y1, x2, y2))
        blurred = region.filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))
        img.paste(blurred, (x1, y1))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out_path, "PNG")
    print(f"  {out_path.relative_to(OUT)}: {len(rects)} rect(s)  ({img.width}x{img.height})")


def copy_to(src_name: str, out_path: Path):
    """No blur needed — copy original 1:1."""
    img = Image.open(SRC / src_name).convert("RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG")
    print(f"  {out_path.relative_to(OUT)}: untouched (no PII)  ({img.width}x{img.height})")


# ---- B2B Tech ----

# playbook-overview.png — NO BLUR (Caya/Friendly Captcha = company refs, not personal contact)
copy_to("Screenshot 2026-04-15 153559.png", OUT / "b2b-tech/playbook-overview.png")

# icp-detail.png — NO BLUR (pure config)
copy_to("Screenshot 2026-04-15 153624.png", OUT / "b2b-tech/icp-detail.png")

# lead-liste.png (1633x1678) — only Name + Email columns. Company/Title/Grade visible.
blur_to("Screenshot 2026-04-15 155453.png", OUT / "b2b-tech/lead-liste.png", [
    (20, 50, 260, 1678),     # Name column (person names)
    (260, 50, 510, 1678),    # Email column (person emails)
])

# lead-detail.png (626x1963) — person name + insights body lines containing name.
# Headers (Pain Points / Solution Fit / Lead Relevance) + icons stay visible.
blur_to("Screenshot 2026-04-15 155253.png", OUT / "b2b-tech/lead-detail.png", [
    (15, 50, 350, 110),      # "Ondrej Kunz" name (below "1 of 50" pager)
])

# ai-emails.png (609x1557) — Subject (contains person name), Salutation, Signature.
# Body stays VISIBLE (whole point of showing the messaging sequence).
blur_to("Screenshot 2026-04-15 155300.png", OUT / "b2b-tech/ai-emails.png", [
    (40, 130, 595, 210),     # Email 1 subject (both lines if wrapped)
    (40, 210, 595, 255),     # Email 1 salutation "Hallo Ondrej,"
    (40, 790, 595, 870),     # Email 1 signature (Viele Grüße + Luca Ceglie)
    (40, 920, 595, 1000),    # Email 2 subject (both lines)
    (40, 1000, 595, 1045),   # Email 2 salutation "Hallo Ondrej,"
    (40, 1480, 595, 1557),   # Email 2 signature (to image bottom)
])

# ---- PV / Solar ----

# playbook-overview.png — NO BLUR
copy_to("Screenshot 2026-04-15 161014.png", OUT / "pv-solar/playbook-overview.png")

# icp-detail.png — NO BLUR
copy_to("Screenshot 2026-04-15 161053.png", OUT / "pv-solar/icp-detail.png")

# lead-liste.png (1639x1578) — Name + Email columns only
blur_to("Screenshot 2026-04-15 153656.png", OUT / "pv-solar/lead-liste.png", [
    (20, 5, 260, 1578),      # Name column
    (260, 5, 510, 1578),     # Email column
])

# lead-detail.png (631x1935) — Thomas Wimmer name + phone + email + LinkedIn
blur_to("Screenshot 2026-04-15 153715.png", OUT / "pv-solar/lead-detail.png", [
    (15, 50, 350, 110),      # "Thomas Wimmer" name
    (15, 895, 400, 935),     # email "info@staudinger-pflanzen.de"
    (15, 935, 400, 980),     # phone "+49 (0) 8724 / 356…"
    (15, 1410, 615, 1580),   # Pain Points body (contains "Thomas Wimmer")
    (15, 1605, 615, 1760),   # Solution Fit body
    (15, 1785, 615, 1935),   # Lead Relevance body (contains "Thomas Wimmer") to image bottom
])

# ai-emails.png (631x1758) — Subject, Salutation, Signature.
# Body stays visible (incl. dachpacht-direkt.de link — that's a CegTec client URL, not personal)
blur_to("Screenshot 2026-04-15 153730.png", OUT / "pv-solar/ai-emails.png", [
    (40, 130, 615, 220),     # Email 1 subject (both lines if wrapped)
    (40, 220, 615, 265),     # Email 1 salutation ("Sehr geehrter Herr Wimmer")
    (40, 910, 615, 1010),    # Email 1 signature
    (40, 1150, 615, 1230),   # Email 2 subject (both lines)
    (40, 1230, 615, 1275),   # Email 2 salutation
    # Email 2 signature is cut off below y=1758 — no blur needed
])

print("\nDone.")
