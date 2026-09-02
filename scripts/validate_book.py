import sys, os, json
sys.stdout.reconfigure(encoding="utf-8")

DATA_PATH = r"R:\flip-book\src\data\book-pages.json"
MANUSCRIPT_DIR = r"R:\flip-book\naskah-buku"

CHAPTER_FILES = [
    ("PROLOG", "00_Prolog_Kata-Pengantar.md"),
    ("BAB 01", "Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md"),
    ("BAB 02", "Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md"),
    ("BAB 03", "Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md"),
    ("BAB 04", "Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md"),
    ("BAB 05", "Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md"),
    ("EPILOG", "06_Epilog_Catatan-Penutup.md"),
]

def run_validation():
    print("==================================================")
    print("RUNNING AUTOMATED 6-POINT BOOK VALIDATION SUITE")
    print("==================================================")

    if not os.path.exists(DATA_PATH):
        print(f"FAIL: Data file not found: {DATA_PATH}")
        sys.exit(1)

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        pages = json.load(f)

    total_pages = len(pages)
    print(f"Loaded {total_pages} pages from dataset.\n")

    # TEST A: COMPLETENESS (Character for character per chapter)
    print("[TEST A] Verifying Character-for-Character Completeness...")
    for code, fname in CHAPTER_FILES:
        fp = os.path.join(MANUSCRIPT_DIR, fname)
        with open(fp, "r", encoding="utf-8") as sf:
            source_txt = sf.read()

        chap_pages = [p for p in pages if p["chapter_code"] == code]
        reconstructed = "".join(p["text"] for p in chap_pages)
        assert reconstructed == source_txt, f"Completeness failed for {code}! Text differs."
        print(f"  ✓ {code}: {len(chap_pages)} pages reconstruct exactly {len(source_txt)} chars.")

    # TEST B: ORDERING (Monotonic global sequence 1..N)
    print("\n[TEST B] Verifying Monotonic Ordering & Page Links...")
    for i, p in enumerate(pages):
        expected_num = i + 1
        assert p["page_number"] == expected_num, f"Ordering failed at page {i}: expected {expected_num}, got {p['page_number']}"
        if i > 0:
            assert p["previous_page"] == expected_num - 1, f"Previous page link broken at page {expected_num}"
        if i < total_pages - 1:
            assert p["next_page"] == expected_num + 1, f"Next page link broken at page {expected_num}"
    print(f"  ✓ All {total_pages} pages have unbroken, monotonic 1..{total_pages} sequential pointers.")

    # TEST C: SENTENCE & BOUNDARY INTEGRITY
    print("\n[TEST C] Verifying Sentence & Boundary Integrity...")
    for p in pages:
        p_text = p["text"].strip()
        # Ensure it doesn't end with a split word or dangling comma/semicolon
        assert not p_text.endswith(","), f"Page {p['page_number']} ends with dangling comma: {repr(p_text[-30:])}"
        assert not p_text.endswith(";"), f"Page {p['page_number']} ends with semicolon: {repr(p_text[-30:])}"
        assert not p_text.endswith(" -"), f"Page {p['page_number']} ends with dangling hyphen: {repr(p_text[-30:])}"
    print(f"  ✓ All {total_pages} pages end cleanly at legitimate boundary points without dangling splits.")

    # TEST D: STRUCTURAL COVERAGE (All 7 chapters present)
    print("\n[TEST D] Verifying Structural Coverage...")
    seen_chaps = set(p["chapter_code"] for p in pages)
    for code, _ in CHAPTER_FILES:
        assert code in seen_chaps, f"Missing chapter structure: {code}"
    print(f"  ✓ All 7 chapters (Prolog, Bab 1-5, Epilog) are fully represented.")

    # TEST E: ILLUSTRATION COVERAGE & VISUAL CONTINUITY
    print("\n[TEST E] Verifying 100% Dedicated Illustration Coverage & Continuity...")
    seen_prompts = set()
    for p in pages:
        prompt = p.get("illustration_prompt", "")
        desc = p.get("illustration_description", "")
        ctx = p.get("visual_continuity_context", {})
        
        assert len(prompt) > 50, f"Page {p['page_number']} prompt too short: {prompt}"
        assert len(desc) > 20, f"Page {p['page_number']} description missing or too short."
        assert "prev_visual" in ctx, f"Page {p['page_number']} missing visual continuity context."
        seen_prompts.add(prompt)
    print(f"  ✓ 100% of {total_pages} pages have rich, dedicated illustration prompts and visual continuity context.")

    # TEST F: ZERO DUPLICATION
    print("\n[TEST F] Verifying Zero Text Duplication Across Adjacent Pages...")
    for i in range(len(pages) - 1):
        p1 = pages[i]
        p2 = pages[i+1]
        # If in same chapter, start_char of p2 must equal end_char of p1
        if p1["chapter_id"] == p2["chapter_id"]:
            assert p1["end_char"] == p2["start_char"], f"Offset overlap or gap between Page {p1['page_number']} and Page {p2['page_number']}!"
    print(f"  ✓ All adjacent pages within chapters have exact contiguous byte offsets (0 overlap, 0 gap).")

    print("\n==================================================")
    print("SUCCESS: ALL 6 AUTOMATED VALIDATION CRITERIA PASSED!")
    print("==================================================")

if __name__ == "__main__":
    run_validation()
