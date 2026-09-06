import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/book-pages.json', encoding='utf-8') as f:
    bp = json.load(f)
with open('src/data/visual-narrative-74.json', encoding='utf-8') as f:
    vn = {x['page_number']: x for x in json.load(f)}

chapters = {}
for p in bp:
    c = p.get('chapter_code', 'UNKNOWN')
    chapters.setdefault(c, []).append(p)

for c_code, pages in chapters.items():
    print(f"\n=======================================================")
    print(f"EXAMINING {c_code}: {pages[0].get('chapter_name')}")
    print(f"=======================================================")
    for p in pages:
        num = p['page_number']
        v = vn.get(num, {})
        bp_title = p.get('title', '').strip()
        vn_title = v.get('title', '').strip()
        bp_text = " ".join(p.get('paragraphs', []))
        vc = v.get('visual_concept', '').strip()
        side_a = p.get('side_a_text', '').strip()

        # Check topic alignment
        print(f"\n--- [PAGE {num:02d}] ---")
        print(f"Book Title   : {bp_title}")
        print(f"Prompt Title : {vn_title}")
        print(f"Side A Quote : \"{side_a}\"")
        print(f"Naskah Topic : {bp_text[:160]}...")
        print(f"Visual Image : {vc[:160]}...")
