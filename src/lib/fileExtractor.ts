/**
 * Text extraction utilities for various file types
 */

/**
 * Extract text from a File object
 * Supports .txt and .pdf files
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "txt":
    case "md":
    case "csv":
    case "json":
    case "xml":
    case "html":
    case "js":
    case "ts":
    case "py":
      return extractFromTextFile(file);
    case "pdf":
      return extractFromPDF(file);
    default:
      // Try reading as text
      return extractFromTextFile(file);
  }
}

/** Read plain text files */
async function extractFromTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsText(file);
  });
}

/** Extract text from PDF using pdf.js */
async function extractFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    
    // Extract text from each page (limit to first 20 pages for performance)
    const maxPages = Math.min(pdf.numPages, 20);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      textParts.push(pageText);
    }

    return textParts.join("\n\n");
  } catch (error) {
    console.error("PDF extraction error:", error);
    return `[PDF file: ${file.name} - text extraction failed]`;
  }
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
