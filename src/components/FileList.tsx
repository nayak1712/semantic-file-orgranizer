/**
 * FileList - Displays files in a selected folder with metadata
 */

import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Eye, Clock, Hash, HardDrive } from "lucide-react";
import { OrganizedFile } from "@/types/files";
import { formatFileSize } from "@/lib/fileExtractor";
import { Badge } from "@/components/ui/badge";

interface FileListProps {
  files: OrganizedFile[];
  onPreview: (file: OrganizedFile) => void;
  onRemove: (id: string) => void;
}

export function FileList({ files, onPreview, onRemove }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileText className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm">No files in this folder</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: index * 0.05 }}
            className="group p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
          >
            {/* File header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-md bg-primary/10 shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {formatFileSize(file.size)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {file.uploadedAt.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onPreview(file)}
                  className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  title="Preview file"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onRemove(file.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Keywords */}
            {file.keywords.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <Hash className="h-3 w-3 text-muted-foreground shrink-0" />
                {file.keywords.slice(0, 5).map((kw) => (
                  <Badge
                    key={kw}
                    variant="secondary"
                    className="text-[10px] font-mono px-1.5 py-0"
                  >
                    {kw}
                  </Badge>
                ))}
                {file.keywords.length > 5 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{file.keywords.length - 5} more
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
