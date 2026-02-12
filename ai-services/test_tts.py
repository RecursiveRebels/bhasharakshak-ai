import asyncio
from text_to_speech import generate_speech

async def test():
    languages = [
        ("Hindi", "नमस्ते"), # Should use Edge
        ("Punjabi", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ"), # Should use gTTS 'pa'
        ("Kashmiri", "Kashmiri test"), # Should use gTTS 'ks'
        ("Bodo", "Bodo test"), # Should fallback to 'hi' gTTS
    ]

    for lang, text in languages:
        print(f"Testing {lang}...")
        try:
            audio = await generate_speech(text, lang)
            if audio:
                print(f"✅ {lang} success, audio length: {len(audio)}")
            else:
                print(f"❌ {lang} returned empty audio")
        except Exception as e:
            print(f"❌ {lang} failed with error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
