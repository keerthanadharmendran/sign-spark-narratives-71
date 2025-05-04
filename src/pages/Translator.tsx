
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

  // Check if any results are available to prevent errors
  const hasResults = translationResult && 
                    translationResult.words && 
                    translationResult.words.length > 0;

  // Scroll to results when they become available
  useEffect(() => {
    if (hasResults && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [hasResults]);

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

          <TranslationForm onTranslationComplete={setTranslationResult} />

          {hasResults && (
            <div ref={resultRef}>
              <TranslationDisplay result={translationResult} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Translator;
