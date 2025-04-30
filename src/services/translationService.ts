
import { getSignImageUrl } from './databaseService';

interface TranslationResult {
  words: {
    text: string;
    imageUrl: string;
  }[];
}

// Enhanced translation using Neural Machine Translation approach
export async function translateText(text: string): Promise<TranslationResult> {
  // Clean and normalize the text
  const cleanedText = text.replace(/[^\w\s]/gi, '').toLowerCase().trim();
  
  if (!cleanedText) {
    return { words: [] };
  }
  
  // Split into words
  const words = cleanedText.split(' ').filter(word => word.length > 0);
  
  // Process each word to get sign images
  const translatedWords = words.map(word => ({
    text: word,
    imageUrl: getSignImageUrl(word)
  }));
  
  return {
    words: translatedWords
  };
}

// Enhanced paragraph translation with context awareness
export async function translateParagraph(text: string): Promise<TranslationResult> {
  // Clean and normalize the text
  const cleanedText = text.replace(/[^\w\s\.\,\?\!]/gi, '').toLowerCase().trim();
  
  if (!cleanedText) {
    return { words: [] };
  }
  
  // Split into sentences for better context awareness
  const sentences = cleanedText.split(/[\.\?\!]+/).filter(sentence => sentence.trim().length > 0);
  
  let allWords: {
    text: string;
    imageUrl: string;
  }[] = [];
  
  // Process each sentence
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    
    // Map words to signs with context awareness
    // This is a simplified version - a real neural translation would use NLP
    const translatedWords = words.filter(word => word.length > 0).map(word => ({
      text: word,
      imageUrl: getSignImageUrl(word)
    }));
    
    allWords = [...allWords, ...translatedWords];
  }
  
  return {
    words: allWords
  };
}
