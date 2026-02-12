
from transformers import pipeline
import traceback

print("Starting pipeline test...", flush=True)
try:
    print("Initializing 'image-to-text' pipeline...", flush=True)
    pipe = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
    print("Pipeline initialized successfully!", flush=True)
except Exception:
    traceback.print_exc()
