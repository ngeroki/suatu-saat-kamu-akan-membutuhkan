# -*- coding: utf-8 -*-
"""
Script to compile and generate the complete R:\flip-book\index.html
incorporating all 5 chapters, all 74 pages, realistic Web Audio API sound,
3D book spread, immersive reader, responsive phone simulator, closing quote, and footer.
"""
import json
import os

def main():
    # 1. Load chapters raw
    with open('R:/flip-book/chapters_raw.json', 'r', encoding='utf-8') as f:
        chapters_raw = json.load(f)

    # 2. Build flat ALL_PAGES mapping
    all_pages = []
    for ch in chapters_raw:
        for p in ch['pages']:
            item = dict(p)
            item['chapter_id'] = ch['id']
            item['chapter_num'] = ch['num']
            item['chapter_title'] = ch['title']
            item['chapter_subtitle'] = ch['subtitle']
            item['chapter_image'] = ch['image']
            item['chapter_total_pages'] = len(ch['pages'])
            all_pages.append(item)

    chapters_json_str = json.dumps(chapters_raw, ensure_ascii=False)
    all_pages_json_str = json.dumps(all_pages, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>SUATU SAAT — Digital Art Book & Field Guide</title>
  <meta name="description" content="Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri. 5 Bab · 74 Halaman. Panduan kesadaran, anatomi energi, dan biohacking spiritual Nusantara.">
  <meta name="theme-color" content="#0A0908">

  <!-- Google Fonts: Cinzel, Cormorant Garamond, Lora, Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    /* === DESIGN SYSTEM & LUXURY EARTHY PALETTE === */
    :root {{
      --bg-obsidian: #0A0908;
      --bg-charcoal: #141311;
      --bg-card: #181714;
      --bg-card-hover: #22201B;
      --border-gold: rgba(197, 160, 89, 0.25);
      --border-subtle: rgba(255, 255, 255, 0.08);
      --gold-accent: #C5A059;
      --gold-light: #E8D7B8;
      --gold-dim: #8F7645;
      --bone-paper: #F9F6F0;
      --bone-cream: #EDE7DC;
      --bone-dark: #DCD4C5;
      --ink-dark: #191815;
      --ink-muted: #57534A;
      --text-light: #ECE5D8;
      --text-muted: #A39A8B;
      --phone-width: 390px;
    }}

    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }}

    body {{
      background-color: #060605;
      color: var(--text-light);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
    }}

    /* Custom Scrollbar */
    ::-webkit-scrollbar {{
      width: 5px;
      height: 5px;
    }}
    ::-webkit-scrollbar-track {{
      background: #0A0908;
    }}
    ::-webkit-scrollbar-thumb {{
      background: #2A2722;
      border-radius: 3px;
    }}
    ::-webkit-scrollbar-thumb:hover {{
      background: var(--gold-accent);
    }}

    /* Desktop Simulator Toolbar */
    #simulator-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1100px;
      padding: 10px 20px;
      background: rgba(14, 13, 11, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 1000;
      gap: 12px;
      flex-wrap: wrap;
    }}

    .sim-brand {{
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 0.2em;
      color: var(--gold-accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .sim-group {{
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .sim-label {{
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-right: 4px;
    }}

    .sim-pill {{
      background: #1A1815;
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
      padding: 5px 11px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }}
    .sim-pill:hover {{
      color: var(--text-light);
      border-color: var(--border-gold);
    }}
    .sim-pill.active {{
      background: var(--gold-accent);
      color: #0A0908;
      font-weight: 700;
      border-color: var(--gold-accent);
    }}

    /* Phone Viewport Container */
    #phone-viewport {{
      width: var(--phone-width, 390px);
      height: 844px;
      max-height: 90vh;
      margin: 16px auto 24px auto;
      border-radius: 42px;
      border: 8px solid #1C1B18;
      box-shadow: 0 25px 65px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      background: #0A0908;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      scroll-behavior: smooth;
    }}

    /* Mobile Responsive Viewport Override */
    @media (max-width: 520px) {{
      #simulator-bar {{
        display: none !important;
      }}
      #phone-viewport {{
        width: 100vw !important;
        height: 100vh !important;
        max-height: none !important;
        margin: 0 !important;
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }}
    }}

    /* Off-canvas Menu Drawer */
    #menu-drawer {{
      position: absolute;
      top: 0;
      left: 0;
      width: 280px;
      height: 100%;
      background: #11100E;
      border-right: 1px solid var(--border-gold);
      z-index: 600;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      padding: 24px;
      box-shadow: 12px 0 35px rgba(0,0,0,0.85);
    }}
    #menu-drawer.open {{
      transform: translateX(0);
    }}
    .drawer-backdrop {{
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      z-index: 590;
      display: none;
    }}
    .drawer-backdrop.active {{
      display: block;
    }}
    .drawer-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 20px;
    }}
    .drawer-brand {{
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 0.2em;
      color: var(--gold-accent);
    }}
    .drawer-close {{
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 20px;
      cursor: pointer;
    }}
    .drawer-nav {{
      display: flex;
      flex-direction: column;
      gap: 8px;
    }}
    .drawer-item {{
      color: var(--text-light);
      text-decoration: none;
      font-size: 13px;
      padding: 10px 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.2s ease;
      cursor: pointer;
    }}
    .drawer-item:hover {{
      background: #1C1B18;
      color: var(--gold-accent);
    }}

    /* === HOME VIEW CONTAINER === */
    #home-view {{
      display: block;
      position: relative;
      width: 100%;
    }}

    /* Screen 1: Hero Cover */
    #screen-cover {{
      position: relative;
      min-height: 820px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: url('assets/hero_bg.jpg') center top / cover no-repeat;
      padding: 24px 20px 32px 20px;
      overflow: hidden;
    }}
    #screen-cover::before {{
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0.72) 48%, rgba(10,9,8,0.98) 96%);
      pointer-events: none;
    }}

    .cover-header {{
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }}
    .cover-brand {{
      font-family: 'Cinzel', serif;
      font-size: 16px;
      letter-spacing: 0.28em;
      color: var(--bone-paper);
      font-weight: 600;
    }}
    .cover-menu-btn {{
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: var(--bone-paper);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .cover-menu-btn:hover {{
      border-color: var(--gold-accent);
      color: var(--gold-accent);
    }}

    .cover-hero-content {{
      position: relative;
      z-index: 10;
      margin-top: 20px;
      text-align: center;
    }}
    .cover-badge {{
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold-accent);
      background: rgba(197, 160, 89, 0.12);
      padding: 4px 14px;
      border-radius: 14px;
      border: 1px solid var(--border-gold);
      margin-bottom: 12px;
    }}
    .cover-title {{
      font-family: 'Cinzel', serif;
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 0.18em;
      line-height: 1.08;
      color: var(--bone-paper);
      margin-bottom: 12px;
      text-shadow: 0 4px 18px rgba(0,0,0,0.85);
    }}
    .cover-subtitle {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
      font-size: 17px;
      line-height: 1.4;
      color: #DCD3C7;
      margin-bottom: 12px;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }}
    .cover-meta {{
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--text-muted);
      margin-bottom: 18px;
    }}

    /* 3D Physical Book Object */
    .book-3d-wrap {{
      position: relative;
      z-index: 10;
      perspective: 1000px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px 0 24px 0;
      cursor: pointer;
    }}
    .book-3d-obj {{
      width: 210px;
      height: 290px;
      border-radius: 6px;
      box-shadow: -16px 24px 40px rgba(0,0,0,0.88), 0 0 28px rgba(197,160,89,0.18);
      transform: rotateY(-12deg) rotateX(4deg);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
      object-fit: cover;
      border: 1px solid rgba(255,255,255,0.12);
    }}
    .book-3d-wrap:hover .book-3d-obj {{
      transform: rotateY(-4deg) rotateX(2deg) scale(1.03);
      box-shadow: -10px 28px 50px rgba(0,0,0,0.95), 0 0 35px rgba(197,160,89,0.3);
    }}

    .cover-actions {{
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }}
    .btn-primary-open {{
      background: linear-gradient(135deg, #E8D7B8 0%, #C5A059 100%);
      color: #0A0908;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 14px 28px;
      border-radius: 30px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 28px rgba(197, 160, 89, 0.38);
      transition: all 0.25s ease;
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }}
    .btn-primary-open:hover {{
      transform: translateY(-2px);
      box-shadow: 0 14px 34px rgba(197, 160, 89, 0.5);
    }}
    .btn-primary-open:active {{
      transform: translateY(1px);
    }}
    .btn-scroll-down {{
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
    }}
    .btn-scroll-down:hover {{
      color: var(--gold-accent);
    }}

    /* Screen 2: Daftar Bab */
    #screen-bab {{
      padding: 40px 18px;
      background: #0D0C0A;
      border-top: 1px solid var(--border-subtle);
    }}
    .section-header {{
      text-align: center;
      margin-bottom: 28px;
    }}
    .section-title {{
      font-family: 'Cinzel', serif;
      font-size: 24px;
      letter-spacing: 0.2em;
      color: var(--bone-paper);
      margin-bottom: 6px;
    }}
    .section-subtitle {{
      font-size: 12px;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }}

    .bab-cards-container {{
      display: flex;
      flex-direction: column;
      gap: 22px;
    }}

    .bab-card {{
      position: relative;
      height: 350px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 22px;
      background-size: cover;
      background-position: center;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
    }}
    .bab-card::before {{
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10,9,8,0.1) 0%, rgba(10,9,8,0.68) 45%, rgba(10,9,8,0.98) 100%);
      transition: opacity 0.3s;
    }}
    .bab-card:hover {{
      transform: translateY(-4px);
      border-color: var(--gold-accent);
    }}
    .bab-card:hover::before {{
      opacity: 0.92;
    }}

    .bab-card-content {{
      position: relative;
      z-index: 10;
    }}
    .bab-num-badge {{
      font-family: 'Cinzel', serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--gold-accent);
      margin-bottom: 6px;
      display: block;
    }}
    .bab-card-title {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.25;
      color: var(--bone-paper);
      margin-bottom: 6px;
    }}
    .bab-card-tagline {{
      font-size: 11px;
      color: #CBC3B7;
      line-height: 1.4;
      margin-bottom: 12px;
    }}
    .bab-tags-row {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }}
    .bab-tag-pill {{
      font-size: 9px;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(255,255,255,0.08);
      color: #E8D7B8;
      border: 1px solid rgba(197, 160, 89, 0.2);
    }}
    .bab-card-bottom {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }}
    .bab-page-count {{
      font-size: 11px;
      color: var(--text-muted);
    }}
    .btn-open-chapter {{
      background: rgba(197, 160, 89, 0.15);
      color: var(--gold-light);
      border: 1px solid var(--gold-accent);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }}
    .bab-card:hover .btn-open-chapter {{
      background: var(--gold-accent);
      color: #0A0908;
    }}

    /* Screen 3: Daftar Isi Accordion */
    #screen-toc {{
      padding: 36px 18px;
      background: #0A0908;
      border-top: 1px solid var(--border-subtle);
    }}
    .toc-accordion-btn {{
      width: 100%;
      background: #141311;
      border: 1px solid var(--border-gold);
      padding: 16px 20px;
      border-radius: 12px;
      color: var(--gold-accent);
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 0.15em;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .toc-accordion-btn:hover {{
      background: #1A1815;
    }}
    .toc-arrow {{
      transition: transform 0.3s;
    }}
    .toc-accordion-btn.open .toc-arrow {{
      transform: rotate(180deg);
    }}

    .toc-content {{
      display: none;
      margin-top: 16px;
      flex-direction: column;
      gap: 16px;
    }}
    .toc-content.open {{
      display: flex;
    }}

    .toc-chapter-box {{
      background: #11100E;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      overflow: hidden;
    }}
    .toc-ch-header {{
      padding: 12px 16px;
      background: #171613;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }}
    .toc-ch-title {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--bone-paper);
    }}
    .toc-ch-num {{
      font-size: 11px;
      color: var(--gold-accent);
      font-family: 'Cinzel', serif;
    }}
    .toc-page-list {{
      display: flex;
      flex-direction: column;
    }}
    .toc-page-item {{
      padding: 10px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: background 0.15s;
    }}
    .toc-page-item:hover {{
      background: rgba(197, 160, 89, 0.08);
    }}
    .toc-p-left {{
      display: flex;
      align-items: baseline;
      gap: 10px;
    }}
    .toc-p-badge {{
      font-size: 10px;
      color: var(--gold-accent);
      font-weight: 600;
      min-width: 42px;
    }}
    .toc-p-title {{
      font-size: 12px;
      color: #D1C9BC;
    }}
    .toc-p-arrow {{
      color: var(--text-muted);
      font-size: 12px;
    }}

    /* Screen 4: Closing */
    #screen-closing {{
      position: relative;
      min-height: 420px;
      background: url('assets/closing_landscape.jpg') center / cover no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 24px;
    }}
    #screen-closing::before {{
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.85) 50%, #0A0908 100%);
    }}
    .closing-content {{
      position: relative;
      z-index: 10;
      max-width: 320px;
    }}
    .closing-quote {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
      font-size: 26px;
      line-height: 1.35;
      color: var(--bone-paper);
      margin-bottom: 18px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.85);
    }}
    .closing-author {{
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 0.25em;
      color: var(--gold-accent);
      margin-bottom: 4px;
    }}
    .closing-sub {{
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.1em;
    }}

    /* Screen 5: Footer */
    #screen-footer {{
      background: #070605;
      padding: 36px 20px;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }}
    .footer-logo {{
      font-family: 'Cinzel', serif;
      font-size: 16px;
      letter-spacing: 0.25em;
      color: var(--bone-paper);
      margin-bottom: 8px;
    }}
    .footer-desc {{
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.5;
      max-width: 280px;
      margin: 0 auto 20px auto;
    }}
    .footer-links {{
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }}
    .footer-link {{
      color: #C2B9AC;
      text-decoration: none;
      font-size: 11px;
      letter-spacing: 0.1em;
      transition: color 0.2s;
      cursor: pointer;
    }}
    .footer-link:hover {{
      color: var(--gold-accent);
    }}
    .footer-copy {{
      font-size: 10px;
      color: #615B51;
      letter-spacing: 0.05em;
    }}

    /* === READER MODE SCREENS === */
    .reader-screen {{
      position: absolute;
      inset: 0;
      background: #0D0C0A;
      z-index: 300;
      display: none;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
    }}
    .reader-screen.active {{
      display: flex;
    }}

    /* Top Chrome Bar */
    .reader-top-bar {{
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      padding: 12px 16px;
      background: rgba(14, 13, 11, 0.94);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      z-index: 400;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: opacity 0.3s, transform 0.3s;
    }}
    .reader-top-bar.hidden-chrome {{
      opacity: 0;
      transform: translateY(-100%);
      pointer-events: none;
    }}

    .reader-btn-back {{
      background: none;
      border: none;
      color: var(--text-light);
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }}
    .reader-title-badge {{
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--gold-accent);
      text-align: center;
    }}
    .reader-actions-top {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .reader-tool-btn {{
      background: #1F1D19;
      border: 1px solid var(--border-subtle);
      color: var(--text-light);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 11px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }}
    .reader-tool-btn:hover {{
      border-color: var(--gold-accent);
      color: var(--gold-accent);
    }}

    /* Bottom Chrome Bar */
    .reader-bottom-bar {{
      position: sticky;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 12px 16px;
      background: rgba(14, 13, 11, 0.94);
      backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255,255,255,0.06);
      z-index: 400;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: opacity 0.3s, transform 0.3s;
    }}
    .reader-bottom-bar.hidden-chrome {{
      opacity: 0;
      transform: translateY(100%);
      pointer-events: none;
    }}
    .scrubber-row {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .nav-arrow-btn {{
      background: #1F1D19;
      border: 1px solid var(--border-subtle);
      color: var(--bone-paper);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
      flex-shrink: 0;
    }}
    .nav-arrow-btn:hover {{
      background: var(--gold-accent);
      color: #0A0908;
    }}
    .scrubber-slider {{
      flex: 1;
      -webkit-appearance: none;
      height: 4px;
      border-radius: 2px;
      background: #2D2A24;
      outline: none;
    }}
    .scrubber-slider::-webkit-slider-thumb {{
      -webkit-appearance: none;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: var(--gold-accent);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(197, 160, 89, 0.6);
    }}
    .reader-page-info {{
      text-align: center;
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }}

    /* === SCREEN 5: 3D BOOK SPREAD === */
    .spread-scroll-area {{
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}

    .open-book-spread {{
      background: #11100E;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 15px 40px rgba(0,0,0,0.85);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s ease;
    }}

    /* Left Page: Bone Paper */
    .spread-page-left {{
      background: var(--bone-paper);
      color: var(--ink-dark);
      padding: 24px 20px;
      position: relative;
    }}
    .page-badge-top {{
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-muted);
      border-bottom: 1px solid rgba(0,0,0,0.08);
      padding-bottom: 6px;
      margin-bottom: 14px;
      display: block;
    }}
    .page-main-title {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.25;
      color: var(--ink-dark);
      margin-bottom: 6px;
    }}
    .page-main-subtitle {{
      font-family: 'Lora', serif;
      font-style: italic;
      font-size: 13px;
      color: #6B655C;
      line-height: 1.4;
      margin-bottom: 16px;
    }}
    .page-body-text {{
      font-family: 'Lora', Georgia, serif;
      font-size: 14px;
      line-height: 1.75;
      color: #262420;
      margin-bottom: 16px;
    }}
    .page-body-text p {{
      margin-bottom: 12px;
      text-align: justify;
    }}
    .page-body-text p:first-of-type::first-letter {{
      font-family: 'Cinzel', serif;
      font-size: 42px;
      float: left;
      line-height: 0.85;
      padding-right: 8px;
      padding-top: 4px;
      color: #8C7342;
      font-weight: 700;
    }}

    /* Key Takeaway Box */
    .page-takeaway-box {{
      background: rgba(237, 231, 220, 0.65);
      border-left: 3px solid var(--gold-dim);
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin-top: 14px;
    }}
    .takeaway-label {{
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #7A6945;
      font-weight: 700;
      display: block;
      margin-bottom: 4px;
    }}
    .takeaway-text {{
      font-family: 'Lora', serif;
      font-size: 12px;
      font-style: italic;
      color: #47433B;
      line-height: 1.5;
    }}
    .page-number-footer {{
      text-align: center;
      font-size: 11px;
      color: #8F887C;
      margin-top: 16px;
      font-family: 'Cinzel', serif;
      border-top: 1px solid rgba(0,0,0,0.06);
      padding-top: 8px;
    }}

    /* Realistic Gutter / Spine Shadow */
    .spread-gutter {{
      height: 18px;
      background: linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.28) 100%);
      position: relative;
    }}

    /* Right Page: Full-Bleed Image Plate */
    .spread-page-right {{
      position: relative;
      min-height: 290px;
      background-size: cover;
      background-position: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 20px;
    }}
    .spread-page-right::before {{
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10,9,8,0.1) 0%, rgba(10,9,8,0.5) 50%, rgba(10,9,8,0.92) 100%);
    }}
    .plate-caption-card {{
      position: relative;
      z-index: 10;
      background: rgba(17, 16, 14, 0.88);
      backdrop-filter: blur(8px);
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08);
    }}
    .plate-badge {{
      font-size: 9px;
      letter-spacing: 0.15em;
      color: var(--gold-accent);
      text-transform: uppercase;
      margin-bottom: 4px;
      display: block;
    }}
    .plate-caption {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--bone-paper);
    }}

    /* === SCREEN 6: IMMERSIVE READ === */
    .immersive-container {{
      position: relative;
      flex: 1;
      padding: 24px 20px 40px 20px;
    }}
    .immersive-bg-blur {{
      position: fixed;
      inset: 0;
      background-size: cover;
      background-position: center;
      filter: blur(40px) brightness(0.18);
      z-index: -1;
      pointer-events: none;
    }}
    .immersive-content {{
      max-width: 600px;
      margin: 0 auto;
    }}
    .imm-badge {{
      font-size: 10px;
      letter-spacing: 0.18em;
      color: var(--gold-accent);
      text-transform: uppercase;
      margin-bottom: 12px;
      display: block;
    }}
    .imm-title {{
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      line-height: 1.25;
      color: var(--bone-paper);
      margin-bottom: 8px;
    }}
    .imm-subtitle {{
      font-family: 'Lora', serif;
      font-style: italic;
      font-size: 14px;
      color: #BDB3A4;
      line-height: 1.4;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }}
    .imm-body {{
      font-family: 'Lora', Georgia, serif;
      font-size: 15px;
      line-height: 1.85;
      color: #E2DBD0;
      margin-bottom: 24px;
    }}
    .imm-body p {{
      margin-bottom: 16px;
      text-align: justify;
    }}
    .imm-body p:first-of-type::first-letter {{
      font-family: 'Cinzel', serif;
      font-size: 48px;
      float: left;
      line-height: 0.85;
      padding-right: 10px;
      padding-top: 4px;
      color: var(--gold-accent);
      font-weight: 700;
    }}

    /* Font Size Variations */
    .size-large .page-body-text, .size-large .imm-body {{
      font-size: 17px !important;
      line-height: 1.9 !important;
    }}
    .size-xlarge .page-body-text, .size-xlarge .imm-body {{
      font-size: 19px !important;
      line-height: 2.0 !important;
    }}

    /* Toast Notification */
    #toast {{
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(25, 23, 20, 0.95);
      color: var(--gold-light);
      border: 1px solid var(--gold-accent);
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 12px;
      letter-spacing: 0.05em;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s;
      z-index: 1200;
      box-shadow: 0 10px 25px rgba(0,0,0,0.8);
    }}
    #toast.show {{
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }}
  </style>
