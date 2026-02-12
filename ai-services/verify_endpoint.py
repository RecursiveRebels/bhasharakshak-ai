
import requests
from PIL import Image
import io

# Create a simple black image
img = Image.new('RGB', (100, 100), color = 'black')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_byte_arr = img_byte_arr.getvalue()

url = "http://localhost:8000/describe-image"
files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}

try:
    print(f"Sending request to {url}...", flush=True)
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}", flush=True)
    print(f"Response: {response.json()}", flush=True)
except Exception as e:
    print(f"Error: {e}", flush=True)
