try:
    import googletrans
    print("googletrans is available")
    from googletrans import Translator
    t = Translator()
    res = t.translate("ਸ਼ੌਕ ਨੂੰ ਸਾਜੋ ਥਾਕੋ ਕਾਮੀ ਸੂਜਾ ਕੋਈ ਇਹ ਗੂੜ੍ਹੀ ਆਈ ਜੋ", src='pa', dest='en')
    print(f"Result: {res.text}")
except ImportError:
    print("googletrans is NOT available")
except Exception as e:
    print(f"Error: {e}")
