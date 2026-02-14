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
        
        # Strategies to get a longer description (5-10 lines equivalent)
        # We will generate multiple captions focusing on different aspects
        prompts = [
            "a photography of",
            "the main subject is",
            "the background looks like",
            "the colors in the image are",
            "the lighting and atmosphere is"
        ]
        
        full_description = []
        
        for prompt in prompts:
            inputs = processor(image, text=prompt, return_tensors="pt")
            out = model.generate(
                **inputs, 
                max_new_tokens=50, 
                min_length=15, 
                num_beams=5, 
                repetition_penalty=1.2,
                no_repeat_ngram_size=2
            )
            caption = processor.decode(out[0], skip_special_tokens=True)
            # Ensure the prompt is part of the sentence or cleaned up
            full_description.append(caption)
            
        # Combine into a paragraph
        final_caption = ". ".join(full_description) + "."
        
        # Clean up double periods
        final_caption = final_caption.replace("..", ".")
        
        return final_caption
    except Exception as e:
        print(f"Error generating caption: {e}")
        return "Could not generate description."
