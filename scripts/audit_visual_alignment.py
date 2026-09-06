#!/usr/bin/env python3
"""
scripts/audit_visual_alignment.py
==================================
Tier 1 Automated Data & Content Alignment Audit across all 74 pages of SUATU SAAT.
Aligns:
- book-pages.json (Side A overlay & Side B curated text)
- visual-narrative-74.json (Visual prompts, source anchors, reflection targets)
- naskah-buku/ (Authentic master manuscripts)
- public/slides-portrait/ & public/thumbnails/ (Physical image assets)
"""

import json
import os
import re
import csv
import sys
from pathlib import Path

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8')

# Paths
ROOT = Path(__file__).resolve().parent.parent
BOOK_PAGES_PATH = ROOT / "src" / "data" / "book-pages.json"
VISUAL_NARRATIVE_PATH = ROOT / "src" / "data" / "visual-narrative-74.json"
NASKAH_DIR = ROOT / "naskah-buku"
PUBLIC_DIR = ROOT / "public"
OUTPUT_DIR = ROOT / "audit"
OUTPUT_CSV = OUTPUT_DIR / "data_audit_results.csv"
OUTPUT_SUMMARY_JSON = OUTPUT_DIR / "data_audit_summary.json"

CHAPTER_FILE_MAP = {
    1: "Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md",
    2: "Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md",
    3: "Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md",
    4: "Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md",
    5: "Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md",
}

STOPWORDS = {
    "yang", "di", "dan", "ini", "itu", "dari", "ke", "ada", "bisa", "kita", "kamu",
    "aku", "ia", "dia", "mereka", "dengan", "untuk", "pada", "adalah", "sebagai",
    "karena", "maka", "oleh", "dalam", "saat", "ketika", "sudah", "belum", "lagi",
    "bukan", "hanya", "cuma", "akan", "kalau", "jika", "tapi", "namun", "juga",
    "atau", "tentang", "seperti", "begitu", "kenapa", "mengapa", "bagaimana",
    "apa", "siapa", "mana", "saja", "pun", "agar", "supaya", "hingga", "sampai",
    "bahkan", "tanpa", "atas", "bawah", "lebih", "sangat", "paling", "selalu",
    "pernah", "tidak", "tak", "tiada", "terus", "lalu", "kemudian", "jadi", "hal"
}

def clean_text_for_tokens(text: str):
    if not text:
        return set()
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    tokens = {w for w in cleaned.split() if len(w) > 3 and w not in STOPWORDS and not w.isdigit()}
    return tokens

def find_fuzzy_anchor_in_text(anchor: str, full_text: str):
    """Check if anchor (or a substantial part of it) appears in full_text."""
    if not anchor or not full_text:
        return False, 0.0
    
    clean_anchor = re.sub(r"\s+", " ", anchor.strip().lower())
    clean_full = re.sub(r"\s+", " ", full_text.strip().lower())
    
    if clean_anchor in clean_full:
        return True, 1.0
    
    chunks = [c.strip() for c in re.split(r"\.{3,}|\.|\n", clean_anchor) if len(c.strip()) > 15]
    if chunks:
        found_chunks = sum(1 for c in chunks if c in clean_full)
        ratio = found_chunks / len(chunks)
        if ratio >= 0.5:
            return True, ratio
    
    anchor_tokens = clean_text_for_tokens(anchor)
    full_tokens = clean_text_for_tokens(full_text)
    if anchor_tokens:
        overlap = len(anchor_tokens & full_tokens) / len(anchor_tokens)
        return overlap >= 0.45, overlap
        
    return False, 0.0

