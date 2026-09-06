import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Parse markdown file
md_path = BASE_DIR / 'docs' / 'self-reflection-stage-storytelling.md'
content = md_path.read_text(encoding='utf-8')

pattern = re.compile(r'## PAGE (\d+)\s*\n\s*(.*?)(?=\n## PAGE |\Z)', re.DOTALL)
matches = pattern.findall(content)

storytelling_map = {}
for p_str, text in matches:
    p_num = int(p_str)
    # Clean whitespace and single paragraph newlines
    clean_text = ' '.join(text.strip().split())
    storytelling_map[p_num] = clean_text

print(f"Total pages parsed: {len(storytelling_map)}")
assert len(storytelling_map) == 74, f"Expected 74 pages, found {len(storytelling_map)}"

for i in range(1, 75):
    assert i in storytelling_map, f"Page {i} missing from storytelling map!"

# 2. Patch src/data/book-pages.json
bp_path = BASE_DIR / 'src' / 'data' / 'book-pages.json'
book_pages = json.load(open(bp_path, encoding='utf-8'))

bp_changed = 0
for page in book_pages:
    p_num = page['page_number']
    new_text = storytelling_map[p_num]
    if page.get('side_a_text') != new_text:
        page['side_a_text'] = new_text
        bp_changed += 1

with open(bp_path, 'w', encoding='utf-8') as f:
    json.dump(book_pages, f, indent=2, ensure_ascii=False)
print(f"Updated src/data/book-pages.json: {bp_changed} pages changed.")

# 3. Patch docs/visual-narratives/bab-0*.json
vn_changed = 0
for chap_num in range(1, 6):
    json_path = BASE_DIR / 'docs' / 'visual-narratives' / f'bab-0{chap_num}.json'
    items = json.load(open(json_path, encoding='utf-8'))
    
    for item in items:
        p_num = item['page_number']
        new_text = storytelling_map[p_num]
        item['side_a_text'] = new_text
        item['self_reflection_check'] = new_text
        vn_changed += 1
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    print(f"Patched {json_path.name}")

print(f"Updated docs/visual-narratives: {vn_changed} pages processed.")
