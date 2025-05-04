
import React, { useState, useRef, useEffect } from 'react';
import { TranslationDisplay } from '@/components/TranslationDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranslationForm from '@/components/TranslationForm';

const Translator: React.FC = () => {
  const [translationResult, setTranslationResult] = useState<{
    words: { text: string; imageUrl: string }[];
    originalText?: string;
    translatedGrammar?: string;
    detectedLanguage?: string;
  } | null>(null);

  // Reference to the translation result section
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Track translation count to force scroll on each new translation
  const [translationCount, setTranslationCount] = useState(0);

  // Check if any results are available to prevent errors
  const hasResults = translationResult && 
                    translationResult.words && 
                    translationResult.words.length > 0;

  // Handle new translations - update result and trigger scroll
  const handleTranslationComplete = (result: any) => {
    setTranslationResult(result);
    setTranslationCount(prev => prev + 1); // Increment to trigger scroll effect
  };

  // Scroll to results when they become available or when a new translation happens
  useEffect(() => {
    if (hasResults && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [hasResults, translationCount]); // Add translationCount to dependencies

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              AI Enabled Speech to Sign Language Conversion
            </h2>
          </section>

          <TranslationForm onTranslationComplete={handleTranslationComplete} />

          {hasResults && (
            <div ref={resultRef}>
              <TranslationDisplay result={translationResult} translationKey={translationCount} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Translator;
