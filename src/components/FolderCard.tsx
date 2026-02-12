/**
 * FolderCard - Displays a semantic folder with file count and category color
 */

import { motion } from "framer-motion";
import { Folder, ChevronRight } from "lucide-react";
import { SemanticFolder, CategoryName } from "@/types/files";

interface FolderCardProps {
  folder: SemanticFolder;
  isSelected: boolean;
  onSelect: (name: CategoryName) => void;
}

const colorMap: Record<string, string> = {
  "category-education": "border-category-education/40 hover:border-category-education",
  "category-finance": "border-category-finance/40 hover:border-category-finance",
  "category-health": "border-category-health/40 hover:border-category-health",
  "category-technology": "border-category-technology/40 hover:border-category-technology",
  "category-others": "border-category-others/40 hover:border-category-others",
};

const bgMap: Record<string, string> = {
  "category-education": "bg-category-education/10",
  "category-finance": "bg-category-finance/10",
  "category-health": "bg-category-health/10",
  "category-technology": "bg-category-technology/10",
  "category-others": "bg-category-others/10",
};

const textMap: Record<string, string> = {
  "category-education": "text-category-education",
  "category-finance": "text-category-finance",
  "category-health": "text-category-health",
  "category-technology": "text-category-technology",
  "category-others": "text-category-others",
};

export function FolderCard({ folder, isSelected, onSelect }: FolderCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(folder.name)}
      className={`w-full text-left p-4 rounded-lg border transition-all card-gradient ${
        colorMap[folder.color] || ""
      } ${isSelected ? "glow-border ring-1 ring-primary/30" : ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${bgMap[folder.color] || "bg-muted"}`}>
            <Folder className={`h-5 w-5 ${textMap[folder.color] || "text-primary"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{folder.icon}</span>
              <span className="font-medium text-foreground">{folder.name}</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {folder.files.length} file{folder.files.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isSelected ? "rotate-90 text-primary" : ""
          }`}
        />
      </div>
    </motion.button>
  );
}
