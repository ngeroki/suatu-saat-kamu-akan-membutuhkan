import sys, os, re, json
sys.stdout.reconfigure(encoding="utf-8")

CHAPTER_FILES = [
    {
        "id": 0,
        "code": "PROLOG",
        "title": "Prolog: Kata Pengantar",
        "filename": "00_Prolog_Kata-Pengantar.md"
    },
    {
        "id": 1,
        "code": "BAB 01",
        "title": "Bab 1: Anatomi Tubuh Energi & Memori Karma",
        "filename": "Bab_01_Anatomi-Tubuh-Energi-dan-Memori-Karma.md"
    },
    {
        "id": 2,
        "code": "BAB 02",
        "title": "Bab 2: Meretas Pikiran Bawah Sadar & Reprogramming Nasib",
        "filename": "Bab_02_Meretas-Pikiran-Bawah-Sadar-dan-Reprogramming-Nasib.md"
    },
    {
        "id": 3,
        "code": "BAB 03",
        "title": "Bab 3: Sistem Hormon, Biohacking Leluhur & Energi Fisik",
        "filename": "Bab_03_Sistem-Hormon-Biohacking-Leluhur-dan-Energi-Fisik.md"
    },
    {
        "id": 4,
        "code": "BAB 04",
        "title": "Bab 4: Fisika Kuantum, Relativitas & Keterhubungan Semesta",
        "filename": "Bab_04_Fisika-Kuantum-Relativitas-dan-Keterhubungan-Semesta.md"
    },
    {
        "id": 5,
        "code": "BAB 05",
        "title": "Bab 5: Menjadi Manusia Normal & Seni Berserah",
        "filename": "Bab_05_Menjadi-Manusia-Normal-dan-Seni-Berserah.md"
    },
    {
        "id": 6,
        "code": "EPILOG",
        "title": "Epilog: Catatan Penutup",
        "filename": "06_Epilog_Catatan-Penutup.md"
    },
]

MANUSCRIPT_DIR = r"R:\flip-book\naskah-buku"

def is_safe_sentence_end(text, match_start):
    prefix = text[max(0, match_start - 8):match_start].lower()
    if match_start > 1 and text[match_start-1] == '.' and text[match_start-2] == '.':
        return False
    abbrevs = ["dr", "prof", "dkk", "dll", "dsb", "hal", "no", "vs", "mr", "mrs"]
    for abb in abbrevs:
        if prefix.endswith(abb):
            return False
    if match_start > 0 and text[match_start-1].isdigit():
        return False
    return True

def get_atomic_spans(doc_text):
    boundaries = set([0, len(doc_text)])
    for m in re.finditer(r"\n\n+", doc_text):
        boundaries.add(m.start())
        boundaries.add(m.end())
        
    sorted_bounds = sorted(boundaries)
    refined_boundaries = set(sorted_bounds)
    for i in range(len(sorted_bounds) - 1):
        s = sorted_bounds[i]
        e = sorted_bounds[i+1]
        chunk = doc_text[s:e]
        words = chunk.split()
        if len(words) >= 30:
            for sm in re.finditer(r'([.!?]["\'\”\)]?)\s+', chunk):
                punct_pos = sm.start()
                if is_safe_sentence_end(chunk, punct_pos):
                    split_point = s + sm.end()
                    refined_boundaries.add(split_point)
                
    final_bounds = sorted(refined_boundaries)
    spans = []
    for i in range(len(final_bounds) - 1):
        s = final_bounds[i]
        e = final_bounds[i+1]
        raw = doc_text[s:e]
        is_h = bool(re.match(r"^\s*#{1,4}\s+", raw))
        is_q = bool(re.match(r"^\s*>\s+", raw))
        spans.append({
            "start": s,
            "end": e,
            "text": raw,
            "word_count": len(raw.split()),
            "is_heading": is_h,
            "is_quote": is_q,
            "is_separator": bool(re.match(r"^\s*---\s*$", raw))
        })
    return spans

