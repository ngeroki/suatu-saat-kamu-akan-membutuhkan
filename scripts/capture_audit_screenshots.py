#!/usr/bin/env python3
"""
scripts/capture_audit_screenshots.py
====================================
Tier 2 Visual Screenshot Capture:
Connects to https://suatu-saat.pages.dev via Playwright (Chrome channel).
Captures Side A (Visual Poster & Typography Overlay) and Side B (Editorial Text)
for prioritized audit pages.
Saves both locally to audit/screenshots/ and to the Brain artifact folder.
"""

import os
import sys
import shutil
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
AUDIT_DIR = ROOT / "audit" / "screenshots"
BRAIN_ARTIFACT_DIR = Path(r"C:\Users\hans_\.gemini\antigravity\brain\ae32efc5-431f-4c7e-9fcd-d6094510b642\screenshots")

# Prioritized audit pages covering every chapter and critical motifs:
# Bab 1: 1 (Opener), 2 (Deja vu gang Jogja), 3 (Meja kayu & tubruk), 4 (Dua gelombang warung), 5 (Tulang ekor buruh), 11 (Batang kangkung)
# Bab 2: 16 (Opener), 20 (Gerbang tidur jendela), 25 (Cermin kejujuran)
# Bab 3: 31 (Opener), 37 (Jamu pahit godok), 40 (Demam kain basah)
# Bab 4: 46 (Opener), 48 (Dua partikel terikat), 54 (Menyapa penjual sayur), 58 (Layar bioskop pikiran)
# Bab 5: 60 (Opener), 62 (Menatap tukang sayur), 65 (Nelayan pasir senja), 66 (Daun jati parit), 74 (Pulang rumah kesadaran)
AUDIT_PAGES = [
    {"page": 1, "chap": 1, "page_in_chap": 1, "name": "bab1-p01-balai-kayu"},
    {"page": 2, "chap": 1, "page_in_chap": 2, "name": "bab1-p02-gang-jogja"},
    {"page": 3, "chap": 1, "page_in_chap": 3, "name": "bab1-p03-meja-kayu-tubruk"},
    {"page": 4, "chap": 1, "page_in_chap": 4, "name": "bab1-p04-warung-bambu"},
    {"page": 5, "chap": 1, "page_in_chap": 5, "name": "bab1-p05-tulang-ekor-batu"},
    {"page": 11, "chap": 1, "page_in_chap": 11, "name": "bab1-p11-batang-kangkung"},
    {"page": 16, "chap": 2, "page_in_chap": 1, "name": "bab2-p16-kabut-pikiran"},
    {"page": 20, "chap": 2, "page_in_chap": 5, "name": "bab2-p20-gerbang-tidur"},
    {"page": 25, "chap": 2, "page_in_chap": 10, "name": "bab2-p25-cermin-kejujuran"},
    {"page": 31, "chap": 3, "page_in_chap": 1, "name": "bab3-p31-rempah-leluhur"},
    {"page": 37, "chap": 3, "page_in_chap": 7, "name": "bab3-p37-jamu-pahit"},
    {"page": 40, "chap": 3, "page_in_chap": 10, "name": "bab3-p40-demam-kain-basah"},
    {"page": 46, "chap": 4, "page_in_chap": 1, "name": "bab4-p46-fisika-kuantum"},
    {"page": 48, "chap": 4, "page_in_chap": 3, "name": "bab4-p48-dua-partikel"},
    {"page": 54, "chap": 4, "page_in_chap": 9, "name": "bab4-p54-sapa-penjual-sayur"},
    {"page": 58, "chap": 4, "page_in_chap": 13, "name": "bab4-p58-layar-bioskop"},
    {"page": 60, "chap": 5, "page_in_chap": 1, "name": "bab5-p60-manusia-normal"},
    {"page": 62, "chap": 5, "page_in_chap": 3, "name": "bab5-p62-tatap-tukang-sayur"},
    {"page": 65, "chap": 5, "page_in_chap": 6, "name": "bab5-p65-nelayan-senja"},
    {"page": 66, "chap": 5, "page_in_chap": 7, "name": "bab5-p66-daun-jati-parit"},
    {"page": 74, "chap": 5, "page_in_chap": 15, "name": "bab5-p74-pulang-kesadaran"},
]

def capture_screenshots():
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    BRAIN_ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print(f"📸 STARTING TIER 2 BROWSER SCREENSHOT CAPTURE ({len(AUDIT_PAGES)} PRIORITY PAGES)")
    print(f"Target URL: https://suatu-saat.pages.dev")
    print(f"Local Destination : {AUDIT_DIR}")
    print(f"Brain Destination : {BRAIN_ARTIFACT_DIR}")
    print("=" * 70)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        for idx, item in enumerate(AUDIT_PAGES, 1):
            p_num = item["page"]
            chap = item["chap"]
            p_chap = item["page_in_chap"]
            name = item["name"]

            url = f"https://suatu-saat.pages.dev/#/read/{chap}/{p_chap}"
            print(f"[{idx}/{len(AUDIT_PAGES)}] Navigating to Page {p_num} ({url})...", flush=True)

            try:
                page.goto(url, wait_until="networkidle", timeout=20000)
                page.wait_for_timeout(800)

                # 1. Capture Side A (Artwork & Editorial Typography Overlay)
                # If page is on Side B, flip to Side A
                flip_to_a_btn = page.query_selector("#m-btn-flip-cue-b")
                if flip_to_a_btn and flip_to_a_btn.is_visible():
                    print(f"   -> Flipping to Side A (Visual Poster)...", flush=True)
                    flip_to_a_btn.click()
                    page.wait_for_timeout(600)

                # Wait for poster image to load
                page.wait_for_selector(".m-poster-img", timeout=5000)
                page.wait_for_timeout(400)

                side_a_filename = f"page-{p_num:02d}-side-a.png"
                local_side_a = AUDIT_DIR / side_a_filename
                brain_side_a = BRAIN_ARTIFACT_DIR / side_a_filename

                page.screenshot(path=str(local_side_a), full_page=False)
                shutil.copy2(local_side_a, brain_side_a)
                print(f"   ✅ Saved Side A: {side_a_filename} ({local_side_a.stat().st_size // 1024} KB)")

                # 2. Capture Side B (Editorial Naskah)
                # Flip to Side B
                flip_to_b_btn = page.query_selector("#m-btn-flip-cue")
                if flip_to_b_btn and flip_to_b_btn.is_visible():
                    flip_to_b_btn.click()
                    page.wait_for_timeout(600)
                elif page.query_selector("#m-stage-a"):
                    page.query_selector("#m-stage-a").click()
                    page.wait_for_timeout(600)

                page.wait_for_selector(".m-editorial-body", timeout=5000)
                page.wait_for_timeout(300)

                side_b_filename = f"page-{p_num:02d}-side-b.png"
                local_side_b = AUDIT_DIR / side_b_filename
                brain_side_b = BRAIN_ARTIFACT_DIR / side_b_filename

                page.screenshot(path=str(local_side_b), full_page=False)
                shutil.copy2(local_side_b, brain_side_b)
                print(f"   ✅ Saved Side B: {side_b_filename} ({local_side_b.stat().st_size // 1024} KB)")

            except Exception as e:
                print(f"   ❌ Error capturing Page {p_num}: {e}", flush=True)

        browser.close()

    print("\n" + "=" * 70)
    print("🎉 TIER 2 SCREENSHOT CAPTURE COMPLETE!")
    print(f"Saved {len(list(AUDIT_DIR.glob('*.png')))} images in {AUDIT_DIR}")
    print("=" * 70)

if __name__ == "__main__":
    capture_screenshots()
