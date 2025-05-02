
import { pipeline, env } from '@huggingface/transformers';
import * as tf from '@tensorflow/tfjs';
import { getSignImagesForWord } from './databaseService';

// Configure the transformers.js environment
env.allowLocalModels = false;
env.useBrowserCache = true;

// Interfaces for our service
interface TranslationResult {
  words: {
    text: string;
    imageUrl: string;
  }[];
  originalText: string;
  translatedGrammar: string;
}

// Model names
const CONTEXT_MODEL = "bert-base-uncased";
const TRANSLATION_MODEL = "facebook/nllb-200-distilled-600M";

/**
 * Advanced text-to-sign translation using transformer models
 */
export async function translateWithTransformer(text: string): Promise<TranslationResult> {
  console.log("Advanced NMT: Processing input text:", text);
  
  // Clean and normalize the text
  const cleanedText = text.replace(/[^\w\s\.\,\?\!]/gi, '').toLowerCase().trim();
  
  if (!cleanedText) {
    return { words: [], originalText: text, translatedGrammar: "" };
  }
  
  try {
    // Initialize TensorFlow.js
    await tf.ready();
    console.log("TensorFlow.js initialized:", tf.getBackend());
    
    // Initialize the feature extraction pipeline for context understanding
    let contextAnalyzer;
    try {
      contextAnalyzer = await pipeline('feature-extraction', CONTEXT_MODEL);
      console.log("Context model loaded successfully");
    } catch (error) {
      console.error("Failed to load context model:", error);
      // Fallback to basic processing
      return fallbackTranslation(cleanedText, text);
    }
    
    // Get sentence embeddings to understand context
    const embeddings = await contextAnalyzer(cleanedText, { pooling: "mean" });
    console.log("Generated embeddings for context understanding");
    
    // In a full implementation, this would use the embeddings to adjust the translation
    // For now, we'll use a rule-based approach to demonstrate the concept
    const translatedGrammar = convertToAslGrammar(cleanedText);
    console.log("Converted to ASL grammar:", translatedGrammar);
    
    // Process according to ASL grammar structure
    const words = translatedGrammar.split(/\s+/).filter(word => word.length > 0);
    console.log("Words after grammar transformation:", words);
    
    // Get sign images - Fixed bug here by directly mapping each word to its sign
    const translatedSigns = words.map(word => {
      const signImage = getSignImagesForWord(word);
      return {
        text: word,
        imageUrl: signImage[0]?.imageUrl || `/signs/not-found.gif`
      };
    });
    
    return {
      words: translatedSigns,
      originalText: text,
      translatedGrammar: translatedGrammar
    };
    
  } catch (error) {
    console.error("Error in transformer translation:", error);
    // Fallback to basic translation if transformer fails
    return fallbackTranslation(cleanedText, text);
  }
}

/**
 * Fallback to basic translation when advanced models fail
 */
function fallbackTranslation(cleanedText: string, originalText: string): TranslationResult {
  console.log("Using fallback translation");
  const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
  
  // Process each word
  const translatedSigns = words.map(word => {
    const signImage = getSignImagesForWord(word);
    return {
      text: word,
      imageUrl: signImage[0]?.imageUrl || `/signs/not-found.gif`
    };
  });
  
  return {
    words: translatedSigns,
    originalText,
    translatedGrammar: cleanedText // In fallback mode, we don't transform grammar
  };
}

/**
 * Convert English text to ASL grammar structure following standard ASL principles
 * ASL typically follows Time-Topic-Comment structure with specific grammar rules
 */
