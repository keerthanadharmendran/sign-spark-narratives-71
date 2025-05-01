
import React, { useState } from 'react';
import { TranslationDisplay } from '@/components/TranslationDisplay';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranslationForm from '@/components/TranslationForm';

const Translator: React.FC = () => {
  const [translationResult, setTranslationResult] = useState<{
    words: { text: string; imageUrl: string; poseData?: number[][] }[];
    originalText?: string;
    translatedGrammar?: string;
  } | null>(null);

  // Check if any results are available to prevent errors
  const hasResults = translationResult && 
                    translationResult.words && 
                    translationResult.words.length > 0;

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              <span className="flex items-center justify-center">
                <Sparkles className="mr-2 text-blue-500" size={24} />
                Advanced Sign Language Translator
              </span>
            </h2>
            <p className="text-muted-foreground">
              Speak or enter text to translate into American Sign Language (ASL)
            </p>
          </section>

          <TranslationForm onTranslationComplete={setTranslationResult} />

          {hasResults && (
            <TranslationDisplay result={translationResult} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Translator;
