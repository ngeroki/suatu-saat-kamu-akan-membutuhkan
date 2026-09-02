import os, re, json

chaps_meta = [
    (1, 'BAB 01', 'Anatomi Tubuh Energi & Memori Karma', 'Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md', 15),
    (2, 'BAB 02', 'Meretas Pikiran Bawah Sadar & Reprogramming Nasib', 'Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md', 15),
    (3, 'BAB 03', 'Sistem Hormon, Biohacking Leluhur & Energi Fisik', 'Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md', 15),
    (4, 'BAB 04', 'Fisika Kuantum, Relativitas & Keterhubungan Semesta', 'Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md', 14),
    (5, 'BAB 05', 'Menjadi Manusia Normal & Seni Berserah Diri', 'Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md', 15),
]

quotes_default = [
    'Kita adalah getaran yang memadat agar dapat menyentuh dunia.',
    'Di balik deja vu, tersimpan rekaman purba yang memanggilmu pulang.',
    'Setiap detak jantungmu memancarkan gelombang yang menyentuh semesta.',
    'Resonansi elektromagnetik menyatukan ruang dan ingatan.',
    'Tulang sulbi adalah benih abadi yang merekam perjalanan jiwamu.',
    'Mengurai karma dimulai dari keberanian menatap apa yang kau simpan dalam hening.',
    'Tujuh stasiun endokrin adalah gerbang kesadaran mikrokosmos raga.',
    'Bioelektrik tubuh adalah jembatan antara pikiran dan materi fisik.',
    'Cairan CSF adalah elevator cahaya menuju penyaksian batin.',
    'Dari kegelapan malam lahir pencerahan fajar yang sejati.',
    'Olah napas sadar mengalirkan kembali energi murni kehidupan.',
    'Jagat Gedhe dan Jagat Alit bernapas dalam satu kesatuan utuh.',
    'Tiga rahasia leluhur tersimpan rapi dalam sanepo rasa.',
    'Rekalibrasi raga adalah laku memulihkan fitrah manusia.',
    'Menyelami diri sendiri adalah menyelami rahasia semesta raya.'
]

global_p = 1
pages_list = []

for cid, cnum, ctitle, fname, pcount in chaps_meta:
    fpath = os.path.join(r'R:\flip-book\naskah-buku', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Split by headings
    sections = re.split(r'\n(?=##?\s+)', text)
    valid_sections = [s.strip() for s in sections if s.strip() and not s.strip().startswith('# \U0001f4da') and not s.strip().startswith('# 📖')]

    for pinchap in range(1, pcount + 1):
        sec = valid_sections[min(pinchap - 1, len(valid_sections) - 1)]
        lines = [l.strip() for l in sec.split('\n') if l.strip()]
        
        # Title from first heading
        title = 'Risalah Kesadaran'
        for l in lines:
            if l.startswith('#'):
                clean_h = re.sub(r'^[#\s\d\.\:\*\?\(\)\/]+', '', l).strip()
                if clean_h:
                    title = clean_h
                    break
        
        # Clean title
        title = title.replace('*', '').strip()
        if len(title) > 44:
            title = title[:42] + '...'

        # Extract paragraphs
        paras = []
        for l in lines:
            if not l.startswith('#') and not l.startswith('>') and len(l) > 25:
                # Clean markdown
                clean_p = re.sub(r'[\*\_\`]', '', l).strip()
                paras.append(clean_p)
                if len(paras) >= 3:
                    break

        if not paras:
            paras = ['Hening sejenak. Amati napas masuk dan keluar. Rasakan kehadiran raga di titik kini dan saat ini.']

        # Extract quote if blockquote exists
        quote_match = re.search(r'>\s*\"?([^\"]+?)\"?\s*(?:\n|$)', sec)
        if quote_match and len(quote_match.group(1)) > 15:
            q = quote_match.group(1).replace('*', '').strip()
            if len(q) > 85:
                q = q[:82] + '...'
        else:
            q = quotes_default[(global_p - 1) % len(quotes_default)]

        page_data = {
            'globalPage': global_p,
            'chapterId': cid,
            'chapterNum': cnum,
            'chapterTitle': ctitle,
            'pageInChap': pinchap,
            'totalInChap': pcount,
            'pageNumberDisplay': f'{pinchap:02d}',
            'title': title,
            'paragraphs': paras,
            'image': f'assets/pages/page_{global_p:02d}.jpg',
            'quote': q
        }
        pages_list.append(page_data)
        global_p += 1

print(f'Successfully built {len(pages_list)} sequential pages (1 to 74)!')

ts_header = """/**
 * SUATU SAAT v2 — Complete 74-Page Book Spread Dataset
 * Source of Truth: R:\\flip-book\\naskah-buku\\
 * Mapped sequentially without skipping!
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
    f.write(ts_header + json.dumps(pages_list, indent=2, ensure_ascii=False) + ts_footer)

print('Wrote complete R:\\flip-book\\src\\data\\spread-pages.ts!')
