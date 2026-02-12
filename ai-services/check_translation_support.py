import asyncio
from translate import translate_text

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

def check_translations():
    print(f"Checking translation support for {len(ALL_LANGUAGES)} languages...\n")
    print(f"{'Language':<25} | {'Status':<15} | {'Result (Hello -> X)'}")
    print("-" * 65)
    
    supported_count = 0
    fallback_count = 0
    failed_count = 0
    
    for lang in ALL_LANGUAGES:
        try:
            # We translate "Hello" to the target language
            # Note: translate.py logic defaults to 'en' if unknown
            result = translate_text("Hello world", lang)
            
            status = "UNKNOWN"
            if "Error" in result:
                status = "ERROR"
                failed_count += 1
            elif result.lower() == "hello world":
                # Likely defaulted to English or is English
                if lang == "English":
                    status = "OK"
                    supported_count += 1
                else:
                    status = "UNSUPPORTED" # Defaulted to English
                    failed_count += 1
            else:
                # We got a translation!
                status = "OK"
                supported_count += 1
                
            print(f"{lang:<25} | {status:<15} | {result}")
            
        except Exception as e:
            print(f"{lang:<25} | ERROR           | {str(e)}")
            failed_count += 1

    print("\nSummary:")
    print(f"Supported/Working: {supported_count}")
    print(f"Unsupported/Defaulted: {failed_count}")

if __name__ == "__main__":
    check_translations()
