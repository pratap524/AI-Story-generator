from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

LOCAL_MODEL_DIR = Path(__file__).resolve().parent / "my_local_model"
if not LOCAL_MODEL_DIR.exists():
    raise RuntimeError(f"Local model directory missing: {LOCAL_MODEL_DIR}")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
USE_FP16 = DEVICE.type == "cuda"

tokenizer = AutoTokenizer.from_pretrained(LOCAL_MODEL_DIR, local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(
    LOCAL_MODEL_DIR,
    local_files_only=True,
    torch_dtype=torch.float16 if USE_FP16 else torch.float32,
)
model.to(DEVICE)
model.eval()

SYSTEM_PROMPT = (
    "You are Storykeeper, an archivist AI tasked with retelling classic fairy tales or new prompts with cinematic detail. "
    "Always keep canon characters, settings, morals, and tone consistent with well-known versions unless the user explicitly requests a change. "
    "Write immersive scenes with dialogue, sensory description, and a full arc, but keep the response to roughly 170-210 words (about 10-13 sentences) so it stays fast to read."
)

FEW_SHOT_SNIPPET = (
    "Request: Write a short bedtime retelling of Cinderella with the glass slipper.\n"
    "Response: Cinderella, kind and patient despite her chores, accepts a shimmering gown from her fairy godmother. "
    "She glides into the royal ball, dances with the prince, and flees before midnight, leaving a glass slipper behind. "
    "The prince searches the kingdom, the slipper fits only Cinderella, and their joyful union rewards her kindness."
)

app = FastAPI(title="AI Story Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateStoryRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt to continue or create a story")


class GenerateStoryResponse(BaseModel):
    story: str


def _build_prompt(user_prompt: str) -> str:
    return (
        "[INST] <<SYS>>"
        f"{SYSTEM_PROMPT}"
        "<</SYS>>\n"
        f"{FEW_SHOT_SNIPPET}\n"
        "Follow the same structure, keep the named characters and motifs from the request,"
        " and end with a reassuring closing line. Stay within 170-210 words."
        " Do not offer writing guidance, advice, or suggestions—produce the finished story itself in third-person omniscient narration."
        " Never speak about what could be written; simply write it.\n"
        f"Request: {user_prompt}\n"
        "Response:" 
        " [/INST]"
    )


@app.post("/generate-story", response_model=GenerateStoryResponse)
async def generate_story(request: GenerateStoryRequest) -> GenerateStoryResponse:
    prompt = _build_prompt(request.prompt)
    tokenized = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024,
    ).to(DEVICE)

    # Trim the generation window so completions stream back faster without
    # noticeably hurting story quality.
    generation_config = {
        "max_new_tokens": 240,
        "min_new_tokens": 170,
        "temperature": 0.45,
        "do_sample": True,
        "top_p": 0.9,
        "repetition_penalty": 1.01,
        "early_stopping": True,
    }

    with torch.no_grad():
        try:
            output = model.generate(**tokenized, **generation_config)
        except RuntimeError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Generation failed: {exc}",
            ) from exc

    prompt_token_count = tokenized["input_ids"].shape[-1]
    generated_tokens = output[0][prompt_token_count:]
    story = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()
    return GenerateStoryResponse(story=story)
