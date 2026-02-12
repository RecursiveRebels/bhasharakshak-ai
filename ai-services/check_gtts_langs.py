from gtts import lang
import pprint

my_codes = ["pa", "sd", "ks", "mni", "sa", "sat", "mai", "doi", "gom", "brx", "as", "or"]
supported = lang.tts_langs()

print("Checking specific codes:")
for code in my_codes:
    if code in supported:
        print(f"✅ {code}: Supported ({supported[code]})")
    else:
        print(f"❌ {code}: Not Supported")

