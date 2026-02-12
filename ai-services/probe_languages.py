from deep_translator import GoogleTranslator

# Potential codes for unsupported languages
# Based on ISO 639-3 and known Google Translate updates
POTENTIAL_MAPPINGS = {
    "Meitei": "mni-Mte", # Alternate for Manipuri
    "Mizo": "lus",       # Lushai
    "Khasi": "kha",      # Khasi (recently added?)
    "Bhojpuri": "bho",   # (Reference)
    "Kokborok": "trp",   # (Might not be supported)
    "Garo": "grt",
    "Chakma": "ccp",
    "Santali": "sat",    # Ol Chiki (Google supported?)
    "Tulu": "tcy",
    "Sikkimese": "sip",
    "Dzongkha": "dz",
    "Bishnupriya": "bpy",
    "Angami": "njm",
}

def probe_codes():
    print("Probing potential language codes...\n")
    
    for lang, code in POTENTIAL_MAPPINGS.items():
        print(f"Probing {lang} ({code})...", end="", flush=True)
        try:
            translator = GoogleTranslator(source='en', target=code)
            result = translator.translate("Hello")
            
            if result and result.lower() != "hello":
                print(f" ✅ SUCCESS: {result}")
            elif result and result.lower() == "hello":
                print(f" ⚠️ Returned English (Likely unsupported)")
            else:
                print(f" ❌ Failed")
        except Exception as e:
            print(f" ❌ Error: {e}")

if __name__ == "__main__":
    probe_codes()
