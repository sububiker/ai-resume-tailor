"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";

interface Props {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}

export default function UploadZone({ file, onFile, onClear }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => { if (accepted[0]) onFile(accepted[0]); },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-violet-500/40 bg-violet-500/10">
        <FileText className="text-violet-400 shrink-0" size={20} />
        <span className="text-sm text-white flex-1 truncate">{file.name}</span>
        <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</span>
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed
        cursor-pointer transition-all duration-200
        ${isDragActive
          ? "border-violet-500 bg-violet-500/10"
          : "border-[#1e1e2e] hover:border-violet-500/50 hover:bg-violet-500/5"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
        <Upload className="text-violet-400" size={22} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white">
          {isDragActive ? "Drop it here" : "Drop your resume here"}
        </p>
        <p className="text-xs text-gray-500 mt-1">PDF or DOCX · up to 10 MB</p>
      </div>
    </div>
  );
}
