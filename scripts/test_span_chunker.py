import sys, os, re
sys.stdout.reconfigure(encoding="utf-8")

with open(r"R:\flip-book\naskah-buku\00_Prolog_Kata-Pengantar.md", "r", encoding="utf-8") as f:
    text = f.read()

def get_atomic_spans(doc_text):
    # Split points:
    # 1. Paragraph breaks (\n\n+)
    para_splits = [m.start() for m in re.finditer(r"\n\n+", doc_text)]
    boundaries = set([0, len(doc_text)])
    boundaries.update(para_splits)
    
    # 2. Split after paragraph separator (\n\n...) so whitespace is preserved
    for m in re.finditer(r"\n\n+", doc_text):
        boundaries.add(m.end())
        
    sorted_bounds = sorted(boundaries)
    
    # Now check any spans that are too long (> 85 words) and find safe sentence breaks
    refined_boundaries = set(sorted_bounds)
    for i in range(len(sorted_bounds) - 1):
        s = sorted_bounds[i]
        e = sorted_bounds[i+1]
        p_text = doc_text[s:e]
        words = p_text.split()
        if len(words) > 85:
            # Pattern for sentence end followed by whitespace
            pattern = r'(?<!\bdr)(?<!\bprof)(?<!\bdkk)(?<!\bdll)(?<!\bdsb)(?<!\bhal)(?<!\bno)(?<!\.\.)(?<=[.!?]["\'\”\)]?)\s+'
            for sm in re.finditer(pattern, p_text):
                split_point = s + sm.end()
                refined_boundaries.add(split_point)
                
    final_bounds = sorted(refined_boundaries)
    spans = []
    for i in range(len(final_bounds) - 1):
        s = final_bounds[i]
        e = final_bounds[i+1]
        spans.append((s, e, doc_text[s:e]))
    return spans

spans = get_atomic_spans(text)
reconstructed = "".join(s[2] for s in spans)
print("Exact character match:", reconstructed == text)
print("Length original:", len(text), "Length reconstructed:", len(reconstructed))
print("Total spans:", len(spans))
