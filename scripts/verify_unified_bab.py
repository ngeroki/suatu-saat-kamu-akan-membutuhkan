import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(r"C:\Users\hans_\.gemini\antigravity\brain\64f9c90c-cfe5-4b5a-ab87-409915da565e")
BASE_URL = "http://localhost:4173"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='msedge', headless=True)
        ctx = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        page = await ctx.new_page()
        
        # 1. Open unified bab list / TOC
        await page.goto(f"{BASE_URL}/#/bab", wait_until="networkidle")
        await page.wait_for_timeout(800)
        
        # 2. Collapse Bab 1
        await page.click(".unified-bab-header[data-chap='1']")
        await page.wait_for_timeout(400)
        
        # 3. Capture all chapters collapsed (showing all 5 chapter cards with artwork)
        shot_all_cards = OUTPUT_DIR / "verify_390_all_bab_cards.png"
        await page.screenshot(path=str(shot_all_cards))
        print(f"Captured: {shot_all_cards}")
        
        # 4. Open Bab 2 dropdown
        await page.click(".unified-bab-header[data-chap='2']")
        await page.wait_for_timeout(400)
        shot_bab2_open = OUTPUT_DIR / "verify_390_bab2_dropdown.png"
        await page.screenshot(path=str(shot_bab2_open))
        print(f"Captured: {shot_bab2_open}")

        # 5. Click page 3 in Bab 2 -> Navigate to reader
        await page.click(".dropdown-page-row[data-chap='2'][data-page='3']")
        await page.wait_for_timeout(800)
        shot_jumped_reader = OUTPUT_DIR / "verify_390_jumped_from_dropdown.png"
        await page.screenshot(path=str(shot_jumped_reader))
        print(f"Captured: {shot_jumped_reader}")

        await browser.close()
        print("Done!")

if __name__ == '__main__':
    asyncio.run(run())
