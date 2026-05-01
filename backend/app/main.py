import logging

import anthropic
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from config import settings
from models.schemas import TailoredResume, TailorResponse
from agents.resume_agent import tailor_resume
from tools.parser import parse_resume
from tools.exporter import export_pdf, export_docx

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Resume Tailor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/tailor", response_model=TailorResponse)
async def tailor(
    resume: UploadFile = File(..., description="PDF or DOCX resume"),
    job_description: str = Form(..., description="Job description text"),
):
    if not resume.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_bytes = await resume.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        resume_text = parse_resume(resume.filename, file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from resume")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")

    try:
        tailored = tailor_resume(_client, resume_text, job_description)
    except anthropic.APIError as exc:
        logger.error("Claude API error: %s", exc)
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}")
    except ValueError as exc:
        logger.error("Agent error: %s", exc)
        raise HTTPException(status_code=422, detail=str(exc))

    return TailorResponse(original_text=resume_text, tailored=tailored)


@app.post("/api/export/pdf")
def export_resume_pdf(resume: TailoredResume):
    try:
        pdf_bytes = export_pdf(resume)
    except Exception as exc:
        logger.error("PDF export error: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

    name = resume.personal_info.name.replace(" ", "_") or "resume"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{name}_tailored.pdf"'},
    )


@app.post("/api/export/word")
def export_resume_word(resume: TailoredResume):
    try:
        docx_bytes = export_docx(resume)
    except Exception as exc:
        logger.error("Word export error: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to generate Word document")

    name = resume.personal_info.name.replace(" ", "_") or "resume"
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{name}_tailored.docx"'},
    )
