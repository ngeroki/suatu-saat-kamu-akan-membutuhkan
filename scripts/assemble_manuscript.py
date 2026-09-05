import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

dir_path = r"r:\flip-book\naskah-buku"
files = [
    "00_Prolog_Kata-Pengantar.md",
    "Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md",
    "Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md",
    "Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md",
    "Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md",
    "Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md",
    "06_Epilog_Catatan-Penutup.md"
]

header = """# 📚 SUATU SAAT KAMU AKAN MEMBUTUHKAN

## Risalah Kesadaran, Pikiran, & Realitas

---

**Narasumber**: Aldi (@rahwanaconsciousnessroom)  
**Edisi**: Naskah Kurasi & Editorial Sastrawi Nusantara  
**Sumber**: 42 Transkrip Mentah & Korpus Otentik  

---

> *"Kamu nggak perlu jadi orang suci. Kamu cuma perlu jadi manusia biasa yang hadir."*

---

# 📑 DAFTAR ISI (Master Table of Contents)

---

- **Prolog: Kata Pengantar**
- **Bab 1: Anatomi Tubuh Energi & Memori Karma**
- **Bab 2: Meretas Pikiran Bawah Sadar & Reprogramming Nasib**
- **Bab 3: Sistem Hormon, Biohacking Leluhur & Energi Fisik**
- **Bab 4: Fisika Kuantum, Relativitas & Keterhubungan Semesta**
- **Bab 5: Menjadi Manusia Normal & Seni Berserah Diri**
- **Epilog: Catatan Penutup**

---
"""

parts = []
for f in files:
    with open(os.path.join(dir_path, f), "r", encoding="utf-8") as fp:
        parts.append(fp.read().strip())

full_text = header + "\n\n" + "\n\n---\n\n".join(parts) + "\n"

out_path = os.path.join(dir_path, "Suatu-Saat-Kamu-Akan-Membutuhkan_Naskah-Utuh.md")
with open(out_path, "w", encoding="utf-8") as fp:
    fp.write(full_text)

print("Assembled master manuscript successfully!")
print("Words:", len(full_text.split()))
print("Em-dashes:", full_text.count("\u2014"))
print("En-dashes:", full_text.count("\u2013"))
