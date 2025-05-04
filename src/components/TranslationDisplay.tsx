
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
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
}

export const TranslationDisplay: React.FC<TranslationDisplayProps> = ({ result }) => {
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
  useEffect(() => {
    if (hasWords) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [result, hasWords]);

  // If no translation words, don't render anything
  if (!hasWords) {
    return null;
  }
  
  // Get current word safely
  const currentWord = result.words[currentIndex] || { text: '', imageUrl: '' };
  
  return (
    <Card className="bg-white shadow-lg">
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
          <Tabs defaultValue="signs" className="w-full mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signs">Signs</TabsTrigger>
              <TabsTrigger value="grammar">ASL Grammar</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
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
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">ASL Grammar Structure:</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {result.translatedGrammar || "ASL grammar typically follows the structure: Topic-Comment, rather than Subject-Verb-Object used in English."}
                </p>
                <p className="text-sm text-gray-700">
                  Key differences: No articles (a, the), different word order, and incorporation of facial expressions as grammatical markers.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">About Sign Language:</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Sign languages are natural languages that use visual-manual modality to convey meaning. They are complete languages with their own grammar and syntax.
                </p>
                <p className="text-sm text-gray-700">
                  {result.detectedLanguage && result.detectedLanguage !== "en" ? 
                    `Source language detected: ${getLanguageName(result.detectedLanguage)}` : 
                    "This translation shows American Sign Language (ASL) equivalents of the entered text."
                  }
                </p>
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
