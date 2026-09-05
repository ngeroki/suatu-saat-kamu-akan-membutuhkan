# -*- coding: utf-8 -*-
"""
scripts/compile_flipbook.py
Canonical Compiler: Compiles chapters_raw.json into src/data/book-pages.json.
Preserves portrait slide image paths, thumbnails, visual continuity, and provenance metadata.
"""
import json
import os

CHAPTERS_RAW_PATH = 'chapters_raw.json'
OUTPUT_PATH = 'src/data/book-pages.json'

def main():
    if not os.path.exists(CHAPTERS_RAW_PATH):
        raise FileNotFoundError(f"Missing {CHAPTERS_RAW_PATH}")

    with open(CHAPTERS_RAW_PATH, 'r', encoding='utf-8') as f:
        chapters_raw = json.load(f)

    # Load existing book-pages.json if available to preserve metadata
    existing_pages = {}
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
                for p in json.load(f):
                    existing_pages[p['page_number']] = p
        except Exception:
            pass

    all_pages = []
    global_page_num = 1

    for ch_idx, chap in enumerate(chapters_raw):
        chap_id = chap.get('id', ch_idx + 1)
        chap_code = f"BAB {chap_id:02d}"
        chap_title_clean = chap.get('title', '').replace('\n', ' ')
        pages = chap.get('pages', [])
        total_in_chap = len(pages)

        for idx, p in enumerate(pages):
            page_in_chap = p.get('page_in_chapter', idx + 1)
            badge = p.get('badge', f'Bagian {page_in_chap}')
            title = p.get('title', '')
            subtitle = p.get('subtitle', '')
            paragraphs = p.get('paragraphs', [])
            image_caption = p.get('imageCaption', '')
            key_takeaway = p.get('keyTakeaway', '')

            default_image = f"/slides-portrait/bab-{chap_id:02d}/slide-{page_in_chap}.jpg"
            default_thumb = f"/thumbnails/bab-{chap_id:02d}/thumb-{page_in_chap}.jpg"

            text_blocks = []
            if badge:
                text_blocks.append(f'> **{badge}**')
            if title:
                text_blocks.append(f'# {title}')
            if subtitle:
                text_blocks.append(f'*{subtitle}*')
            for para in paragraphs:
                text_blocks.append(para)
            if key_takeaway:
                text_blocks.append(f'> **Intisari Kesadaran:** {key_takeaway}')

            full_text = '\n\n'.join(text_blocks)
            word_count = sum(len(w.split()) for w in paragraphs) + len(title.split())

            existing = existing_pages.get(global_page_num, {})

            page_obj = {
                'page_number': global_page_num,
                'chapter_id': chap_id,
                'chapter_code': chap_code,
                'chapter_name': chap_title_clean,
                'subchapter_name': title,
                'page_in_chap': page_in_chap,
                'total_in_chap': total_in_chap,
                'previous_page': global_page_num - 1 if global_page_num > 1 else None,
                'next_page': global_page_num + 1 if global_page_num < 74 else None,
                'badge': badge,
                'title': title,
                'subtitle': subtitle,
                'paragraphs': paragraphs,
                'text': full_text,
                'word_count': word_count,
                'image_path': existing.get('image_path') or default_image,
                'illustration_prompt': existing.get('illustration_prompt', ''),
                'illustration_description': image_caption or existing.get('illustration_description', ''),
                'imageCaption': image_caption or existing.get('imageCaption', ''),
                'keyTakeaway': key_takeaway,
                'thumbnail': existing.get('thumbnail') or default_thumb,
                'visual_continuity_context': existing.get('visual_continuity_context', {
                    'prev_visual': '',
                    'current_subject': title,
                    'environment': '',
                    'mood': ''
                }),
                'narrative_role': existing.get('narrative_role', 'insight'),
                'transition': existing.get('transition', 'continues'),
                'provenance': existing.get('provenance', {
                    'source_chapter': chap_id,
                    'source_section': f"Bab {chap_id} > {title}",
                    'source_paragraph_start': 1,
                    'source_paragraph_end': len(paragraphs)
                })
            }
            all_pages.append(page_obj)
            global_page_num += 1

    all_pages[-1]['next_page'] = None
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_pages, f, ensure_ascii=False, indent=2)
    print(f'Successfully compiled {len(all_pages)} pages into {OUTPUT_PATH} from {CHAPTERS_RAW_PATH}!')

if __name__ == '__main__':
    main()

