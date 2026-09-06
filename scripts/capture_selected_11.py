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
BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173"

TARGET_PAGES = [
    {"page": 8, "chap": 1, "page_in_chap": 8, "name": "bab1-p08-pati-geni"},
    {"page": 37, "chap": 3, "page_in_chap": 7, "name": "bab3-p37-bayar-pahit-muka"},
    {"page": 38, "chap": 3, "page_in_chap": 8, "name": "bab3-p38-tiga-tungku-endokrin"},
    {"page": 39, "chap": 3, "page_in_chap": 9, "name": "bab3-p39-empat-menara-cahaya"},
    {"page": 40, "chap": 3, "page_in_chap": 10, "name": "bab3-p40-bharatayuddha-kepala"},
    {"page": 41, "chap": 3, "page_in_chap": 11, "name": "bab3-p41-kera-liar-ganesha"},
    {"page": 42, "chap": 3, "page_in_chap": 12, "name": "bab3-p42-selapanan-35-hari"},
    {"page": 43, "chap": 3, "page_in_chap": 13, "name": "bab3-p43-garam-krosok-kelor"},
    {"page": 44, "chap": 3, "page_in_chap": 14, "name": "bab3-p44-napas-4-4-8"},
    {"page": 48, "chap": 4, "page_in_chap": 3, "name": "bab4-p48-simpul-tenun-kuantum"},
    {"page": 54, "chap": 4, "page_in_chap": 9, "name": "bab4-p54-pejalan-bukit-kapur"}
]

def run():
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    BRAIN_ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Starting capture of 11 pages from {BASE_URL}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()
        for idx, item in enumerate(TARGET_PAGES, 1):
            p_num = item["page"]
            chap = item["chap"]
            p_chap = item["page_in_chap"]
            url = f"{BASE_URL}/#/read/{chap}/{p_chap}"
            print(f"[{idx}/11] Page {p_num:02d} ({url})...", flush=True)
            try:
                page.goto(url, wait_until="networkidle", timeout=20000)
                page.wait_for_timeout(800)
                flip_to_a_btn = page.query_selector("#m-btn-flip-cue-b")
                if flip_to_a_btn and flip_to_a_btn.is_visible():
                    flip_to_a_btn.click()
                    page.wait_for_timeout(600)
                page.wait_for_selector(".m-poster-img", timeout=5000)
                page.wait_for_timeout(500)
                side_a_filename = f"page-{p_num:02d}-side-a.png"
                local_side_a = AUDIT_DIR / side_a_filename
                brain_side_a = BRAIN_ARTIFACT_DIR / side_a_filename
                page.screenshot(path=str(local_side_a), full_page=False)
                shutil.copy2(local_side_a, brain_side_a)
                print(f"   ✅ Saved Side A: {side_a_filename}", flush=True)
                flip_to_b_btn = page.query_selector("#m-btn-flip-cue")
                if flip_to_b_btn and flip_to_b_btn.is_visible():
                    flip_to_b_btn.click()
                    page.wait_for_timeout(600)
                elif page.query_selector("#m-stage-a"):
                    page.query_selector("#m-stage-a").click()
                    page.wait_for_timeout(600)
                page.wait_for_selector(".m-editorial-body", timeout=5000)
                page.wait_for_timeout(400)
                side_b_filename = f"page-{p_num:02d}-side-b.png"
                local_side_b = AUDIT_DIR / side_b_filename
                brain_side_b = BRAIN_ARTIFACT_DIR / side_b_filename
                page.screenshot(path=str(local_side_b), full_page=False)
                shutil.copy2(local_side_b, brain_side_b)
                print(f"   ✅ Saved Side B: {side_b_filename}", flush=True)
            except Exception as e:
                print(f"   ❌ Error on Page {p_num}: {e}", flush=True)
        browser.close()
    print("All screenshots captured successfully!")

if __name__ == "__main__":
    run()