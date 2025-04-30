
import { getSignImageUrl } from './databaseService';

interface TranslationResult {
  words: {
    text: string;
    imageUrl: string;
  }[];
}

// Simple translation for now - in a real app, this would use more sophisticated NLP
export async function translateText(text: string): Promise<TranslationResult> {
  // Simple text processing
  const cleanedText = text.replace(/[^\w\s]/gi, '').toLowerCase();
  const words = cleanedText.split(' ').filter(word => word.length > 0);
  
  // Map each word to its sign image
  const translatedWords = words.map(word => ({
    text: word,
    imageUrl: getSignImageUrl(word)
  }));
  
  return {
    words: translatedWords
  };
}

// Function to translate a paragraph
export async function translateParagraph(text: string): Promise<TranslationResult> {
  // For now, we'll use the same basic translation
  // In a real app, you might have more advanced paragraph handling
  return translateText(text);
}
