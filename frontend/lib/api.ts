import { TailoredResume, TailorResponse } from "./types";

const BASE = "/api";

export async function tailorResume(
  resumeFile: File,
  jobDescription: string
): Promise<TailorResponse> {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("job_description", jobDescription);

  const res = await fetch(`${BASE}/tailor`, { method: "POST", body: form });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  return res.json();
}

export async function exportPDF(resume: TailoredResume): Promise<Blob> {
  const res = await fetch(`${BASE}/export/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  if (!res.ok) throw new Error("Failed to export PDF");
  return res.blob();
}

export async function exportWord(resume: TailoredResume): Promise<Blob> {
  const res = await fetch(`${BASE}/export/word`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  if (!res.ok) throw new Error("Failed to export Word document");
  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
