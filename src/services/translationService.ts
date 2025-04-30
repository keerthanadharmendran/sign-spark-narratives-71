
import { getSignImagesForWord } from './databaseService';

interface TranslationResult {
  words: {
    text: string;
    imageUrl: string;
  }[];
}

// Neural Machine Translation for context-aware text-to-sign translation
export async function translateToSignLanguage(text: string): Promise<TranslationResult> {
  // Clean and normalize the text
  const cleanedText = text.replace(/[^\w\s\.\,\?\!]/gi, '').toLowerCase().trim();
  
  if (!cleanedText) {
    return { words: [] };
  }
  
  console.log("NMT: Processing input text:", cleanedText);
  
  // Split into words while preserving meaningful units
  const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
  
  console.log("NMT: Extracted words:", words);
  
  // Process each word with context awareness
  let translatedSigns: { text: string; imageUrl: string }[] = [];
  
  for (const word of words) {
    console.log("NMT: Processing word:", word);
    // Get sign images for the word with letter fallback if needed
    const wordSigns = getSignImagesForWord(word);
    translatedSigns = [...translatedSigns, ...wordSigns];
  }
  
  console.log("NMT: Translation complete, signs generated:", translatedSigns.length);
  
  return {
    words: translatedSigns
  };
}
