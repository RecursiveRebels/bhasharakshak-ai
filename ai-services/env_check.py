
import transformers
import sys

print(f"Transformers version: {transformers.__version__}")
try:
    from transformers import pipelines
    print("Supported tasks:")
    for task in pipelines.SUPPORTED_TASKS.keys():
        print(f" - {task}")
except Exception as e:
    print(f"Error listing tasks: {e}")
