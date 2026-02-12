from translate import translate_text

LANGS_TO_TEST = [
    "Mizo",      # Expected: PASS (lus)
    "Meitei",    # Expected: PASS (mni-Mtei)
    "Bhojpuri",  # Expected: PASS (bho)
    "Santali",   # Expected: FAIL? (sat) -> check why
    "Kokborok",  # Expected: PASS (fallback bn)
    "Chakma",    # Expected: PASS (fallback bn)
    "Mishing"    # Expected: PASS (fallback as)
]

print("Verifying specific language support improvements:\n")

for lang in LANGS_TO_TEST:
    res = translate_text("Hello", lang)
    print(f"{lang:<10} -> {res}")
