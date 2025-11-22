from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from services.flowchart_generator import FlowchartGenerator

load_dotenv()

app = FastAPI(title="AI Flowchart Maker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = FlowchartGenerator(os.getenv("GROQ_API_KEY"))

class TextInput(BaseModel):
    text: str

class PromptInput(BaseModel):
    prompt: str

@app.get("/")
def read_root():
    return {"message": "AI Flowchart Maker API", "status": "running"}

@app.post("/generate/text")
async def generate_from_text(input_data: TextInput):
    try:
        result = generator.text_to_flowchart(input_data.text)
        return result
    except Exception as e:
        import traceback
        print(f"Error in generate_from_text: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/prompt")
async def generate_from_prompt(input_data: PromptInput):
    try:
        result = await generator.prompt_to_flowchart(input_data.prompt)
        return result
    except Exception as e:
        import traceback
        print(f"Error in generate_from_prompt: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/image")
async def generate_from_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith('image/') and file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="Only image and PDF files are supported")
        
        file_content = await file.read()
        result = await generator.image_to_flowchart(file_content, file.filename)
        return result
    except Exception as e:
        import traceback
        print(f"Error in generate_from_image: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
