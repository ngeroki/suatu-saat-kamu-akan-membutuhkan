import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='msedge', headless=True)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )
        page = await context.new_page()
        file_url = 'file:///' + str(Path('r:/flip-book/index.html').resolve()).replace('\\', '/')
        await page.goto(file_url, wait_until='networkidle')
        await page.wait_for_timeout(1000)
        
        # 1. Cover
        await page.screenshot(path='r:/flip-book/screenshot_cover.png')
        print('1. Cover captured')
        
        # 2. Bab cards
        await page.evaluate("document.getElementById('phone-viewport').scrollTop = 780")
        await page.wait_for_timeout(600)
        await page.screenshot(path='r:/flip-book/screenshot_bab.png')
        print('2. Bab captured')

        # 3. TOC
        await page.evaluate("document.getElementById('phone-viewport').scrollTop = 2500; toggleTocAccordion();")
        await page.wait_for_timeout(600)
        await page.screenshot(path='r:/flip-book/screenshot_toc.png')
        print('3. TOC captured')

        # 4. Closing & Footer
        await page.evaluate("document.getElementById('phone-viewport').scrollTop = 99999")
        await page.wait_for_timeout(600)
        await page.screenshot(path='r:/flip-book/screenshot_closing.png')
        print('4. Closing captured')
        
        # 5. Spread reader
        await page.evaluate("openReader(0)")
        await page.wait_for_timeout(800)
        await page.screenshot(path='r:/flip-book/screenshot_spread.png')
        print('5. Spread captured')

        # 6. Immersive reader
        await page.evaluate("switchReaderMode('read')")
        await page.wait_for_timeout(800)
        await page.screenshot(path='r:/flip-book/screenshot_immersive.png')
        print('6. Immersive captured')
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(capture())
