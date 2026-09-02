import os, re, json

# Load all manuscript text
f_babs = [
    (1, 'Bab 01', 'Anatomi Tubuh Energi & Memori Karma', 'Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md', 15),
    (2, 'Bab 02', 'Meretas Pikiran Bawah Sadar & Reprogramming Nasib', 'Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md', 15),
    (3, 'Bab 03', 'Sistem Hormon, Biohacking Leluhur & Energi Fisik', 'Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md', 15),
    (4, 'Bab 04', 'Fisika Kuantum, Relativitas & Keterhubungan Semesta', 'Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md', 14),
    (5, 'Bab 05', 'Menjadi Manusia Normal & Seni Berserah Diri', 'Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md', 14),
    (6, 'PENUTUP', 'Aku Telah Pulang', '06_Epilog_Catatan-Penutup.md', 1),
]

all_pages = []
global_page = 1

for cid, cnum, ctitle, fname, pcount in f_babs:
    fpath = os.path.join(r'R:\flip-book\naskah-buku', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into sections by Markdown headings
    raw_sections = re.split(r'\n(?=#{2,4}\s+)', content)
    clean_sections = []
    for s in raw_sections:
        s = s.strip()
        if not s or s.startswith('# 📖') or s.startswith('# ?') or s.startswith('# SUATU') or s.startswith('# Prolog'):
            continue
        lines = [l.strip() for l in s.split('\n') if l.strip()]
        if not lines:
            continue
        heading = lines[0]
        # Extract title
        t = re.sub(r'^[#\s\d\.\:\*\?\(\)\/]+', '', heading).strip()
        t = t.replace('*', '').strip()
        if not t:
            continue
        # Extract text blocks
        paras = []
        for l in lines[1:]:
            if not l.startswith('#') and not l.startswith('>') and not l.startswith('|') and not l.startswith('-') and len(l) > 30:
                clean_l = re.sub(r'[\*\_\`]', '', l).strip()
                paras.append(clean_l)
        
        # Extract quote
        q_match = re.search(r'>\s*\"?([^\"]+?)\"?\s*(?:\n|$)', s)
        q = q_match.group(1).replace('*', '').strip() if q_match else None
        
        if paras:
            clean_sections.append((t, paras, q))

    print(f'{cnum} ({fname}): extracted {len(clean_sections)} authentic sections for {pcount} pages')

    # Now assign exactly pcount pages
    for i in range(pcount):
        sec_idx = int(i * len(clean_sections) / pcount)
        sec_idx = min(sec_idx, len(clean_sections) - 1)
        sec_title, sec_paras, sec_q = clean_sections[sec_idx]

        # Editorial title formatting (short & poetic, 2-3 lines max)
        t_clean = sec_title
        if len(t_clean) > 36:
            t_clean = t_clean[:34] + '...'

        # Editorial text: 1 powerful, concise paragraph (~45-75 words)
        raw_text = ' '.join(sec_paras[:2])
        words = raw_text.split()
        if len(words) > 55:
            # Cut at sentence boundary around 45-55 words
            shortened = ' '.join(words[:50])
            last_period = shortened.rfind('.')
            if last_period > 100:
                curated_text = shortened[:last_period + 1]
            else:
                curated_text = shortened + '...'
        else:
            curated_text = raw_text

        # Quote for right page overlay
        if not sec_q or len(sec_q) < 15 or len(sec_q) > 85:
            # Take a poignant sentence
            sec_q = words[0] if words else "Hening menyingkap rahasia semesta."
            if len(words) > 8:
                sec_q = ' '.join(words[:8]) + '.'

        page_in_chap = (i + 1) if cid <= 5 else 15
        total_in_chap = 15 if (cid in [1, 2, 3, 5, 6]) else 14
        actual_cid = 5 if cid == 6 else cid
        actual_cnum = "BAB 05" if cid == 6 else cnum

        page_obj = {
            'globalPage': global_page,
            'chapterId': actual_cid,
            'chapterNum': actual_cnum,
            'chapterTitle': ctitle if cid <= 5 else 'Menjadi Manusia Normal & Seni Berserah Diri',
            'pageInChap': page_in_chap,
            'totalInChap': total_in_chap,
            'pageNumberDisplay': f'{page_in_chap:02d}',
            'title': t_clean,
            'paragraphs': [curated_text],
            'image': f'assets/pages/page_{global_page:02d}.jpg',
            'quote': sec_q
        }
        all_pages.append(page_obj)
        global_page += 1

print(f'Total curated pages created: {len(all_pages)}')

# Write to src/data/spread-pages.ts
ts_header = """/**
 * SUATU SAAT v2 — Complete 74-Page Curated Dataset
 * Source of Truth: R:\\flip-book\\naskah-buku\\
 * Strictly formatted for mobile dual-spread reading without text overflow!
 */

export interface SpreadPage {
  globalPage: number;
  chapterId: number;
  chapterNum: string;
  chapterTitle: string;
  pageInChap: number;
  totalInChap: number;
  pageNumberDisplay: string;
  title: string;
  paragraphs: string[];
  image: string;
  quote: string;
}

export const BOOK_SPREAD_PAGES: SpreadPage[] = """

ts_footer = """;

export function getSpreadPage(chapId: number, pageInChap: number): SpreadPage {
  const found = BOOK_SPREAD_PAGES.find(p => p.chapterId === chapId && p.pageInChap === pageInChap);
  if (found) return found;
  const closest = BOOK_SPREAD_PAGES.find(p => p.chapterId === chapId);
  return closest || BOOK_SPREAD_PAGES[0];
}

export function getSpreadPageByGlobal(globalPage: number): SpreadPage {
  const found = BOOK_SPREAD_PAGES.find(p => p.globalPage === globalPage);
  return found || BOOK_SPREAD_PAGES[0];
}
"""

with open(r'R:\flip-book\src\data\spread-pages.ts', 'w', encoding='utf-8') as f:
    f.write(ts_header + json.dumps(all_pages, indent=2, ensure_ascii=False) + ts_footer)

print('Successfully updated R:\\flip-book\\src\\data\\spread-pages.ts!')
