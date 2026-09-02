import asyncio
from playwright.async_api import async_playwright

async def full_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        
        # 1. Cover
        await page.goto("http://localhost:4173/#/")
        await page.wait_for_timeout(600)
        await page.screenshot(path=r"R:\flip-book\audit_1_cover.png")
        print("1. Cover loaded")

        # 2. Click Buka Buku
        await page.click("#btn-buka-buku")
        await page.wait_for_timeout(600)
        await page.screenshot(path=r"R:\flip-book\audit_2_reader_b1p1.png")
        print("2. Reader Bab 1 Page 1 loaded")

        # 3. Flip to Page 2
        await page.click("#nav-btn-next")
        await page.wait_for_timeout(600)
        await page.screenshot(path=r"R:\flip-book\audit_3_reader_b1p2.png")
        print("3. Reader Bab 1 Page 2 loaded")

        # 4. Click Kembali ke Bab
        await page.click("#reader-back-btn")
        await page.wait_for_timeout(600)
        await page.screenshot(path=r"R:\flip-book\audit_4_bab_list.png")
        print("4. Bab list loaded")

        # 5. Click Bab 02
        await page.click(".bab-card-exact[data-chap='2']")
        await page.wait_for_timeout(600)
        await page.screenshot(path=r"R:\flip-book\audit_5_reader_b2p1.png")
        print("5. Reader Bab 2 Page 1 loaded")

        # 6. Click Tab Daftar Isi
        await page.click("#tab-btn-toc")
        await page.wait_for_timeout(600)
        await page.screenshot(path=r"R:\flip-book\audit_6_toc.png")
        print("6. TOC loaded")

        # 7. Expand Bab 02 in TOC and click a subitem
        await page.click(".toc-accordion-block:nth-child(2) .toc-accordion-header")
        await page.wait_for_timeout(400)
        subitems = await page.query_selector_all(".toc-accordion-block:nth-child(2) .toc-subitem-row")
        if len(subitems) > 1:
            await subitems[1].click()
            await page.wait_for_timeout(600)
            await page.screenshot(path=r"R:\flip-book\audit_7_jumped_from_toc.png")
            print("7. Jumped from TOC to reader successfully!")

        await browser.close()

asyncio.run(full_audit())
