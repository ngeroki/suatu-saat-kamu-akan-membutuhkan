import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/book-pages.json', encoding='utf-8') as f:
    bp = json.load(f)
with open('src/data/visual-narrative-74.json', encoding='utf-8') as f:
    vn = {x['page_number']: x for x in json.load(f)}

for p in bp:
    num = p['page_number']
    v = vn.get(num, {})
    print(f"=== PAGE {num} [{p.get('chapter_code')}] ===")
    print(f"TITLE: {p.get('title')}")
    print(f"SUBTITLE: {p.get('subtitle')}")
    print(f"SIDE A TEXT: {p.get('side_a_text')}")
    print("NASKAH:")
    for idx, para in enumerate(p.get('paragraphs', [])):
        print(f"  ({idx+1}) {para}")
    print(f"VISUAL CONCEPT: {v.get('visual_concept')}")
    print(f"IMAGE PROMPT: {v.get('image_prompt')}")
    print("-" * 60)
