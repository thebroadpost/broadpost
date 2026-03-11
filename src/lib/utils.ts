export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  // Remove markdown formatting and count words
  const cleanText = text.replace(/[#*`_\]\[\(\)]/g, ' ');
  const wordCount = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 min read time
}

/**
 * Combine tailwind classes safely (fallback for simple use cases without clsx/tailwind-merge)
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
