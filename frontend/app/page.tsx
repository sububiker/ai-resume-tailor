"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, ChevronDown, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import UploadZone from "@/components/UploadZone";
import ATSScoreCard from "@/components/ATSScoreCard";
import ResumePreview from "@/components/ResumePreview";
import DownloadButtons from "@/components/DownloadButtons";
import { tailorResume } from "@/lib/api";
import { TailorResponse } from "@/lib/types";

type Step = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<TailorResponse | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "ats">("ats");
  const resultsRef = useRef<HTMLDivElement>(null);

  const canSubmit = !!resumeFile && jd.trim().length > 50 && step !== "loading";

  const handleSubmit = async () => {
    if (!canSubmit || !resumeFile) return;
    setStep("loading");
    setError("");
    setResult(null);

    try {
      const data = await tailorResume(resumeFile, jd);
      setResult(data);
      setStep("done");

      // Confetti 🎉
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#7c3aed", "#3b82f6", "#a78bfa"] });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
            <Zap size={12} />
            Powered by Claude Opus 4.7
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Tailor your resume</span>
            <br />
            <span className="text-white">with AI in seconds</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload your resume and paste a job description. Claude rewrites it to match perfectly — boosting your ATS score and interview chances.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 glow space-y-8">

          {/* Step 1 — Resume upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">1</span>
              Upload your resume
            </label>
            <UploadZone
              file={resumeFile}
              onFile={setResumeFile}
              onClear={() => setResumeFile(null)}
            />
          </div>

          {/* Step 2 — Job description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">2</span>
              Paste the job description
              <span className="text-xs text-gray-500 font-normal ml-auto">{jd.length} chars</span>
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here — the more detail, the better the match..."
              rows={7}
              className="w-full rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-white placeholder-gray-600 text-sm p-4 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            {jd.length > 0 && jd.trim().length < 50 && (
              <p className="text-xs text-amber-400 mt-1.5">Add more detail for better results</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200
              ${canSubmit
                ? "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
              }
            `}
          >
            {step === "loading" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Claude is tailoring your resume…
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Tailor My Resume
              </>
            )}
          </button>

          {step === "error" && (
            <p className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* Loading state */}
        {step === "loading" && (
          <div className="mt-8 text-center space-y-3">
            <div className="flex justify-center gap-1.5">
              {["Parsing resume", "Analysing JD", "Rewriting bullets", "Scoring ATS"].map((s, i) => (
                <span
                  key={s}
                  className="text-xs px-3 py-1 rounded-full border border-[#1e1e2e] text-gray-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600">This takes 15–30 seconds</p>
          </div>
        )}

        {/* Results */}
        {step === "done" && result && (
          <div ref={resultsRef} className="mt-10 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Your tailored resume is ready! 🎉</h2>
                <p className="text-sm text-gray-400 mt-0.5">Review below, then download in your preferred format</p>
              </div>
              <DownloadButtons resume={result.tailored} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-[#111118] border border-[#1e1e2e] w-fit">
              {(["ats", "preview"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "ats" ? "ATS Analysis" : "Resume Preview"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
              {activeTab === "ats" ? (
                <ATSScoreCard
                  score={result.tailored.ats_score}
                  matched={result.tailored.keywords_matched}
                  missing={result.tailored.keywords_missing}
                  changes={result.tailored.changes_made}
                />
              ) : (
                <ResumePreview resume={result.tailored} />
              )}
            </div>

            {/* Bottom download */}
            <div className="flex justify-center pt-2">
              <DownloadButtons resume={result.tailored} />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
