# Initialize the image captioning model as None initially
processor = None
model = None

def generate_caption(image_path):
    from transformers import BlipProcessor, BlipForConditionalGeneration
    from PIL import Image
    global processor, model
    
    try:
        if processor is None or model is None:
            print("Initializing AI Model (BLIP) via direct loading...")
            try:
                # Load model directly to avoid pipeline task ambiguity
                processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
                model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
                print("AI Model Ready!")
            except Exception as e:
                print(f"Model initialization failed: {e}")
                return "AI analysis is currently unavailable (model downloading or error)."
            
        image = Image.open(image_path).convert('RGB')
        
        # specific conditional generation
        inputs = processor(image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)
        
        return caption
    except Exception as e:
        print(f"Error generating caption: {e}")
        return "Could not generate description."
