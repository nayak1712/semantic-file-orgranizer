/**
 * Semantic File Organizer - Main Dashboard
 * Upload files and watch them get automatically organized into semantic folders
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderTree, Sparkles } from "lucide-react";
import { useFileOrganizer } from "@/hooks/useFileOrganizer";
import { UploadZone } from "@/components/UploadZone";
import { FolderCard } from "@/components/FolderCard";
import { FileList } from "@/components/FileList";
import { FilePreview } from "@/components/FilePreview";
import { StatsBar } from "@/components/StatsBar";
import { SearchBar } from "@/components/SearchBar";
import { OrganizedFile } from "@/types/files";

const Index = () => {
  const {
    files,
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
  } = useFileOrganizer();

  const [previewFile, setPreviewFile] = useState<OrganizedFile | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg accent-gradient">
              <FolderTree className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Semantic File Organizer
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                AI-powered file categorization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse-glow" />
            <span className="hidden sm:inline">Hackathon Project</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Folders & Stats */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-5">
            {/* Upload Zone */}
            <UploadZone
              onFilesSelected={processFiles}
              isProcessing={isProcessing}
              progress={processingProgress}
            />

            {/* Stats */}
            {stats.totalFiles > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <StatsBar
                  totalFiles={stats.totalFiles}
                  totalSize={stats.totalSize}
                  categories={stats.categories}
                />
              </motion.div>
            )}

            {/* Folder List */}
            {folders.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Folders
                  </h2>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs text-primary hover:underline font-mono"
                    >
                      Show all
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {folders.map((folder) => (
                    <FolderCard
                      key={folder.name}
                      folder={folder}
                      isSelected={selectedCategory === folder.name}
                      onSelect={(name) =>
                        setSelectedCategory(
                          selectedCategory === name ? null : name
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-4">
            {/* Search */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* File List */}
            {stats.totalFiles === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="p-6 rounded-full bg-primary/5 mb-6">
                  <FolderTree className="h-16 w-16 text-primary/30" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No files yet
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Upload text or PDF files and watch them get automatically
                  organized into semantic folders based on their content.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="px-2 py-1 rounded border border-border">.txt</span>
                  <span className="px-2 py-1 rounded border border-border">.pdf</span>
                  <span className="px-2 py-1 rounded border border-border">.md</span>
                  <span className="px-2 py-1 rounded border border-border">.csv</span>
                  <span className="px-2 py-1 rounded border border-border">.json</span>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-foreground">
                    {selectedCategory
                      ? `📂 ${selectedCategory}`
                      : "All Files"}
                    <span className="ml-2 text-muted-foreground font-mono text-xs">
                      ({files.length})
                    </span>
                  </h2>
                </div>
                <FileList
                  files={files}
                  onPreview={setPreviewFile}
                  onRemove={removeFile}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* File Preview Modal */}
      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default Index;
