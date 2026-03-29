# AI Story Generator

AI Story Generator is a full-stack AI storytelling app with a React + Vite frontend and a FastAPI backend that runs a local Transformers model for cinematic fairy-tale generation.

## Features

- Story prompts with a cinematic style and consistent fairy-tale canon
- FastAPI endpoint for story generation
- Local model loading (no external API required)
- React UI built for rapid iteration

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: FastAPI, PyTorch, Transformers

## Project Structure

- `craft AI stories/`: React + Vite frontend
- `backend/`: FastAPI server and model runtime

## Quick Start

### Frontend

```bash
cd "craft AI stories"
npm install
npm run dev
```

### Backend (Windows)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API

### Generate Story

- Method: `POST`
- Path: `/generate-story`
- Body:

```json
{
  "prompt": "Write a short bedtime retelling of Cinderella with the glass slipper."
}
```

- Response:

```json
{
  "story": "..."
}
```

### Example Request

```bash
curl -X POST http://localhost:8000/generate-story \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"A windswept village meets a wandering storyteller.\"}"
```

## Model Notes

- The backend expects a local model folder at `backend/my_local_model`.
- For best performance, install a GPU-enabled PyTorch build and run on CUDA.
- If the model folder is missing, the backend will fail fast on startup.

## Troubleshooting

- Backend crashes on import: verify Python version and `pip install -r requirements.txt` completed.
- Slow generation: use a GPU build of PyTorch and ensure CUDA is available.
- CORS issues in the browser: the backend allows all origins by default.

## License

MIT (add or change this to match your preference)
