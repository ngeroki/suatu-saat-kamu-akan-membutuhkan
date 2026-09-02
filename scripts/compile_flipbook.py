# -*- coding: utf-8 -*-
import json
import os

CHAPTER_CONFIG = [
    {
        'id': 1,
        'code': 'BAB 01',
        'title': 'Anatomi Tubuh Energi\n& Memori Karma',
        'subtitle': 'Medan Torus, Black Box Tulang Ekor & Kosmologi Kesadaran',
        'tags': ['Medan Torus', 'Memori Karma', 'Cairan CSF'],
        'image': '/slides/bab-01/slide-1.png',
        'json_path': 'R:/suatu-saat-kamu-akan-membutuhkan/apps/web/src/data/bab_01_flipbook.json',
    },
    {
        'id': 2,
        'code': 'BAB 02',
        'title': 'Meretas Pikiran\nBawah Sadar\n& Reprogramming Nasib',
        'subtitle': 'Zona Theta, Critical Faculty & Jeda 3 Detik',
        'tags': ['Zona Theta', 'Critical Faculty', 'Jeda 3 Detik'],
        'image': '/slides/bab-02/slide-1.png',
        'json_path': 'R:/suatu-saat-kamu-akan-membutuhkan/apps/web/src/data/bab_02_flipbook.json',
    },
    {
        'id': 3,
        'code': 'BAB 03',
        'title': 'Sistem Hormon,\nBiohacking Leluhur',
        'subtitle': 'Dopamin, Ritme Sirkadian & Puasa Weton',
        'tags': ['Dopamin', 'Ritme Sirkadian', 'Puasa Weton'],
        'image': '/slides/bab-03/slide-1.png',
        'json_path': 'R:/suatu-saat-kamu-akan-membutuhkan/apps/web/src/data/bab_03_flipbook.json',
    },
    {
        'id': 4,
        'code': 'BAB 04',
        'title': 'Fisika Kuantum,\nRelativitas &\nKeterhubungan',
        'subtitle': 'Quantum Entanglement & Titik Nol (Suwung)',
        'tags': ['Keterhubungan', 'Relativitas', 'Titik Nol'],
        'image': '/slides/bab-04/slide-1.png',
        'json_path': 'R:/suatu-saat-kamu-akan-membutuhkan/apps/web/src/data/bab_04_flipbook.json',
    },
    {
        'id': 5,
        'code': 'BAB 05',
        'title': 'Menjadi Manusia\nNormal & Seni\nBerserah',
        'subtitle': 'Anti Spiritual Bypass & Ketenangan Batin',
        'tags': ['Anti Spiritual Bypass', 'Dunia Fisik', 'Titik Nol'],
        'image': '/slides/bab-05/slide-1.png',
        'json_path': 'R:/suatu-saat-kamu-akan-membutuhkan/apps/web/src/data/bab_05_flipbook.json',
    }
]

def main():
    all_pages = []
    global_page_num = 1
    for chap in CHAPTER_CONFIG:
        with open(chap['json_path'], 'r', encoding='utf-8') as f:
            pages = json.load(f)
        total_in_chap = len(pages)
        chap_title_clean = chap['title'].replace('\n', ' ')
        chap['pageStart'] = global_page_num
        chap['pageCount'] = total_in_chap
        for idx, p in enumerate(pages):
            page_in_chap = p.get('page', idx + 1)
            badge = p.get('badge', f'Bagian {page_in_chap}')
            title = p.get('title', '')
            subtitle = p.get('subtitle', '')
            paragraphs = p.get('paragraphs', [])
            image = p.get('image', '')
            image_caption = p.get('imageCaption', '')
            key_takeaway = p.get('keyTakeaway', '')
            thumbnail = p.get('thumbnail', '')
            
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
            
            page_obj = {
                'page_number': global_page_num,
                'chapter_id': chap['id'],
                'chapter_code': chap['code'],
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
                'image_path': image,
                'illustration_prompt': '',
                'illustration_description': image_caption,
                'imageCaption': image_caption,
                'keyTakeaway': key_takeaway,
                'thumbnail': thumbnail,
                'visual_continuity_context': {
                    'prev_visual': '',
                    'current_subject': title,
                    'environment': '',
                    'mood': ''
                }
            }
            all_pages.append(page_obj)
            global_page_num += 1

    all_pages[-1]['next_page'] = None
    with open('src/data/book-pages.json', 'w', encoding='utf-8') as f:
        json.dump(all_pages, f, ensure_ascii=False, indent=2)
    print(f'Successfully compiled {len(all_pages)} pages into src/data/book-pages.json!')

if __name__ == '__main__':
    main()
