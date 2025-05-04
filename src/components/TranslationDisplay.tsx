
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { getLanguageName } from '../services/languageService';

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
          {/* Continuous video of signs */}
          <div className="mb-8 flex flex-col items-center">
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
              <p className="text-sm text-gray-500 mt-2">
                {currentIndex + 1} of {result.words.length} 
                {isPlaying && result.words.length > 1 && " • Playing..."}
              </p>
            </div>
          </div>
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
