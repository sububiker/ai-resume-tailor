"""Resume tailoring agent — Claude reads resume + JD and returns structured JSON."""
import json
import logging
import re

import anthropic

from config import settings
from models.schemas import TailoredResume

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert resume writer and ATS optimization specialist.

Your job: rewrite a candidate's resume to match a job description perfectly.

STRICT RULES:
- NEVER invent experience, skills, or qualifications the candidate does not have
- Only reframe existing experience using the JD's language and keywords
- Naturally incorporate JD keywords — do not keyword-stuff
- Keep all facts truthful — just present them in the most relevant way
- Reorder bullets to lead with the most JD-relevant achievements

ATS SCORING (ats_score 0-100):
- Count how many key JD requirements appear in the resume
- 90-100: Excellent match, most keywords present
- 70-89: Good match, minor gaps
- 50-69: Moderate match, some important skills missing
- Below 50: Poor match

You MUST respond with ONLY a valid JSON object — no prose, no markdown fences:
{
  "personal_info": {
    "name": "full name",
    "email": "email or empty string",
    "phone": "phone or empty string",
    "linkedin": "linkedin url or empty string",
    "location": "city, country or empty string"
  },
  "summary": "2-3 sentence professional summary tailored to the JD",
  "experience": [
    {
      "company": "company name",
      "title": "job title",
      "duration": "date range",
      "location": "location or empty string",
      "bullets": ["achievement bullet 1", "achievement bullet 2"]
    }
  ],
  "education": [
    {
      "institution": "university name",
      "degree": "degree and field",
      "year": "graduation year",
      "gpa": "GPA if provided else empty string"
    }
  ],
  "skills": ["skill1", "skill2"],
  "certifications": ["cert1"],
  "ats_score": 85,
  "keywords_matched": ["keyword1", "keyword2"],
  "keywords_missing": ["keyword3"],
  "changes_made": ["Updated summary to highlight Python expertise", "Reordered bullets to lead with cloud experience"]
}"""


def _parse_json(text: str) -> dict:
    text = text.strip()
    # Strip markdown code fences if present
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Claude did not return valid JSON: {text[:300]}")


def tailor_resume(
    client: anthropic.Anthropic,
    resume_text: str,
    job_description: str,
) -> TailoredResume:
    logger.info("Starting resume tailoring agent")

    user_message = (
        f"ORIGINAL RESUME:\n{resume_text}\n\n"
        f"JOB DESCRIPTION:\n{job_description}"
    )

    response = client.messages.create(
        model=settings.model,
        max_tokens=4096,
        thinking={"type": "adaptive"},
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": user_message}],
    )

    text_block = next((b for b in response.content if b.type == "text"), None)
    if text_block is None:
        raise ValueError("Agent returned no text response")

    data = _parse_json(text_block.text)
    logger.info("Resume tailored — ATS score: %s", data.get("ats_score"))
    return TailoredResume(**data)
