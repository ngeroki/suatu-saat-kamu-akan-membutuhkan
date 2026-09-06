import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/book-pages.json', encoding='utf-8') as f:
    bp = json.load(f)
with open('src/data/visual-narrative-74.json', encoding='utf-8') as f:
    vn = {x['page_number']: x for x in json.load(f)}

print("=== CHECKING ALL 74 PAGES: NASKAH TOPIC VS VISUAL IMAGE ===")

for p in bp:
    num = p['page_number']
    v = vn.get(num, {})
    title = p.get('title', '')
    paras = " ".join(p.get('paragraphs', []))
    vc = v.get('visual_concept', '')
    prompt = v.get('image_prompt', '')
    side_a = p.get('side_a_text', '')

    print(f"P{num:02d} [{p.get('chapter_code')}]: {title}")
    print(f"  Naskah preview: {paras[:180]}...")
    print(f"  Visual Concept: {vc}")
    print(f"  Prompt preview: {prompt[:150]}...")
    print()
