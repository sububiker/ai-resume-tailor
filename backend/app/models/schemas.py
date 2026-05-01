from pydantic import BaseModel


class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    location: str = ""


class Experience(BaseModel):
    company: str = ""
    title: str = ""
    duration: str = ""
    location: str = ""
    bullets: list[str] = []


class Education(BaseModel):
    institution: str = ""
    degree: str = ""
    year: str = ""
    gpa: str = ""


class TailoredResume(BaseModel):
    personal_info: PersonalInfo = PersonalInfo()
    summary: str = ""
    experience: list[Experience] = []
    education: list[Education] = []
    skills: list[str] = []
    certifications: list[str] = []
    ats_score: int = 0
    keywords_matched: list[str] = []
    keywords_missing: list[str] = []
    changes_made: list[str] = []


class TailorResponse(BaseModel):
    original_text: str
    tailored: TailoredResume
