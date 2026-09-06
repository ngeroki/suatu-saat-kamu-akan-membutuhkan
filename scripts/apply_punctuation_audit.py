import json
from pathlib import Path
from prepare_punctuation_fixes import REPLACEMENTS

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Update src/data/book-pages.json
bp_path = BASE_DIR / 'src' / 'data' / 'book-pages.json'
book_pages = json.load(open(bp_path, encoding='utf-8'))

para_changes = 0
text_changes = 0

for p in book_pages:
    # A. Update paragraphs
    new_paragraphs = []
    p_changed = False
    for para in p.get('paragraphs', []):
        curr_para = para
        for old_sub, new_sub in REPLACEMENTS:
            if old_sub in curr_para:
                curr_para = curr_para.replace(old_sub, new_sub)
                p_changed = True
        new_paragraphs.append(curr_para)
    if p_changed:
        p['paragraphs'] = new_paragraphs
        para_changes += 1

    # B. Update text field
    curr_text = p.get('text', '')
    t_changed = False
    for old_sub, new_sub in REPLACEMENTS:
        if old_sub in curr_text:
            curr_text = curr_text.replace(old_sub, new_sub)
            t_changed = True
    if t_changed:
        p['text'] = curr_text
        text_changes += 1

    # C. Update side_a_text if Page 7 or 14
    p_num = p['page_number']
    if p_num == 7:
        p['side_a_text'] = "Habis mandi kadang badan terasa lebih enteng. Coba perhatikan, yang berubah cuma badanmu, atau pikiranmu juga ikut agak longgar?"
    elif p_num == 14:
        p['side_a_text'] = "Besok kalau ada orang nyebelin di jalan, tanganmu biasanya lebih cepat mana, pencet klakson atau ngerem dulu? Tiga detik itu kelihatannya sebentar."

with open(bp_path, 'w', encoding='utf-8') as f:
    json.dump(book_pages, f, indent=2, ensure_ascii=False)

print(f"Applied fixes to book-pages.json: {para_changes} pages updated in paragraphs, {text_changes} pages updated in text.")

# 2. Update docs/visual-narratives/bab-01.json for Page 7 and Page 14
bab1_path = BASE_DIR / 'docs' / 'visual-narratives' / 'bab-01.json'
bab1_items = json.load(open(bab1_path, encoding='utf-8'))
for item in bab1_items:
    if item['page_number'] == 7:
        item['side_a_text'] = "Habis mandi kadang badan terasa lebih enteng. Coba perhatikan, yang berubah cuma badanmu, atau pikiranmu juga ikut agak longgar?"
        item['self_reflection_check'] = item['side_a_text']
    elif item['page_number'] == 14:
        item['side_a_text'] = "Besok kalau ada orang nyebelin di jalan, tanganmu biasanya lebih cepat mana, pencet klakson atau ngerem dulu? Tiga detik itu kelihatannya sebentar."
        item['self_reflection_check'] = item['side_a_text']

with open(bab1_path, 'w', encoding='utf-8') as f:
    json.dump(bab1_items, f, indent=2, ensure_ascii=False)
print("Updated bab-01.json for Pages 7 & 14.")

# 3. Update docs/self-reflection-stage-storytelling.md
md_doc = BASE_DIR / 'docs' / 'self-reflection-stage-storytelling.md'
md_txt = md_doc.read_text(encoding='utf-8')
md_txt = md_txt.replace(
    "Coba perhatikan: yang berubah cuma badanmu,",
    "Coba perhatikan, yang berubah cuma badanmu,"
)
md_txt = md_txt.replace(
    "tanganmu biasanya lebih cepat mana: pencet klakson",
    "tanganmu biasanya lebih cepat mana, pencet klakson"
)
md_doc.write_text(md_txt, encoding='utf-8')
print("Updated docs/self-reflection-stage-storytelling.md.")
