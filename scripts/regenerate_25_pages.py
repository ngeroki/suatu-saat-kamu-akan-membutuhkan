import asyncio
import json
import os
import shutil
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
PROMPTS_FILE = BASE_DIR / "scripts" / "target_25_prompts.json"
PROGRESS_FILE = BASE_DIR / "scripts" / "regen_25_progress.json"
BACKUP_DIR = BASE_DIR / "storage" / "backup_target_25_original"

def load_json(p: Path):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(p: Path, data):
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def refresh_cookies(email: str):
    print(f"[{email}] Refreshing cookies via BrowserOS Neo...", flush=True)
    try:
        subprocess.run(["node", str(COOKIE_EXTRACTOR), email], cwd=str(BASE_DIR), check=True, capture_output=True, text=True)
        print(f"[{email}] Cookies refreshed.", flush=True)
    except Exception as e:
        print(f"[{email}] Refresh error: {e}", flush=True)

def get_cookies(email: str):
    cfile = CONFIG_DIR / f"gemini_web_cookies_{email}.json"
    if not cfile.exists():
        refresh_cookies(email)
    return load_json(cfile)

async def init_client(email: str, proxy: str = None) -> GeminiClient:
    for attempt in range(1, 4):
        try:
            cookies = get_cookies(email)
            client = GeminiClient(cookies.get("__Secure-1PSID"), cookies.get("__Secure-1PSIDTS"), proxy=proxy, auto_refresh=False, verbose=False)
            await client.init(timeout=45)
            return client
        except Exception as e:
            print(f"[{email}] Init attempt {attempt} failed: {e}. Refreshing...", flush=True)
            refresh_cookies(email)
            await asyncio.sleep(4)
    cookies = get_cookies(email)
    client = GeminiClient(cookies.get("__Secure-1PSID"), cookies.get("__Secure-1PSIDTS"), proxy=proxy, auto_refresh=False, verbose=False)
    await client.init(timeout=45)
    return client

def create_thumbnail(src_path: Path, thumb_path: Path):
    try:
        thumb_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src_path) as img:
            img.thumbnail((512, 910), Image.Resampling.LANCZOS)
            img.save(thumb_path, "JPEG", quality=85, optimize=True)
        size_kb = thumb_path.stat().st_size / 1024
        print(f"  [THUMB] Created: {thumb_path.name} ({size_kb:.1f} KB)", flush=True)
    except Exception as e:
        print(f"  [THUMB] Error creating {thumb_path}: {e}", flush=True)

def backup_original_files(book_pages, target_keys):
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    bp_map = {p["page_number"]: p for p in book_pages}
    for p_num in target_keys:
        if p_num not in bp_map:
            continue
        rel = bp_map[p_num]["image_path"].lstrip("/")
        src = BASE_DIR / "public" / rel
        bak = BACKUP_DIR / rel
        if src.exists() and not bak.exists():
            bak.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, bak)
            print(f"[BACKUP] Page {p_num} -> {bak.relative_to(BASE_DIR)}")

