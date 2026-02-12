/**
 * FilePreview - Modal for previewing file content
 */

import { X, FileText, Hash, HardDrive, Clock, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrganizedFile } from "@/types/files";
import { formatFileSize } from "@/lib/fileExtractor";
import { Badge } from "@/components/ui/badge";

interface FilePreviewProps {
  file: OrganizedFile | null;
  onClose: () => void;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  return (
    <AnimatePresence>
      {file && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50 bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-md bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {formatFileSize(file.size)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {file.uploadedAt.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {file.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Keywords */}
            {file.keywords.length > 0 && (
              <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-wrap">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                {file.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-xs font-mono">
                    {kw}
                  </Badge>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 scrollbar-thin">
              <pre className="text-sm font-mono text-secondary-foreground whitespace-pre-wrap leading-relaxed">
                {file.content.slice(0, 5000)}
                {file.content.length > 5000 && (
                  <span className="text-muted-foreground">
                    {"\n\n"}... content truncated ({formatFileSize(file.content.length)} total)
                  </span>
                )}
              </pre>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
