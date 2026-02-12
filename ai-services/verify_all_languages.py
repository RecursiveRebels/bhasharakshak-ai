import asyncio
from text_to_speech import generate_speech

async def verify_all():
    # Exact list from frontend
    INDIAN_LANGUAGES = [
        "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Gujarati", "Marathi", "Punjabi", "Odia", "Assamese", "Bodo", "Dogri", "Kashmiri", "Konkani", "Maithili", "Manipuri", "Nepali", "Sanskrit", "Santali", "Sindhi", "Urdu"
    ]

    print(f"Testing {len(INDIAN_LANGUAGES)} languages...\n")
    
    results = []
    
    for lang in INDIAN_LANGUAGES:
        print(f"🔹 Testing {lang}...", end="", flush=True)
        try:
            # Use a generic text that should work
            text = "Testing voice." 
            if lang == "Hindi": text = "नमस्ते"
            
            # Use the existing generate_speech function
            audio = await generate_speech(text, lang)
            
            if audio and len(audio) > 1000:
                print(f" ✅ OK ({len(audio)} bytes)")
                results.append((lang, "OK"))
            else:
                print(f" ❌ FAILED (Empty/Small Audio)")
                results.append((lang, "FAILED"))
        except Exception as e:
            print(f" ❌ ERROR: {e}")
            results.append((lang, f"ERROR: {e}"))

    print("\n\n=== SUMMARY ===")
    for lang, status in results:
        print(f"{lang}: {status}")

if __name__ == "__main__":
    asyncio.run(verify_all())
