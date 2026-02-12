/**
 * Custom hook for managing the file organizer state
 * Handles file uploads, text extraction, categorization, and folder management
 */

import { useState, useCallback, useMemo } from "react";
import { OrganizedFile, CategoryName, SemanticFolder } from "@/types/files";
import { extractKeywords, categorizeContent, CATEGORIES } from "@/lib/categorizer";
import { extractTextFromFile } from "@/lib/fileExtractor";
import { toast } from "sonner";

export function useFileOrganizer() {
  const [files, setFiles] = useState<OrganizedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /** Process and categorize uploaded files */
  const processFiles = useCallback(async (newFiles: File[]) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const processed: OrganizedFile[] = [];
    const total = newFiles.length;

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      try {
        // Extract text content
        const content = await extractTextFromFile(file);

        // Extract keywords from content
        const keywords = extractKeywords(content);

        // Categorize based on content and keywords
        const category = categorizeContent(content, keywords);

        processed.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          size: file.size,
          type: file.type || "text/plain",
          content,
          keywords,
          category,
          uploadedAt: new Date(),
          file,
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        toast.error(`Failed to process ${file.name}`);
      }

      setProcessingProgress(Math.round(((i + 1) / total) * 100));
    }

    setFiles((prev) => [...prev, ...processed]);
    setIsProcessing(false);
    setProcessingProgress(0);

    if (processed.length > 0) {
      toast.success(`Organized ${processed.length} file${processed.length > 1 ? "s" : ""} into folders`);
    }
  }, []);

  /** Remove a file by ID */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.info("File removed");
  }, []);

  /** Build semantic folders from organized files */
  const folders: SemanticFolder[] = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      files: files.filter((f) => f.category === cat.name),
      color: cat.color,
    })).filter((folder) => folder.files.length > 0 || folder.name !== "Others");
  }, [files]);

  /** Filter files based on search query */
  const filteredFiles = useMemo(() => {
    let result = files;

    if (selectedCategory) {
      result = result.filter((f) => f.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.keywords.some((k) => k.includes(q)) ||
          f.content.toLowerCase().includes(q)
      );
    }

    return result;
  }, [files, selectedCategory, searchQuery]);

  /** Get stats */
  const stats = useMemo(() => ({
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    categories: CATEGORIES.map((c) => ({
      name: c.name,
      count: files.filter((f) => f.category === c.name).length,
    })).filter((c) => c.count > 0),
  }), [files]);

  return {
    files: filteredFiles,
    allFiles: files,
    folders,
    stats,
    isProcessing,
    processingProgress,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    processFiles,
    removeFile,
  };
}