def generate_page_visual_metadata(page_text, chapter_info, subchapter_name, prev_visual):
    clean_text = re.sub(r"[#\*\_\`>]", "", page_text).strip()
    words = clean_text.split()
    
    is_dialogue = "Aldi" in page_text or "obrolan" in page_text.lower() or "kopi" in page_text.lower() or "warung" in page_text.lower()
    is_anatomy = "torus" in page_text.lower() or "tulang" in page_text.lower() or "csf" in page_text.lower() or "saraf" in page_text.lower() or "medan" in page_text.lower()
    is_subconscious = "theta" in page_text.lower() or "tidur" in page_text.lower() or "mimpi" in page_text.lower() or "bawah sadar" in page_text.lower() or "otak" in page_text.lower()
    is_biohack = "hormon" in page_text.lower() or "dopamin" in page_text.lower() or "puasa" in page_text.lower() or "weton" in page_text.lower() or "ritme" in page_text.lower() or "sel" in page_text.lower()
    is_quantum = "kuantum" in page_text.lower() or "partikel" in page_text.lower() or "relativitas" in page_text.lower() or "semesta" in page_text.lower() or "keterhubungan" in page_text.lower() or "suwung" in page_text.lower()

    if is_dialogue:
        subject = "Aldi conversing thoughtfully at an open-air roadside coffee table in Yogyakarta, warm steam rising from a clay glass, relaxed candid posture"
        location = "Veranda of Bento Kopi / Kaliurang roadside stall at dusk, misty streetlights and lush tropical banana leaves in soft focus"
        mood = "Intimate, warm, reflective, authentic Indonesian late-night conversation"
    elif is_anatomy:
        subject = "Cinematic medical-spiritual illustration of the human subtle energy anatomy, translucent spinal column with luminous cerebrospinal fluid ascending, glowing sacral vortex"
        location = "Dark minimalist space, ethereal golden frequency lines wrapping in a toroidal field"
        mood = "Reverent, intricate, sacred anatomy, scientific yet deeply mystical"
    elif is_subconscious:
        subject = "Submerged serene figure floating in deep turquoise water beneath gentle shimmering sunbeams breaking through the surface, eyes peacefully closed"
        location = "Deep tranquil freshwater basin, water rippling with hypnagogic light"
        mood = "Profound quietude, theta brainwave stillness, threshold between wakefulness and dream"
    elif is_biohack:
        subject = "Dew-drenched ancestral medicinal flora, detailed macro view of fresh tropical herbal leaves and roots, soft golden dawn sunlight illuminating water droplets"
        location = "Highland volcanic garden in Java, rich fertile volcanic soil and morning mist"
        mood = "Vibrant organic vitality, grounding ancestral biohacking wisdom, natural harmony"
    elif is_quantum:
        subject = "Cosmic quantum entanglement metaphor, two interconnected glowing particle spirals echoing through an infinite starlit dark expanse"
        location = "Deep indigo cosmic void, delicate geometric web of light connecting all elements"
        mood = "Awe-inspiring, timeless, interconnected cosmic unity, silence of the void"
    else:
        subject = "Solitary contemplator seated serenely on a volcanic mountain ridge overlooking misty valleys and distant temple silhouette at blue-hour dawn"
        location = "Mount Merapi or Semeru foothills, sea of clouds rolling slowly under amber horizon"
        mood = "Surrendered peace, grounded awareness, returning home to inner stillness"

    global_style = "Cinematic 35mm photograph, editorial documentary realism, warm earthy amber and charcoal tones, natural film grain, authentic Indonesian setting, highly detailed textures, soft atmospheric lighting, no CGI glow, no text, no captions"
    
    prompt = f"{subject}, set in {location}. {mood}. Visual style: {global_style}. Context from manuscript: '{clean_text[:120]}...'"
    description = f"Visual grounding: {subject} ({mood}) reflecting section '{subchapter_name}'."
    
    continuity_context = {
        "prev_visual": prev_visual,
        "current_subject": subject,
        "environment": location,
        "mood": mood
    }
    
    return prompt, description, continuity_context

