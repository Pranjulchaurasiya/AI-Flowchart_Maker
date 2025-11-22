# AI Flowchart Maker

Production-ready AI-powered flowchart generation tool with React + FastAPI.

## Features

- **Text-to-Flowchart**: Convert structured text into visual flowcharts
- **Prompt-to-Flowchart**: Generate flowcharts from natural language descriptions
- **Interactive Canvas**: Drag, edit, and customize flowcharts
- **Export**: Download flowcharts as JSON

## Tech Stack

**Frontend**: React, Vite, TailwindCSS, React Flow, Lucide Icons
**Backend**: FastAPI, Groq AI, Python
**AI**: Groq API (Mixtral-8x7b)

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env
python main.py
```

### Frontend

```bash
npm install
npm run dev
```

## Usage

1. Choose **Text** or **Prompt** mode
2. Enter your input
3. Click **Generate Flowchart**
4. Edit and export your flowchart

## API Endpoints

- `POST /generate/text` - Generate from structured text
- `POST /generate/prompt` - Generate from natural language

## Environment Variables

```
GROQ_API_KEY=your_api_key_here
```

Get your Groq API key from: https://console.groq.com
