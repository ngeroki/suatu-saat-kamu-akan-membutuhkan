import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(r"C:\Users\hans_\.gemini\antigravity\brain\64f9c90c-cfe5-4b5a-ab87-409915da565e")
BASE_URL = "http://localhost:4173"

async def run_verifications():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='msedge', headless=True)
        
        # 1. Test 390x844 (iPhone 12/13/14 Standard)
        print("Testing 390x844...")
        ctx_390 = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        page = await ctx_390.new_page()
        
        # Page 1 Visual Mode
        await page.goto(f"{BASE_URL}/#/read/1/1", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        p1_visual = OUTPUT_DIR / "verify_390_p1_visual.png"
        await page.screenshot(path=str(p1_visual))
        print(f"Captured: {p1_visual}")
        
        # Switch to Naskah Mode on Page 1
        await page.click("#dock-btn-naskah")
        await page.wait_for_timeout(600)
        p1_naskah = OUTPUT_DIR / "verify_390_p1_naskah.png"
        await page.screenshot(path=str(p1_naskah))
        print(f"Captured: {p1_naskah}")
        
        # Switch back to Visual Mode
        await page.click("#dock-btn-visual")
        await page.wait_for_timeout(600)
        
        # Go to Page 35 (Bab 3, Page 5)
        # Note: In our dataset, Bab 3 page 5 corresponds to global index 34 -> page 35
        await page.goto(f"{BASE_URL}/#/read/3/5", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        p35_visual = OUTPUT_DIR / "verify_390_p35_visual.png"
        await page.screenshot(path=str(p35_visual))
        print(f"Captured: {p35_visual}")
        
        # Switch to Naskah on Page 35
        await page.click("#dock-btn-naskah")
        await page.wait_for_timeout(600)
        p35_naskah = OUTPUT_DIR / "verify_390_p35_naskah.png"
        await page.screenshot(path=str(p35_naskah))
        print(f"Captured: {p35_naskah}")
        
        # Go to Page 74 (Bab 5, Page 15 - Last Page)
        await page.goto(f"{BASE_URL}/#/read/5/15", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        p74_naskah = OUTPUT_DIR / "verify_390_p74_naskah.png"
        await page.screenshot(path=str(p74_naskah))
        print(f"Captured: {p74_naskah}")
        
        await page.click("#dock-btn-visual")
        await page.wait_for_timeout(600)
        p74_visual = OUTPUT_DIR / "verify_390_p74_visual.png"
        await page.screenshot(path=str(p74_visual))
        print(f"Captured: {p74_visual}")
        
        await ctx_390.close()
        
        # 2. Test 360x800 (Compact Android)
        print("Testing 360x800...")
        ctx_360 = await browser.new_context(
            viewport={'width': 360, 'height': 800},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        page_360 = await ctx_360.new_page()
        await page_360.goto(f"{BASE_URL}/#/read/1/1", wait_until="networkidle")
        await page_360.wait_for_timeout(1000)
        p1_360 = OUTPUT_DIR / "verify_360_p1_visual.png"
        await page_360.screenshot(path=str(p1_360))
        print(f"Captured: {p1_360}")
        await ctx_360.close()
        
        # 3. Test 430x932 (Large iPhone Pro Max)
        print("Testing 430x932...")
        ctx_430 = await browser.new_context(
            viewport={'width': 430, 'height': 932},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        page_430 = await ctx_430.new_page()
        await page_430.goto(f"{BASE_URL}/#/read/1/1", wait_until="networkidle")
        await page_430.wait_for_timeout(1000)
        p1_430 = OUTPUT_DIR / "verify_430_p1_visual.png"
        await page_430.screenshot(path=str(p1_430))
        print(f"Captured: {p1_430}")
        await ctx_430.close()
        
        # 4. Test Desktop 1280x800
        print("Testing Desktop 1280x800...")
        ctx_desktop = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            device_scale_factor=1,
            is_mobile=False
        )
        page_desktop = await ctx_desktop.new_page()
        await page_desktop.goto(f"{BASE_URL}/#/read/1/1", wait_until="networkidle")
        await page_desktop.wait_for_timeout(1000)
        p1_desktop = OUTPUT_DIR / "verify_desktop_spread.png"
        await page_desktop.screenshot(path=str(p1_desktop))
        print(f"Captured: {p1_desktop}")
        await ctx_desktop.close()
        
        await browser.close()
        print("All verification screenshots successfully captured!")

if __name__ == '__main__':
    asyncio.run(run_verifications())
