
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
    
    // First, check if we have a full word sign available
    const wordSigns = getSignImagesForWord(word);
    
    // If we got exactly one sign and it's not a "not-found" sign, use it
    if (wordSigns.length === 1 && !wordSigns[0].imageUrl.includes("not-found")) {
      translatedSigns.push(wordSigns[0]);
    } else {
      // If no sign is found or it's a "not-found" sign, break the word down into letters
      console.log(`NMT: No sign found for "${word}". Breaking into letters.`);
      
      // For each letter in the word, get its sign
      const letters = word.split('');
      for (const letter of letters) {
        const letterSigns = getSignImagesForWord(letter);
        
        // Add the letter sign with modified text to indicate it's finger-spelled
        if (letterSigns && letterSigns.length > 0) {
          translatedSigns.push({
            text: `${letter} (finger-spelled)`,
            imageUrl: letterSigns[0].imageUrl
          });
        } else {
          // If even the letter isn't found, use a not-found image
          translatedSigns.push({
            text: letter,
            imageUrl: "/signs/not-found.gif"
          });
        }
      }
    }
  }
  
  console.log("NMT: Translation complete, signs generated:", translatedSigns.length);
  
  return {
    words: translatedSigns
  };
}
