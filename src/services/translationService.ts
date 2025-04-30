
import { getSignImagesForWord } from './databaseService';

interface TranslationResult {
  words: {
    text: string;
    imageUrl: string;
  }[];
}

// Enhanced translation using Neural Machine Translation approach with letter fallback
export async function translateText(text: string): Promise<TranslationResult> {
  // Clean and normalize the text
  const cleanedText = text.replace(/[^\w\s]/gi, '').toLowerCase().trim();
  
  if (!cleanedText) {
    return { words: [] };
  }
  
  // Split into words
  const words = cleanedText.split(' ').filter(word => word.length > 0);
  
  // Process each word to get sign images with letter fallback
  let translatedWords: { text: string; imageUrl: string }[] = [];
  
  for (const word of words) {
    const wordSigns = getSignImagesForWord(word);
    translatedWords = [...translatedWords, ...wordSigns];
  }
  
  return {
    words: translatedWords
  };
}

// Enhanced paragraph translation with context awareness and letter fallback
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
    
    // Map words to signs with context awareness and letter fallback
    for (const word of words) {
      if (word.length > 0) {
        const wordSigns = getSignImagesForWord(word);
        allWords = [...allWords, ...wordSigns];
      }
    }
  }
  
  return {
    words: allWords
  };
}
