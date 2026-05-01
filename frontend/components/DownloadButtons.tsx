"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { exportPDF, exportWord, downloadBlob } from "@/lib/api";
import { TailoredResume } from "@/lib/types";

interface Props {
  resume: TailoredResume;
}

export default function DownloadButtons({ resume }: Props) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingWord, setLoadingWord] = useState(false);

  const name = resume.personal_info.name.replace(" ", "_") || "resume";

  const handlePDF = async () => {
    setLoadingPdf(true);
    try {
      const blob = await exportPDF(resume);
      downloadBlob(blob, `${name}_tailored.pdf`);
    } catch (e) {
      alert("PDF export failed. Please try again.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleWord = async () => {
    setLoadingWord(true);
    try {
      const blob = await exportWord(resume);
      downloadBlob(blob, `${name}_tailored.docx`);
    } catch (e) {
      alert("Word export failed. Please try again.");
    } finally {
      setLoadingWord(false);
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={handlePDF}
        disabled={loadingPdf}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
      >
        {loadingPdf ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
        Download PDF
      </button>

      <button
        onClick={handleWord}
        disabled={loadingWord}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#1e1e2e] hover:border-violet-500/50 hover:bg-violet-500/5 text-white font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loadingWord ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
        Download Word
      </button>
    </div>
  );
}
