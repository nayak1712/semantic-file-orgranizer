/**
 * StatsBar - Quick statistics display
 */

import { motion } from "framer-motion";
import { Files, HardDrive, FolderOpen } from "lucide-react";
import { formatFileSize } from "@/lib/fileExtractor";

interface StatsBarProps {
  totalFiles: number;
  totalSize: number;
  categories: { name: string; count: number }[];
}

export function StatsBar({ totalFiles, totalSize, categories }: StatsBarProps) {
  const stats = [
    { icon: Files, label: "Files", value: totalFiles.toString() },
    { icon: HardDrive, label: "Total Size", value: formatFileSize(totalSize) },
    { icon: FolderOpen, label: "Categories", value: categories.length.toString() },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-3 rounded-lg border border-border card-gradient text-center"
        >
          <stat.icon className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold font-mono text-foreground">{stat.value}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
