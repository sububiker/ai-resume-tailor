"use client";

import { TailoredResume } from "@/lib/types";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

interface Props {
  resume: TailoredResume;
}

export default function ResumePreview({ resume }: Props) {
  const pi = resume.personal_info;

  return (
    <div className="bg-white text-gray-900 rounded-xl p-8 text-sm leading-relaxed shadow-2xl">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{pi.name}</h1>
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-gray-600">
          {pi.email && (
            <span className="flex items-center gap-1"><Mail size={11} />{pi.email}</span>
          )}
          {pi.phone && (
            <span className="flex items-center gap-1"><Phone size={11} />{pi.phone}</span>
          )}
          {pi.location && (
            <span className="flex items-center gap-1"><MapPin size={11} />{pi.location}</span>
          )}
          {pi.linkedin && (
            <span className="flex items-center gap-1"><Linkedin size={11} />{pi.linkedin}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Summary</h2>
          <p className="text-gray-700">{resume.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Experience</h2>
          <div className="space-y-3">
            {resume.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">{exp.title}</span>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                <ul className="space-y-0.5 ml-3">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-gray-700 before:content-['•'] before:mr-2 before:text-gray-400">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Education</h2>
          <div className="space-y-2">
            {resume.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">{edu.degree}</span>
                  <span className="text-xs text-gray-500">{edu.year}</span>
                </div>
                <div className="text-xs text-gray-500">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Certifications</h2>
          <ul className="space-y-0.5">
            {resume.certifications.map((c, i) => (
              <li key={i} className="text-gray-700 before:content-['•'] before:mr-2 before:text-gray-400">{c}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
