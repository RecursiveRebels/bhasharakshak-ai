import edge_tts
import asyncio
import base64
import tempfile
import os
from gtts import gTTS
import io

async def generate_speech(text: str, lang: str) -> str:
    """
    Hybrid TTS with Robust Fallbacks:
    1. Try Microsoft Edge TTS (Preferred).
    2. Try Google TTS (gTTS) for supported languages.
    3. Fallback to a linguistically similar language (e.g., Dogri -> Hindi).
    4. Last resort: English.
    """
    try:
        # 1. Edge TTS Map (High Quality)
        edge_voice_map = {
            "English": "en-IN-NeerjaNeural",
            "Hindi": "hi-IN-SwaraNeural",
            "Tamil": "ta-IN-PallaviNeural",
            "Telugu": "te-IN-MohanNeural",
            "Kannada": "kn-IN-GaganNeural",
            "Malayalam": "ml-IN-SobhanaNeural", 
            "Bengali": "bn-IN-BashkarNeural",
            "Gujarati": "gu-IN-DhwaniNeural",
            "Marathi": "mr-IN-ManoharNeural",
            "Urdu": "ur-IN-GulNeural",
            "Nepali": "ne-NP-HemkalaNeural",
            # Potential Edge Voices (might fail if not available)
            "Assamese": "as-IN-YashicaNeural",
            "Odia": "or-IN-SubhasiniNeural",
        }

        # 2. Valid gTTS Codes (Only for languages NOT in Edge but supported by gTTS)
        # Note: gTTS supports 'pa' (Punjabi), 'si' (Sinhala), 'ne' (Nepali - but Edge is better)
        gtts_lang_map = {
            "Punjabi": "pa",
        }

        # 3. Linguistic Fallbacks (Closest Supported Language)
        # Maps unsupported language -> (gTTS code of supported language)
        fallback_map = {
            "Assamese": "bn", # Bengali script is very similar
            "Odia": "bn",     # Bengali script is somewhat similar
            "Sindhi": "ur",   # Urdu (Arabic script) or Hindi (Devanagari) - Urdu is safer default
            "Kashmiri": "ur", # Urdu is closest
            "Manipuri": "bn", # Bengali script used
            "Sanskrit": "hi", # Hindi (Devanagari)
            "Santali": "bn",  # Bengali script often used
            "Maithili": "hi", # Hindi (Devanagari)
            "Dogri": "hi",    # Hindi (Devanagari)
            "Konkani": "mr",  # Marathi (primary script)
            "Bodo": "hi",     # Hindi (Devanagari)
        }

        # --- Execution Logic ---

        # A. Try Edge TTS
        voice = edge_voice_map.get(lang)
        if voice:
            try:
                communicate = edge_tts.Communicate(text, voice)
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
                temp_file.close()
                await communicate.save(temp_file.name)
                
                with open(temp_file.name, "rb") as f:
                    audio_bytes = f.read()
                os.unlink(temp_file.name)
                if len(audio_bytes) > 1000: # Ensure valid audio
                    return base64.b64encode(audio_bytes).decode('utf-8')
            except Exception as e:
                print(f"Edge TTS failed for {lang} ({voice}): {e}. Trying fallbacks.")

        # B. Try gTTS (Direct Support)
        gtts_code = gtts_lang_map.get(lang)
        if gtts_code:
            try:
                return await generate_gtts(text, gtts_code)
            except Exception as e:
                print(f"gTTS failed for {lang} ({gtts_code}): {e}. Trying fallbacks.")

        # C. Try Linguistic Fallback
        fallback_code = fallback_map.get(lang)
        if fallback_code:
            print(f"Using fallback language '{fallback_code}' for '{lang}'")
            try:
                return await generate_gtts(text, fallback_code)
            except Exception as e:
                 print(f"Fallback gTTS failed for {lang} -> {fallback_code}: {e}")

        # D. Last Resort
        print(f"TTS: No specialized support for {lang}. Defaulting to English.")
        return await generate_gtts(text, 'en')

    except Exception as e:
        print(f"CRITICAL TTS ERROR: {e}")
        return ""

async def generate_gtts(text: str, lang_code: str) -> str:
    try:
        # Increase reliability by trying 'com' tld if needed, but standard is fine
        tts = gTTS(text=text, lang=lang_code, slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_bytes = fp.read()
        return base64.b64encode(audio_bytes).decode('utf-8')
    except Exception as e:
         print(f"generate_gtts error ({lang_code}): {e}")
         raise e
