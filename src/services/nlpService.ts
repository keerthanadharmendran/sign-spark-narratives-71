
/**
 * Natural Language Processing service
 * Provides NLP capabilities similar to NLTK but for client-side JavaScript
 */
import nlp from 'compromise';

// Add language plugins if needed in the future
// import compromiseNumbers from 'compromise-numbers';
// nlp.extend(compromiseNumbers);

/**
 * Processes text using NLP techniques
 */
interface NLPResult {
  tokens: string[];
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  sentences: string[];
  tags: Record<string, string[]>;
  sentiment: 'positive' | 'negative' | 'neutral';
}

/**
 * Process text through NLP pipeline
 * Performs tokenization, POS tagging, entity recognition
 */
export function processText(text: string): NLPResult {
  if (!text || text.trim() === '') {
    return {
      tokens: [],
      nouns: [],
      verbs: [],
      adjectives: [],
      adverbs: [],
      sentences: [],
      tags: {},
      sentiment: 'neutral'
    };
  }

  const doc = nlp(text);
  
  // Tokenization - split text into words
  const tokens = doc.terms().out('array');
  
  // Parts of speech extraction
  const nouns = doc.nouns().out('array');
  const verbs = doc.verbs().out('array');
  const adjectives = doc.adjectives().out('array');
  const adverbs = doc.adverbs().out('array');
  
  // Sentence segmentation
  const sentences = doc.sentences().out('array');
  
  // Named entity recognition and POS tagging
  // Map words to their tags
  const terms = doc.terms().out('tags');
  const tags: Record<string, string[]> = {};
  
  // Process the terms to group by tag
  terms.forEach((term: any) => {
    const word = term.text;
    const wordTags = Object.keys(term.tags);
    
    wordTags.forEach(tag => {
      if (!tags[tag]) {
        tags[tag] = [];
      }
      
      if (!tags[tag].includes(word)) {
        tags[tag].push(word);
      }
    });
  });
  
  // Basic sentiment analysis
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  const positiveWords = doc.match('(good|great|excellent|amazing|wonderful|fantastic|happy|love|like)').terms();
  const negativeWords = doc.match('(bad|terrible|awful|horrible|sad|hate|dislike)').terms();
  
  if (positiveWords.length > negativeWords.length) {
    sentiment = 'positive';
  } else if (negativeWords.length > positiveWords.length) {
    sentiment = 'negative';
  }
  
  return {
    tokens,
    nouns,
    verbs,
    adjectives,
    adverbs,
    sentences,
    tags,
    sentiment
  };
}

/**
 * Improve ASL grammar translation using NLP insights
 */
export function improveAslGrammar(text: string): string {
  const doc = nlp(text);
  let aslText = text;
  
  // Apply ASL grammar rules
  
  // 1. Remove articles (a, an, the)
  aslText = doc.replace('(a|an|the)', '').out('text');
  
  // 2. Place time expressions at the beginning
  const timeExpressions = doc.match('(yesterday|today|tomorrow|now|later|#time|#date)').out('array');
  if (timeExpressions.length > 0) {
    // Remove time expressions from original text
    const withoutTime = doc.not('(yesterday|today|tomorrow|now|later|#time|#date)').out('text');
    // Add them at the beginning
    aslText = `${timeExpressions.join(' ')} ${withoutTime}`.trim();
  }
  
  // 3. Place question words at the end for ASL questions
  if (aslText.includes('?')) {
    const questionDoc = nlp(aslText);
    const questionWords = questionDoc.match('(what|where|when|why|who|how|which)').out('array');
    
    if (questionWords.length > 0) {
      // Remove question words and question mark
      const withoutQuestion = questionDoc
        .not('(what|where|when|why|who|how|which)')
        .out('text').replace('?', '');
      
      // Add question words at the end
      aslText = `${withoutQuestion} ${questionWords.join(' ')}`.trim();
    }
  }
  
  // 4. Handle negatives - move to the end in ASL
  const negDoc = nlp(aslText);
  const negWords = negDoc.match('(not|no|never)').out('array');
  
  if (negWords.length > 0) {
    // Remove negation words
    const withoutNeg = negDoc.not('(not|no|never)').out('text');
    // Add negation at the end
    aslText = `${withoutNeg} ${negWords.join(' ')}`.trim();
  }
  
  return aslText;
}

/**
 * Get the most important words in a text based on NLP analysis
 * Useful for summarization and key concept identification
 */
export function getKeywords(text: string, limit = 5): string[] {
  const doc = nlp(text);
  
  // Extract nouns, they usually carry the most meaning
  const nouns = doc.nouns().out('array');
  
  // Extract verbs, they describe actions
  const verbs = doc.verbs().out('array');
  
  // Combine and limit
  const keywords = [...nouns, ...verbs].slice(0, limit);
  
  return keywords;
}