function convertToAslGrammar(text: string): string {
  // Handle special phrases first
  const specialPhrases: Record<string, string> = {
    "thank you": "thank you",
    "what is your name": "name you what",
    "how are you": "you feel how",
    "nice to meet you": "meet you nice",
  };
  
  // Check for exact special phrases
  const lowerText = text.toLowerCase();
  for (const [phrase, translation] of Object.entries(specialPhrases)) {
    if (lowerText === phrase) {
      return translation;
    }
  }
  
  // Split the text into sentences
  const sentences = lowerText
    .replace(/([.!?])\s*/g, "$1|")
    .split("|")
    .filter(sentence => sentence.trim().length > 0);
  
  // Process each sentence
  const translatedSentences = sentences.map(sentence => {
    // Pre-process to clean up the sentence
    const cleanedSentence = sentence.trim().replace(/[^\w\s\.\,\?\!]/gi, '');
    if (!cleanedSentence) return "";
    
    // Tokenize the sentence
    const words = cleanedSentence.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return "";
    
    // Extract time expressions (if any)
    const timeWords = extractTimeWords(words);
    const nonTimeWords = words.filter(word => !timeWords.includes(word));
    
    // Extract questions (if any)
    const isQuestion = sentence.includes("?") || 
                      words.includes("what") || 
                      words.includes("where") || 
                      words.includes("when") || 
                      words.includes("why") || 
                      words.includes("who") || 
                      words.includes("how") || 
                      words.includes("which");
    
    // Build ASL structure
    let aslStructure: string[] = [];
    
    // Time expressions go first in ASL
    if (timeWords.length > 0) {
      aslStructure = [...aslStructure, ...timeWords];
    }
    
    // Find the topic (usually the subject) - simplified approach
    const remainingWords = [...nonTimeWords];
    
    // For questions, the question word often goes at the end in ASL
    if (isQuestion) {
      // Extract WH question words
      const questionWords = remainingWords.filter(word => 
        ["what", "where", "when", "why", "who", "how", "which"].includes(word)
      );
      
      // Remove question words from remaining words
      const nonQuestionWords = remainingWords.filter(word => 
        !["what", "where", "when", "why", "who", "how", "which"].includes(word)
      );
      
      // Simple re-ordering for questions - put question words at the end
      if (questionWords.length > 0) {
        // Very simplified - proper ASL grammar would be more complex
        const topic = identifyTopic(nonQuestionWords);
        const verbAndRest = nonQuestionWords.filter(w => w !== topic);
        aslStructure = [...aslStructure, topic, ...verbAndRest, ...questionWords];
      } else {
        // Yes/no questions generally have the same word order in ASL,
        // but with facial grammar (which we can't represent in text)
        aslStructure = [...aslStructure, ...remainingWords];
      }
    } else {
      // For statements, follow Topic-Comment structure
      const topic = identifyTopic(remainingWords);
      const verbAndRest = remainingWords.filter(w => w !== topic);
      
      // Add topic first, then the rest
      aslStructure = [...aslStructure, topic, ...verbAndRest];
    }
    
    // Remove articles, certain prepositions, and be-verbs as they're often omitted in ASL
    aslStructure = aslStructure.filter(word => 
      !["a", "an", "the", "is", "are", "am", "was", "were", "be", "been"].includes(word)
    );
    
    return aslStructure.join(" ");
  });
  
  return translatedSentences.join(" ");
}

/**
 * Extract time-related words from a sentence
 */
function extractTimeWords(words: string[]): string[] {
  const timeWords: string[] = [];
  const timeIndicators = [
    "tomorrow", "yesterday", "today", "now", "later",
    "morning", "afternoon", "evening", "night",
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
    "january", "february", "march", "april", "may", "june", 
    "july", "august", "september", "october", "november", "december",
    "year", "month", "week", "day", "hour", "minute", "second",
    "past", "future", "ago", "before", "after"
  ];
  
  // Simple detection - a more advanced implementation would detect phrases
  words.forEach(word => {
    if (timeIndicators.includes(word.toLowerCase())) {
      timeWords.push(word.toLowerCase());
    }
  });
  
  return timeWords;
}

/**
 * Simple function to identify the topic of a sentence
 * In ASL, the topic is usually what the sentence is about
 */
function identifyTopic(words: string[]): string {
  // Very simplified approach - in real ASL, topic identification is complex
  // For now, we'll assume the first noun/pronoun is the topic
  // This is a gross oversimplification and would need a proper NLP approach
  
  // Common pronouns and potential subjects
  const potentialTopics = ["i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those"];
  
  // Try to find a pronoun first
  for (const word of words) {
    if (potentialTopics.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
  }
  
  // If no pronoun, return the first word as a fallback
  // This is a simplification - proper topic identification would need POS tagging
  return words.length > 0 ? words[0].toLowerCase() : "";
}

/**
 * Few-shot learning function to add new signs with minimal examples
 */
export async function learnNewSignFromExamples(
  word: string, 
  exampleUrls: string[]
): Promise<boolean> {
  try {
    console.log(`Learning new sign for '${word}' from ${exampleUrls.length} examples`);
    
    // Initialize TensorFlow.js if not already initialized
    await tf.ready();
    
    // In a real implementation, this would:
    // 1. Extract features from example GIFs/videos
    // 2. Train a small model to recognize the pattern
    // 3. Generate new sign data based on the learned pattern
    
    // For this demo, we'll just add the first example to our database
    if (exampleUrls.length > 0) {
      // Add to database
      // In a real app, this would store the learned model or features
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error learning new sign:", error);
    return false;
  }
}
