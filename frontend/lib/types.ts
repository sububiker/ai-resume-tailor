export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
}

export interface Experience {
  company: string;
  title: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

export interface TailoredResume {
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  ats_score: number;
  keywords_matched: string[];
  keywords_missing: string[];
  changes_made: string[];
}

export interface TailorResponse {
  original_text: string;
  tailored: TailoredResume;
}
