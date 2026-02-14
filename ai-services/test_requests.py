import requests
import json
import urllib.parse

def translate_gtx(text, source='auto', target='en'):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": source,
        "tl": target,
        "dt": "t",
        "q": text
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        translated_text = ""
        if data and isinstance(data, list) and len(data) > 0:
            for item in data[0]:
                if item and isinstance(item, list) and len(item) > 0:
                    translated_text += item[0]
        
        return translated_text
    except Exception as e:
        return f"Error: {e}"

text = "ਸ਼ੌਕ ਨੂੰ ਸਾਜੋ ਥਾਕੋ ਕਾਮੀ ਸੂਜਾ ਕੋਈ ਇਹ ਗੂੜ੍ਹੀ ਆਈ ਜੋ"

print(f"Original: {text}")

# Hack 1: Prepend "Translate to English"
text_hack1 = "Translate to English: " + text
res1 = translate_gtx(text_hack1, source='pa')
print(f"Hack 1 Result: {res1}")

# Hack 2: Use 'auto' source
res2 = translate_gtx(text, source='auto')
print(f"Hack 2 (auto): {res2}")
