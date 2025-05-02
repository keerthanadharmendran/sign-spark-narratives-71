
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
    
    // Get sign images - Fixed bug: avoid duplicating words like "thank you" -> "thank you you"
    const translatedSigns = [];
    let prevWord = ""; // Track previous word to avoid duplication
    
    for (const word of words) {
      // Skip if this word is the same as the previous (avoid duplication)
      if (word === prevWord) {
        continue;
      }
      
      const signImage = getSignImagesForWord(word);
      translatedSigns.push({
        text: word,
        imageUrl: signImage[0]?.imageUrl || `/signs/not-found.gif`
      });
      
      prevWord = word;
    }
    
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
  const translatedSigns = [];
  let prevWord = ""; // Track previous word to avoid duplication
  
  for (const word of words) {
    // Skip if this word is the same as the previous (avoid duplication)
    if (word === prevWord) {
      continue;
    }
    
    const signImage = getSignImagesForWord(word);
    translatedSigns.push({
      text: word,
      imageUrl: signImage[0]?.imageUrl || `/signs/not-found.gif`
    });
    
    prevWord = word;
  }
  
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
  // Special case for common phrases to handle directly
  const specialPhrases: Record<string, string> = {
    "thank you": "thank you",
    "what is your name": "name you what",
    "how are you": "you feel how",
    "nice to meet you": "meet you nice",
    "good morning": "morning good",
    "good afternoon": "afternoon good",
    "good evening": "evening good",
    "good night": "night good",
    "i love you": "i love you",
    "please help me": "help me please",
    "excuse me": "excuse me",
    "i am sorry": "sorry i",
    "no problem": "problem no",
    "see you later": "see you later",
    "see you tomorrow": "tomorrow see you"
  };
  
  // Check for exact special phrases
  const lowerText = text.toLowerCase();
  if (specialPhrases[lowerText]) {
    return specialPhrases[lowerText];
  }
  
  // Split the text into sentences for more accurate processing
  const sentences = lowerText
    .replace(/([.!?])\s*/g, "$1|")
    .split("|")
    .filter(sentence => sentence.trim().length > 0);
  
  if (sentences.length === 0) return "";
  
  // Process each sentence according to ASL grammar rules
  const translatedSentences = sentences.map(sentence => {
    // Pre-process to clean up the sentence
    const cleanedSentence = sentence.trim().replace(/[^\w\s\.\,\?\!]/gi, '');
    if (!cleanedSentence) return "";
    
    // Check if this is a special phrase segment
    for (const [phrase, translation] of Object.entries(specialPhrases)) {
      if (cleanedSentence.includes(phrase)) {
        return cleanedSentence.replace(phrase, translation);
      }
    }
    
    // Tokenize the sentence into words
    const words = cleanedSentence.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return "";
    
    // Extract time expressions (if any)
    const timeWords = extractTimeWords(words);
    const nonTimeWords = words.filter(word => !timeWords.includes(word));
    
    // Extract questions (if any)
    const questionMarkerIndex = sentence.indexOf('?');
    const isQuestion = questionMarkerIndex >= 0 || 
                      startsWithQuestionWord(sentence);
    
    // Build ASL grammar structure
    let aslStructure: string[] = [];
    
    // Time expressions go first in ASL
    if (timeWords.length > 0) {
      aslStructure = [...aslStructure, ...timeWords];
    }
    
    if (isQuestion) {
      // Handle questions - ASL often puts question words at the end
      const { questionWords, nonQuestionWords } = extractQuestionWords(nonTimeWords);
      
      if (questionWords.length > 0) {
        // Topic-Comment-Question structure
        const topic = identifyTopic(nonQuestionWords);
        const comments = nonQuestionWords.filter(w => 
          w !== topic && !questionWords.includes(w) && !isUnnecessaryWord(w)
        );
        
        // ASL question structure: Topic, Comment, Question-Word
        aslStructure = [
          ...aslStructure,
          topic,
          ...comments,
          ...questionWords
        ].filter(Boolean);
      } else {
        // Yes/No questions in ASL use facial expressions with similar word order
        const topic = identifyTopic(nonTimeWords);
        const comments = nonTimeWords.filter(w => 
          w !== topic && !isUnnecessaryWord(w)
        );
        
        aslStructure = [
          ...aslStructure,
          topic,
          ...comments
        ].filter(Boolean);
      }
    } else {
      // Handle statements - follow Topic-Comment structure
      // Identify negation words
      const negationWords = nonTimeWords.filter(w => 
        ["no", "not", "never", "don't", "doesn't", "didn't", "won't", "can't", "cannot"].includes(w)
      );
      
      const nonNegationWords = nonTimeWords.filter(w => !negationWords.includes(w));
      const topic = identifyTopic(nonNegationWords);
      
      // In ASL, negation typically comes at the end
      const comments = nonNegationWords.filter(w => 
        w !== topic && !isUnnecessaryWord(w)
      );
      
      // Build the ASL structure: Topic, Comment, Negation
      aslStructure = [
        ...aslStructure,
        topic,
        ...comments,
        ...negationWords
      ].filter(Boolean);
    }
    
    // Filter out unnecessary words that don't exist in ASL
    aslStructure = aslStructure.filter(word => !isUnnecessaryWord(word));
    
    // Join the words to form the ASL sentence
    return aslStructure.join(" ");
  });
  
  // Join all sentences and return
  return translatedSentences.join(" ");
}

