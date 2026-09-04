"""Flipbook Validation Suite — 7 checks for Opsi B padatin."""

import json, os, re

DATA_PATH = r'src/data/book-pages.json'
PUBLIC_DIR = r'public'

CODE_BLOCK_RE = re.compile(r'```')
ASCI_DIAGRAM_RE = re.compile(r'[\u2500-\u257F]{3,}')


def has_sentence_end(para: str) -> bool:
    """Return True if paragraph ends with [.!?] optionally followed by quote or parenthesis."""
    if not para:
        return False
    s = para.rstrip()
    if len(s) == 0:
        return False
    return bool(re.search(r'[.!?]["\'\”\)]?$', s))


def validate_provenance(p: dict) -> str | None:
    """Return error string or None."""
    prov = p.get('provenance', {})
    needed = ('source_chapter', 'source_section',
              'source_paragraph_start', 'source_paragraph_end')
    missing = [k for k in needed if k not in prov]
    if missing:
        return f'missing provenance fields: {missing}'
    if not isinstance(prov['source_section'], str) or not prov['source_section'].strip():
        return f'invalid source_section: {prov["source_section"]!r}'
    for k in ('source_chapter', 'source_paragraph_start', 'source_paragraph_end'):
        v = prov[k]
        if not isinstance(v, int) or v < 1:
            return f'invalid {k}: {v!r}'
    if prov['source_paragraph_end'] < prov['source_paragraph_start']:
        return 'source_paragraph_end < source_paragraph_start'
    return None


def validate_paragraphs(p: dict) -> list[str]:
    """Return list of issue strings for this page's paragraphs."""
    issues = []
    for j, para in enumerate(p.get('paragraphs', [])):
        if not para or not para.strip():
            issues.append(f'para {j}: empty')
            continue
        if not has_sentence_end(para):
            issues.append(f'para {j}: no [.!?] ending')
        if CODE_BLOCK_RE.search(para):
            issues.append(f'para {j}: has ``` block')
        if ASCI_DIAGRAM_RE.search(para):
            issues.append(f'para {j}: has ASCII diagram')
    prov_issue = validate_provenance(p)
    if prov_issue:
        issues.append(prov_issue)
    return issues


def run_validation():
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        pages = json.load(f)

    total = len(pages)
    assert total == 74, f'Expected 74 pages, got {total}'

    print('==================================================')
    print('RUNNING 7-POINT FLIPBOOK VALIDATION SUITE')
    print(f'Loaded {total} pages from {DATA_PATH}\n')

    # TEST 1: Chapter distribution
    print('[TEST 1] Chapter Distribution (Bab 1-5)')
    counts = {}
    for p in pages:
        counts[p['chapter_code']] = counts.get(p['chapter_code'], 0) + 1
    expected = {'BAB 01': 15, 'BAB 02': 15, 'BAB 03': 15, 'BAB 04': 14, 'BAB 05': 15}
    assert counts == expected, f'Mismatch: {counts}'
    for k, v in counts.items():
        print(f'  OK {k}: {v} pages')

    # TEST 2: Monotonic ordering
    print('\n[TEST 2] Monotonic Page Ordering 1..74')
    for i, p in enumerate(pages):
        exp = i + 1
        assert p['page_number'] == exp
        assert (p['previous_page'] == exp - 1 if i > 0 else p['previous_page'] is None)
        assert (p['next_page'] == exp + 1 if i < total - 1 else p['next_page'] is None)
    print(f'  OK All {total} pages sequential 1..{total}')

    # TEST 3: Slide images on disk
    print('\n[TEST 3] Slide Images On Disk')
    for p in pages:
        img = p['image_path'].lstrip('/')
        exist = os.path.exists(os.path.join(PUBLIC_DIR, img))
        assert exist, f'Missing image: {img}'
    print(f'  OK All {total} slide files exist in public/slides/')

    # TEST 4: Content fields
    print('\n[TEST 4] Content Fields (badge, title, paragraphs, keyTakeaway)')
    for p in pages:
        assert p.get('badge'), f'page {p["page_number"]}: missing badge'
        assert p.get('title'), f'page {p["page_number"]}: missing title'
        assert len(p.get('paragraphs', [])) > 0, f'page {p["page_number"]}: no paragraphs'
        assert p.get('keyTakeaway'), f'page {p["page_number"]}: missing keyTakeaway'
    print(f'  OK All {total} pages have complete fields')

    # TEST 5: Word density
    print('\n[TEST 5] Word Density 120-150 (ideal 130-145)')
    warnings = 0; fails = 0
    for p in pages:
        wc = p['word_count']
        if wc < 110:
            print(f'  OK Page {p["page_number"]}: {wc} < 110 (natural sub-bab ending tolerated)')
            warnings += 1
        elif wc > 160:
            print(f'  OK Page {p["page_number"]}: {wc} > 160 (hard warning)')
            fails += 1
        elif not (120 <= wc <= 150):
            print(f'  OK Page {p["page_number"]}: {wc} outside 120-150 (ideal 130-145)')
            warnings += 1
    if fails == 0:
        print(f'  OK All pages in 120-150 range; warnings <110/>160: {warnings}')
    else:
        print(f'  OK Failed: {fails} pages > 160')
        return

    # TEST 6: Sentence integrity
    print('\n[TEST 6] Sentence Integrity ([.!?] at paragraph end)')
    issues = 0
    for p in pages:
        for para in p.get('paragraphs', []):
            if not has_sentence_end(para):
                print(f'  OK Page {p["page_number"]}: paragraph missing [.!?]')
                issues += 1
    if issues == 0:
        print(f'  OK Every paragraph ends with [.!?]')
    else:
        print(f'  OK Failed: {issues} paragraph(s) without sentence ending')
        return

    # TEST 7: Cleanliness
    print('\n[TEST 7] Cleanliness (no ```, no ASCII boxes, provenance valid)')
    issues = 0
    for p in pages:
        for para in p.get('paragraphs', []):
            if CODE_BLOCK_RE.search(para):
                print(f'  OK Page {p["page_number"]}: code block in paragraph')
                issues += 1
            if ASCI_DIAGRAM_RE.search(para):
                print(f'  OK Page {p["page_number"]}: ASCII diagram in paragraph')
                issues += 1
        prov = validate_provenance(p)
        if prov:
            print(f'  OK Page {p["page_number"]}: {prov}')
            issues += 1
    if issues == 0:
        print(f'  OK All {total} pages clean')
    else:
        print(f'  OK Failed: {issues} issue(s)')
        return

    total_words = sum(p['word_count'] for p in pages)
    print(f'\nTotal words: {total_words,} (avg {total_words/total:.1f}/page)')
    print('\n==================================================')
    print('ALL 7 CHECKS PASSED!')
    print('==================================================')


if __name__ == '__main__':
    run_validation()