</head>
<body>

  <!-- Desktop Simulator Bar -->
  <div id="simulator-bar">
    <div class="sim-brand">
      <span>SUATU SAAT</span>
      <span style="color: var(--text-muted); font-size: 10px;">· MOBILE SIMULATOR</span>
    </div>

    <!-- Width Selector Pills -->
    <div class="sim-group">
      <span class="sim-label">Lebar:</span>
      <button class="sim-pill" onclick="setSimulatorWidth('360px')">360px</button>
      <button class="sim-pill active" onclick="setSimulatorWidth('390px')">390px</button>
      <button class="sim-pill" onclick="setSimulatorWidth('430px')">430px</button>
      <button class="sim-pill" onclick="setSimulatorWidth('100%')">Fluid</button>
    </div>

    <!-- Screen Navigation Pills -->
    <div class="sim-group">
      <span class="sim-label">Layar:</span>
      <button class="sim-pill active" onclick="jumpToScreen('cover')">Cover</button>
      <button class="sim-pill" onclick="jumpToScreen('bab')">Bab</button>
      <button class="sim-pill" onclick="jumpToScreen('toc')">Daftar Isi</button>
      <button class="sim-pill" onclick="openReader(1, 'spread')">3D Spread</button>
      <button class="sim-pill" onclick="openReader(1, 'read')">Immersive</button>
    </div>

    <!-- Audio Test -->
    <div class="sim-group">
      <button class="sim-pill" onclick="playPaperSound(); showToast('Bunyi kertas dibunyikan')">🔊 Uji Kertas</button>
    </div>
  </div>

  <!-- Main Mobile Frame Viewport -->
  <div id="phone-viewport">

    <!-- Off-canvas Menu Drawer -->
    <div id="drawer-backdrop" class="drawer-backdrop" onclick="toggleMenu()"></div>
    <div id="menu-drawer">
      <div class="drawer-header">
        <span class="drawer-brand">SUATU SAAT</span>
        <button class="drawer-close" onclick="toggleMenu()">✕</button>
      </div>
      <div class="drawer-nav">
        <div class="drawer-item" onclick="jumpToScreen('cover'); toggleMenu()">
          <span>Sampul & Pembuka</span> <span>→</span>
        </div>
        <div class="drawer-item" onclick="jumpToScreen('bab'); toggleMenu()">
          <span>5 Daftar Bab</span> <span>→</span>
        </div>
        <div class="drawer-item" onclick="jumpToScreen('toc'); toggleMenu()">
          <span>Daftar Isi (Semua Hal)</span> <span>→</span>
        </div>
        <div style="height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0;"></div>
        <div class="drawer-item" onclick="openReader(1, 'spread'); toggleMenu()">
          <span>Bab 1: Fisika & Tubuh Energi</span> <span style="font-size: 10px; color: var(--gold-accent);">01</span>
        </div>
        <div class="drawer-item" onclick="openReader(16, 'spread'); toggleMenu()">
          <span>Bab 2: Pikiran Bawah Sadar</span> <span style="font-size: 10px; color: var(--gold-accent);">02</span>
        </div>
        <div class="drawer-item" onclick="openReader(31, 'spread'); toggleMenu()">
          <span>Bab 3: Biohacking Leluhur</span> <span style="font-size: 10px; color: var(--gold-accent);">03</span>
        </div>
        <div class="drawer-item" onclick="openReader(46, 'spread'); toggleMenu()">
          <span>Bab 4: Kuantum & Suwung</span> <span style="font-size: 10px; color: var(--gold-accent);">04</span>
        </div>
        <div class="drawer-item" onclick="openReader(60, 'spread'); toggleMenu()">
          <span>Bab 5: Manusia Normal</span> <span style="font-size: 10px; color: var(--gold-accent);">05</span>
        </div>
        <div style="height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0;"></div>
        <div class="drawer-item" onclick="jumpToScreen('closing'); toggleMenu()">
          <span>Catatan Penutup</span> <span>→</span>
        </div>
      </div>
    </div>

    <!-- ================= HOME VIEW ================= -->
    <div id="home-view">

      <!-- SCREEN 1: HERO COVER -->
      <section id="screen-cover">
        <div class="cover-header">
          <div class="cover-brand">SUATU SAAT</div>
          <button class="cover-menu-btn" onclick="toggleMenu()" title="Buka Menu">☰</button>
        </div>

        <div class="cover-hero-content">
          <span class="cover-badge">Digital Field Guide · 2026</span>
          <h1 class="cover-title">SUATU<br>SAAT</h1>
          <p class="cover-subtitle">"Kamu akan membutuhkan cara lain untuk melihat dirimu sendiri."</p>
          <p class="cover-meta">5 BAB · 74 HALAMAN</p>
        </div>

        <!-- 3D Physical Book Showcase -->
        <div class="book-3d-wrap" onclick="openReader(1, 'spread')">
          <img src="assets/book_cover_3d.jpg" alt="Buku SUATU SAAT Hardcover 3D" class="book-3d-obj">
        </div>

        <div class="cover-actions">
          <button class="btn-primary-open" onclick="openReader(1, 'spread')">
            <span>Buka Buku</span>
            <span>→</span>
          </button>
          <button class="btn-scroll-down" onclick="jumpToScreen('bab')">
            <span>Daftar Bab & Isi</span>
            <span>↓</span>
          </button>
        </div>
      </section>

      <!-- SCREEN 2: DAFTAR BAB -->
      <section id="screen-bab">
        <div class="section-header">
          <h2 class="section-title">DAFTAR BAB</h2>
          <p class="section-subtitle">5 Pintu Gerbang Eksplorasi Kesadaran Nusantara</p>
        </div>

        <div class="bab-cards-container">
          <!-- Bab 1 Card -->
          <div class="bab-card" style="background-image: url('assets/bab_01_torus.jpg');" onclick="openReader(1, 'spread')">
            <div class="bab-card-content">
              <span class="bab-num-badge">01</span>
              <h3 class="bab-card-title">Anatomi Tubuh Energi & Memori Karma</h3>
              <p class="bab-card-tagline">Medan Torus, Black Box Tulang Ekor & Melatonin CSF</p>
              <div class="bab-tags-row">
                <span class="bab-tag-pill">Medan Torus</span>
                <span class="bab-tag-pill">Memori Karma</span>
                <span class="bab-tag-pill">Cairan CSF</span>
              </div>
              <div class="bab-card-bottom">
                <span class="bab-page-count">15 Halaman (Hal 1-15)</span>
                <span class="btn-open-chapter">Buka Bab →</span>
              </div>
            </div>
          </div>

          <!-- Bab 2 Card -->
          <div class="bab-card" style="background-image: url('assets/bab_02_theta.jpg');" onclick="openReader(16, 'spread')">
            <div class="bab-card-content">
              <span class="bab-num-badge">02</span>
              <h3 class="bab-card-title">Meretas Pikiran Bawah Sadar & Reprogramming Nasib</h3>
              <p class="bab-card-tagline">Gunung Es Subconscious, Gelombang Theta & Jeda 3 Detik</p>
              <div class="bab-tags-row">
                <span class="bab-tag-pill">Zona Theta</span>
                <span class="bab-tag-pill">Critical Faculty</span>
                <span class="bab-tag-pill">Jeda 3 Detik</span>
              </div>
              <div class="bab-card-bottom">
                <span class="bab-page-count">15 Halaman (Hal 16-30)</span>
                <span class="btn-open-chapter">Buka Bab →</span>
              </div>
            </div>
          </div>

          <!-- Bab 3 Card -->
          <div class="bab-card" style="background-image: url('assets/bab_03_biohack.jpg');" onclick="openReader(31, 'spread')">
            <div class="bab-card-content">
              <span class="bab-num-badge">03</span>
              <h3 class="bab-card-title">Sistem Hormon, Biohacking Leluhur & Energi Fisik</h3>
              <p class="bab-card-tagline">Dopamin Baseline, Ritme Sirkadian & Tirakat Puasa Weton</p>
              <div class="bab-tags-row">
                <span class="bab-tag-pill">Dopamin Baseline</span>
                <span class="bab-tag-pill">Ritme Sirkadian</span>
                <span class="bab-tag-pill">Puasa Weton</span>
              </div>
              <div class="bab-card-bottom">
                <span class="bab-page-count">15 Halaman (Hal 31-45)</span>
                <span class="btn-open-chapter">Buka Bab →</span>
              </div>
            </div>
          </div>

          <!-- Bab 4 Card -->
          <div class="bab-card" style="background-image: url('assets/bab_04_kuantum.jpg');" onclick="openReader(46, 'spread')">
            <div class="bab-card-content">
              <span class="bab-num-badge">04</span>
              <h3 class="bab-card-title">Fisika Kuantum, Relativitas & Keterhubungan Semesta</h3>
              <p class="bab-card-tagline">Efek Pengamat, Dualitas Gelombang-Partikel & Falsafah Suwung</p>
              <div class="bab-tags-row">
                <span class="bab-tag-pill">Efek Pengamat</span>
                <span class="bab-tag-pill">Keterhubungan</span>
                <span class="bab-tag-pill">Titik Nol Suwung</span>
              </div>
              <div class="bab-card-bottom">
                <span class="bab-page-count">14 Halaman (Hal 46-59)</span>
                <span class="btn-open-chapter">Buka Bab →</span>
              </div>
            </div>
          </div>

          <!-- Bab 5 Card -->
          <div class="bab-card" style="background-image: url('assets/bab_05_berserah.jpg');" onclick="openReader(60, 'spread')">
            <div class="bab-card-content">
              <span class="bab-num-badge">05</span>
              <h3 class="bab-card-title">Menjadi Manusia Normal & Seni Berserah</h3>
              <p class="bab-card-tagline">Melepas Obsesi Gaib, Menghidupi Keseharian & Titik Nol</p>
              <div class="bab-tags-row">
                <span class="bab-tag-pill">Anti Spiritual Bypass</span>
                <span class="bab-tag-pill">Dunia Fisik</span>
                <span class="bab-tag-pill">Titik Nol</span>
              </div>
              <div class="bab-card-bottom">
                <span class="bab-page-count">15 Halaman (Hal 60-74)</span>
                <span class="btn-open-chapter">Buka Bab →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SCREEN 3: DAFTAR ISI ACCORDION -->
      <section id="screen-toc">
        <button class="toc-accordion-btn" id="toc-toggle-btn" onclick="toggleTocAccordion()">
          <span>DAFTAR ISI — SEMUA HALAMAN</span>
          <span class="toc-arrow">↓</span>
        </button>

        <div class="toc-content" id="toc-content-area">
          <!-- Accordion will be filled via JS -->
        </div>
      </section>

      <!-- SCREEN 4: CLOSING -->
      <section id="screen-closing">
        <div class="closing-content">
          <blockquote class="closing-quote">
            "Menjadi manusia normal yang sadar utuh."
          </blockquote>
          <p class="closing-author">— ALDI</p>
          <p class="closing-sub">Rahwana Consciousness Room</p>
        </div>
      </section>

      <!-- SCREEN 5: FOOTER -->
      <footer id="screen-footer">
        <div class="footer-logo">SUATU SAAT</div>
        <p class="footer-desc">Buku panduan kesadaran, anatomi energi tubuh, memori karma, dan biohacking spiritual Nusantara.</p>
        <div class="footer-links">
          <span class="footer-link" onclick="jumpToScreen('cover')">Buku</span>
          <span class="footer-link" onclick="jumpToScreen('bab')">Bab</span>
          <span class="footer-link" onclick="jumpToScreen('toc')">Daftar Isi</span>
          <span class="footer-link" onclick="openReader(1, 'spread')">Baca Flipbook</span>
        </div>
        <p class="footer-copy">© 2026 SUATU SAAT · Digital Edition · Hak Cipta Dilindungi</p>
      </footer>
    </div>

    <!-- ================= SCREEN 5: 3D BOOK SPREAD ================= -->
    <div id="screen-spread" class="reader-screen">
      <!-- Top Chrome Bar -->
      <div class="reader-top-bar" id="spread-top-bar">
        <button class="reader-btn-back" onclick="closeReader()">
          <span>←</span> <span>Katalog</span>
        </button>
        <div class="reader-title-badge" id="spread-chapter-badge">BAB 01 · Hal 01/15</div>
        <div class="reader-actions-top">
          <button class="reader-tool-btn" onclick="switchReaderMode('read')" title="Beralih ke Tampilan Immersive">
            <span>📜</span> <span>Baca</span>
          </button>
          <button class="reader-tool-btn" id="sound-btn" onclick="toggleSound()" title="Aktif/Nonaktifkan Bunyi Kertas">
            🔊
          </button>
        </div>
      </div>

      <!-- Spread Content Area -->
      <div class="spread-scroll-area" id="spread-area" onclick="handleReaderTap(event)">
        <div class="open-book-spread" id="book-spread-elem">
          <!-- Left Page: Bone Paper -->
          <div class="spread-page-left">
            <span class="page-badge-top" id="spread-p-badge">BAB 01 • BAGIAN 1</span>
            <h2 class="page-main-title" id="spread-p-title">Judul Halaman</h2>
            <p class="page-main-subtitle" id="spread-p-subtitle">Subjudul halaman deskriptif</p>
            <div class="page-body-text" id="spread-p-body">
              <!-- Paragraphs inserted dynamically -->
            </div>
            <div class="page-takeaway-box" id="spread-takeaway-wrap">
              <span class="takeaway-label">Intisari Pelajaran</span>
              <p class="takeaway-text" id="spread-p-takeaway">Intisari pelajaran...</p>
            </div>
            <div class="page-number-footer" id="spread-p-footnum">— Hal 1 —</div>
          </div>

          <!-- Realistic Spine Gutter Shadow -->
          <div class="spread-gutter"></div>

          <!-- Right Page: Full-Bleed Image Plate -->
          <div class="spread-page-right" id="spread-p-plate">
            <div class="plate-caption-card">
              <span class="plate-badge" id="spread-plate-badge">PELAT VISUAL 01</span>
              <p class="plate-caption" id="spread-plate-caption">Visual Masterclass...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Chrome Bar -->
      <div class="reader-bottom-bar" id="spread-bottom-bar">
        <div class="scrubber-row">
          <button class="nav-arrow-btn" onclick="prevPage()" title="Halaman Sebelumnya">‹</button>
          <input type="range" min="1" max="74" value="1" class="scrubber-slider" id="spread-scrubber" oninput="onScrubInput(this.value)" onchange="onScrubChange(this.value)">
          <button class="nav-arrow-btn" onclick="nextPage()" title="Halaman Selanjutnya">›</button>
        </div>
        <div class="reader-page-info" id="spread-page-info">Hal 1 dari 74 (1%)</div>
      </div>
    </div>

    <!-- ================= SCREEN 6: IMMERSIVE READ ================= -->
    <div id="screen-read" class="reader-screen">
      <div class="immersive-bg-blur" id="imm-bg-blur"></div>

      <!-- Top Bar -->
      <div class="reader-top-bar" id="imm-top-bar">
        <button class="reader-btn-back" onclick="switchReaderMode('spread')">
          <span>📖</span> <span>Mode Buku</span>
        </button>
        <div class="reader-title-badge" id="imm-chapter-badge">BAB 01 · Hal 01/15</div>
        <div class="reader-actions-top">
          <button class="reader-tool-btn" onclick="cycleFontSize()" title="Ubah Ukuran Teks">
            A±
          </button>
          <button class="reader-tool-btn" id="imm-bookmark-btn" onclick="toggleBookmark()" title="Tandai Halaman">
            🔖
          </button>
        </div>
      </div>

      <!-- Immersive Body -->
      <div class="immersive-container" id="imm-container" onclick="handleReaderTap(event)">
        <div class="immersive-content">
          <span class="imm-badge" id="imm-p-badge">BAB 01 • BAGIAN 1</span>
          <h1 class="imm-title" id="imm-p-title">Judul Halaman</h1>
          <p class="imm-subtitle" id="imm-p-subtitle">Subjudul halaman deskriptif</p>
          <div class="imm-body" id="imm-p-body">
            <!-- Paragraphs inserted dynamically -->
          </div>
          <div class="page-takeaway-box" style="margin-top: 24px;">
            <span class="takeaway-label">Intisari Pelajaran</span>
            <p class="takeaway-text" id="imm-p-takeaway">Intisari pelajaran...</p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="reader-bottom-bar" id="imm-bottom-bar">
        <div class="scrubber-row">
          <button class="nav-arrow-btn" onclick="prevPage()">‹</button>
          <input type="range" min="1" max="74" value="1" class="scrubber-slider" id="imm-scrubber" oninput="onScrubInput(this.value)" onchange="onScrubChange(this.value)">
          <button class="nav-arrow-btn" onclick="nextPage()">›</button>
        </div>
        <div class="reader-page-info" id="imm-page-info">Hal 1 dari 74 (1%)</div>
      </div>
    </div>

  </div> <!-- End #phone-viewport -->

  <!-- Toast Element -->
  <div id="toast">Notifikasi</div>

  <!-- Embedded JavaScript Application Engine -->
  <script>
    // 1. DATA SOURCE: Complete 5 Chapters & 74 Pages
    const CHAPTERS_RAW = {chapters_json_str};
    const ALL_PAGES = {all_pages_json_str};

    // 2. APP STATE
    let currentPageIndex = 0; // 0 to 73 (representing page 1 to 74)
    let currentReaderMode = 'spread'; // 'spread' or 'read'
    let soundEnabled = true;
    let isChromeVisible = true;
    let audioCtx = null;
    let fontSizeLevel = 'normal'; // 'normal', 'large', 'xlarge'
    let bookmarkedPages = [];

    // Touch gesture tracker
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    // 3. INITIALIZATION
    window.addEventListener('DOMContentLoaded', () => {{
      renderTocAccordion();
      loadStoredState();
      setupSwipeGestures();
      setupKeyboardNav();
    }});

    // 4. PROCEDURAL PAPER FLIP SOUND (Web Audio API Synthesizer)
    function playPaperSound() {{
      if (!soundEnabled) return;
      try {{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!audioCtx) {{
          audioCtx = new AudioContext();
        }}
        if (audioCtx.state === 'suspended') {{
          audioCtx.resume();
        }}

        const sampleRate = audioCtx.sampleRate;
        const duration = 0.12;
        const bufferSize = Math.floor(sampleRate * duration);
        const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {{
          const white = Math.random() * 2 - 1;
          data[i] = white * Math.exp(-i / (bufferSize * 0.32));
        }}

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1150, audioCtx.currentTime);
        filter.Q.setValueAtTime(2.2, audioCtx.currentTime);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noise.start();
      }} catch (e) {{
        console.warn('Audio synthesis unavailable:', e);
      }}
    }}

    function toggleSound() {{
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('sound-btn');
      if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
      showToast(soundEnabled ? 'Bunyi kertas diaktifkan' : 'Bunyi kertas dibisukan');
    }}

    // 5. TOAST MESSAGE HELPER
    let toastTimeout = null;
    function showToast(msg) {{
      const toast = document.getElementById('toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {{
        toast.classList.remove('show');
      }}, 2400);
    }}

    // 6. RENDER DAFTAR ISI ACCORDION (All 74 Pages)
    function renderTocAccordion() {{
      const area = document.getElementById('toc-content-area');
      if (!area) return;

      let html = '';
      CHAPTERS_RAW.forEach((ch) => {{
        html += `
          <div class="toc-chapter-box">
            <div class="toc-ch-header" onclick="toggleChapterDetails(${{ch.id}})">
              <span class="toc-ch-title">${{ch.title}}</span>
              <span class="toc-ch-num">BAB ${{ch.num}} (${{ch.pages.length}} HAL)</span>
            </div>
            <div class="toc-page-list" id="toc-ch-pages-${{ch.id}}">
        `;

        ch.pages.forEach((p) => {{
          html += `
            <div class="toc-page-item" onclick="openReader(${{p.global_page}}, 'spread')">
              <div class="toc-p-left">
                <span class="toc-p-badge">Hal ${{p.page_in_chapter < 10 ? '0' + p.page_in_chapter : p.page_in_chapter}}</span>
                <span class="toc-p-title">${{p.title}}</span>
              </div>
              <span class="toc-p-arrow">→</span>
            </div>
          `;
        }});

        html += `
            </div>
          </div>
        `;
      }});

      area.innerHTML = html;
    }}

    function toggleTocAccordion() {{
      const btn = document.getElementById('toc-toggle-btn');
      const content = document.getElementById('toc-content-area');
      btn.classList.toggle('open');
      content.classList.toggle('open');
    }}

    function toggleChapterDetails(chId) {{
      const elem = document.getElementById(`toc-ch-pages-${{chId}}`);
      if (elem) {{
        elem.style.display = elem.style.display === 'none' ? 'flex' : 'none';
      }}
    }}

    // 7. NAVIGATION & SCREEN SWITCHING
    function jumpToScreen(screenId) {{
      // Close reader if active
      closeReader();
      const elem = document.getElementById('screen-' + screenId);
      if (elem) {{
        elem.scrollIntoView({{ behavior: 'smooth' }});
      }}
      updateSimScreenPills(screenId);
    }}

    function updateSimScreenPills(name) {{
      const pills = document.querySelectorAll('#simulator-bar .sim-group:nth-child(3) .sim-pill');
      pills.forEach((p) => p.classList.remove('active'));
      pills.forEach((p) => {{
        if (p.textContent.toLowerCase().includes(name.toLowerCase())) {{
          p.classList.add('active');
        }}
      }});
    }}

    function openReader(globalPageNum, mode = 'spread') {{
      currentPageIndex = Math.max(0, Math.min(ALL_PAGES.length - 1, globalPageNum - 1));
      currentReaderMode = mode;

      document.getElementById('home-view').style.display = 'none';
      document.getElementById('screen-spread').classList.remove('active');
      document.getElementById('screen-read').classList.remove('active');

      if (mode === 'spread') {{
        document.getElementById('screen-spread').classList.add('active');
        updateSimScreenPills('spread');
      }} else {{
        document.getElementById('screen-read').classList.add('active');
        updateSimScreenPills('immersive');
      }}

      renderCurrentPage();
      playPaperSound();
      saveLastRead();
    }}

    function closeReader() {{
      document.getElementById('screen-spread').classList.remove('active');
      document.getElementById('screen-read').classList.remove('active');
      document.getElementById('home-view').style.display = 'block';
    }}

    function switchReaderMode(targetMode) {{
      currentReaderMode = targetMode;
      openReader(currentPageIndex + 1, targetMode);
    }}

    // 8. PAGE RENDERING (Spread & Immersive)
    function renderCurrentPage() {{
      const pageData = ALL_PAGES[currentPageIndex];
      if (!pageData) return;

      const pageNum = currentPageIndex + 1;
      const totalPages = ALL_PAGES.length;
      const pct = Math.round((pageNum / totalPages) * 100);

      // --- SPREAD VIEW RENDERING ---
      document.getElementById('spread-chapter-badge').textContent = `BAB ${{pageData.chapter_num}} · Hal ${{pageData.page_in_chapter}}/${{pageData.chapter_total_pages}}`;
      document.getElementById('spread-p-badge').textContent = pageData.badge || `BAB ${{pageData.chapter_num}}`;
      document.getElementById('spread-p-title').textContent = pageData.title;
      document.getElementById('spread-p-subtitle').textContent = pageData.subtitle || '';

      // Paragraphs
      const spreadBody = document.getElementById('spread-p-body');
      spreadBody.innerHTML = pageData.paragraphs.map(p => `<p>${{p}}</p>`).join('');

      // Key Takeaway
      document.getElementById('spread-p-takeaway').textContent = pageData.keyTakeaway || '';

      // Footer page number
      document.getElementById('spread-p-footnum').textContent = `— Hal ${{pageData.page_in_chapter}} (Buku: ${{pageNum}}/${{totalPages}}) —`;

      // Right Plate (Full-Bleed Visual)
      const plate = document.getElementById('spread-p-plate');
      plate.style.backgroundImage = `url('${{pageData.chapter_image}}')`;
      document.getElementById('spread-plate-badge').textContent = `PELAT VISUAL · BAB ${{pageData.chapter_num}}`;
      document.getElementById('spread-plate-caption').textContent = pageData.imageCaption || pageData.title;

      // Scrubber and Info
      const spreadScrubber = document.getElementById('spread-scrubber');
      if (spreadScrubber) spreadScrubber.value = pageNum;
      document.getElementById('spread-page-info').textContent = `Hal ${{pageNum}} dari ${{totalPages}} (${{pct}}%)`;

      // --- IMMERSIVE READ VIEW RENDERING ---
      document.getElementById('imm-chapter-badge').textContent = `BAB ${{pageData.chapter_num}} · Hal ${{pageData.page_in_chapter}}/${{pageData.chapter_total_pages}}`;
      document.getElementById('imm-p-badge').textContent = pageData.badge || `BAB ${{pageData.chapter_num}}`;
      document.getElementById('imm-p-title').textContent = pageData.title;
      document.getElementById('imm-p-subtitle').textContent = pageData.subtitle || '';

      const immBody = document.getElementById('imm-p-body');
      immBody.innerHTML = pageData.paragraphs.map(p => `<p>${{p}}</p>`).join('');

      document.getElementById('imm-p-takeaway').textContent = pageData.keyTakeaway || '';

      const immBg = document.getElementById('imm-bg-blur');
      if (immBg) immBg.style.backgroundImage = `url('${{pageData.chapter_image}}')`;

      const immScrubber = document.getElementById('imm-scrubber');
      if (immScrubber) immScrubber.value = pageNum;
      document.getElementById('imm-page-info').textContent = `Hal ${{pageNum}} dari ${{totalPages}} (${{pct}}%)`;

      // Bookmark button status
      const isMarked = bookmarkedPages.includes(pageNum);
      const bBtn = document.getElementById('imm-bookmark-btn');
      if (bBtn) bBtn.style.color = isMarked ? 'var(--gold-accent)' : 'var(--text-light)';

      // Scroll reader views to top
      const spreadScroll = document.getElementById('screen-spread');
      if (spreadScroll) spreadScroll.scrollTop = 0;
      const readScroll = document.getElementById('screen-read');
      if (readScroll) readScroll.scrollTop = 0;
    }}

    function nextPage() {{
      if (currentPageIndex < ALL_PAGES.length - 1) {{
        currentPageIndex++;
        renderCurrentPage();
        playPaperSound();
        saveLastRead();
      }} else {{
        showToast('Anda telah mencapai halaman terakhir.');
      }}
    }}

    function prevPage() {{
      if (currentPageIndex > 0) {{
        currentPageIndex--;
        renderCurrentPage();
        playPaperSound();
        saveLastRead();
      }} else {{
        showToast('Ini adalah halaman pertama.');
      }}
    }}

    function onScrubInput(val) {{
      const pageNum = parseInt(val, 10);
      const totalPages = ALL_PAGES.length;
      const pct = Math.round((pageNum / totalPages) * 100);
      document.getElementById('spread-page-info').textContent = `Hal ${{pageNum}} dari ${{totalPages}} (${{pct}}%)`;
      document.getElementById('imm-page-info').textContent = `Hal ${{pageNum}} dari ${{totalPages}} (${{pct}}%)`;
    }}

    function onScrubChange(val) {{
      const pageNum = parseInt(val, 10);
      currentPageIndex = pageNum - 1;
      renderCurrentPage();
      playPaperSound();
      saveLastRead();
    }}

    // 9. TAP TO TOGGLE CHROME (Kindle Style)
    function handleReaderTap(e) {{
      // Only toggle if not tapping buttons, inputs, links
      const tag = e.target.tagName.toLowerCase();
      if (['button', 'input', 'a'].includes(tag) || e.target.closest('button')) return;

      isChromeVisible = !isChromeVisible;
      const topBars = [document.getElementById('spread-top-bar'), document.getElementById('imm-top-bar')];
      const bottomBars = [document.getElementById('spread-bottom-bar'), document.getElementById('imm-bottom-bar')];

      topBars.forEach(b => {{
        if (b) b.classList.toggle('hidden-chrome', !isChromeVisible);
      }});
      bottomBars.forEach(b => {{
        if (b) b.classList.toggle('hidden-chrome', !isChromeVisible);
      }});
    }}

    // 10. TOUCH SWIPE GESTURES
    function setupSwipeGestures() {{
      const targets = [document.getElementById('screen-spread'), document.getElementById('screen-read')];

      targets.forEach(el => {{
        if (!el) return;
        el.addEventListener('touchstart', (e) => {{
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
          touchStartTime = Date.now();
        }}, {{ passive: true }});

        el.addEventListener('touchend', (e) => {{
          const touchEndX = e.changedTouches[0].screenX;
          const touchEndY = e.changedTouches[0].screenY;
          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;
          const diffTime = Date.now() - touchStartTime;

          // Horizontal swipe threshold
          if (Math.abs(diffX) > 45 && Math.abs(diffY) < 60 && diffTime < 450) {{
            if (diffX < 0) {{
              nextPage(); // Swipe Left -> Next
            }} else {{
              prevPage(); // Swipe Right -> Prev
            }}
          }}
        }}, {{ passive: true }});
      }});
    }}

    // 11. KEYBOARD NAVIGATION
    function setupKeyboardNav() {{
      window.addEventListener('keydown', (e) => {{
        const spreadActive = document.getElementById('screen-spread').classList.contains('active');
        const readActive = document.getElementById('screen-read').classList.contains('active');

        if (!spreadActive && !readActive) return;

        if (e.key === 'ArrowRight' || e.key === 'PageDown') {{
          e.preventDefault();
          nextPage();
        }} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {{
          e.preventDefault();
          prevPage();
        }} else if (e.key === 'Escape') {{
          closeReader();
        }}
      }});
    }}

    // 12. FONT SIZE TOGGLE
    function cycleFontSize() {{
      const viewport = document.getElementById('phone-viewport');
      if (fontSizeLevel === 'normal') {{
        fontSizeLevel = 'large';
        viewport.classList.remove('size-xlarge');
        viewport.classList.add('size-large');
        showToast('Ukuran teks: Besar (+)');
      }} else if (fontSizeLevel === 'large') {{
        fontSizeLevel = 'xlarge';
        viewport.classList.remove('size-large');
        viewport.classList.add('size-xlarge');
        showToast('Ukuran teks: Ekstra (++)');
      }} else {{
        fontSizeLevel = 'normal';
        viewport.classList.remove('size-large', 'size-xlarge');
        showToast('Ukuran teks: Normal');
      }}
    }}

    // 13. BOOKMARKS & PERSISTENCE
    function toggleBookmark() {{
      const pageNum = currentPageIndex + 1;
      const idx = bookmarkedPages.indexOf(pageNum);
      if (idx > -1) {{
        bookmarkedPages.splice(idx, 1);
        showToast(`Tanda halaman ${{pageNum}} dihapus`);
      }} else {{
        bookmarkedPages.push(pageNum);
        showToast(`Halaman ${{pageNum}} ditandai 🔖`);
      }}
      try {{
        localStorage.setItem('suatu_saat_bookmarks', JSON.stringify(bookmarkedPages));
      }} catch {{}}
      renderCurrentPage();
    }}

    function saveLastRead() {{
      try {{
        localStorage.setItem('suatu_saat_last_page', (currentPageIndex + 1).toString());
      }} catch {{}}
    }}

    function loadStoredState() {{
      try {{
        const b = localStorage.getItem('suatu_saat_bookmarks');
        if (b) bookmarkedPages = JSON.parse(b);
      }} catch {{}}
    }}

    // 14. DRAWER CONTROLLER
    function toggleMenu() {{
      const drawer = document.getElementById('menu-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      drawer.classList.toggle('open');
      backdrop.classList.toggle('active');
    }}

    // 15. DESKTOP SIMULATOR WIDTH SWITCHER
    function setSimulatorWidth(widthVal) {{
      const vp = document.getElementById('phone-viewport');
      if (!vp) return;

      if (widthVal === '100%') {{
        vp.style.width = '100%';
        vp.style.maxWidth = '780px';
        vp.style.borderRadius = '24px';
      }} else {{
        vp.style.width = widthVal;
        vp.style.maxWidth = 'none';
        vp.style.borderRadius = '42px';
      }}

      const pills = document.querySelectorAll('#simulator-bar .sim-group:nth-child(2) .sim-pill');
      pills.forEach((p) => p.classList.remove('active'));
      pills.forEach((p) => {{
        if (p.textContent.includes(widthVal) || (widthVal === '100%' && p.textContent.includes('Fluid'))) {{
          p.classList.add('active');
        }}
      }});
      showToast(`Viewport disetel ke ${{widthVal}}`);
    }}
  </script>
</body>
</html>
"""

    with open('R:/flip-book/index.html', 'w', encoding='utf-8') as out:
        out.write(html_content)

    print(f"Successfully generated R:/flip-book/index.html ({len(html_content)} bytes)")

if __name__ == '__main__':
    main()
