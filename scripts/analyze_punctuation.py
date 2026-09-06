import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
bp = json.load(open(BASE_DIR / 'src' / 'data' / 'book-pages.json', encoding='utf-8'))

with open(BASE_DIR / 'scripts' / 'punctuation_inventory.txt', 'w', encoding='utf-8') as out:
    out.write("=== INVENTORY OF ALL SEMICOLONS (;) IN PARAGRAPHS ===\n")
    for p in bp:
        p_num = p['page_number']
        for idx, para in enumerate(p.get('paragraphs', [])):
            if ';' in para:
                out.write(f"Page {p_num} [para {idx+1}]:\n{para}\n\n")

    out.write("\n" + "="*70 + "\n")
    out.write("=== INVENTORY OF ALL COLONS (:) IN PARAGRAPHS ===\n")
    for p in bp:
        p_num = p['page_number']
        for idx, para in enumerate(p.get('paragraphs', [])):
            if ':' in para:
                out.write(f"Page {p_num} [para {idx+1}]:\n{para}\n\n")

    out.write("\n" + "="*70 + "\n")
    out.write("=== INVENTORY OF ALL COLONS/SEMICOLONS IN SIDE_A_TEXT ===\n")
    for p in bp:
        p_num = p['page_number']
        t = p.get('side_a_text', '')
        if ':' in t or ';' in t:
            out.write(f"Page {p_num}: {t}\n")

print("Wrote punctuation inventory to scripts/punctuation_inventory.txt")
