import os
import sys
from pathlib import Path

NASKAH_DIR = Path("r:/flip-book/naskah-buku")
OUTPUT_FILE = NASKAH_DIR / "Suatu-Saat-Kamu-Akan-Membutuhkan_Naskah-Utuh.md"

BOOK_SECTIONS = [
    ("00_Prolog_Kata-Pengantar.md", "Prolog: Kata Pengantar"),
    ("Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md", "Bab 1: Anatomi Tubuh Energi & Memori Karma"),
    ("Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md", "Bab 2: Meretas Pikiran Bawah Sadar & Reprogramming Nasib"),
    ("Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md", "Bab 3: Sistem Hormon, Biohacking Leluhur & Energi Fisik"),
    ("Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md", "Bab 4: Fisika Kuantum, Relativitas & Keterhubungan Semesta"),
    ("Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md", "Bab 5: Menjadi Manusia Normal & Seni Berserah"),
    ("06_Epilog_Catatan-Penutup.md", "Epilog: Catatan Penutup"),
]

cover = """# 📚 SUATU SAAT KAMU AKAN MEMBUTUHKAN

## Risalah Kesadaran, Pikiran, & Realitas

---

**Narasumber**: Aldi (`@rahwanaconsciousnessroom`)
**Implementor**: Antigravity & OpenCode Sisyphus

**Sumber**: Transkrip Mentah (>120.000 Kata)
**Periode**: Mei 2025 — September 2026

---

> *"Kamu nggak perlu jadi orang suci. Kamu cuma perlu jadi manusia biasa yang hadir."*

---

"""

toc_lines = [
    "# 📑 DAFTAR ISI (Master Table of Contents)\n",
    "---\n",
]
for _, title in BOOK_SECTIONS:
    toc_lines.append(f"- **{title}**")
toc_lines.append("\n---\n")
toc = "\n".join(toc_lines)

parts = [cover, toc]

for filename, title in BOOK_SECTIONS:
    fp = NASKAH_DIR / filename
    if not fp.exists():
        continue
    with open(fp, "r", encoding="utf-8") as f:
        c = f.read()
    lines = c.split("\n")
    if lines and lines[0].startswith("# "):
        c = "\n".join(lines[1:]).lstrip()
    parts.append(f"\n# {title}\n\n" + c)
    parts.append("\n\n---\n\n")

full = "\n".join(parts)
while "\n\n\n\n" in full:
    full = full.replace("\n\n\n\n", "\n\n\n")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(full)

print(f"Compiled Naskah Utuh: {OUTPUT_FILE.stat().st_size:,} bytes")
