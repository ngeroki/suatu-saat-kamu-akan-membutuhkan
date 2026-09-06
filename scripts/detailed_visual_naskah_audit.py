#!/usr/bin/env python3
"""
scripts/detailed_visual_naskah_audit.py
========================================
Deep semantic and thematic audit of all 74 pages:
Compares Side B (Naskah) <-> Side A (Visual Concept, Image Prompt, Side A Text, Title, Subtitle).
Detects narrative disconnects, thematic drifts, and title/anchor shifts.
"""

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
BOOK_PAGES_PATH = ROOT / "src" / "data" / "book-pages.json"
VISUAL_NARRATIVE_PATH = ROOT / "src" / "data" / "visual-narrative-74.json"
NASKAH_DIR = ROOT / "naskah-buku"
OUTPUT_FILE = ROOT / "audit" / "detailed_alignment_findings.json"

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

def clean_tokens(text: str):
    if not text:
        return set()
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    return {w for w in cleaned.split() if len(w) > 3 and w not in STOPWORDS and not w.isdigit()}

def run_deep_audit():
    with open(BOOK_PAGES_PATH, encoding="utf-8") as f:
        book_pages = json.load(f)

    with open(VISUAL_NARRATIVE_PATH, encoding="utf-8") as f:
        vn_list = json.load(f)
    vn_map = {item["page_number"]: item for item in vn_list}

    audit_data = []
    category_counts = {"ALIGNED": 0, "MINOR_DRIFT": 0, "DISCONNECT": 0}

    for p in book_pages:
        num = p["page_number"]
        vn = vn_map.get(num, {})

        bp_title = p.get("title", "").strip()
        bp_subtitle = p.get("subtitle", "").strip()
        bp_side_a = p.get("side_a_text", "").strip()
        paragraphs = p.get("paragraphs", [])
        page_text = " ".join(paragraphs)
        key_takeaway = p.get("keyTakeaway", "")

        vn_title = vn.get("title", "").strip()
        vn_subtitle = vn.get("subtitle", "").strip()
        vn_side_a = vn.get("side_a_text", "").strip()
        visual_concept = vn.get("visual_concept", "").strip()
        image_prompt = vn.get("image_prompt", "").strip()
        source_anchor = vn.get("source_anchor", "").strip()
        reflection_target = vn.get("reflection_target", "").strip()

        # Token analysis
        page_tokens = clean_tokens(page_text)
        title_tokens = clean_tokens(bp_title + " " + bp_subtitle)
        side_a_tokens = clean_tokens(bp_side_a)
        vn_concept_tokens = clean_tokens(visual_concept + " " + reflection_target)
        prompt_tokens = clean_tokens(image_prompt)

        # Check semantic overlap
        anchor_in_page = False
        if source_anchor:
            clean_anchor = re.sub(r"[^\w\s]", "", source_anchor.lower())
            clean_page = re.sub(r"[^\w\s]", "", page_text.lower())
            # Substring check
            anchor_in_page = any(chunk.strip() in clean_page for chunk in clean_anchor.split("...") if len(chunk.strip()) > 15)
            if not anchor_in_page:
                anchor_tokens = clean_tokens(source_anchor)
                if anchor_tokens:
                    anchor_overlap = len(anchor_tokens & page_tokens) / len(anchor_tokens)
                    anchor_in_page = anchor_overlap >= 0.35

        # Check title desync
        title_differs = (bp_title != vn_title) if vn_title else False

        # Evaluation of alignment
        # Check concept alignment
        concept_overlap_count = len(page_tokens & vn_concept_tokens)
        side_a_overlap_count = len(page_tokens & side_a_tokens)

        notes = []
        rating = "ALIGNED"

        if not anchor_in_page:
            notes.append("Source anchor quote not directly found in this page slice.")
        if title_differs:
            notes.append(f"Title variation: Web shows '{bp_title}', Prompt dossier lists '{vn_title}'")

        # Specific domain heuristic checks
        # E.g. Check if page discusses a specific biological or physical concept
        # and whether the visual/prompt recognizes it or has drifted:
        # Bab 1: Deja vu, tulang ekor/sulbi, kundalini, medan torus, serat optik/cairan serebrospinal, kangkung
        # Bab 2: Gelombang alfa, theta, reprogramming, cermin, tidur, subconscious
        # Bab 3: Hormon, dopamin, kortisol, puasa, ritme sirkadian, kelenjar pineal, demam
        # Bab 4: Observer effect, kuantum entanglement, relativitas, waktu
        # Bab 5: Berserah vs menyerah, kesadaran normal, welas asih, keheningan
        
        # Determine rating
        if anchor_in_page and concept_overlap_count >= 2:
            rating = "ALIGNED"
        elif concept_overlap_count >= 1 or side_a_overlap_count >= 2:
            rating = "MINOR_DRIFT" if (title_differs or not anchor_in_page) else "ALIGNED"
        else:
            # Low keyword overlap
            # Check if it's an abstract or poetic scene
            if "warkop" in visual_concept.lower() or "kebun" in visual_concept.lower() or "halaman" in visual_concept.lower():
                rating = "MINOR_DRIFT"
                notes.append("Visual uses an atmospheric everyday metaphor (warkop/nature) rather than literal subject depiction.")
            else:
                rating = "DISCONNECT"
                notes.append("Noticeable thematic divergence between visual concept and text on this page.")

        category_counts[rating] += 1

        audit_data.append({
            "page_number": num,
            "chapter_code": p.get("chapter_code", ""),
            "chapter_name": p.get("chapter_name", ""),
            "rating": rating,
            "title_web": bp_title,
            "title_prompt": vn_title,
            "side_a_text": bp_side_a,
            "visual_concept": visual_concept,
            "image_prompt_summary": image_prompt[:120] + "...",
            "source_anchor": source_anchor,
            "anchor_in_page": anchor_in_page,
            "notes": notes,
            "concept_overlap": concept_overlap_count,
            "side_a_overlap": side_a_overlap_count,
            "first_paragraph": paragraphs[0] if paragraphs else ""
        })

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "summary": category_counts,
            "pages": audit_data
        }, f, indent=2, ensure_ascii=False)

    print("=" * 70)
    print("DETAILED VISUAL <-> NASKAH ALIGNMENT BREAKDOWN:")
    print(f"🟢 ALIGNED      : {category_counts['ALIGNED']}")
    print(f"🟡 MINOR DRIFT  : {category_counts['MINOR_DRIFT']}")
    print(f"🔴 DISCONNECT   : {category_counts['DISCONNECT']}")
    print(f"Detailed output saved to: {OUTPUT_FILE}")
    print("=" * 70)

    # Print out DISCONNECT and MINOR_DRIFT pages
    print("\n--- NOTABLE PAGES REQUIRING ATTENTION ---")
    for item in audit_data:
        if item["rating"] in ("DISCONNECT", "MINOR_DRIFT"):
            print(f"\n[Page {item['page_number']}] {item['chapter_code']} - {item['title_web']} ({item['rating']})")
            print(f"  Side A : \"{item['side_a_text']}\"")
            print(f"  Visual : {item['visual_concept']}")
            print(f"  Notes  : {'; '.join(item['notes'])}")

if __name__ == "__main__":
    run_deep_audit()
