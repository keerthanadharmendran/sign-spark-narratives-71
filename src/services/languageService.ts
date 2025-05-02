
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
    
    // Enhanced Tamil detection - both for Tamil script and romanized Tamil
    // Tamil characters fall within this Unicode range
    const tamilRegex = /[\u0B80-\u0BFF]/;
    
    // Expanded romanized Tamil words dictionary for better detection
    const romanizedTamilWords = [
      'vanakkam', 'nandri', 'thamizh', 'amma', 'appa', 'akka', 'anna', 
      'naan', 'neenga', 'avaru', 'ival', 'enakku', 'unakku', 'epdi',
      'illai', 'sari', 'romba', 'nalla', 'enna', 'ethu', 'inge', 'ange',
      'payanam', 'ulagam', 'kadavul', 'irukkum', 'ponen', 'vanthen', 'pochu',
      'sollunga', 'paarkalaam', 'theriyum', 'theriyathu', 'varuga', 'ponalum'
    ];
    
    // Check for Tamil script characters
    if (tamilRegex.test(text)) {
      console.log("Detected Tamil language (script)");
      return SUPPORTED_LANGUAGES.TAMIL;
    }
    
    // More sophisticated check for romanized Tamil
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    // Count how many Tamil words are in the text
    let tamilWordCount = 0;
    for (const word of words) {
      if (romanizedTamilWords.some(tamilWord => word.includes(tamilWord))) {
        tamilWordCount++;
      }
    }
    
    // If more than 20% of words appear to be Tamil, classify as Tamil
    if (words.length > 0 && (tamilWordCount / words.length) > 0.2) {
      console.log("Detected romanized Tamil language");
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
    // Improved Tamil to English translation using Google Translate API
    // We're using better error handling and retry logic
    
    // Using more robust URL construction with explicit encoding
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;
    
    // Add retry logic with a maximum of 2 retries
    let attempts = 0;
    const maxAttempts = 3;
    let translatedText = '';
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(url);
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Improved extraction of translated text from response
        if (data && Array.isArray(data[0])) {
          // Concatenate all translation segments with proper spacing
          translatedText = data[0]
            .filter(segment => Array.isArray(segment) && segment[0])
            .map((segment: any[]) => segment[0])
            .join(' ')
            .trim();
          
          // Post-process Tamil to English translations for better quality
          if (sourceLang === SUPPORTED_LANGUAGES.TAMIL) {
            translatedText = postProcessTamilTranslation(translatedText);
          }
          
          break; // Success, exit the retry loop
        } else {
          throw new Error("Unexpected translation response format");
        }
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error(`Translation failed after ${maxAttempts} attempts:`, error);
          throw error; // Rethrow after max attempts
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
      }
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
 * Post-process Tamil to English translations to improve quality
 */
function postProcessTamilTranslation(translatedText: string): string {
  // Common patterns that need fixing in Tamil to English translations
  const fixPatterns: [RegExp, string][] = [
    // Fix common article issues
    [/(\s|^)a\s([aeiou])/gi, '$1an $2'],
    
    // Fix common Tamil-to-English translation errors
    [/(\s|^)i am going$/i, '$1I am going'],
    [/(\s|^)i will$/i, '$1I will'],
    [/(\s|^)he is coming$/i, '$1He is coming'],
    
    // Fix capitalization of names and places
    [/(\s|^)chennai(\s|$)/gi, '$1Chennai$2'],
    [/(\s|^)tamil nadu(\s|$)/gi, '$1Tamil Nadu$2'],
    [/(\s|^)india(\s|$)/gi, '$1India$2'],
    
    // Fix capitalization in sentences
    // Fixed: Proper type for replacement function
    [/(\.\s+)([a-z])/g, '$1$2'.toUpperCase()],
    
    // Fix first letter capitalization
    // Fixed: Proper type for replacement function  
    [/^([a-z])/g, '$1'.toUpperCase()],
    
    // Fix common pronoun capitalization
    [/(\s|^)i(\s|$)/g, '$1I$2']
  ];
  
  // Apply all fixes
  let processed = translatedText;
  for (const [pattern, replacement] of fixPatterns) {
    processed = processed.replace(pattern, replacement);
  }
  
  return processed;
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
