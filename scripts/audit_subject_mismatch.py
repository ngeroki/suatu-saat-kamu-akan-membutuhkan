import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/book-pages.json', encoding='utf-8') as f:
    bp = json.load(f)
with open('src/data/visual-narrative-74.json', encoding='utf-8') as f:
    vn = {x['page_number']: x for x in json.load(f)}

print("AUDITING PAGE BY PAGE: IDENTIFYING SUBJECT MISMATCHES")

disconnects = []

for p in bp:
    num = p['page_number']
    v = vn.get(num, {})
    title = p.get('title', '')
    paras_text = " ".join(p.get('paragraphs', []))
    vc = v.get('visual_concept', '')
    prompt = v.get('image_prompt', '')
    side_a = p.get('side_a_text', '')

    # Print out summary for each page
    # Let's assess:
    # 1. Main subject of text
    # 2. Main subject of image
    # 3. Does image depict text?
    print(f"[{num:02d}] {title}")
    print(f"  TEXT TOPIC   : {paras_text[:140]}...")
    print(f"  IMAGE SUBJECT: {vc[:140]}...")
    print(f"  SIDE A TEXT  : {side_a}")
    print()