async def worker(worker_id: str, email: str, proxy: str, queue: asyncio.Queue, progress: dict, lock: asyncio.Lock, bp_map: dict, prompts: dict):
    print(f"[{worker_id}] Starting for {email} (proxy: {proxy or 'Direct'})...", flush=True)
    client = await init_client(email, proxy=proxy)
    
    while not queue.empty():
        try:
            p_num = queue.get_nowait()
        except asyncio.QueueEmpty:
            break
            
        mapping = bp_map[p_num]
        dest_rel = mapping["image_path"].lstrip("/")
        dest_path = BASE_DIR / "public" / dest_rel
        thumb_rel = mapping.get("thumbnail", dest_rel.replace("slides-portrait", "thumbnails").replace("slide-", "thumb-")).lstrip("/")
        thumb_path = BASE_DIR / "public" / thumb_rel
        
        prompt_text = prompts[str(p_num)]
        print(f"\n==================================================", flush=True)
        print(f"[{worker_id}] GENERATING PAGE {p_num:02d}: {mapping.get('title')}", flush=True)
        print(f"==================================================", flush=True)
        
        success = False
        for attempt in range(1, 4):
            try:
                chat = client.start_chat(model="gemini-pro")
                res = await chat.send_message(f"Generate an image of {prompt_text}")
                
                if res.images and len(res.images) > 0:
                    dest_path.parent.mkdir(parents=True, exist_ok=True)
                    tmp_dest = dest_path.with_suffix(".tmp.jpg")
                    await res.images[0].save(path=str(tmp_dest.parent), filename=tmp_dest.name, verbose=False)
                    
                    if tmp_dest.exists() and tmp_dest.stat().st_size > 1_000_000:
                        with Image.open(tmp_dest) as im:
                            w, h = im.size
                            fmt = im.format
                        if fmt == "JPEG" and h > w:
                            shutil.move(tmp_dest, dest_path)
                            size_mb = dest_path.stat().st_size / 1024 / 1024
                            print(f"[{worker_id}] SUCCESS: Page {p_num:02d} saved to {dest_rel} ({size_mb:.2f} MB, {w}x{h})", flush=True)
                            create_thumbnail(dest_path, thumb_path)
                            
                            async with lock:
                                if p_num not in progress["completed"]:
                                    progress["completed"].append(p_num)
                                if p_num in progress["failed"]:
                                    progress["failed"].remove(p_num)
                                save_json(PROGRESS_FILE, progress)
                            success = True
                            break
                        else:
                            print(f"[{worker_id}] Validation warning: invalid aspect or format ({w}x{h}, {fmt})", flush=True)
                    else:
                        print(f"[{worker_id}] Image too small or corrupted on attempt {attempt}.", flush=True)
                else:
                    snippet = res.text[:100] if res.text else "No text"
                    print(f"[{worker_id}] No image on attempt {attempt}. Response: {snippet}", flush=True)
                    if any(w in snippet.lower() for w in ["sign", "signed in", "can't seem to create"]):
                        refresh_cookies(email)
                        client = await init_client(email, proxy=proxy)
                await asyncio.sleep(4)
            except Exception as e:
                print(f"[{worker_id}] Error Page {p_num} attempt {attempt}: {e}", flush=True)
                err_str = str(e).lower()
                if any(w in err_str for w in ["auth", "expired", "permission denied"]):
                    refresh_cookies(email)
                    client = await init_client(email, proxy=proxy)
                await asyncio.sleep(5)
                
        if not success:
            print(f"[{worker_id}] FAILED PAGE {p_num:02d} after 3 attempts!", flush=True)
            async with lock:
                if p_num not in progress["failed"]:
                    progress["failed"].append(p_num)
                save_json(PROGRESS_FILE, progress)
                
        queue.task_done()

async def main():
    prompts = load_json(PROMPTS_FILE)
    target_keys = sorted([int(k) for k in prompts.keys()])
    
    book_pages = load_json(BASE_DIR / "src" / "data" / "book-pages.json")
    bp_map = {p["page_number"]: p for p in book_pages}
    
    # Backup original images
    backup_original_files(book_pages, target_keys)
    
    # Progress check
    progress = {"completed": [], "failed": []}
    if PROGRESS_FILE.exists():
        try:
            progress = load_json(PROGRESS_FILE)
        except Exception:
            pass
            
    # Check if Page 4 from scratch test exists and can be adopted
    test_p4 = BASE_DIR / "scratch" / "test_p4.jpg"
    if 4 in target_keys and 4 not in progress["completed"] and test_p4.exists() and test_p4.stat().st_size > 1_000_000:
        p4_dest = BASE_DIR / "public" / bp_map[4]["image_path"].lstrip("/")
        p4_dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(test_p4, p4_dest)
        p4_thumb = BASE_DIR / "public" / bp_map[4].get("thumbnail", "").lstrip("/")
        create_thumbnail(p4_dest, p4_thumb)
        progress["completed"].append(4)
        save_json(PROGRESS_FILE, progress)
        print("[ADOPT] Page 4 adopted from test_p4.jpg!")

    queue = asyncio.Queue()
    for p_num in target_keys:
        if p_num not in progress["completed"]:
            queue.put_nowait(p_num)
            
    print(f"Total target pages: {len(target_keys)}")
    print(f"Already completed: {len(progress['completed'])}")
    print(f"Remaining in queue: {queue.qsize()}")
    
    if queue.empty():
        print("All target pages are already completed!")
        return
        
    lock = asyncio.Lock()
    
    # Launch workers: Worker-1 (ngempetbuko) and Worker-2 (embobotbnbb)
    workers = [
        asyncio.create_task(worker("Worker-1", "ngempetbuko@gmail.com", None, queue, progress, lock, bp_map, prompts)),
        asyncio.create_task(worker("Worker-2", "embobotbnbb@gmail.com", None, queue, progress, lock, bp_map, prompts))
    ]
    
    await queue.join()
    for w in workers:
        w.cancel()
    print("\n==================================================")
    print("Generation run finished!")
    print(f"Completed ({len(progress['completed'])}): {sorted(progress['completed'])}")
    print(f"Failed ({len(progress['failed'])}): {sorted(progress['failed'])}")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(main())
