import asyncio
import subprocess
import time
from playwright.async_api import async_playwright

async def capture():
    server = subprocess.Popen(['npx.cmd', 'vite', 'preview', '--port', '4173'], cwd=r'R:\flip-book', stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(channel='msedge', headless=True)
            page = await browser.new_page(viewport={'width': 390, 'height': 844})

            # Screen 1: Cover (#/)
            await page.goto('http://localhost:4173/#/')
            await page.wait_for_timeout(1000)
            await page.screenshot(path=r'R:\flip-book\v2_cover.png')
            print("Captured v2_cover.png")

            # Screen 2: Bab List (#/bab)
            await page.goto('http://localhost:4173/#/bab')
            await page.wait_for_timeout(1000)
            await page.screenshot(path=r'R:\flip-book\v2_bab.png')
            print("Captured v2_bab.png")

            # Screen 3: TOC (#/toc)
            await page.goto('http://localhost:4173/#/toc')
            await page.wait_for_timeout(1000)
            await page.screenshot(path=r'R:\flip-book\v2_toc.png')
            print("Captured v2_toc.png")

            # Screen 4: Flipbook Reader (#/read/1/1)
            await page.goto('http://localhost:4173/#/read/1/1')
            await page.wait_for_timeout(1500)
            await page.screenshot(path=r'R:\flip-book\v2_read_flip.png')
            print("Captured v2_read_flip.png")

            # Screen 5: Spread Mode (#/spread/1/1)
            await page.goto('http://localhost:4173/#/spread/1/1')
            await page.wait_for_timeout(1000)
            await page.screenshot(path=r'R:\flip-book\v2_read_spread.png')
            print("Captured v2_read_spread.png")

            # Screen 6: Immersive Mode (#/immersive/1/1)
            await page.goto('http://localhost:4173/#/immersive/1/1')
            await page.wait_for_timeout(1000)
            await page.screenshot(path=r'R:\flip-book\v2_read_immersive.png')
            print("Captured v2_read_immersive.png")

            await browser.close()
    finally:
        server.terminate()

asyncio.run(capture())
