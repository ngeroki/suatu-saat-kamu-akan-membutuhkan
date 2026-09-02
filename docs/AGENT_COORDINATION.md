# 🤝 DOKUMEN KOORDINASI CROSS-AGENT (ANTIGRAVITY + OPENCODE)

## 1. Saluran Komunikasi
- Session ID: `ses_f9de86d2cffeEHvpVqiwq3HP1P`.
- Commit prefix: [AG] Antigravity, [OMO] OpenCode Sisyphus.

---

## 3. Active Co-op Allocation — SUATU SAAT v2 Full Rebuild

### [AG] Domain (Antigravity)
Files: package.json, vite.config.ts, tsconfig.json, src/style.css, src/data/chapters.ts, src/lib/*, src/router.ts, src/main.ts, public/assets/

Task: Vite scaffold + design system CSS tokens + typed chapter data + core libs + image assets.

### [OMO] Domain (OpenCode Sisyphus)
Files: src/screens/*, src/components/*, index.html

Task: All 6 screens (cover, bab-list, toc, reader/flip, reader/spread, reader/immersive) + page renderer + nav components.

### ZERO OVERLAP RULE
- [AG] DOES NOT TOUCH screens/ or components/.
- [OMO] DOES NOT TOUCH style.css, data/, lib/, router.ts.

## 4. Sequence
1. [AG] scaffolds Vite + design system + data layer (FIRST).
2. Once committed -> [OMO] starts screen implementation (parallel with [AG] image gen).
3. [AG] does final typecheck + Playwright visual verification.
