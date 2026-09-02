import json

with open(r'R:\flip-book\src\data\spread-pages.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('BOOK_SPREAD_PAGES: SpreadPage[] = ') + len('BOOK_SPREAD_PAGES: SpreadPage[] = ')
end = text.find(';\n\nexport function')
data = json.loads(text[start:end].strip())

# Specifically format landmark pages to match mockup exactly:
for p in data:
    # Bab 2 Page 7 (Matches Mockup media_1788368709063.png)
    if p['chapterId'] == 2 and p['pageInChap'] == 7:
        p['pageNumberDisplay'] = "02"
        p['title'] = "Zona Theta:\nPintu Masuk ke\nPikiran Bawah Sadar"
        p['paragraphs'] = [
            "Di antara sadar dan tidur, ada ruang sunyi yang sangat kuat. Di sanalah perubahan dimulai."
        ]
        p['image'] = "assets/bab_02_theta.jpg"
        p['quote'] = "Ketika pikiran tenang, realitas mulai terbuka."

    # Bab 1 Page 1 (Opening Cover)
    elif p['chapterId'] == 1 and p['pageInChap'] == 1:
        p['pageNumberDisplay'] = "01"
        p['title'] = "Anatomi Tubuh Energi &\nMemori Karma"
        p['paragraphs'] = [
            "Kita ini makhluk energi yang memadat menjadi materi. Medan getaran ini berdenyut menembus batas raga fisik."
        ]
        p['image'] = "assets/bab_01_torus.jpg"
        p['quote'] = "Kita adalah getaran yang memadat agar dapat menyentuh dunia."

    # Bab 1 Page 2 (Obrolan Pinggir Jurang)
    elif p['chapterId'] == 1 and p['pageInChap'] == 2:
        p['pageNumberDisplay'] = "02"
        p['title'] = "Obrolan Pinggir Jurang &\nMisteri Deja Vu"
        p['paragraphs'] = [
            "Pernahkah kamu mendatangi tempat baru lalu dadamu berdesir hebat? Seolah ada rekaman purba yang memanggilmu pulang."
        ]
        p['image'] = "assets/pages/page_02.jpg"
        p['quote'] = "Di balik deja vu, tersimpan ingatan purba tentang rumah sejati."

    # Bab 3 Page 1
    elif p['chapterId'] == 3 and p['pageInChap'] == 1:
        p['pageNumberDisplay'] = "01"
        p['title'] = "Sistem Hormon &\nBiohacking Leluhur"
        p['paragraphs'] = [
            "Raga manusia adalah laboratorium biokimia terhebat. Leluhur Nusantara memahami ritme penyelarasan sel tanpa butuh laboratorium modern."
        ]
        p['image'] = "assets/bab_03_biohack.jpg"
        p['quote'] = "Raga adalah kuil suci; rawatlah kimianya dengan kearifan alam."

    # Bab 4 Page 1
    elif p['chapterId'] == 4 and p['pageInChap'] == 1:
        p['pageNumberDisplay'] = "01"
        p['title'] = "Fisika Kuantum &\nKeterhubungan Semesta"
        p['paragraphs'] = [
            "Tidak ada yang benar-benar terpisah di alam semesta ini. Partikel atom yang pernah bersentuhan akan terhubung selamanya."
        ]
        p['image'] = "assets/bab_04_kuantum.jpg"
        p['quote'] = "Semesta tidak berada di luar dirimu; semesta bernapas di dalam dadamu."

    # Bab 5 Page 1
    elif p['chapterId'] == 5 and p['pageInChap'] == 1:
        p['pageNumberDisplay'] = "01"
        p['title'] = "Menjadi Manusia Normal &\nSeni Berserah"
        p['paragraphs'] = [
            "Puncak dari seluruh perjalanan batin bukanlah menjadi sakti atau melayang di awan, melainkan menjadi manusia normal yang sadar utuh."
        ]
        p['image'] = "assets/bab_05_berserah.jpg"
        p['quote'] = "Menjadi manusia normal yang sadar utuh—itulah puncak perjalanan."

    # Penutup Page 74
    elif p['globalPage'] == 74:
        p['pageNumberDisplay'] = "15"
        p['title'] = "Aku Telah Pulang:\nTitik Nol Keheningan"
        p['paragraphs'] = [
            "Perjalanan telah genap. Pulanglah ke dalam dirimu sendiri setiap kali dunia bising. Di sanalah rumah abadi yang tak pernah runtuh."
        ]
        p['image'] = "assets/closing_landscape.jpg"
        p['quote'] = "Aku telah pulang. Ke dalam hening yang memeluk segalanya."

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
    f.write(ts_header + json.dumps(data, indent=2, ensure_ascii=False) + ts_footer)

print('Successfully refined landmark pages!')
