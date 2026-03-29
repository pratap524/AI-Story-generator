from pathlib import Path

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Point this to your local folder
local_folder = Path(__file__).resolve().parent / "my_local_model"

if not local_folder.exists():
    raise FileNotFoundError(
        f"Local model folder not found: {local_folder}. Run download_model.py first."
    )

print("Loading model from local storage...")

# 1. Load the tokenizer and model from the local folder
tokenizer = AutoTokenizer.from_pretrained(local_folder, local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(local_folder, local_files_only=True)

# 2. Prepare your prompt
prompt = "The most important skill for a data scientist is"
inputs = tokenizer(prompt, return_tensors="pt")

# 3. Generate the output
print("Generating text...\n")
outputs = model.generate(
    **inputs,
    max_new_tokens=50,
    temperature=0.7,
    do_sample=True,
)

# 4. Decode and print the result
response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(response)
