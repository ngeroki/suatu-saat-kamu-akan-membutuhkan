import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

pages = json.load(open(BASE / 'src' / 'data' / 'book-pages.json', encoding='utf-8'))
img_paths = set(p.get('image_path', '') for p in pages)
thumb_paths = set(p.get('thumbnail', '') for p in pages)

print("=== BOOK-PAGES.JSON REFERENCES ===")
print("Distinct image_paths count:", len(img_paths))
print("Sample image_paths:", list(img_paths)[:5])
print("Distinct thumbnails count:", len(thumb_paths))
print("Sample thumbnails:", list(thumb_paths)[:5])

src_files = list((BASE / 'src').rglob('*.ts')) + list((BASE / 'src').rglob('*.css')) + [BASE / 'index.html']
print("\n=== SOURCE CODE REFERENCES IN SRC/ ===")
for kw in ['slides-portrait', 'slides/', 'thumbnails', 'audio', 'assets']:
    hits = []
    for sf in src_files:
        content = sf.read_text(encoding='utf-8', errors='ignore')
        if kw in content:
            hits.append(str(sf.relative_to(BASE)))
    print(f"Keyword '{kw}': {hits}")

print("\n=== AUDITING PUBLIC/ASSETS ===")
pub_assets = BASE / 'public' / 'assets'
if pub_assets.exists():
    asset_files = list(pub_assets.rglob('*'))
    print("Files in public/assets:", len([f for f in asset_files if f.is_file()]))
    for f in [f for f in asset_files if f.is_file()][:10]:
        print("  -", f.relative_to(pub_assets))

print("\n=== AUDITING PUBLIC/SLIDES (LANDSCAPE/ORIGINAL) ===")
pub_slides = BASE / 'public' / 'slides'
if pub_slides.exists():
    slides_files = list(pub_slides.rglob('*'))
    print("Files in public/slides:", len([f for f in slides_files if f.is_file()]))
    for f in [f for f in slides_files if f.is_file()][:10]:
        print("  -", f.relative_to(pub_slides))

print("\n=== AUDITING PUBLIC/AUDIO ===")
pub_audio = BASE / 'public' / 'audio'
if pub_audio.exists():
    for f in pub_audio.iterdir():
        print(f"  - {f.name} ({f.stat().st_size / 1024:.1f} KB)")
