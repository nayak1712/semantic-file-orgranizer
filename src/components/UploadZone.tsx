/**
 * UploadZone - Drag & drop file upload area
 * Supports text and PDF files with visual feedback
 */

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  progress: number;
}

const ACCEPTED_TYPES = [
  ".txt", ".md", ".csv", ".json", ".xml", ".html", ".js", ".ts", ".py", ".pdf",
];

export function UploadZone({ onFilesSelected, isProcessing, progress }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
    e.target.value = "";
  };

  return (
    <motion.div
      className={`upload-zone rounded-lg p-8 text-center cursor-pointer transition-all relative overflow-hidden ${
        isDragging ? "dragging" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              Analyzing & organizing files...
            </p>
            <div className="w-full max-w-xs bg-secondary rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full accent-gradient rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-mono text-primary">{progress}%</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="p-4 rounded-full bg-primary/10">
              {isDragging ? (
                <FileText className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <p className="text-foreground font-medium">
                {isDragging ? "Drop files here" : "Drag & drop files to organize"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports TXT, PDF, MD, CSV, JSON, and more
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground border border-border rounded px-3 py-1">
              or click to browse
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
