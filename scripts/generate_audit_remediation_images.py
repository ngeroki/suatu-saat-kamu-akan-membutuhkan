import asyncio
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from PIL import Image
from gemini_webapi import GeminiClient

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = Path.home() / ".gemini" / "config"
COOKIE_EXTRACTOR = BASE_DIR / "scripts" / "extract-account-cookies.cjs"
EMAIL = "ngempetbuko@gmail.com"

# Definitions of the 16 target pages with refined art-directed prompts
PAGE_CONFIGS = {
    63: {
        "title": "Pertukaran yang Terjadi di Balik Kelambu",
        "slide": "public/slides-portrait/bab-05/slide-4.jpg",
        "thumb": "public/thumbnails/bab-05/thumb-4.jpg",
        "batch": "hal63",
        "prompt": (
            "Generate an image of an intimate authentic Indonesian husband and wife resting together under a thin antique white translucent mosquito net (kelambu) "
            "in an old Javanese limasan wooden bedroom at night. Dim warm amber glow from a small brass kerosene lamp (lampu teplok). Sacred, tender, quiet communion. "
            "Their hands rest together gently on the woven cotton blanket, fingers touching naturally with clean, realistic, proportional five-finger hand anatomy, "
            "perfectly detailed hands and fingers, anatomically correct human hands, no deformed digits, natural human anatomy. "
            "Rich 35mm film grain, Indonesian slow-cinema still, muted earthy palette with charcoal, bone paper, warm amber, deep teak brown. "
            "Strictly no nudity, no text, no deformed hands, no extra fingers, no CGI gloss, vertical portrait 9:16 aspect ratio"
        )
    },
    5: {
        "title": "Tulang Kecil di Dasar Tubuh",
        "slide": "public/slides-portrait/bab-01/slide-5.jpg",
        "thumb": "public/thumbnails/bab-01/thumb-5.jpg",
        "batch": "batch1",
        "prompt": (
            "Generate an image of an Indonesian figure sitting in profound quiet contemplation on a dark teak wooden floor of a quiet Javanese joglo pavilion at early dawn. "
            "Seen from behind or three-quarters, head gently bowed, hand resting gently at the lower spine and coccyx area, embodying the sacred seed of creation (tulang sulbi). "
            "Soft golden dawn light filtering horizontally through wooden lattice shutters, illuminating the subtle curve of the spine like a delicate primordial stem of life. "
            "Deep charcoal, warm terracotta, earth brown, bone white tones. 35mm slow-cinema film still, tactile natural textures, vertical 9:16 layout, negative space in upper dark rafters. "
            "No text, no glowing CGI runes, no medical diagrams, vertical portrait 9:16 aspect ratio"
        )
    },
    6: {
        "title": "Karma Bukan Hakim di Atas Awan",
        "slide": "public/slides-portrait/bab-01/slide-6.jpg",
        "thumb": "public/thumbnails/bab-01/thumb-6.jpg",
        "batch": "batch1",
        "prompt": (
            "Generate an image of an Indonesian man in his 30s standing before an antique tarnished teak vanity mirror in a dim, austere wooden room in Solo. "
            "Moody warm yellow side lighting from a simple low-wattage bulb. His physical face looks calm, but his honest reflection in the weathered, slightly clouded mirror "
            "reveals raw inner truth and quiet self-reckoning—the natural law of cause and effect (karma) stripping away all pretense. "
            "Distressed teakwood grain, chipped lime plaster, gritty 35mm analog film texture, muted earthy palette of charcoal, sepia, bronze, raw umber, "
            "vertical 9:16 layout with shadowy negative space above. No text, no mythical monsters, no fantasy scales, no digital effects, vertical portrait 9:16 aspect ratio"
        )
    },
    34: {
        "title": "Tubuh yang Menyalakan Alarm",
        "slide": "public/slides-portrait/bab-03/slide-4.jpg",
        "thumb": "public/thumbnails/bab-03/thumb-4.jpg",
        "batch": "batch1",
        "prompt": (
            "Generate an image of an Indonesian man sitting abruptly startled and tense in a dim, rustic room at night, staring down at a glowing smartphone screen lying on a rough dark teak table. "
            "An unexpected sudden notification has just arrived; his shoulders are elevated and rigid with primal biological fight-or-flight alarm. "
            "The harsh pale bluish-white rectangle of the phone screen starkly cuts across his startled, hypervigilant face against deep warm charcoal darkness of the wooden room. "
            "Authentic psychological tension, Indonesian indie cinema still, natural skin texture, heavy 35mm film grain, vertical 9:16 portrait orientation, ample dark negative space above. "
            "No cartoon comic lines, no floating holographic icons, no text, no CGI effects, vertical portrait 9:16 aspect ratio"
        )
    },
    45: {
        "title": "Menjadi Tuan di Rumah Sendiri",
        "slide": "public/slides-portrait/bab-03/slide-15.jpg",
        "thumb": "public/thumbnails/bab-03/thumb-15.jpg",
        "batch": "batch1",
        "prompt": (
            "Generate an image of an Indonesian person sitting serenely in a traditional Javanese joglo central living area (dalem), eyes gently closed in tranquil awareness. "
            "Both hands resting flat and grounded on their thighs or over the chest, feeling the quiet rhythm of their own heartbeat, embodying deep somatic gratitude and peaceful self-sovereignty. "
            "Soft diffuse morning daylight filtering through wooden slats, falling across linen clothes and polished teak pillars. Muted earthy palette of charcoal, warm timber, terracotta, and bone white. "
            "Authentic slow-cinema 35mm film aesthetic, rich analog grain, vertical 9:16 composition, negative space in upper ceiling beams. "
            "No text, no fantasy glowing auras, no superhero poses, vertical portrait 9:16 aspect ratio"
        )
    },
    47: {
        "title": "Kawan Lama yang Tiba-Tiba Muncul",
        "slide": "public/slides-portrait/bab-04/slide-2.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-2.jpg",
        "batch": "batch1",
        "prompt": (
            "Generate an image of an Indonesian man sitting alone at a weathered wooden corner table of a modest roadside warkop (coffee stall) late at night during heavy torrential rain. "
            "Outside the rain-streaked glass window, wet dark reflections and blurry streetlamps shimmer. He gazes into space with deep, quiet introspection, holding a hot glass of black kopi tubruk, "
            "as his smartphone screen on the table softly illuminates with an unexpected message from an old friend. "
            "Atmospheric slow-cinema mood, wet reflections, warm amber tungsten lighting contrasting with cool rain outside, 35mm film grain, "
            "vertical 9:16 portrait framing, generous moody negative space above. No text, no neon cyber graphics, no cheesy glowing bubbles, vertical portrait 9:16 aspect ratio"
        )
    },
    50: {
        "title": "Waktu yang Kita Kejar-kejar",
        "slide": "public/slides-portrait/bab-04/slide-5.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-5.jpg",
        "batch": "batch2",
        "prompt": (
            "Generate an image of a vintage mechanical pendulum wooden wall clock hanging on an aged lime-washed timber wall in a quiet midnight Javanese warung, "
            "its hands and tick-tock rendered meaningless and still in the face of the present moment. In the foreground on a rustic dark wooden table sits a solitary glass of steaming hot black coffee (kopi tubruk), "
            "fragrant steam curling gently into the stillness. Soft warm yellow lantern light, rich teakwood textures, faded plaster, authentic 35mm film grain. "
            "Deep charcoal, warm umber, bone white, soft amber palette. Vertical 9:16 composition, steaming coffee grounded in foreground, antique clock softly receding on wall above, ample quiet negative space. "
            "No text, no melting surrealist clocks, no sci-fi vortex, no neon, vertical portrait 9:16 aspect ratio"
        )
    },
    51: {
        "title": "Menunggu Hidup Dimulai",
        "slide": "public/slides-portrait/bab-04/slide-6.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-6.jpg",
        "batch": "batch2",
        "prompt": (
            "Generate an image of a humble traditional Javanese earth-floor kitchen (dapur pawon) filled with an overwhelming, warm sense of quiet abundance and deep contentment. "
            "On a weathered wooden lincak bench sits a simple enamel plate of steaming white rice, fried tempeh, and sambal, catching golden morning light filtering through wooden wall slats. "
            "Glowing embers in a clay firewood stove (luweng) softly warm the room. Earthy textures: terracotta clay pots, woven bamboo tampah, blackened kettle, damp compacted earth floor. "
            "Rich 35mm analog slow-cinema aesthetic, warm terracotta, soot black, raw umber, golden morning rays, vertical 9:16 framing with calm shadowy rafters above. "
            "No text, no magical glowing sparkles, no fantasy halos, no cartoon graphics, vertical portrait 9:16 aspect ratio"
        )
    },
    52: {
        "title": "Dunia Berubah Ketika Cara Melihat Berubah",
        "slide": "public/slides-portrait/bab-04/slide-7.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-7.jpg",
        "batch": "batch2",
        "prompt": (
            "Generate an image of an environmental portrait of an Indonesian seeker's calm, deeply attentive, penetrating eyes gazing forward through swirling morning mountain mist in the Javanese highlands at dawn. "
            "Where his focused gaze lands, the thick mist gently thins and parts, revealing crisp dewy pine needles and firm stone path, symbolizing conscious awareness bringing reality into clear focus out of quiet uncertainty. "
            "Cool misty dawn light, soft silhouette of mountain ridges, 35mm cinematic film still, muted indigo, slate grey, sage green, and charcoal tones, natural film grain, "
            "vertical 9:16 composition with vast quiet fog above for negative space. No text, no sci-fi lasers, no floating wave formulas, no neon HUDs, vertical portrait 9:16 aspect ratio"
        )
    },
    53: {
        "title": "Ketika Sekat Diri Menipis",
        "slide": "public/slides-portrait/bab-04/slide-8.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-8.jpg",
        "batch": "batch2",
        "prompt": (
            "Generate an image of a solitary Indonesian person sitting in deep quiet meditation cross-legged on a handwoven pandan mat in the center of an empty rustic wooden joglo pavilion at late twilight. "
            "Peaceful stillness, grounded calm posture with hands resting gently on knees. Soft evening light casting gentle long shadows across the dark polished teakwood floor. "
            "Subdued Indonesian slow-cinema 35mm film still, tactile natural textures, earthy palette of charcoal, warm timber, bone paper, and faded sage. "
            "Vertical 9:16 portrait framing, peaceful architecture, vast quiet shadowy space above. "
            "No text, no glowing effects, no fantasy elements, vertical portrait 9:16 aspect ratio"
        )
    },
    54: {
        "title": "Menjadi Manusia Utuh",
        "slide": "public/slides-portrait/bab-04/slide-9.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-9.jpg",
        "batch": "batch2",
        "prompt": (
            "Generate an image of an unassuming Indonesian wayfarer (musafir) in simple humble attire and woven straw hat or headcloth, seen from behind or profile, steadily ascending a weathered earthen terraced path up a misty green hillside at early sunrise. "
            "Stepping firmly upon the ancient stepped soil, walking the timeless archetypal journey toward wholeness and human maturity (Insan Kamil). "
            "Golden morning light breaking across rolling rice terraces and mist-shrouded mountain slopes. "
            "Tactile 35mm documentary realism, rich earth brown, moss green, ochre, and soft morning sky tones. "
            "Vertical 9:16 composition, traveler climbing in lower half, majestic open sky and ridge above providing clean negative space. "
            "No text, no floating holy symbols, no fantasy glowing footsteps, no cartoon vectors, vertical portrait 9:16 aspect ratio"
        )
    },
    55: {
        "title": "Sebelas Tembang Perjalanan Hidup",
        "slide": "public/slides-portrait/bab-04/slide-10.jpg",
        "thumb": "public/thumbnails/bab-04/thumb-10.jpg",
        "batch": "batch2",
        "prompt": (
            "Generate an image of a poetic cultural still-life arrangement on an aged teak wooden surface in an open Javanese pendopo pavilion at twilight. "
            "Neatly folded raw unbleached white cotton shroud cloth (kain mori), an antique handwritten Javanese script manuscript page (kidung Macapat), a single chiseled buffalo leather shadow puppet (wayang kulit), "
            "and a slender living green vine creeping across the weathered wood. Soft warm flame from a brass oil lamp (blencong) casting rich undulating shadows. "
            "Tactile textures of coarse woven cotton, antique paper, dark timber grain, 35mm documentary film grain, palette of bone white, raw umber, antique indigo, and soot black. "
            "Vertical 9:16 framing, arrangement grounded in lower half with quiet shadowy timber above for typography. "
            "No modern typography, no mystical neon glowing runes, no fantasy sparkles, vertical portrait 9:16 aspect ratio"
        )
    },
    66: {
        "title": "Menyerah atau Berserah?",
        "slide": "public/slides-portrait/bab-05/slide-7.jpg",
        "thumb": "public/thumbnails/bab-05/thumb-7.jpg",
        "batch": "batch3",
        "prompt": (
            "Generate an image of a weathered Indonesian warrior or solitary seeker standing on the dark volcanic sand of Java's southern coast (Pantai Selatan) under a brooding twilight and night sky. "
            "He has laid down his traditional heirloom kris weapon onto the wet black sand before him; his calloused hands hang open, peaceful and relaxed at his sides, facing the colossal rolling ocean waves without fear, embodying true spiritual surrender (Pasrah Sumarah). "
            "Dramatic dark indigo and charcoal storm clouds with a sliver of faint amber light on the ocean horizon reflecting on wet sand. "
            "Tactile 35mm film grain, Sebastiao Salgado documentary depth, desaturated cyan, charcoal, and wet sand tones. "
            "Vertical 9:16 portrait framing, figure grounded below, vast moody oceanic sky above. "
            "No text, no sea monsters, no cartoon lightning, no glowing magical forcefields, vertical portrait 9:16 aspect ratio"
        )
    },
    67: {
        "title": "Jangan Mengambil Alih Ujian Orang",
        "slide": "public/slides-portrait/bab-05/slide-8.jpg",
        "thumb": "public/thumbnails/bab-05/thumb-8.jpg",
        "batch": "batch3",
        "prompt": (
            "Generate an image of an Indonesian person standing quietly in the shadows of a traditional Javanese joglo wooden doorway, hands held back, exercising deep compassionate restraint. "
            "Outside through the sunlit doorway, another beloved figure is seen walking up a dusty village slope carrying their own woven basket load, learning their own essential life lesson. "
            "The observer's face expresses deep love mixed with disciplined respect—honoring another person's sovereign struggle without interfering. "
            "Warm dusty tropical light outside contrasting with cool teakwood shadows inside. 35mm analog film aesthetic, rich warm terracotta, dusty ochre, deep charcoal tones. "
            "Vertical 9:16 portrait framing, doorway framing the scene, ample negative space above. "
            "No text, no exaggerated melodrama, no cartoon bubbles, vertical portrait 9:16 aspect ratio"
        )
    },
    68: {
        "title": "Menolong Tanpa Menghitung Jasa",
        "slide": "public/slides-portrait/bab-05/slide-9.jpg",
        "thumb": "public/thumbnails/bab-05/thumb-9.jpg",
        "batch": "batch3",
        "prompt": (
            "Generate an image of weathered, gentle Indonesian hands pouring clear cool water from an unglazed terracotta pitcher (kendi gerabah) into a simple chipped enamel mug "
            "on the split-bamboo bench of a rustic village guard hut (gardu pos ronda) in the quiet of night. "
            "A quiet act of anonymous kindness and pure uncalculated generosity (kerentek hati) for anyone passing by. "
            "A small warm oil lantern softly illuminates the smooth stream of water and porous red clay pot against deep nocturnal village shadows. "
            "Rich 35mm film grain, authentic Indonesian rural night still, warm amber, terracotta, bamboo beige, and velvet charcoal palette. "
            "Vertical 9:16 close-up framing, dark wooden hut eaves above providing clean negative space. "
            "No text, no fake water sparkles, no CGI gloss, vertical portrait 9:16 aspect ratio"
        )
    },
    73: {
        "title": "Spiritualitas yang Tidak Bikin Aneh",
        "slide": "public/slides-portrait/bab-05/slide-14.jpg",
        "thumb": "public/thumbnails/bab-05/thumb-14.jpg",
        "batch": "batch3",
        "prompt": (
            "Generate an image of an elderly Javanese master carpenter in simple work clothes, kneeling calmly as he gently taps a hand-carved hardwood locking peg (pasak kayu) "
            "into the mortise joint of a massive teak pillar (soko guru) of a traditional limasan house. "
            "Quiet mastery and deep meditative grounding in honest craft, demonstrating that true spirituality is rooted in ordinary, disciplined work. "
            "Soft morning sunlight streaming through the timber rafters, catching floating wood shavings and rich teakwood grain. "
            "Tactile 35mm documentary realism, warm amber, weathered timber, raw stone plinth (umpak), and charcoal tones. "
            "Vertical 9:16 architectural portrait, pillar anchored firmly in lower frame, open timber beams above for typography. "
            "No text, no floating blueprints, no mystical holograms, vertical portrait 9:16 aspect ratio"
        )
    }
}

