import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeAI — Tailor your resume with AI",
  description: "Upload your resume and a job description. AI rewrites it to match perfectly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
