"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface Props {
  score: number;
  matched: string[];
  missing: string[];
  changes: string[];
}

function scoreColor(score: number) {
  if (score >= 80) return { bar: "from-emerald-500 to-green-400", text: "text-emerald-400", label: "Excellent" };
  if (score >= 60) return { bar: "from-yellow-500 to-amber-400", text: "text-yellow-400", label: "Good" };
  return { bar: "from-red-500 to-rose-400", text: "text-red-400", label: "Needs Work" };
}

export default function ATSScoreCard({ score, matched, missing, changes }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const colors = scoreColor(score);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    // Count up animation
    const duration = 1400;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      setBarWidth(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e2e" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="3"
              strokeDasharray={`${barWidth} 100`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.1s" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${colors.text}`}>{displayed}</span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>

        <div>
          <div className={`text-lg font-bold ${colors.text}`}>{colors.label} ATS Match</div>
          <p className="text-sm text-gray-400 mt-1">
            {matched.length} of {matched.length + missing.length} keywords matched
          </p>
          <div className="mt-3 h-2 w-48 rounded-full bg-[#1e1e2e] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-2 gap-4">
        {matched.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Matched Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matched.map((kw) => (
                <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {missing.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <XCircle size={14} className="text-rose-400" />
              <span className="text-xs font-medium text-rose-400">Missing Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((kw) => (
                <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Changes made */}
      {changes.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Changes Made</span>
          </div>
          <ul className="space-y-1">
            {changes.map((c, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
