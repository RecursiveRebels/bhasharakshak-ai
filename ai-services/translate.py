import requests

def translate_gtx(text, source='auto', target='en'):
    """
    Direct Google Translate (GTX) for better reliability than deep-translator scraping.
    """
    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text
        }
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        translated_text = ""
        if data and isinstance(data, list) and len(data) > 0:
            for item in data[0]:
                if item and isinstance(item, list) and len(item) > 0:
                    translated_text += item[0]
        
        return translated_text
    except Exception as e:
        print(f"GTX Error: {e}")
        return None

def translate_text(text: str, target_lang: str, source_lang: str = None) -> str:
    """
    Real Machine Translation using deep-translator (Google Translate) with GTX fallback.
    """
    try:
        # Map frontend language names to codes for better compatibility
        # Based on deep-translator/Google Translate supported list
        lang_map = {
            "Hindi": "hi", "Tamil": "ta", "Telugu": "te", "Kannada": "kn",
            "Malayalam": "ml", "Bengali": "bn", "Gujarati": "gu", "Marathi": "mr",
            "Punjabi": "pa", "Urdu": "ur", "English": "en", "Odia": "or",
            "Assamese": "as", "Nepali": "ne", "Sindhi": "sd", "Sanskrit": "sa",
            # Corrected/Specific Codes
            "Konkani": "gom", 
            "Maithili": "mai",
            "Bhojpuri": "bho",
            "Mizo": "lus", # Lushai
            "Dogri": "doi",

            # === Smart Fallbacks (Approximations) ===
            "Bodo": "hi",     
            "Sanskrit": "hi", 
            
            # Bengali Script Group
            "Manipuri": "bn",
            "Meitei": "bn",
            "Santali": "bn",
            "Kokborok": "bn",
            "Chakma": "bn",
            "Bishnupriya Manipuri": "bn",
            "Hajong": "bn",
            "Koch": "bn",
            "Rabha": "bn",
            
            # Assamese Script / Related
            "Mishing": "as", 
            "Tiwa": "as",
            "Deori": "as",
            "Dimasa": "as",
            
            # Urdu / Perso-Arabic Script
            "Kashmiri": "ur", 
            
            # Roman Script / English fallback
            "Khasi": "en",
            "Garo": "en",
            "Naga": "en",
            "Angami": "en",
            "Ao": "en",
            "Lotha": "en",
            "Sumi": "en",
        }
        
        # Default to target_lang lowercase if not found, but check if key exists in map first
        target_code = lang_map.get(target_lang)
        
        if not target_code:
            target_code = "en"

        # Determine source code
        source_code = 'auto'
        if source_lang:
            source_code = lang_map.get(source_lang, 'auto')
        
        # 1. Try Direct GTX first (More reliable for Indian languages)
        gtx_result = translate_gtx(text, source=source_code, target=target_code)
        if gtx_result:
            return gtx_result

        # 2. Fallback to deep-translator
        translator = GoogleTranslator(source=source_code, target=target_code)
        translated = translator.translate(text)
        return translated
    except Exception as e:
        print(f"Translation Error: {e}")
        return f"Error: Could not translate. ({str(e)})"
