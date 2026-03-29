# Haxtreame

Haxtreame is a full-stack AI storytelling app with a React + Vite frontend and a FastAPI backend that runs a local Transformers model for cinematic fairy-tale generation.

## Quick Start

### Frontend

```bash
cd "craft AI stories"
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API

- `POST /generate-story`
  - Body: `{ "prompt": "Your story request" }`
  - Response: `{ "story": "..." }`

## Notes

- The backend expects a local model in `backend/my_local_model`.
- For best performance, run with a GPU-enabled PyTorch build.
