import asyncio
from translate import translate_text
import time

# List from frontend/reactapp/src/utils/languageNames.js
ALL_LANGUAGES = [
    # Constitutional
    "Assamese", "Bengali", "Bodo", "Dogri", "English", "Gujarati", "Hindi", 
    "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri", 
    "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", 
    "Tamil", "Telugu", "Urdu",
    # Tribal/Regional
    "Adi", "Aka", "Angami", "Ao", "Apatani", "Bhutia", "Bishnupriya Manipuri", 
    "Bugun", "Chakma", "Chang", "Deori", "Dimasa", "Garo", "Hajong", "Hmar", 
    "Karbi", "Khasi", "Khamti", "Koch", "Kokborok", "Konyak", "Kuki", "Ladakhi", 
    "Lepcha", "Limbu", "Lotha", "Lushai", "Meitei", "Mishing", "Mishmi", "Mizo", 
    "Monpa", "Munda", "Nocte", "Nyishi", "Phom", "Rabha", "Rengma", "Sangtam", 
    "Sherdukpen", "Singpho", "Sumi", "Tagin", "Tangkhul", "Tangsa", "Tiwa", 
    "Tripuri", "Wancho", "Yimkhiung", "Zeme"
]

TEST_WORDS = ["Hello", "Water"]

def check_translations():
    print(f"Checking translation support for {len(ALL_LANGUAGES)} languages with {len(TEST_WORDS)} words...\n")
    
    supported_langs = []
    unsupported_langs = []
    error_langs = []

    for lang in ALL_LANGUAGES:
        if lang == "English":
            supported_langs.append(lang)
            continue
            
        print(f"Testing {lang}...", end="", flush=True)
        success_count = 0
        translations = []
        
        for word in TEST_WORDS:
            try:
                # We translate word to the target language
                result = translate_text(word, lang)
                
                if "Error" in result:
                    translations.append("ERROR")
                elif result.lower() == word.lower():
                    # Defaulted to English (unsupported)
                    translations.append(result + " (En)")
                else:
                    # Valid translation
                    success_count += 1
                    translations.append(result)
                
            except Exception as e:
                translations.append(f"ERR")
            
            # Small delay to avoid rate limiting
            # time.sleep(0.2) 
        
        if success_count == len(TEST_WORDS):
            print(f" ✅ SUPPORTED: {translations}")
            supported_langs.append(lang)
        elif success_count > 0:
            print(f" ⚠️ PARTIAL: {translations}")
            supported_langs.append(f"{lang} (Partial)")
        else:
            print(f" ❌ UNSUPPORTED: {translations}")
            unsupported_langs.append(lang)

    print("\n" + "="*50)
    print("FINAL REPORT")
    print("="*50)
    
    print(f"\n✅ SUPPORTED LANGUAGES ({len(supported_langs)}):")
    print(", ".join(supported_langs))
    
    print(f"\n❌ UNSUPPORTED LANGUAGES ({len(unsupported_langs)}):")
    print(", ".join(unsupported_langs))

if __name__ == "__main__":
    check_translations()
