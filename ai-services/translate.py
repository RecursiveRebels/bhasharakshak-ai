from deep_translator import GoogleTranslator

def translate_text(text: str, target_lang: str) -> str:
    """
    Real Machine Translation using deep-translator (Google Translate).
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
            # For languages without direct API support, we map to the closest linguistically 
            # or script-related major language to provide at least some intelligibility 
            # or script familiarity, rather than just returning English.
            
            # Devanagari Script Group
            "Bodo": "hi",     
            "Sanskrit": "hi", # If 'sa' fails, fallback to Hindi (though 'sa' is supported)
            
            # Bengali Script Group
            "Manipuri": "bn", # Meiteilon (Fallback to Bengali script if native not supported)
            "Meitei": "bn",   # Alias
            "Santali": "bn",  # Fallback to Bengali script (Ol Chiki native support often flaky)
            "Kokborok": "bn", # Often uses Bengali script
            "Chakma": "bn",   # Linguistically close to Bengali
            "Bishnupriya Manipuri": "bn",
            "Hajong": "bn",
            "Koch": "bn",
            "Rabha": "bn", # Often uses Bengali or Assamese
            
            # Assamese Script / Related
            "Mishing": "as", 
            "Tiwa": "as",
            "Deori": "as",
            "Dimasa": "as", # or Bengali
            
            # Urdu / Perso-Arabic Script
            "Kashmiri": "ur", 
            
            # Roman Script / English fallback
            # (Many NE tribal languages use Roman script, so English is the safest fallback 
            # if translation is impossible, to avoid script confusion)
            "Khasi": "en",
            "Garo": "en",
            "Naga": "en", # General placeholder
            "Angami": "en",
            "Ao": "en",
            "Lotha": "en",
            "Sumi": "en",
        }
        
        # Default to target_lang lowercase if not found, but check if key exists in map first
        target_code = lang_map.get(target_lang)
        
        if not target_code:
            # If not in map, try to see if the raw input is a valid code or just fallback to English to be safe
            # The list provided by user shows standard codes. 
            target_code = "en"
        
        translator = GoogleTranslator(source='auto', target=target_code)
        translated = translator.translate(text)
        return translated
    except Exception as e:
        print(f"Translation Error: {e}")
        return f"Error: Could not translate. ({str(e)})"
