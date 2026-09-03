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
        
        # 1. Open Reader at Page 2 (Bab 1 Page 2: Deja Vu)
        await page.goto(f"{BASE_URL}/#/read/1/2", wait_until="networkidle")
        await page.wait_for_timeout(800)
        shot_collapsed = OUTPUT_DIR / "verify_390_peek_collapsed.png"
        await page.screenshot(path=str(shot_collapsed))
        print(f"Captured: {shot_collapsed}")
        
        # 2. Tap drawer header to expand
        await page.click("#m-drawer-header")
        await page.wait_for_timeout(600)
        shot_expanded = OUTPUT_DIR / "verify_390_peek_expanded.png"
        await page.screenshot(path=str(shot_expanded))
        print(f"Captured: {shot_expanded}")

        # 3. Open Reader at Page 17 (Bab 2 Page 2: Bento Kopi Kaliurang)
        await page.goto(f"{BASE_URL}/#/read/2/2", wait_until="networkidle")
        await page.wait_for_timeout(800)
        shot_p17_collapsed = OUTPUT_DIR / "verify_390_peek_p17_collapsed.png"
        await page.screenshot(path=str(shot_p17_collapsed))
        print(f"Captured: {shot_p17_collapsed}")

        # 4. Expand Page 17
        await page.click("#m-drawer-header")
        await page.wait_for_timeout(600)
        shot_p17_expanded = OUTPUT_DIR / "verify_390_peek_p17_expanded.png"
        await page.screenshot(path=str(shot_p17_expanded))
        print(f"Captured: {shot_p17_expanded}")

        await browser.close()
        print("Done!")

if __name__ == '__main__':
    asyncio.run(run())
