/**
 * Keyword-based content categorizer
 * Uses keyword matching to classify text into semantic categories
 */

import { CategoryConfig, CategoryName } from "@/types/files";

/** Category definitions with associated keywords */
export const CATEGORIES: CategoryConfig[] = [
  {
    name: "Education",
    keywords: [
      "school", "university", "student", "teacher", "course", "lecture",
      "exam", "homework", "study", "research", "thesis", "academic",
      "learning", "education", "curriculum", "syllabus", "grade", "degree",
      "professor", "college", "tutorial", "lesson", "training", "classroom",
      "scholarship", "diploma", "assignment", "textbook", "library",
    ],
    icon: "📚",
    color: "category-education",
  },
  {
    name: "Finance",
    keywords: [
      "bank", "money", "investment", "stock", "budget", "tax", "revenue",
      "profit", "loss", "expense", "income", "salary", "payment", "loan",
      "credit", "debit", "financial", "accounting", "audit", "fund",
      "portfolio", "dividend", "interest", "mortgage", "insurance",
      "transaction", "balance", "asset", "liability", "equity",
    ],
    icon: "💰",
    color: "category-finance",
  },
  {
    name: "Health",
    keywords: [
      "health", "medical", "doctor", "patient", "hospital", "medicine",
      "treatment", "diagnosis", "symptom", "disease", "therapy", "surgery",
      "nurse", "clinic", "prescription", "vaccine", "fitness", "nutrition",
      "mental", "wellness", "healthcare", "pharmacy", "dental", "cardiac",
      "blood", "vitamin", "exercise", "diet", "allergy", "infection",
    ],
    icon: "🏥",
    color: "category-health",
  },
  {
    name: "Technology",
    keywords: [
      "software", "hardware", "computer", "programming", "code", "algorithm",
      "data", "database", "network", "server", "cloud", "api", "web",
      "mobile", "app", "developer", "engineering", "ai", "machine",
      "learning", "automation", "cybersecurity", "blockchain", "iot",
      "digital", "tech", "system", "framework", "deployment", "debug",
    ],
    icon: "💻",
    color: "category-technology",
  },
  {
    name: "Others",
    keywords: [],
    icon: "📁",
    color: "category-others",
  },
];

/**
 * Extract keywords from text content
 * Simple but effective: tokenize, clean, count frequency, return top words
 */
export function extractKeywords(text: string, topN = 10): string[] {
  // Common English stop words to filter out
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "it", "its", "this",
    "that", "these", "those", "i", "you", "he", "she", "we", "they", "me",
    "him", "her", "us", "them", "my", "your", "his", "our", "their", "not",
    "no", "nor", "so", "if", "then", "than", "too", "very", "just", "about",
    "above", "after", "again", "all", "also", "am", "any", "as", "because",
    "before", "between", "both", "each", "few", "get", "got", "here",
    "how", "into", "more", "most", "much", "must", "new", "now", "off",
    "old", "only", "other", "out", "over", "own", "same", "some", "such",
    "up", "what", "when", "where", "which", "while", "who", "why",
  ]);

  // Tokenize and clean
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Count frequency
  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  // Sort by frequency and return top N
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Categorize content based on keyword matching
 * Scores each category by counting matching keywords in the text
 */
export function categorizeContent(text: string, keywords: string[]): CategoryName {
  const lowerText = text.toLowerCase();
  const allWords = new Set([
    ...keywords,
    ...lowerText.split(/\s+/).filter((w) => w.length > 2),
  ]);

  let bestCategory: CategoryName = "Others";
  let bestScore = 0;

  for (const category of CATEGORIES) {
    if (category.name === "Others") continue;

    let score = 0;
    for (const keyword of category.keywords) {
      if (allWords.has(keyword)) {
        score += 2; // Direct keyword match
      }
      // Also check if keyword appears in text as substring
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category.name;
    }
  }

  // Need minimum score to avoid false positives
  return bestScore >= 3 ? bestCategory : "Others";
}

/**
 * Get category config by name
 */
export function getCategoryConfig(name: CategoryName): CategoryConfig {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
}