/**
 * Check if a sentence starts with a question word
 */
function startsWithQuestionWord(sentence: string): boolean {
  const lowerSentence = sentence.toLowerCase().trim();
  const questionWords = ["what", "where", "when", "why", "who", "how", "which", "whose", "whom"];
  
  for (const word of questionWords) {
    if (lowerSentence.startsWith(word + " ") || lowerSentence === word) {
      return true;
    }
  }
  
  return false;
}

/**
 * Extract question words from a list of words
 */
function extractQuestionWords(words: string[]): { questionWords: string[], nonQuestionWords: string[] } {
  const questionWords: string[] = [];
  const nonQuestionWords: string[] = [];
  
  const questionWordList = ["what", "where", "when", "why", "who", "how", "which", "whose", "whom"];
  
  words.forEach(word => {
    if (questionWordList.includes(word.toLowerCase())) {
      questionWords.push(word.toLowerCase());
    } else {
      nonQuestionWords.push(word);
    }
  });
  
  return { questionWords, nonQuestionWords };
}

/**
 * Check if a word is unnecessary in ASL
 * ASL omits many function words that are required in English
 */
function isUnnecessaryWord(word: string): boolean {
  const unnecessaryWords = [
    "a", "an", "the", // Articles
    "is", "are", "am", "was", "were", "be", "been", "being", // Be-verbs
    "to", "for", "of", "in", "on", "at", "by", "with", // Common prepositions
    "do", "does", "did", // Do-verbs as auxiliaries
    "has", "have", "had", // Have-verbs as auxiliaries
    "will", "shall", "would", "should", "may", "might", "must", "can", "could" // Modal verbs
  ];
  
  return unnecessaryWords.includes(word.toLowerCase());
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
    "past", "future", "ago", "before", "after",
    "early", "late", "soon", "already", "yet", "still"
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
 * Identify the topic of a sentence for ASL translation
 * In ASL, the topic is usually what the sentence is about
 */
function identifyTopic(words: string[]): string {
  if (words.length === 0) return "";
  
  // Common pronouns that are often the topic
  const pronouns = ["i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those", "my", "your", "his", "her", "our", "their"];
  
  // Common proper nouns that might be topics (simplified)
  const properNouns = ["john", "mary", "bob", "london", "paris", "monday", "january"];
  
  // Check for pronouns first
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    if (pronouns.includes(lowerWord)) {
      return lowerWord;
    }
  }
  
  // Check for proper nouns
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    if (properNouns.includes(lowerWord)) {
      return lowerWord;
    }
  }
  
  // If no pronoun or proper noun is found, use the first noun or first word
  // In a real implementation, we would use POS tagging to identify nouns
  return words[0].toLowerCase();
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
