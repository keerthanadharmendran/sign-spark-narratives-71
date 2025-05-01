
/**
 * Language detection and translation service
 */

// Language codes
export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  TAMIL: 'ta'
};

/**
 * Detects the language of a given text
 * Uses compact-language-detector library for client-side detection
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    console.log("Detecting language for:", text);
    
    // Simple language detection based on character sets for minimal implementation
    // Tamil characters fall within this Unicode range
    const tamilRegex = /[\u0B80-\u0BFF]/;
    
    if (tamilRegex.test(text)) {
      console.log("Detected Tamil language");
      return SUPPORTED_LANGUAGES.TAMIL;
    }
    
    // Default to English for everything else
    console.log("Defaulting to English language");
    return SUPPORTED_LANGUAGES.ENGLISH;
  } catch (error) {
    console.error("Language detection error:", error);
    // Default to English on error
    return SUPPORTED_LANGUAGES.ENGLISH;
  }
}

/**
 * Translates text from the source language to the target language
 * Uses Google Translate API
 */
export async function translateText(text: string, sourceLang: string, targetLang: string = SUPPORTED_LANGUAGES.ENGLISH): Promise<string> {
  // If already in target language, return as is
  if (sourceLang === targetLang) {
    return text;
  }
  
  console.log(`Translating from ${sourceLang} to ${targetLang}:`, text);
  
  try {
    // Google Translate API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Extract translated text from response
    // The response format is a nested array where the first element contains translation segments
    let translatedText = '';
    
    if (data && data[0]) {
      // Concatenate all translation segments
      translatedText = data[0]
        .map((segment: any[]) => segment[0])
        .join(' ')
        .trim();
    }
    
    console.log("Translated text:", translatedText);
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Process input text for translation
 * Detects language, translates to English if needed, then returns the English text
 */
export async function processMultilingualInput(text: string): Promise<{
  originalText: string;
  detectedLanguage: string;
  translatedText: string;
}> {
  // Detect the language of the input text
  const detectedLanguage = await detectLanguage(text);
  
  // If not English, translate to English
  let translatedText = text;
  if (detectedLanguage !== SUPPORTED_LANGUAGES.ENGLISH) {
    translatedText = await translateText(text, detectedLanguage, SUPPORTED_LANGUAGES.ENGLISH);
  }
  
  return {
    originalText: text,
    detectedLanguage,
    translatedText
  };
}

/**
 * Get language name from language code
 */
export function getLanguageName(langCode: string): string {
  const languageNames: { [key: string]: string } = {
    en: 'English',
    ta: 'Tamil'
  };
  
  return languageNames[langCode] || 'Unknown';
}