def audit():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(BOOK_PAGES_PATH, encoding="utf-8") as f:
        book_pages = json.load(f)

    with open(VISUAL_NARRATIVE_PATH, encoding="utf-8") as f:
        visual_narratives = json.load(f)

    vn_map = {item["page_number"]: item for item in visual_narratives}

    chapter_texts = {}
    for chap_id, fname in CHAPTER_FILE_MAP.items():
        fpath = NASKAH_DIR / fname
        if fpath.exists():
            with open(fpath, encoding="utf-8") as mf:
                chapter_texts[chap_id] = mf.read()
        else:
            chapter_texts[chap_id] = ""

    results = []
    flagged_count = 0
    ok_count = 0

    print("=" * 70)
    print("🚀 STARTING TIER 1 DATA AUDIT: VISUAL ↔ NASKAH ALIGNMENT (74 PAGES)")
    print("=" * 70)

    for p in book_pages:
        page_num = p["page_number"]
        chap_id = p["chapter_id"]
        title = p.get("title", "")
        subtitle = p.get("subtitle", "")
        paragraphs = p.get("paragraphs", [])
        page_text = " ".join(paragraphs)
        side_a_text = p.get("side_a_text", "")
        key_takeaway = p.get("keyTakeaway", "")
        illustration_desc = p.get("illustration_description", "")
        word_count = p.get("word_count", 0)
        img_rel_path = p.get("image_path", "")
        thumb_rel_path = p.get("thumbnail", "")

        vn = vn_map.get(page_num, {})
        vn_title = vn.get("title", "")
        vn_subtitle = vn.get("subtitle", "")
        vn_side_a = vn.get("side_a_text", "")
        visual_concept = vn.get("visual_concept", "")
        image_prompt = vn.get("image_prompt", "")
        source_anchor = vn.get("source_anchor", "")
        reflection_target = vn.get("reflection_target", "")

        issues = []

        # 1. Physical asset check
        img_file = PUBLIC_DIR / img_rel_path.lstrip("/\\")
        if not img_file.exists():
            issues.append(f"MISSING_IMAGE: {img_rel_path}")
        else:
            img_size_mb = img_file.stat().st_size / (1024 * 1024)
            if img_size_mb < 0.8:
                issues.append(f"IMAGE_TOO_SMALL: {img_size_mb:.2f}MB (< 0.8MB)")

        thumb_file = PUBLIC_DIR / thumb_rel_path.lstrip("/\\")
        if not thumb_file.exists():
            issues.append(f"MISSING_THUMBNAIL: {thumb_rel_path}")

        # 2. Source Anchor fidelity check
        anchor_in_page, page_score = find_fuzzy_anchor_in_text(source_anchor, page_text)
        chap_text = chapter_texts.get(chap_id, "")
        anchor_in_chap, chap_score = find_fuzzy_anchor_in_text(source_anchor, chap_text)

        if not anchor_in_page:
            if anchor_in_chap:
                issues.append(f"ANCHOR_IN_CHAPTER_NOT_PAGE: Anchor exists in Chapter {chap_id} but not in this specific page slice (page_score={page_score:.2f}, chap_score={chap_score:.2f})")
            else:
                issues.append(f"ANCHOR_MISSING: Source anchor not found in page nor manuscript (score={page_score:.2f})")

        # 3. Side A Text verification
        if not side_a_text:
            issues.append("EMPTY_SIDE_A_TEXT")
        else:
            side_a_words = len(side_a_text.split())
            if side_a_words < 6 or side_a_words > 28:
                issues.append(f"SIDE_A_LENGTH_IRREGULAR: {side_a_words} words")
            if vn_side_a and side_a_text.strip() != vn_side_a.strip():
                issues.append("SIDE_A_VN_DESYNC: side_a_text in book-pages differs from visual-narrative-74.json")

        # 4. Title / Subtitle sync
        if vn_title and title.strip() != vn_title.strip():
            issues.append(f"TITLE_DESYNC: book-pages='{title}' vs vn='{vn_title}'")

        # 5. Semantic overlap between Visual Concept and Page Content
        page_tokens = clean_text_for_tokens(page_text)
        vc_tokens = clean_text_for_tokens(f"{visual_concept} {reflection_target}")
        prompt_tokens = clean_text_for_tokens(image_prompt)

        concept_overlap = len(page_tokens & vc_tokens)
        prompt_overlap = len(page_tokens & prompt_tokens)

        # 6. Formatting & Hygiene checks
        if any("—" in par or "–" in par for par in paragraphs):
            issues.append("FORBIDDEN_DASH: em-dash or en-dash detected in paragraphs")
        if "—" in side_a_text or "–" in side_a_text:
            issues.append("FORBIDDEN_DASH_SIDE_A")

        if word_count < 80:
            issues.append(f"LOW_WORD_COUNT: {word_count} words (<80)")
        elif word_count > 250:
            issues.append(f"HIGH_WORD_COUNT: {word_count} words (>250)")

        negative_constraints = "[NEGATIVE CONSTRAINTS]" in image_prompt or "no glowing" in image_prompt.lower()
        if not negative_constraints:
            issues.append("MISSING_NEGATIVE_CONSTRAINTS: prompt lacks anti-slop constraints")

        if issues:
            status = "⚠️ PERLU REVIEW"
            flagged_count += 1
        else:
            status = "✅ OK"
            ok_count += 1

        results.append({
            "page_number": page_num,
            "chapter_code": p.get("chapter_code", f"BAB 0{chap_id}"),
            "chapter_name": p.get("chapter_name", ""),
            "title": title,
            "subtitle": subtitle,
            "status": status,
            "issue_count": len(issues),
            "issues": "; ".join(issues),
            "word_count": word_count,
            "side_a_text": side_a_text,
            "source_anchor": source_anchor[:80] + "..." if len(source_anchor) > 80 else source_anchor,
            "visual_concept": visual_concept[:100] + "..." if len(visual_concept) > 100 else visual_concept,
            "image_path": img_rel_path,
            "anchor_in_page": anchor_in_page,
            "anchor_in_chap": anchor_in_chap,
            "concept_overlap": concept_overlap,
        })

    # Write CSV
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as cf:
        fieldnames = [
            "page_number", "chapter_code", "chapter_name", "title", "subtitle",
            "status", "issue_count", "issues", "word_count", "side_a_text",
            "source_anchor", "visual_concept", "image_path",
            "anchor_in_page", "anchor_in_chap", "concept_overlap"
        ]
        writer = csv.DictWriter(cf, fieldnames=fieldnames)
        writer.writeheader()
        for r in results:
            writer.writerow(r)

    # Write JSON Summary
    summary_data = {
        "total_pages": len(book_pages),
        "ok_pages": ok_count,
        "flagged_pages": flagged_count,
        "percentage_ok": round((ok_count / len(book_pages)) * 100, 1),
        "flagged_list": [r for r in results if r["status"] == "⚠️ PERLU REVIEW"]
    }

    with open(OUTPUT_SUMMARY_JSON, "w", encoding="utf-8") as jf:
        json.dump(summary_data, jf, indent=2, ensure_ascii=False)

    print("\n" + "=" * 70)
    print("📊 TIER 1 DATA AUDIT SUMMARY:")
    print(f"   Total Pages Audited : {len(book_pages)}")
    print(f"   ✅ OK                : {ok_count} ({summary_data['percentage_ok']}%)")
    print(f"   ⚠️ PERLU REVIEW      : {flagged_count} ({round((flagged_count / len(book_pages)) * 100, 1)}%)")
    print(f"   CSV Output          : {OUTPUT_CSV}")
    print(f"   JSON Summary        : {OUTPUT_SUMMARY_JSON}")
    print("=" * 70)

    if flagged_count > 0:
        print(f"\n⚠️ FLAGGED PAGES COUNT: {len(summary_data['flagged_list'])}")
        for fr in summary_data["flagged_list"]:
            print(f"  - Page {fr['page_number']} [{fr['chapter_code']} - {fr['title']}]: {fr['issues']}")
    else:
        print("\n🎉 ALL 74 PAGES PASSED TIER 1 AUDIT CLEANLY!")

if __name__ == "__main__":
    audit()
