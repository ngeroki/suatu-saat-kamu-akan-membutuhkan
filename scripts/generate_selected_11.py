import asyncio
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from PIL import Image
from gemini_webapi import GeminiClient

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = Path.home() / ".gemini" / "config"
COOKIE_EXTRACTOR = BASE_DIR / "scripts" / "extract-account-cookies.cjs"
TARGET_PAGES = [8, 37, 38, 39, 40, 41, 42, 43, 44, 48, 54]
EMAIL = "ngempetbuko@gmail.com"

def load_json(p: Path):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def refresh_cookies(email: str):
    print(f"[{email}] Refreshing cookies from BrowserOS Neo...", flush=True)
    try:
        subprocess.run(["node", str(COOKIE_EXTRACTOR), email], cwd=str(BASE_DIR), check=True, capture_output=True, text=True)
        print(f"[{email}] Cookies refreshed successfully.", flush=True)
    except Exception as e:
        print(f"[{email}] Cookie refresh failed: {e}", flush=True)

def get_cookies_for_account(email: str):
    cookie_file = CONFIG_DIR / f"gemini_web_cookies_{email}.json"
    if not cookie_file.exists():
        refresh_cookies(email)
    with open(cookie_file, "r", encoding="utf-8") as f:
        return json.load(f)

async def init_client_for_account(email: str) -> GeminiClient:
    for attempt in range(1, 4):
        try:
            cookies = get_cookies_for_account(email)
            psid = cookies.get("__Secure-1PSID")
            psidts = cookies.get("__Secure-1PSIDTS")
            client = GeminiClient(psid, psidts, auto_refresh=False, verbose=False)
            await client.init(timeout=45)
            return client
        except Exception as e:
            print(f"[{email}] Init attempt {attempt} failed ({e}), refreshing cookies...", flush=True)
            refresh_cookies(email)
            await asyncio.sleep(5)
    cookies = get_cookies_for_account(email)
    client = GeminiClient(cookies.get("__Secure-1PSID"), cookies.get("__Secure-1PSIDTS"), auto_refresh=False, verbose=False)
    await client.init(timeout=45)
    return client

def create_thumbnail(src_path: Path, thumb_path: Path):
    try:
        thumb_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src_path) as img:
            img.thumbnail((512, 910), Image.Resampling.LANCZOS)
            img.save(thumb_path, "JPEG", quality=85, optimize=True)
        size_kb = thumb_path.stat().st_size / 1024
        print(f"[THUMB] Created thumbnail: {thumb_path.name} ({size_kb:.1f} KB)", flush=True)
    except Exception as e:
        print(f"[THUMB] Warning: Failed to create thumbnail {thumb_path}: {e}", flush=True)

async def main():
    visual_data = load_json(BASE_DIR / "src" / "data" / "visual-narrative-74.json")
    book_pages = load_json(BASE_DIR / "src" / "data" / "book-pages.json")
    pages_map = {}
    for bp in book_pages:
        pages_map[bp["page_number"]] = {
            "slide": bp["image_path"],
            "thumb": bp.get("thumbnail", bp["image_path"].replace("slides-portrait", "thumbnails").replace("slide-", "thumb-"))
        }
    vn_map = {item["page_number"]: item for item in visual_data}
    print(f"Initializing Gemini Client for {EMAIL}...")
    client = await init_client_for_account(EMAIL)
    print("Gemini Client ready! Starting targeted generation for 11 pages...\\n")
    results = {}
    for idx, p_num in enumerate(TARGET_PAGES, 1):
        item = vn_map[p_num]
        mapping = pages_map[p_num]
        dest_rel = mapping["slide"]
        dest_path = BASE_DIR / "public" / dest_rel.lstrip("/")
        thumb_rel = mapping["thumb"]
        thumb_path = BASE_DIR / "public" / thumb_rel.lstrip("/")
        print(f"[{idx}/{len(TARGET_PAGES)}] Generating Page {p_num:02d}: {item['title']}...")
        print(f"  Concept: {item['visual_concept']}")
        prompt = f"Generate an image of {item['image_prompt']}, vertical portrait 9:16 aspect ratio"
        success = False
        for attempt in range(1, 4):
            try:
                chat = client.start_chat(model="gemini-pro")
                res = await chat.send_message(prompt)
                if res.images and len(res.images) > 0:
                    dest_path.parent.mkdir(parents=True, exist_ok=True)
                    saved = await res.images[0].save(path=str(dest_path.parent), filename=dest_path.name, verbose=False)
                    size_mb = dest_path.stat().st_size / 1024 / 1024
                    print(f"  -> SUCCESS! Saved to {dest_rel} ({size_mb:.2f} MB)")
                    create_thumbnail(dest_path, thumb_path)
                    results[p_num] = {"status": "success", "size_mb": size_mb}
                    success = True
                    break
                else:
                    text_snippet = res.text[:120] if res.text else "No text"
                    print(f"  Warning: No image returned (attempt {attempt}). Response: {text_snippet}")
                    text_lower = text_snippet.lower()
                    if any(k in text_lower for k in ("sign", "signed in", "can't seem to create", "can't create")):
                        print("  Refreshing cookies...")
                        refresh_cookies(EMAIL)
                        client = await init_client_for_account(EMAIL)
                    await asyncio.sleep(5)
            except Exception as e:
                print(f"  Error on attempt {attempt}: {e}")
                err_str = str(e).lower()
                if any(k in err_str for k in ("unauthenticated", "expired", "permission denied")):
                    refresh_cookies(EMAIL)
                    client = await init_client_for_account(EMAIL)
                await asyncio.sleep(5)
        if not success:
            print(f"  -> FAILED to generate Page {p_num} after 3 attempts!")
            results[p_num] = {"status": "failed"}
        await asyncio.sleep(3)
    await client.close()
    print("\\n=======================================================")
    print("TARGETED GENERATION SUMMARY:")
    for p_num, res in results.items():
        st = res["status"]
        sz = f"({res.get('size_mb', 0):.2f} MB)" if st == "success" else ""
        print(f"  Page {p_num:02d}: {st.upper()} {sz}")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(main())