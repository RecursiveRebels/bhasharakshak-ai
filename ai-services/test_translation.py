from deep_translator import MyMemoryTranslator

text = "ਸ਼ੌਕ ਨੂੰ ਸਾਜੋ ਥਾਕੋ ਕਾਮੀ ਸੂਜਾ ਕੋਈ ਇਹ ਗੂੜ੍ਹੀ ਆਈ ਜੋ"
target = "en"

# Try specific codes for MyMemory
codes = ["pa", "pa-IN", "pan"]

for c in codes:
    try:
        print(f"Testing MyMemory source='{c}'...")
        res = MyMemoryTranslator(source=c, target=target).translate(text)
        print(f"Result ({c}): {res}")
    except Exception as e:
        print(f"Error ({c}): {e}")
