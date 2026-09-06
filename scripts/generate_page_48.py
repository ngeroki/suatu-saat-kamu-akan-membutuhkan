import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path
from PIL import Image
from gemini_webapi import GeminiClient

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = Path.home() / ".gemini" / "config"
COOKIE_EXTRACTOR = BASE_DIR / "scripts" / "extract-account-cookies.cjs"
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
    cookies = get_cookies_for_account(email)
    client = GeminiClient(cookies.get("__Secure-1PSID"), cookies.get("__Secure-1PSIDTS"), auto_refresh=False, verbose=False)
    await client.init(timeout=45)
    return client

def create_thumbnail(src_path: Path, thumb_path: Path):
    thumb_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src_path) as img:
        img.thumbnail((512, 910), Image.Resampling.LANCZOS)
        img.save(thumb_path, "JPEG", quality=85, optimize=True)
    size_kb = thumb_path.stat().st_size / 1024
    print(f"[THUMB] Created thumbnail: {thumb_path.name} ({size_kb:.1f} KB)", flush=True)

async def main():
    visual_data = load_json(BASE_DIR / "src" / "data" / "visual-narrative-74.json")
    item = [x for x in visual_data if x["page_number"] == 48][0]
    dest_path = BASE_DIR / "public" / "slides-portrait" / "bab-04" / "slide-3.jpg"
    thumb_path = BASE_DIR / "public" / "thumbnails" / "bab-04" / "thumb-3.jpg"

    refresh_cookies(EMAIL)
    client = await init_client_for_account(EMAIL)
    print(f"Generating Page 48: {item['title']}...")
    prompt = f"Generate an image of {item['image_prompt']}, vertical portrait 9:16 aspect ratio"

    for attempt in range(1, 5):
        try:
            chat = client.start_chat(model="gemini-pro")
            res = await chat.send_message(prompt)
            if res.images and len(res.images) > 0:
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                saved = await res.images[0].save(path=str(dest_path.parent), filename=dest_path.name, verbose=False)
                size_mb = dest_path.stat().st_size / 1024 / 1024
                print(f"SUCCESS Page 48 saved ({size_mb:.2f} MB)!")
                create_thumbnail(dest_path, thumb_path)
                break
            else:
                print(f"Attempt {attempt}: No images returned. Text: {res.text[:100]}")
                refresh_cookies(EMAIL)
                client = await init_client_for_account(EMAIL)
                await asyncio.sleep(5)
        except Exception as e:
            print(f"Attempt {attempt} error: {e}")
            refresh_cookies(EMAIL)
            client = await init_client_for_account(EMAIL)
            await asyncio.sleep(5)
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())