def refresh_cookies(email: str):
    print(f"[{email}] Refreshing cookies via {COOKIE_EXTRACTOR.name}...", flush=True)
    try:
        res = subprocess.run(["node", str(COOKIE_EXTRACTOR), email], cwd=str(BASE_DIR), check=True, capture_output=True, text=True)
        print(f"[{email}] Cookies refreshed: {res.stdout.strip()}", flush=True)
    except Exception as e:
        print(f"[{email}] Cookie refresh failed: {e}", flush=True)

def get_cookies_for_account(email: str):
    cookie_file = CONFIG_DIR / f"gemini_web_cookies_{email}.json"
    if not cookie_file.exists():
        refresh_cookies(email)
    with open(cookie_file, "r", encoding="utf-8") as f:
        return json.load(f)

async def init_client_for_account(email: str) -> GeminiClient:
    for attempt in range(1, 4):
        try:
            cookies = get_cookies_for_account(email)
            psid = cookies.get("__Secure-1PSID")
            psidts = cookies.get("__Secure-1PSIDTS")
            client = GeminiClient(psid, psidts, auto_refresh=False, verbose=False)
            await client.init(timeout=45)
            return client
        except Exception as e:
            print(f"[{email}] Init attempt {attempt} failed ({e}), refreshing cookies...", flush=True)
            refresh_cookies(email)
            await asyncio.sleep(4)
    cookies = get_cookies_for_account(email)
    client = GeminiClient(cookies.get("__Secure-1PSID"), cookies.get("__Secure-1PSIDTS"), auto_refresh=False, verbose=False)
    await client.init(timeout=45)
    return client

