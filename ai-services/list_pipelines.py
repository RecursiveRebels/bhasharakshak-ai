
from transformers import pipelines
try:
    print(list(pipelines.SUPPORTED_TASKS.keys()))
except Exception as e:
    print(f"Error listing tasks: {e}")
