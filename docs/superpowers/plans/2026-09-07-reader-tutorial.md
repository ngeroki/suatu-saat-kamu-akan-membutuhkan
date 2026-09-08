# Reader Tutorial Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a minimal, thin, non-blocking tutorial layer over the existing reader that guides the reader through 3 fundamental gestures (`flip → swipe → page-picker → completed`) using existing interaction handlers without any new dependencies.

**Architecture:** A lightweight observer layer within `ReaderScreen` that tracks a single state machine (`flip` → `swipe` → `page-picker` → `completed`), renders a non-blocking pointer-events-none overlay with animated ink gesture cues, advances strictly from existing reader interaction callbacks, and persists completion to `localStorage`.

**Tech Stack:** TypeScript, Vanilla DOM, CSS3 Animations, Vite.

## Global Constraints

- Storage key: `suatu-saat:reader-tutorial-completed`
- Exactly 3 tutorial states + 1 completion state: `flip → swipe → page-picker → completed`
- Zero new libraries/dependencies (no Driver.js, Shepherd, Intro.js)
- Non-blocking UX: `pointer-events: none` on overlay/backdrop elements so underlying reader DOM remains 100% interactive
- Zero duplicate gesture/click detectors: advance solely on existing `flipToSide`, `nextPage`/`prevPage`, and `togglePagePicker` execution points
- No modal dialogs, no "Next" buttons, no progress bars, no "Wrong!" states
- Editorial Nusantara aesthetic: Charcoal `#11110F`, Bone `#F4EFE6`, Earth `#7A6045`, Terracotta `#8B4E3C`, Gold `#C5A059`

---

### Task 1: CSS Ink Gesture & Spotlight Highlight Styles

**Files:**
- Modify: `src/style.css`

**Interfaces:**
- Produces: CSS classes `.m-reader-tutorial-layer`, `.m-tut-cue`, `.m-tut-cue-pill`, `.m-tut-target-highlight`, `@keyframes tut-pulse`, `@keyframes tut-float-x`

- [ ] **Step 1: Add CSS rules to `src/style.css`**
Add scoped, lightweight styles for the tutorial layer with `pointer-events: none`, soft ambient vignette, subtle golden/terracotta target highlight ring, and editorial calligraphy cue pills.

- [ ] **Step 2: Verify CSS builds cleanly**
Run `npm run build` to verify no syntax errors in CSS.

---

### Task 2: ReaderScreen Tutorial State Machine & Interaction Callbacks

**Files:**
- Modify: `src/screens/reader/reader.ts`

**Interfaces:**
- Consumes: Existing `flipToSide`, `nextPage`/`prevPage`, `togglePagePicker`, `renderMobile`, `hide`
- Produces: `TutorialStep` type (`"flip" | "swipe" | "page-picker" | "completed"`), `advanceTutorial(currentStep)`, `updateTutorialUI()`

- [ ] **Step 1: Define Tutorial Types & State in `reader.ts`**
Add `TutorialStep` type, `TUTORIAL_STORAGE_KEY = "suatu-saat:reader-tutorial-completed"`, and initialize `tutorialStep` checking `localStorage`.

- [ ] **Step 2: Wire advance callbacks into existing reader handlers**
- In `flipToSide(side)`: when successfully flipping from "A" to "B" (or "B" to "A"), if `this.tutorialStep === "flip"`, advance to `"swipe"`.
- In `nextPage()` / `prevPage()`: if `this.tutorialStep === "swipe"`, advance to `"page-picker"`.
- In `togglePagePicker()`: if `this.tutorialStep === "page-picker"`, advance to `"completed"`, write `localStorage.setItem(TUTORIAL_STORAGE_KEY, "true")`, and remove tutorial DOM.

- [ ] **Step 3: Implement `updateTutorialUI()` and cleanup on `hide()`**
Render or update the lightweight tutorial cue badge and target highlight. Handle clean teardown on step advancement and screen exit.

- [ ] **Step 4: Verify typecheck and build**
Run `npm run build` to verify TypeScript compile and Vite bundling pass with exit code 0.

---

### Task 3: Comprehensive Verification & Headless Browser Testing

**Files:**
- Test / Verify: `scripts/verify_tutorial.py` or Playwright headless check

- [ ] **Step 1: Test initial state (fresh reader)**
Verify tutorial starts at `flip` state when localStorage key is unset.
- [ ] **Step 2: Test flip interaction**
Trigger flip (tap poster or cue button) -> assert state advances to `swipe`.
- [ ] **Step 3: Test swipe/navigation interaction**
Trigger next page (swipe or chevron) -> assert state advances to `page-picker`.
- [ ] **Step 4: Test page-picker interaction**
Trigger page picker tap -> assert state advances to `completed` and localStorage is set.
- [ ] **Step 5: Test persistence & idempotency**
Reload or reopen reader -> verify tutorial does not render again once completed.
