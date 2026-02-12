
import sys
import traceback

print("Attempting to import image_captioning...", flush=True)
try:
    from image_captioning import generate_caption
    print("Import successful.", flush=True)
except Exception:
    traceback.print_exc()

print("Attempting to initialize model and caption...", flush=True)
try:
    # Trigger the model initialization
    # We pass a dummy path that will fail at Image.open, but we want to see the "Initializing AI Model..." print first.
    # To truly test it, we'd need a valid image. 
    # But let's just see if it gets past the import and tries to run.
    try:
        res = generate_caption("dummy_path.jpg") 
        print(f"Result: {res}", flush=True)
    except FileNotFoundError:
        print("FileNotFoundError caught (expected for dummy path)", flush=True)
    except Exception as e:
        print(f"Runtime error: {e}", flush=True)
        traceback.print_exc()

except Exception:
    traceback.print_exc()