def paginate_all():
    all_pages = []
    global_page_num = 1
    prev_visual = "Opening title sequence, Indonesian mountain mist at dawn"

    for ch in CHAPTER_FILES:
        filepath = os.path.join(MANUSCRIPT_DIR, ch["filename"])
        with open(filepath, "r", encoding="utf-8") as f:
            doc_text = f.read()

        spans = get_atomic_spans(doc_text)
        reconstructed_ch = "".join(s["text"] for s in spans)
        assert reconstructed_ch == doc_text, f"Span mismatch in {ch['filename']}!"

        current_page_spans = []
        current_page_words = 0
        current_page_height_cost = 0
        current_subchapter = ch["title"]
        page_in_chap = 1
        chap_pages = []

        i = 0
        while i < len(spans):
            span = spans[i]
            
            if span["is_heading"]:
                clean_heading = re.sub(r"^[#\s]+", "", span["text"]).strip()
                if clean_heading and not clean_heading.startswith("📖") and not clean_heading.startswith("---"):
                    current_subchapter = clean_heading

            # Strict anti-orphan rule:
            # If current page already has ANY content (>= 20 words or >= 25 cost), NEVER start heading on it!
            if span["is_heading"] and current_page_height_cost >= 25:
                if current_page_spans:
                    p_start = current_page_spans[0]["start"]
                    p_end = current_page_spans[-1]["end"]
                    p_text = doc_text[p_start:p_end]
                    chap_pages.append({
                        "start_char": p_start,
                        "end_char": p_end,
                        "text": p_text,
                        "word_count": len(p_text.split()),
                        "chapter_id": ch["id"],
                        "chapter_code": ch["code"],
                        "chapter_name": ch["title"],
                        "subchapter_name": current_subchapter,
                        "page_in_chap": page_in_chap
                    })
                    page_in_chap += 1
                    current_page_spans = []
                    current_page_words = 0
                    current_page_height_cost = 0

            span_cost = span["word_count"]
            if span["is_heading"]:
                span_cost += 25
            elif span["is_quote"]:
                span_cost += 15

            current_page_spans.append(span)
            current_page_words += span["word_count"]
            current_page_height_cost += span_cost

            # Safe visual threshold: target ~55-70 words per mobile card (max ~75 height cost)
            if current_page_height_cost >= 58:
                if i + 1 < len(spans):
                    next_span = spans[i+1]
                    next_cost = next_span["word_count"] + (25 if next_span["is_heading"] else 0)
                    if (current_page_height_cost + next_cost > 72) or next_span["is_heading"]:
                        p_start = current_page_spans[0]["start"]
                        p_end = current_page_spans[-1]["end"]
                        p_text = doc_text[p_start:p_end]
                        chap_pages.append({
                            "start_char": p_start,
                            "end_char": p_end,
                            "text": p_text,
                            "word_count": len(p_text.split()),
                            "chapter_id": ch["id"],
                            "chapter_code": ch["code"],
                            "chapter_name": ch["title"],
                            "subchapter_name": current_subchapter,
                            "page_in_chap": page_in_chap
                        })
                        page_in_chap += 1
                        current_page_spans = []
                        current_page_words = 0
                        current_page_height_cost = 0

            i += 1

        if current_page_spans:
            p_start = current_page_spans[0]["start"]
            p_end = current_page_spans[-1]["end"]
            p_text = doc_text[p_start:p_end]
            chap_pages.append({
                "start_char": p_start,
                "end_char": p_end,
                "text": p_text,
                "word_count": len(p_text.split()),
                "chapter_id": ch["id"],
                "chapter_code": ch["code"],
                "chapter_name": ch["title"],
                "subchapter_name": current_subchapter,
                "page_in_chap": page_in_chap
            })

        chap_reconstructed = "".join(p["text"] for p in chap_pages)
        assert chap_reconstructed == doc_text, f"Chapter {ch['code']} reconstructed text differs from source!"
        print(f"✓ {ch['code']} ({ch['title']}): {len(chap_pages)} pages, {len(doc_text.split())} words, 100% exact match.")

        total_in_chap = len(chap_pages)
        for cp in chap_pages:
            cp["total_in_chap"] = total_in_chap
            cp["page_number"] = global_page_num
            cp["previous_page"] = global_page_num - 1 if global_page_num > 1 else None
            cp["next_page"] = global_page_num + 1
            
            prompt, desc, cont_ctx = generate_page_visual_metadata(
                cp["text"], ch, cp["subchapter_name"], prev_visual
            )
            cp["illustration_prompt"] = prompt
            cp["illustration_description"] = desc
            cp["visual_continuity_context"] = cont_ctx
            cp["image_path"] = f"assets/pages/page_{global_page_num:03d}.jpg"
            prev_visual = desc

            all_pages.append(cp)
            global_page_num += 1

    if all_pages:
        all_pages[-1]["next_page"] = None

    print(f"\n==========================================")
    print(f"TOTAL REFINED PAGES: {len(all_pages)}")
    print(f"Total Words Across Pages: {sum(p['word_count'] for p in all_pages)}")
    print(f"Average Words Per Page: {sum(p['word_count'] for p in all_pages) / len(all_pages):.1f}")
    print(f"==========================================\n")

    output_json_path = r"R:\flip-book\src\data\book-pages.json"
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(all_pages, f, indent=2, ensure_ascii=False)
    print(f"Saved full refined dataset to: {output_json_path}")

    return all_pages

if __name__ == "__main__":
    paginate_all()
