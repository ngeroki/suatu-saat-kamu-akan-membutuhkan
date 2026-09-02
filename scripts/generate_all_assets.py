import asyncio
import os
import shutil
import sys
from pathlib import Path

SCRIPT_DIR = Path("C:/Users/hans_/.gemini/config/skills/gemini-image-gen/scripts")
sys.path.insert(0, str(SCRIPT_DIR))

from generate import generate

ASSETS_DIR = Path("r:/flip-book/assets")
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

ITEMS = [
    {
        "name": "book_cover_3d",
        "prompt": "Cinematic commercial product photo of a thick hardcover physical book titled 'SUATU SAAT' standing on an Indonesian volcanic mossy rock, moody mist behind it. Textured dark charcoal cloth cover with gold embossed serif typography 'SUATU SAAT' and 'ALDI'. Realistic tactile book binding, paper edges visible, quiet luxury, 35mm photograph",
        "model": "pro",
        "aspect": "3:4",
        "target": "book_cover_3d.jpg"
    },
    {
        "name": "bab_01_torus",
        "prompt": "Cinematic dark editorial artwork of a luminous human body anatomy with glowing golden Torus energy field radiating around heart and spine, sacred geometry lines, deep charcoal and warm amber glow, minimalist, meditative, fine art",
        "model": "flash",
        "aspect": "16:9",
        "target": "bab_01_torus.jpg"
    },
    {
        "name": "bab_02_theta",
        "prompt": "Serene human figure submerged underwater in deep ocean with sun rays filtering down through tranquil dark teal water, peaceful theta meditation state, dreamlike subconscious, cinematic photography, quiet and mysterious",
        "model": "flash",
        "aspect": "16:9",
        "target": "bab_02_theta.jpg"
    },
    {
        "name": "bab_03_biohack",
        "prompt": "Macro photograph of vibrant tropical Indonesian rainforest leaves, wet banana and monstera foliage with fresh dew drops, golden morning sunlight filtering through jungle canopy, organic nature, rich botanical textures",
        "model": "flash",
        "aspect": "16:9",
        "target": "bab_03_biohack.jpg"
    },
    {
        "name": "bab_04_kuantum",
        "prompt": "Cosmic quantum vortex, glowing stardust particles and spiral galaxy swirling in the deep black void of space, ethereal quantum entanglement, cosmic contemplation, deep charcoal and warm amber starlight",
        "model": "flash",
        "aspect": "16:9",
        "target": "bab_04_kuantum.jpg"
    },
    {
        "name": "bab_05_berserah",
        "prompt": "Silhouette of a person sitting in peaceful meditation on a mountaintop ridge facing a golden sunrise horizon, ancient Javanese stone temple silhouetted in soft warm light, deep surrender, tranquil Nusantara atmosphere",
        "model": "flash",
        "aspect": "16:9",
        "target": "bab_05_berserah.jpg"
    },
    {
        "name": "closing_landscape",
        "prompt": "Cinematic twilight view of Indonesian volcanic highlands, rolling mist through ancient pine trees and stone temple ruins, serene golden hour, warm black charcoal and bone ivory tones, quiet editorial photography",
        "model": "flash",
        "aspect": "16:9",
        "target": "closing_landscape.jpg"
    }
]

async def run():
    print(f"Starting asset generation for {len(ITEMS)} items...")
    for idx, item in enumerate(ITEMS):
        target_path = ASSETS_DIR / item["target"]
        if target_path.exists():
            print(f"[{idx+1}/{len(ITEMS)}] Skipping {item['name']} (already exists)")
            continue
        print(f"[{idx+1}/{len(ITEMS)}] Generating {item['name']} ({item['model']})...")
        try:
            results = await generate(
                prompt=item["prompt"],
                model_type=item["model"],
                aspect_ratio=item["aspect"],
                output_path=str(target_path)
            )
            if results:
                gen_file = results[0]["path"]
                shutil.copy2(gen_file, str(target_path))
                print(f"-> Saved: {target_path} ({results[0]['width']}x{results[0]['height']})")
        except Exception as e:
            print(f"-> Error generating {item['name']}: {e}")
        await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(run())
