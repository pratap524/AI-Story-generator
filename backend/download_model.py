import os
from pathlib import Path

from dotenv import load_dotenv
from transformers import AutoModelForCausalLM, AutoTokenizer

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

# The Hugging Face model ID
model_id = "mistralai/Mistral-7B-Instruct-v0.3"
# The local folder where you want to store it
local_folder = Path(__file__).resolve().parent / "my_local_model"

print(f"Downloading {model_id}...")

# 1. Download the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_id, token=HF_TOKEN)
model = AutoModelForCausalLM.from_pretrained(model_id, token=HF_TOKEN)

# 2. Save them to your local folder
tokenizer.save_pretrained(local_folder)
model.save_pretrained(local_folder)

print(f"Success! Model and tokenizer saved to {local_folder}")
