import cv2
import glob
import os
import json
import numpy as np

# Load template: mountain logo from pill_sample.png
template_full = cv2.imread(r"C:\Users\hans_\.gemini\antigravity\brain\e8e1b60b-feb7-4554-943d-745294f549e7\scratch\pill_sample.png")
if template_full is None:
    print("Failed to load pill_sample.png")
    exit(1)

h_t, w_t = template_full.shape[:2]
logo_icon = template_full[int(h_t*0.25):int(h_t*0.85), int(w_t*0.12):int(w_t*0.32)]
text_gemini = template_full[int(h_t*0.3):int(h_t*0.8), int(w_t*0.32):int(w_t*0.60)]

files = sorted(glob.glob("public/slides-portrait/*/*.jpg"))
flagged = []

for f in files:
    img = cv2.imread(f)
    if img is None:
        continue
    h, w = img.shape[:2]
    # Check bottom 25%
    roi = img[int(h*0.75):h, :]
    
    # 1. Check full pill
    res_pill = cv2.matchTemplate(roi, template_full, cv2.TM_CCOEFF_NORMED)
    _, max_pill, _, loc_pill = cv2.minMaxLoc(res_pill)
    
    # 2. Check logo icon
    res_logo = cv2.matchTemplate(roi, logo_icon, cv2.TM_CCOEFF_NORMED)
    _, max_logo, _, loc_logo = cv2.minMaxLoc(res_logo)
    
    # 3. Check gemini text
    res_text = cv2.matchTemplate(roi, text_gemini, cv2.TM_CCOEFF_NORMED)
    _, max_text, _, loc_text = cv2.minMaxLoc(res_text)
    
    # Check if watermark is detected
    is_hit = max_pill > 0.60 or max_logo > 0.65 or max_text > 0.65
    if is_hit:
        # Calculate absolute bounding box in the original image
        roi_offset_y = int(h*0.75)
        # Choose best match location
        best_loc = loc_pill
        bbox = {
            "x": int(best_loc[0]),
            "y": int(roi_offset_y + best_loc[1]),
            "w": int(w_t),
            "h": int(h_t)
        }
        flagged.append({
            "file": f.replace("\\", "/"),
            "max_pill": float(max_pill),
            "max_logo": float(max_logo),
            "max_text": float(max_text),
            "bbox": bbox
        })

print(f"Total slides scanned: {len(files)}")
print(f"Flagged slides with Gemini Notebook watermark: {len(flagged)}")
for item in flagged:
    print(f"  -> {item['file']} (pill: {item['max_pill']:.2f}, logo: {item['max_logo']:.2f}, text: {item['max_text']:.2f}) at y={item['bbox']['y']}, x={item['bbox']['x']}")

# Save report
with open("docs/WATERMARK_AUDIT_REPORT.json", "w", encoding="utf-8") as out:
    json.dump(flagged, out, indent=2)
print("Saved report to docs/WATERMARK_AUDIT_REPORT.json")
