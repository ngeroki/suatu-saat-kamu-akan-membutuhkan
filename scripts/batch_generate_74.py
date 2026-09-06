import asyncio
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from PIL import Image
from gemini_webapi import GeminiClient

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = Path.home() / ".gemini" / "config"
COOKIE_EXTRACTOR = BASE_DIR / "scripts" / "extract-account-cookies.cjs"
PROGRESS_FILE = BASE_DIR / "scripts" / "generation_progress.json"

ACCOUNTS = [
    {
        "email": "ngempetbuko@gmail.com", 
        "name": "Worker-1 (ngempetbuko - Direct)",
        "proxy": None
    },
    {
        "email": "embobotbnbb@gmail.com", 
        "name": "Worker-2 (embobotbnbb - MobileNode)",
        "proxy": "socks5h://192.168.1.5:1080"
    }
]

def load_json(p: Path):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(p: Path, data):
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def refresh_cookies(email: str):
    print(f"[{email}] Refreshing warm cookies from BrowserOS Neo...", flush=True)
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

async def init_client_for_account(email: str, proxy: str = None) -> GeminiClient:
    for attempt in range(1, 4):
        try:
            cookies = get_cookies_for_account(email)
            psid = cookies.get("__Secure-1PSID")
            psidts = cookies.get("__Secure-1PSIDTS")
            client = GeminiClient(psid, psidts, proxy=proxy, auto_refresh=False, verbose=False)
            await client.init(timeout=45)
            return client
        except Exception as e:
            print(f"[{email}] Init attempt {attempt} failed ({e}), refreshing...", flush=True)
            refresh_cookies(email)
            if proxy and attempt == 1:
                recover_proxy()
            await asyncio.sleep(5)
    cookies = get_cookies_for_account(email)
    client = GeminiClient(cookies.get("__Secure-1PSID"), cookies.get("__Secure-1PSIDTS"), proxy=proxy, auto_refresh=False, verbose=False)
    await client.init(timeout=45)
    return client

def create_thumbnail(src_path: Path, thumb_path: Path):
    try:
        thumb_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src_path) as img:
            img.thumbnail((512, 910), Image.Resampling.LANCZOS)
            img.save(thumb_path, "JPEG", quality=85, optimize=True)
    except Exception as e:
        print(f"[THUMB] Warning: Failed to create thumbnail {thumb_path}: {e}", flush=True)

def recover_proxy():
    try:
        adb_bin = r"C:\Users\hans_\scoop\apps\adb\current\platform-tools\adb.exe"
        ep = "192.168.1.5:5555"
        subprocess.run([adb_bin, "connect", ep], capture_output=True, timeout=10)
        subprocess.run([adb_bin, "-s", ep, "shell", "svc", "power", "stayon", "true"], capture_output=True, timeout=10)
        subprocess.run([adb_bin, "-s", ep, "shell", "monkey", "-p", "com.dataproxy", "-c", "android.intent.category.LAUNCHER", "1"], capture_output=True, timeout=10)
        time.sleep(1)
        subprocess.run([adb_bin, "-s", ep, "shell", "input", "tap", "540", "600"], capture_output=True, timeout=10)
        print("[RECOVER_PROXY] DataProxy awakened and toggled.", flush=True)
    except Exception as e:
        print(f"[RECOVER_PROXY] Error: {e}", flush=True)

