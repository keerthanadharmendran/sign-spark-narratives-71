
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Play, Pause, Info, Globe, Wrench } from 'lucide-react';
import { getLanguageName } from '../services/languageService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TranslationDisplayProps {
  result: {
    words: {
      text: string;
      imageUrl: string;
    }[];
    originalText?: string;
    translatedGrammar?: string;
    detectedLanguage?: string;
  };
  translationKey?: number; // Add this prop to track new translations
}

export const TranslationDisplay: React.FC<TranslationDisplayProps> = ({ result, translationKey }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Start playing automatically
  const [activeTab, setActiveTab] = useState("signs");
  
  // Safety check for result data
  const hasWords = result && result.words && result.words.length > 0;
  
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isPlaying && hasWords) {
      intervalId = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= result.words.length) {
            setIsPlaying(false);
            return 0;
          }
          return nextIndex;
        });
      }, 2000); // Display each sign for 2 seconds
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, result.words.length, hasWords]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentIndex >= result.words.length - 1) {
      setCurrentIndex(0);
    }
  };
  
  // Reset to first sign and auto-play when new translation comes in
  // Use translationKey to ensure this runs on every new translation
  useEffect(() => {
    if (hasWords) {
      setCurrentIndex(0);
      setIsPlaying(true);
      // Always show the Signs tab for new translations
      setActiveTab("signs");
    }
  }, [result, hasWords, translationKey]);

  // If no translation words, don't render anything
  if (!hasWords) {
    return null;
  }
  
  // Get current word safely
  const currentWord = result.words[currentIndex] || { text: '', imageUrl: '' };
  
  return (
    <Card className="bg-white shadow-lg" id="translation-result">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex justify-between items-center">
          <span>Sign Language Translation</span>
          {result.words.length > 1 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePlayPause}
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause size={16} /> Pause
                </>
              ) : (
                <>
                  <Play size={16} /> Play Translation
                </>
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <Tabs value={activeTab} className="w-full mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="signs" className="text-left">Signs</TabsTrigger>
              <TabsTrigger value="grammar" className="text-left">ASL Grammar</TabsTrigger>
              <TabsTrigger value="info" className="text-left">Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signs" className="mt-4">
              {/* Continuous video of signs */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md h-80 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-md border border-gray-200">
                  <img 
                    src={currentWord.imageUrl} 
                    alt={`Sign for "${currentWord.text}"`}
                    className="max-w-full max-h-full object-contain"
                    loading="eager"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      // Set fallback image on error
                      (e.target as HTMLImageElement).src = "/signs/not-found.gif";
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xl font-medium">
                    {currentWord.text}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="grammar" className="mt-4">
              <div className="bg-blue-50 p-6 rounded-md">
                <h3 className="text-xl font-bold mb-4">ASL Grammar Translation</h3>
                <p className="text-sm text-gray-700 mb-4">
                  ASL uses different grammar than English. Here's how your text translates to ASL structure:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {result.detectedLanguage && result.detectedLanguage !== "en" ? (
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="font-medium mb-2">{getLanguageName(result.detectedLanguage)}:</p>
                      <p>{result.originalText}</p>
                    </div>
                  ) : null}
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="font-medium mb-2">English:</p>
                    <p>{result.originalText}</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <p className="font-medium mb-2">ASL Structure:</p>
                  <p>{result.translatedGrammar || result.words.map(word => word.text).join(' ')}</p>
                </div>
                
                <p className="text-sm text-gray-700 mt-4">
                  ASL typically uses a different word order than English, often following Time-Topic-Comment structure.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="mt-4">
              <div className="bg-blue-50 p-6 rounded-md space-y-6">
                <div>
                  <h3 className="flex items-center text-lg font-bold mb-2">
                    <Info size={18} className="mr-2" /> About This Translation
                  </h3>
                  <p className="text-gray-700">
                    This translation uses transformer-based models to understand context, encoder-decoder architecture with attention mechanisms, 
                    and few-shot learning techniques. It also includes multilingual support with automatic language detection and translation.
                  </p>
                </div>
                
                <div>
                  <h3 className="flex items-center text-lg font-bold mb-2">
                    <Wrench size={18} className="mr-2" /> Technology Used
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Transformer models for context understanding</li>
                    <li>ASL grammar restructuring</li>
                    <li>Few-shot learning for new signs</li>
                    <li>Multilingual support with language detection and translation</li>
                  </ul>
                </div>
                
                {result.detectedLanguage && result.detectedLanguage !== "en" && (
                  <div>
                    <h3 className="flex items-center text-lg font-bold mb-2">
                      <Globe size={18} className="mr-2" /> Multilingual Processing
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Your input was detected as {getLanguageName(result.detectedLanguage)} and translated to English before generating sign language.
                    </p>
                    <div className="flex items-center justify-between text-center">
                      <div className="bg-white px-4 py-2 rounded-full">
                        {getLanguageName(result.detectedLanguage)}
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="bg-white px-4 py-2 rounded-full">
                        English
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="bg-white px-4 py-2 rounded-full">
                        ASL
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Original Text:</h3>
          <p className="text-muted-foreground">
            {result.originalText || result.words.map(word => word.text).join(' ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