def create_thumbnail(src_path: Path, thumb_path: Path):
    try:
        thumb_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src_path) as img:
            img.thumbnail((512, 910), Image.Resampling.LANCZOS)
            img.save(thumb_path, "JPEG", quality=85, optimize=True)
        size_kb = thumb_path.stat().st_size / 1024
        print(f"  [THUMB] Saved thumbnail: {thumb_path.name} ({size_kb:.1f} KB)", flush=True)
    except Exception as e:
        print(f"  [THUMB] Warning: Failed to create thumbnail {thumb_path}: {e}", flush=True)

async def generate_single_page(client: GeminiClient, p_num: int, cfg: dict):
    dest_path = BASE_DIR / cfg["slide"]
    thumb_path = BASE_DIR / cfg["thumb"]
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    thumb_path.parent.mkdir(parents=True, exist_ok=True)
    prompt = cfg["prompt"]

    print(f"\n=======================================================", flush=True)
    print(f"Generating Page {p_num:02d}: {cfg['title']} ({cfg['batch']})", flush=True)
    print(f"Target file: {cfg['slide']}", flush=True)
    print(f"=======================================================", flush=True)

    for attempt in range(1, 4):
        try:
            print(f"  [Attempt {attempt}/3] Sending prompt to gemini-pro...", flush=True)
            chat = client.start_chat(model="gemini-pro")
            res = await chat.send_message(prompt)
            if res.images and len(res.images) > 0:
                try:
                    await res.images[0].save(path=str(dest_path.parent), filename=dest_path.name, verbose=False, client=client.client)
                except Exception:
                    await res.images[0].save(path=str(dest_path.parent), filename=dest_path.name, verbose=False)
                size_mb = dest_path.stat().st_size / 1024 / 1024
                print(f"  -> SUCCESS! Saved to {cfg['slide']} ({size_mb:.2f} MB)", flush=True)
                create_thumbnail(dest_path, thumb_path)
                return {"page": p_num, "status": "success", "size_mb": size_mb, "file": cfg["slide"]}
            else:
                text_snip = (res.text[:120] if res.text else "No text response").replace("\n", " ")
                print(f"  Warning: No image returned (attempt {attempt}). Response: {text_snip}", flush=True)
                text_lower = text_snip.lower()
                if any(k in text_lower for k in ("sign", "signed in", "can't seem to create", "can't create")):
                    refresh_cookies(EMAIL)
                    client = await init_client_for_account(EMAIL)
                await asyncio.sleep(4)
        except Exception as e:
            print(f"  Error on attempt {attempt}: {e}", flush=True)
            err_str = str(e).lower()
            if any(k in err_str for k in ("unauthenticated", "expired", "permission denied")):
                refresh_cookies(EMAIL)
                client = await init_client_for_account(EMAIL)
            await asyncio.sleep(5)

    print(f"  -> FAILED to generate Page {p_num} after 3 attempts!", flush=True)
    return {"page": p_num, "status": "failed", "file": cfg["slide"]}

