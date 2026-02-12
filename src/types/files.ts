/**
 * Core types for the Semantic File Organizer
 */

/** Represents a single uploaded file with extracted metadata */
export interface OrganizedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  keywords: string[];
  category: CategoryName;
  uploadedAt: Date;
  file: File;
}

/** Available semantic categories */
export type CategoryName = 
  | "Education" 
  | "Finance" 
  | "Health" 
  | "Technology" 
  | "Others";

/** A semantic folder containing organized files */
export interface SemanticFolder {
  name: CategoryName;
  icon: string;
  files: OrganizedFile[];
  color: string;
}

/** Category configuration */
export interface CategoryConfig {
  name: CategoryName;
  keywords: string[];
  icon: string;
  color: string;
}
