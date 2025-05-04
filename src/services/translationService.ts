
import { getSignImagesForWord } from './databaseService';

// List of filler words to filter out in sentences (but not when they appear alone)
const FILLER_WORDS = [
  "a", "an", "the", "is", "are", "am", "was", "were", "be", "been", "being",
  "to", "for", "of", "in", "on", "at", "by", "with",
  "do", "does", "did",
  "has", "have", "had",
  "will", "shall", "would", "should", "may", "might", "must", "can", "could"
];

// Basic sign language translation function that maps words to signs
export const translateToSignLanguage = async (text: string) => {
  // Normalize and clean the text
  const cleanText = text.toLowerCase().trim();
  if (!cleanText) return { words: [] };

  // Split into individual words
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  // Apply filtering only if this is a multi-word input
  const wordsToTranslate = words.length === 1 
    ? words 
    : words.filter(word => !FILLER_WORDS.includes(word));
  
  console.log("Basic translation - words after filler removal:", wordsToTranslate);

  // Look up each word in the sign language database
  const translatedWords = await Promise.all(
    wordsToTranslate.map(async (word) => {
      const signs = getSignImagesForWord(word);
      
      // If word has a sign, use it
      if (signs.length > 0 && !signs[0].imageUrl.includes("not-found")) {
        return {
          text: word,
          imageUrl: signs[0].imageUrl,
        };
      }
      
      // If no sign is found, return a not-found image
      return {
        text: word,
        imageUrl: "/signs/not-found.gif",
      };
    })
  );

  return { words: translatedWords };
};
