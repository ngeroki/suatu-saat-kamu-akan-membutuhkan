"""
SUATU SAAT v2 — Automated Smart Inpainter
Removes "Gemini Notebook" watermark from the bottom-right corner of all 74 portrait slides.
Uses OpenCV Telea inpainting with adaptive thresholding to cleanly reconstruct surrounding backgrounds.
"""
import os
import glob
import shutil
from pathlib import Path
import cv2
import numpy as np

PROJECT_ROOT = Path("R:/flip-book")
SLIDES_PORTRAIT_DIR = PROJECT_ROOT / "public" / "slides-portrait"
DIST_PORTRAIT_DIR = PROJECT_ROOT / "dist" / "slides-portrait"

def remove_watermark(image_path: str) -> bool:
    img = cv2.imread(image_path)
    if img is None:
        print(f"Failed to load: {image_path}")
        return False

    h, w = img.shape[:2]

    # Watermark bounding box ROI: bottom-right corner
    roi_y1 = max(0, h - 95)
    roi_y2 = h
    roi_x1 = max(0, w - 380)
    roi_x2 = w

    roi = img[roi_y1:roi_y2, roi_x1:roi_x2]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

    # Adaptive threshold based on background brightness
    bg_level = float(np.median(gray))
    thresh_val = max(int(bg_level + 40), 90)

    _, mask = cv2.threshold(gray, thresh_val, 255, cv2.THRESH_BINARY)

    # If bright watermark pixels detected, inpaint them
    if mask.sum() > 0:
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask_dilated = cv2.dilate(mask, kernel, iterations=2)

        inpainted_roi = cv2.inpaint(roi, mask_dilated, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
        img[roi_y1:roi_y2, roi_x1:roi_x2] = inpainted_roi

        # Save back with high quality
        cv2.imwrite(image_path, img, [cv2.IMWRITE_JPEG_QUALITY, 90, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
        return True

    return False

def main():
    search_pattern = str(SLIDES_PORTRAIT_DIR / "*" / "*.jpg")
    slide_files = sorted(glob.glob(search_pattern))
    print(f"Found {len(slide_files)} portrait slides in {SLIDES_PORTRAIT_DIR}")

    cleaned_count = 0
    for idx, f in enumerate(slide_files, 1):
        rel_path = os.path.relpath(f, str(PROJECT_ROOT))
        success = remove_watermark(f)
        if success:
            cleaned_count += 1
            print(f"[{idx:02d}/{len(slide_files)}] Cleaned: {rel_path}")
        else:
            print(f"[{idx:02d}/{len(slide_files)}] Clean/No watermark: {rel_path}")

    print(f"\nCompleted! Cleaned watermarks from {cleaned_count}/{len(slide_files)} slides.")

    # Synchronize cleaned files to dist/slides-portrait
    if DIST_PORTRAIT_DIR.exists():
        print(f"\nSynchronizing cleaned slides to {DIST_PORTRAIT_DIR}...")
        for f in slide_files:
            rel = os.path.relpath(f, str(SLIDES_PORTRAIT_DIR))
            target = DIST_PORTRAIT_DIR / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, target)
        print("Dist synchronization complete!")

if __name__ == "__main__":
    main()