async def worker_task(queue: asyncio.Queue, account_info: dict, progress: dict, lock: asyncio.Lock):
    email = account_info["email"]
    worker_name = account_info["name"]
    proxy = account_info.get("proxy")
    print(f"[{worker_name}] Starting worker for {email} (proxy: {proxy or 'Direct'})...", flush=True)
    
    client = await init_client_for_account(email, proxy=proxy)
    
    while not queue.empty():
        item = await queue.get()
        p_num = item["page_number"]
        dest_rel = item["dest_slide"]
        dest_path = BASE_DIR / "public" / dest_rel.lstrip("/")
        thumb_rel = item["dest_thumb"]
        thumb_path = BASE_DIR / "public" / thumb_rel.lstrip("/")
        
        # Check if already completed and file is fresh (> 2MB)
        if dest_path.exists() and dest_path.stat().st_size > 2_000_000 and str(p_num) in progress.get("completed", []):
            print(f"[{worker_name}] Page {p_num} already completed ({dest_path.stat().st_size / 1024 / 1024:.2f}MB), skipping.", flush=True)
            queue.task_done()
            continue
            
        print(f"\n>>> [{worker_name}] Generating PAGE {p_num:02d}: '{item['title']}'...", flush=True)
        prompt = f"Generate an image of {item['prompt']}, vertical portrait 9:16 aspect ratio"
        
        success = False
        for attempt in range(1, 4):
            try:
                chat = client.start_chat(model="gemini-pro")
                res = await chat.send_message(prompt)
                
                if res.images and len(res.images) > 0:
                    dest_path.parent.mkdir(parents=True, exist_ok=True)
                    saved = await res.images[0].save(
                        path=str(dest_path.parent),
                        filename=dest_path.name,
                        verbose=False
                    )
                    size_mb = dest_path.stat().st_size / 1024 / 1024
                    print(f"[{worker_name}] SUCCESS PAGE {p_num:02d} saved to {dest_rel} ({size_mb:.2f} MB)", flush=True)
                    
                    # Create thumbnail
                    create_thumbnail(dest_path, thumb_path)
                    
                    async with lock:
                        if "completed" not in progress:
                            progress["completed"] = []
                        if str(p_num) not in progress["completed"]:
                            progress["completed"].append(str(p_num))
                        if "failed" in progress and p_num in progress["failed"]:
                            progress["failed"].remove(p_num)
                        save_json(PROGRESS_FILE, progress)
                        
                    success = True
                    break
                else:
                    text_snippet = res.text[:100] if res.text else "No text"
                    print(f"[{worker_name}] Warning: No images returned for Page {p_num} on attempt {attempt}. Text: {text_snippet}", flush=True)
                    text_lower = text_snippet.lower()
                    if any(k in text_lower for k in ("sign", "signed in", "can't seem to create", "can't create", "create it right now")):
                        print(f"[{worker_name}] Detected session expiration from response text. Refreshing cookies...", flush=True)
                        refresh_cookies(email)
                        client = await init_client_for_account(email, proxy=proxy)
                    await asyncio.sleep(5)
            except Exception as exc:
                print(f"[{worker_name}] Error Page {p_num} attempt {attempt}: {exc}", flush=True)
                err_str = str(exc).lower()
                if any(k in err_str for k in ("unauthenticated", "cookies have expired", "permission denied")):
                    refresh_cookies(email)
                    client = await init_client_for_account(email, proxy=proxy)
                elif any(k in err_str for k in ("failed to connect", "connection timed out", "curl: (7)", "curl: (28)")):
                    if proxy:
                        print(f"[{worker_name}] Proxy connection glitch detected. Attempting recovery...", flush=True)
                        recover_proxy()
                        await asyncio.sleep(3)
                        client = await init_client_for_account(email, proxy=proxy)
                await asyncio.sleep(6)
                
        if not success:
            print(f"[{worker_name}] FAILED to generate Page {p_num} after 3 attempts!", flush=True)
            async with lock:
                if "failed" not in progress:
                    progress["failed"] = []
                if p_num not in progress["failed"]:
                    progress["failed"].append(p_num)
                save_json(PROGRESS_FILE, progress)
                
        queue.task_done()
        # Polite spacing
        await asyncio.sleep(2)
        
    await client.close()
    print(f"[{worker_name}] Worker completed all assigned queue items.", flush=True)

