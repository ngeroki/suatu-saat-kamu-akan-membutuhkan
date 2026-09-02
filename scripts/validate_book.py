import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

DATA_PATH = r'src/data/book-pages.json'
PUBLIC_DIR = r'public'

def run_validation():
    print('==================================================')
    print('RUNNING AUTOMATED 5-POINT FLIPBOOK VALIDATION SUITE')
    print('==================================================')

    if not os.path.exists(DATA_PATH):
        print(f'FAIL: Data file not found: {DATA_PATH}')
        sys.exit(1)

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        pages = json.load(f)

    total_pages = len(pages)
    print(f'Loaded {total_pages} pages from dataset.\n')
    assert total_pages == 74, f'Expected 74 pages, got {total_pages}'

    # TEST 1: CHAPTER DISTRIBUTION
    print('[TEST 1] Verifying Chapter Distribution (Bab 1-5)...')
    chap_counts = {}
    for p in pages:
        code = p['chapter_code']
        chap_counts[code] = chap_counts.get(code, 0) + 1
    
    expected_counts = {'BAB 01': 15, 'BAB 02': 15, 'BAB 03': 15, 'BAB 04': 14, 'BAB 05': 15}
    assert chap_counts == expected_counts, f'Mismatch: {chap_counts}'
    for k, v in chap_counts.items():
        print(f'  ✓ {k}: {v} pages')

    # TEST 2: ORDERING & LINKS
    print('\n[TEST 2] Verifying Monotonic Ordering & Page Links (1..74)...')
    for i, p in enumerate(pages):
        expected_num = i + 1
        assert p['page_number'] == expected_num, f'Page {i} wrong number'
        if i > 0:
            assert p['previous_page'] == expected_num - 1
        else:
            assert p['previous_page'] is None
        if i < total_pages - 1:
            assert p['next_page'] == expected_num + 1
        else:
            assert p['next_page'] is None
    print(f'  ✓ All {total_pages} pages have unbroken 1..{total_pages} sequential pointers.')

    # TEST 3: ASSETS ON DISK
    print('\n[TEST 3] Verifying Slide Images On Disk...')
    for p in pages:
        img_rel = p['image_path'].lstrip('/')
        img_path = os.path.join(PUBLIC_DIR, img_rel)
        assert os.path.exists(img_path), f'Missing image: {img_path}'
    print(f'  ✓ All {total_pages} slide files exist in public/slides/.')

    # TEST 4: CONTENT INTEGRITY
    print('\n[TEST 4] Verifying Content Fields...')
    for p in pages:
        assert p.get('badge')
        assert p.get('title')
        assert len(p.get('paragraphs', [])) > 0
        assert p.get('keyTakeaway')
    print(f'  ✓ All {total_pages} pages have complete badges, titles, paragraphs, and takeaways.')

    total_words = sum(p['word_count'] for p in pages)
    print(f'\n[TEST 5] Total Words: {total_words:,} words (Avg {total_words/total_pages:.1f} words/page)')
    print('\n==================================================')
    print('ALL 5 FLIPBOOK VALIDATION CHECKS PASSED!')
    print('==================================================')

if __name__ == '__main__':
    run_validation()
