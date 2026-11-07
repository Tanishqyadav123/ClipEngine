"use client";

import React, { useState } from "react";
import { Upload, FileVideo, X } from "lucide-react";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

export const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {selectedFile ? (
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-5 py-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 w-full">
          <FileVideo className="w-8 h-8 text-indigo-500 shrink-0" />
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {selectedFile.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="ml-auto p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border border-zinc-300 dark:border-zinc-800 rounded-xl cursor-pointer bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all shadow-sm">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-3 mb-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500">
              <Upload className="w-6 h-6" />
            </div>
            <p className="mb-1 text-sm text-zinc-800 dark:text-zinc-200 font-medium">
              Choose a video file to upload
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              MP4, MOV, AVI or WebM
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};