async def main():
    visual_data = load_json(BASE_DIR / "src" / "data" / "visual-narrative-74.json")
    book_pages = load_json(BASE_DIR / "src" / "data" / "book-pages.json")
    
    # Build lookup
    pages_map = {}
    for bp in book_pages:
        pages_map[bp["page_number"]] = {
            "slide": bp["image_path"],
            "thumb": bp.get("thumbnail", bp["image_path"].replace("slides-portrait", "thumbnails").replace("slide-", "thumb-"))
        }
        
    progress = {}
    if PROGRESS_FILE.exists():
        try:
            progress = load_json(PROGRESS_FILE)
        except Exception:
            progress = {"completed": [], "failed": []}
    else:
        progress = {"completed": [], "failed": []}
        
    # Page 1 is already generated and verified
    p1_path = BASE_DIR / "public" / "slides-portrait" / "bab-01" / "slide-1.jpg"
    if p1_path.exists() and p1_path.stat().st_size > 2_000_000 and "1" not in progress.get("completed", []):
        progress.setdefault("completed", []).append("1")
        # Ensure thumb exists
        create_thumbnail(p1_path, BASE_DIR / "public" / "thumbnails" / "bab-01" / "thumb-1.jpg")
        save_json(PROGRESS_FILE, progress)
        print("Page 01 marked as already completed (3.5MB verified).")
        
    # Divide tasks into two queues or a single shared queue
    # A single shared queue ensures load balancing (if one worker is faster, it picks up more)
    queue = asyncio.Queue()
    for item in visual_data:
        p_num = item["page_number"]
        mapping = pages_map.get(p_num, {})
        queue.put_nowait({
            "page_number": p_num,
            "title": item["title"],
            "prompt": item["image_prompt"],
            "dest_slide": mapping.get("slide", f"/slides-portrait/bab-01/slide-{p_num}.jpg"),
            "dest_thumb": mapping.get("thumb", f"/thumbnails/bab-01/thumb-{p_num}.jpg")
        })
        
    lock = asyncio.Lock()
    print(f"Loaded {queue.qsize()} pages into queue. Launching 2 concurrent workers...")
    
    start_time = time.time()
    await asyncio.gather(
        worker_task(queue, ACCOUNTS[0], progress, lock),
        worker_task(queue, ACCOUNTS[1], progress, lock),
        return_exceptions=True
    )
    
    total_time = time.time() - start_time
    print(f"\n=======================================================")
    print(f"FIRST PASS FINISHED in {total_time/60:.2f} minutes!")
    print(f"Completed: {len(progress.get('completed', []))} / 74")
    print(f"Failed: {progress.get('failed', [])}")
    print(f"=======================================================\n")
    
    # Retry pass for any failed items using Worker 1 (Direct)
    if progress.get("failed") and len(progress["failed"]) > 0:
        failed_pages = list(progress["failed"])
        print(f"\n[RETRY PASS] Retrying {len(failed_pages)} failed pages with Worker-1 (Direct)...", flush=True)
        retry_queue = asyncio.Queue()
        for item in visual_data:
            if item["page_number"] in failed_pages:
                p_num = item["page_number"]
                mapping = pages_map.get(p_num, {})
                retry_queue.put_nowait({
                    "page_number": p_num,
                    "title": item["title"],
                    "prompt": item["image_prompt"],
                    "dest_slide": mapping.get("slide", f"/slides-portrait/bab-01/slide-{p_num}.jpg"),
                    "dest_thumb": mapping.get("thumb", f"/thumbnails/bab-01/thumb-{p_num}.jpg")
                })
        if not retry_queue.empty():
            await worker_task(retry_queue, ACCOUNTS[0], progress, lock)
            
    print(f"\n=======================================================")
    print(f"ALL GENERATIONS FINISHED!")
    print(f"Final Completed: {len(progress.get('completed', []))} / 74")
    print(f"Final Failed: {progress.get('failed', [])}")
    print(f"=======================================================\n")
    
    # Verification & Deployment
    if len(progress.get("completed", [])) >= 70:
        print("[POST-GEN] Running npm run build...", flush=True)
        subprocess.run(["npm", "run", "build"], cwd=str(BASE_DIR), check=True)
        
        print("[POST-GEN] Committing to Git...", flush=True)
        subprocess.run(["git", "add", "-A"], cwd=str(BASE_DIR), check=True)
        subprocess.run([
            "git", "commit", "-m", 
            "feat(assets): full 74-page fine-art master visual narrative regeneration"
        ], cwd=str(BASE_DIR), check=True)
        
        print("[POST-GEN] Pushing to GitHub (Cloudflare Pages auto-deploy)...", flush=True)
        subprocess.run(["git", "push", "origin", "master"], cwd=str(BASE_DIR), check=True)
        
        print("\n[POST-GEN] DEPLOYMENT COMPLETE! Cloudflare Pages build triggered. PC will remain ON (User requested manual shutdown).", flush=True)
    else:
        print("[POST-GEN] Warning: Not enough pages completed. Please inspect logs.", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
