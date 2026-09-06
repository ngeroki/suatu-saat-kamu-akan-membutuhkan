import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public"
ARCHIVE_DIR = BASE_DIR / "storage" / "archive_legacy_public"
ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)

print("=== CLEANING UP PUBLIC/ LEGACY ASSETS ===")

# 1. Archive public/slides/ (~190 MB)
slides_dir = PUBLIC_DIR / "slides"
if slides_dir.exists():
    dest = ARCHIVE_DIR / "slides"
    if dest.exists():
        shutil.rmtree(dest)
    shutil.move(str(slides_dir), str(dest))
    print(f"[MOVED] public/slides/ -> {dest.relative_to(BASE_DIR)}")

# 2. Archive public/assets/pages/ (~67 MB)
assets_pages_dir = PUBLIC_DIR / "assets" / "pages"
if assets_pages_dir.exists():
    dest = ARCHIVE_DIR / "assets_pages"
    if dest.exists():
        shutil.rmtree(dest)
    shutil.move(str(assets_pages_dir), str(dest))
    print(f"[MOVED] public/assets/pages/ -> {dest.relative_to(BASE_DIR)}")

# 3. Archive legacy timestamped files and unreferenced jpgs in public/assets/
KEEP_ASSETS = {
    "hero_bg.jpg",
    "prolog_warkop.jpg",
    "epilog_keluarga.jpg",
    "bab_01_torus.jpg",
    "bab_02_theta.jpg",
    "bab_03_biohack.jpg",
    "bab_04_kuantum.jpg",
    "bab_05_berserah.jpg",
}

assets_dir = PUBLIC_DIR / "assets"
if assets_dir.exists():
    archive_assets = ARCHIVE_DIR / "assets_unreferenced"
    archive_assets.mkdir(parents=True, exist_ok=True)
    for f in list(assets_dir.iterdir()):
        if f.is_file() and f.name not in KEEP_ASSETS:
            dest_file = archive_assets / f.name
            shutil.move(str(f), str(dest_file))
            print(f"[MOVED] public/assets/{f.name} -> {dest_file.relative_to(BASE_DIR)}")

# 4. Archive public/thumbnails/thumbnails.zip (7.1 MB)
thumb_zip = PUBLIC_DIR / "thumbnails" / "thumbnails.zip"
if thumb_zip.exists():
    dest_zip = ARCHIVE_DIR / "thumbnails.zip"
    shutil.move(str(thumb_zip), str(dest_zip))
    print(f"[MOVED] public/thumbnails/thumbnails.zip -> {dest_zip.relative_to(BASE_DIR)}")

print("\n=== CLEANUP FINISHED ===")
