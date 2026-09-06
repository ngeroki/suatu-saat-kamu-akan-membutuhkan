import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
bp = json.load(open(BASE_DIR / 'src' / 'data' / 'book-pages.json', encoding='utf-8'))

print("=== ALL 14 SEMICOLONS IN PARAGRAPHS ===")
for p in bp:
    p_num = p['page_number']
    for idx, para in enumerate(p.get('paragraphs', [])):
        if ';' in para:
            print(f"\nPage {p_num} (para {idx+1}):")
            print(para)

print("\n" + "="*50 + "\n")
print("=== ALL COLONS IN PARAGRAPHS ===")
colon_count = 0
for p in bp:
    p_num = p['page_number']
    for idx, para in enumerate(p.get('paragraphs', [])):
        if ':' in para:
            colon_count += para.count(':')
            # Split into sentences or lines around colon
            for sent in para.split('. '):
                if ':' in sent:
                    print(f"Page {p_num}: {sent.strip()}")

print(f"\nTotal colons found in paragraphs: {colon_count}")
