# PROJECT RESUME — SUATU SAAT (Flip-Book SPA)
Last Updated: 2026-09-03T01:27:30+07:00

## Quick Status
- Server: Detached Node.js HTTP server running on http://localhost:4173 (PID in server.pid).
- Mode: Single Page App (Vite + TypeScript) with 100% Mockup Aligned UI.
- Structure:
  - Screen 1 (Cover): Master artwork hero (centered 3D book on mountain rock), Cormorant Garamond display typography, warm sand CTA.
  - Screen 2 (Daftar Bab): 5 cards with large numerals (01-05), titles, 3 teaser bullets, illustrations fading left-to-dark, circle arrow buttons.
  - Screen 3 (Daftar Isi): Dropdown accordion per bab, showing page numbers and clickable sub-sections.
  - Screen 4 (Spread Reader): Authentic physical book spread filling 80% screen height, 74 sequential pages mapped from manuscript, 74 unique page illustrations, 3D curl paper flip physics (MLBB style), and multi-layer procedural paper rustle audio.

## Key Files
- `src/screens/reader/reader.ts`: 3D physics page curl reader engine with sequential navigation.
- `src/data/spread-pages.ts`: Complete 74-page dataset strictly structured per chapter.
- `src/lib/audio.ts`: Procedural multi-layer paper turn audio synthesizer.
- `public/assets/pages/`: 74 dedicated art plates for every single page.
