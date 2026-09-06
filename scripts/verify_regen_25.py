import json
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
book_pages = json.load(open(BASE_DIR / 'src' / 'data' / 'book-pages.json', encoding='utf-8'))
bp_map = {p['page_number']: p for p in book_pages}

targets = [4, 6, 7, 9, 24, 32, 33, 34, 35, 36, 38, 39, 41, 42, 43, 44, 54, 61, 63, 64, 65, 66, 67, 69, 70]
untouched_samples = [2, 3, 10, 14, 17]

print('=== VERIFYING TARGET PAGES ===')
all_ok = True
for t in targets:
    p = bp_map[t]
    slide_rel = p['image_path'].lstrip('/')
    thumb_rel = p.get('thumbnail', slide_rel.replace('slides-portrait', 'thumbnails').replace('slide-', 'thumb-')).lstrip('/')
    
    slide_file = BASE_DIR / 'public' / slide_rel
    thumb_file = BASE_DIR / 'public' / thumb_rel
    
    if not slide_file.exists():
        print(f'FAIL: Slide missing for Page {t}: {slide_file}')
        all_ok = False
        continue
    if not thumb_file.exists():
        print(f'FAIL: Thumb missing for Page {t}: {thumb_file}')
        all_ok = False
        continue
        
    with Image.open(slide_file) as im:
        w, h = im.size
        fmt = im.format
    size_mb = slide_file.stat().st_size / 1024 / 1024
    thumb_kb = thumb_file.stat().st_size / 1024
    
    is_9_16 = abs((w / h) - (9 / 16)) < 0.05
    title = p['title'][:32]
    print(f'P{t:02d}: OK | {w}x{h} ({fmt}, {size_mb:.2f} MB, 9:16={is_9_16}) | Thumb: {thumb_kb:.1f} KB | {title}')

print('\n=== VERIFYING UNTOUCHED PAGES ===')
for u in untouched_samples:
    p = bp_map[u]
    slide_rel = p['image_path'].lstrip('/')
    slide_file = BASE_DIR / 'public' / slide_rel
    title = p['title'][:32]
    print(f'P{u:02d} (Untouched): exists={slide_file.exists()} | size={slide_file.stat().st_size / 1024 / 1024:.2f} MB | {title}')

print(f'\nAll target pages verified successfully: {all_ok}')
