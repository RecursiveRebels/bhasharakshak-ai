from deep_translator import GoogleTranslator
import json

def list_langs():
    try:
        langs = GoogleTranslator().get_supported_languages(as_dict=True)
        
        # Check specific interests
        interest_map = {
            "Bhojpuri": "bho",
            "Dogri": "doi",
            "Konkani": "gom",
            "Maithili": "mai",
            "Meitei": "mni-Mtei", # Manipuri
            "Mizo": "lus", # Lushai
            "Sanskrit": "sa",
            "Santali": "sat", # Ol Chiki
            "Sindhi": "sd",
            "Assamese": "as",
            "Odia": "or",
            "Imphal": "mni",
            "Lusai": "lus",
            "Tulu": "tcy",
            "Uyghur": "ug"
        }
        
        print("\nChecking for specific Indian languages in supported list:")
        for name, code in interest_map.items():
            # Check by code
            if code in langs.values():
                 print(f" ✅ Found {name} by code: {code}")
                 continue
            
            # Check by name
            found = False
            for k, v in langs.items():
                if name.lower() in k.lower():
                    print(f" ✅ Found {name} by name: {k} -> {v}")
                    found = True
                    break
            
            if not found:
                print(f" ❌ Not found: {name}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_langs()
