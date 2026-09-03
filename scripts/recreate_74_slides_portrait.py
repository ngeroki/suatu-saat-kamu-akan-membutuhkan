import argparse
import asyncio
import json
import os
import shutil
import sys
import time
from pathlib import Path
from PIL import Image
from gemini_webapi import GeminiClient

PROJECT_ROOT = Path("R:/flip-book")
SLIDES_SRC_DIR = PROJECT_ROOT / "public" / "slides"
SLIDES_PORTRAIT_DIR = PROJECT_ROOT / "public" / "slides-portrait"
COOKIE_FILE = Path.home() / ".gemini" / "config" / "gemini_web_cookies.json"

CHAPTER_COUNTS = {
    1: 15,
    2: 15,
    3: 15,
    4: 14,
    5: 15,
}

def load_cookies():
    if not COOKIE_FILE.exists():
        raise FileNotFoundError(f"Cookie file not found at {COOKIE_FILE}")
    with open(COOKIE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def is_valid_portrait(path: Path) -> bool:
    if not path.exists():
        return False
    try:
        with Image.open(path) as img:
            w, h = img.size
            return h > w and h >= 2000
    except Exception:
        return False

async def init_client():
    cookies = load_cookies()
    client = GeminiClient(cookies["__Secure-1PSID"], cookies.get("__Secure-1PSIDTS", ""))
    await client.init(timeout=120, auto_close=False, auto_refresh=True, verbose=False)
    return client

# Load pages metadata for semantic guidance
PAGES_FILE = PROJECT_ROOT / "src" / "data" / "book-pages.json"
PAGES_DATA = []
if PAGES_FILE.exists():
    with open(PAGES_FILE, "r", encoding="utf-8") as f:
        PAGES_DATA = json.load(f)

def get_page_meta(chap: int, slide_num: int):
    starts = {1: 0, 2: 15, 3: 30, 4: 45, 5: 59}
    idx = starts.get(chap, 0) + slide_num - 1
    if 0 <= idx < len(PAGES_DATA):
        return PAGES_DATA[idx]
    return {}

def update_book_pages_json(chap: int, slide_num: int):
    if not PAGES_FILE.exists():
        return
    try:
        with open(PAGES_FILE, "r", encoding="utf-8") as f:
            pages = json.load(f)
        starts = {1: 0, 2: 15, 3: 30, 4: 45, 5: 59}
        idx = starts.get(chap, 0) + slide_num - 1
        if 0 <= idx < len(pages):
            pages[idx]["image_path"] = f"/slides-portrait/bab-0{chap}/slide-{slide_num}.jpg"
            with open(PAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(pages, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: could not update book-pages.json: {e}", file=sys.stderr)

async def process_slide(client: GeminiClient, chap: int, slide_num: int, force: bool = False):
    src_file = SLIDES_SRC_DIR / f"bab-0{chap}" / f"slide-{slide_num}.png"
    dest_dir = SLIDES_PORTRAIT_DIR / f"bab-0{chap}"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_file = dest_dir / f"slide-{slide_num}.jpg"

    if not src_file.exists():
        print(f"[Bab {chap} | Slide {slide_num}] Source file not found: {src_file}", file=sys.stderr)
        return False

    if not force and is_valid_portrait(dest_file):
        print(f"[Bab {chap} | Slide {slide_num}] ALREADY EXISTS & VALID PORTRAIT -> Skipping: {dest_file.name}")
        update_book_pages_json(chap, slide_num)
        return True

    meta = get_page_meta(chap, slide_num)
    topic_title = meta.get("title", f"Bab {chap} Slide {slide_num}")
    topic_sub = meta.get("subtitle", "")
    caption = meta.get("imageCaption", "")

    prompt = (
        f"Recreate this exact slide illustration into a vertical portrait 9:16 aspect ratio format for a mobile digital book reader.\n"
        f"Topic: {topic_title}\n"
        f"Content essence: {topic_sub}. {caption}\n"
        f"Maintain the exact same visual elements, subjects, charts, diagrams, typography, color palette, and atmosphere from the reference image, "
        f"but re-compose the layout vertically so all elements and text fit comfortably in a vertical portrait screen without cropping. "
        f"Vertical portrait 9:16 aspect ratio."
    )

    scratch_dir = PROJECT_ROOT / "scratch"
    scratch_dir.mkdir(parents=True, exist_ok=True)
    ref_opt = scratch_dir / f"ref_opt_b{chap}_s{slide_num}.jpg"
    with Image.open(src_file) as im:
        im_opt = im.copy()
        im_opt.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
        im_opt.convert("RGB").save(ref_opt, quality=90)

    for attempt in range(2):
        print(f"[Bab {chap} | Slide {slide_num}] Sending reference image to Gemini Pro (Attempt {attempt+1}/2)...")
        try:
            session = client.start_chat(model="gemini-pro")
            output = await session.send_message(prompt, files=[str(ref_opt)])

            if not output.images:
                print(f"[Bab {chap} | Slide {slide_num}] ERROR: No images returned. Output: {output.text[:100]}...", file=sys.stderr)
                if attempt == 0:
                    await asyncio.sleep(5)
                    continue
                return False

            tmp_dir = PROJECT_ROOT / "scratch"
            tmp_dir.mkdir(parents=True, exist_ok=True)
            saved_file = await output.images[0].save(path=str(tmp_dir), filename=f"recreate_b{chap}_s{slide_num}", verbose=False)

            # Copy to destination
            shutil.copy2(saved_file, str(dest_file))
            
            with Image.open(dest_file) as img:
                w, h = img.size
            print(f"[Bab {chap} | Slide {slide_num}] SUCCESS -> Saved: {dest_file.name} ({w}x{h})")
            update_book_pages_json(chap, slide_num)
            return True

        except Exception as exc:
            print(f"[Bab {chap} | Slide {slide_num}] EXCEPTION (attempt {attempt+1}): {exc}", file=sys.stderr)
            if "UNAUTHENTICATED" in str(exc) or "403" in str(exc) or "expired" in str(exc).lower():
                print(f"[Bab {chap} | Slide {slide_num}] Attempting self-healing cookie refresh via BrowserOS Neo...")
                os.system("node C:/Users/hans_/.gemini/config/skills/gemini-image-gen/scripts/get_cookies.js")
                await asyncio.sleep(3)
                try:
                    cookies = load_cookies()
                    client.psid = cookies["__Secure-1PSID"]
                    client.psidts = cookies.get("__Secure-1PSIDTS", "")
                    await client.init(timeout=120, auto_close=False, auto_refresh=True, verbose=False)
                except Exception as ce:
                    print(f"Failed to re-init client: {ce}", file=sys.stderr)
            if attempt == 0:
                await asyncio.sleep(5)
            else:
                return False

    return False

async def run(chaps: list[int], force: bool = False):
    total_slides = sum(CHAPTER_COUNTS[c] for c in chaps)
    print(f"Starting portrait redesign pipeline for {len(chaps)} chapters ({total_slides} total slides)...")

    client = await init_client()
    success_count = 0

    try:
        for chap in chaps:
            count = CHAPTER_COUNTS[chap]
            print(f"\n==========================================")
            print(f"--- PROCESSING BAB 0{chap} (1 to {count}) ---")
            print(f"==========================================")
            for s in range(1, count + 1):
                ok = await process_slide(client, chap, s, force=force)
                if ok:
                    success_count += 1
                await asyncio.sleep(2)

    finally:
        await client.close()

    print(f"\nPipeline finished! Total processed/verified: {success_count}/{total_slides}")

def main():
    parser = argparse.ArgumentParser(description="Recreate 74 landscape slides into 9:16 portrait slides using Gemini Pro")
    parser.add_argument("--chap", "-c", type=int, choices=[1, 2, 3, 4, 5], help="Specific chapter to process (1-5)")
    parser.add_argument("--all", action="store_true", help="Process all 5 chapters (74 slides)")
    parser.add_argument("--force", "-f", action="store_true", help="Force regenerate even if already exists")

    args = parser.parse_args()
    if args.chap:
        selected_chaps = [args.chap]
    elif args.all:
        selected_chaps = [1, 2, 3, 4, 5]
    else:
        # Default to chapter 1
        selected_chaps = [1]

    asyncio.run(run(selected_chaps, force=args.force))

if __name__ == "__main__":
    main()
