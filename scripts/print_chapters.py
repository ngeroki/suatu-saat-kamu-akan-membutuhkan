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
    title = p.get('title', '')
    paras = p.get('paragraphs', [])
    vc = v.get('visual_concept', '')
    prompt = v.get('image_prompt', '')
    side_a = p.get('side_a_text', '')

    print(f"=== [PAGE {num:02d}] {p.get('chapter_code')} | {title} ===")
    print(f"Side A Overlay: \"{side_a}\"")
    print(f"Visual Concept: {vc}")
    print(f"Prompt: {prompt[:120]}...")
    print("Full Naskah:")
    for idx, par in enumerate(paras):
        print(f"  [{idx+1}] {par}")
    print("-" * 75)
