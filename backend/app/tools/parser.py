"""Parse resume text from uploaded PDF or DOCX files."""
import io

import pdfplumber
from docx import Document


def parse_pdf(file_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
    return "\n".join(text_parts)


def parse_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


def parse_resume(filename: str, file_bytes: bytes) -> str:
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        return parse_pdf(file_bytes)
    if ext in ("docx", "doc"):
        return parse_docx(file_bytes)
    raise ValueError(f"Unsupported file type: .{ext}. Upload a PDF or DOCX.")
