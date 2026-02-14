from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uuid

# Import services
from speech_to_text import transcribe_audio
from translate import translate_text
from text_to_speech import generate_speech
from image_captioning import generate_caption

app = FastAPI(title="BhashaRakshak AI Services")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TranslationRequest(BaseModel):
    text: str
    target_lang: str
    source_lang: str = None

class TTSRequest(BaseModel):
    text: str
    lang: str

@app.get("/")
def read_root():
    return {"message": "BhashaRakshak AI Services Ready"}

@app.post("/stt")
async def speech_to_text(file: UploadFile = File(...), language: str = Form("English")):
    try:
        # Save temp file
        temp_filename = f"temp_{uuid.uuid4()}.wav"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Transcribe
        transcript = await transcribe_audio(temp_filename, language)
        
        # Cleanup
        os.remove(temp_filename)
        
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/describe-image")
async def describe_image(file: UploadFile = File(...)):
    try:
        # Save temp file
        temp_filename = f"temp_img_{uuid.uuid4()}.jpg"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Generate Caption
        caption = generate_caption(temp_filename)
        
        # Cleanup
        os.remove(temp_filename)
        
        return {"description": caption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
def translate(request: TranslationRequest):
    try:
        translated_text = translate_text(request.text, request.target_lang, request.source_lang)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    try:
        # Returns a base64 audio string or URL
        audio_data = await generate_speech(request.text, request.lang)
        return {"audio_data": audio_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