async def main():
    import argparse
    parser = argparse.ArgumentParser(description="Audit Remediation Image Generator for SUATU SAAT")
    parser.add_argument("--targets", type=str, default="", help="Comma separated page numbers, e.g. 63,5,6")
    parser.add_argument("--batch", type=str, default="", help="Batch name: hal63, batch1, batch2, batch3, or all")
    args = parser.parse_args()

    targets = []
    if args.targets:
        targets = [int(x.strip()) for x in args.targets.split(",") if x.strip()]
    elif args.batch:
        b = args.batch.lower()
        if b == "all":
            targets = list(PAGE_CONFIGS.keys())
        else:
            targets = [p for p, cfg in PAGE_CONFIGS.items() if cfg["batch"].lower() == b]
    else:
        targets = list(PAGE_CONFIGS.keys())

    print(f"Starting Visual Generation for {len(targets)} pages: {targets}")
    client = await init_client_for_account(EMAIL)
    print("Gemini Pro client initialized and ready.\n")

    results = []
    for idx, p_num in enumerate(targets, 1):
        cfg = PAGE_CONFIGS[p_num]
        print(f"\n>>> Progress: [{idx}/{len(targets)} Pages]")
        res = await generate_single_page(client, p_num, cfg)
        results.append(res)
        await asyncio.sleep(3)

    await client.close()

    print("\n=======================================================")
    print("AUDIT REMEDIATION RUN SUMMARY:")
    for r in results:
        status = r["status"].upper()
        sz = f"({r.get('size_mb', 0):.2f} MB)" if r["status"] == "success" else ""
        print(f"  Page {r['page']:02d}: {status} {sz} -> {r['file']}")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(main())
