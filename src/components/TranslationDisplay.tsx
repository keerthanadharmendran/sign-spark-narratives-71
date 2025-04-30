
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface TranslationDisplayProps {
  result: {
    words: {
      text: string;
      imageUrl: string;
    }[];
  };
  mode: 'word' | 'paragraph';
}

export const TranslationDisplay: React.FC<TranslationDisplayProps> = ({ result, mode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isPlaying && result.words.length > 0) {
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
  }, [isPlaying, result.words.length]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentIndex >= result.words.length - 1) {
      setCurrentIndex(0);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Translation Results</span>
          {result.words.length > 1 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePlayPause}
            >
              {isPlaying ? 'Pause' : 'Play All Signs'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          {/* Current active sign */}
          {result.words.length > 0 && (
            <div className="mb-8 flex flex-col items-center">
              <div className="w-64 h-64 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-md">
                <img 
                  src={result.words[currentIndex].imageUrl} 
                  alt={`Sign for "${result.words[currentIndex].text}"`}
                  className="max-w-full max-h-full object-contain"
                  loading="eager"
                />
              </div>
              <p className="mt-4 text-center text-xl font-medium">
                {result.words[currentIndex].text}
              </p>
            </div>
          )}
          
          {/* Carousel of all signs */}
          <Carousel className="w-full max-w-lg">
            <CarouselContent>
              {result.words.map((word, index) => (
                <CarouselItem 
                  key={index} 
                  className="basis-1/3 md:basis-1/4 cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsPlaying(false);
                  }}
                >
                  <div className={`flex flex-col items-center p-2 ${currentIndex === index ? 'ring-2 ring-primary rounded-lg' : ''}`}>
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                      <img 
                        src={word.imageUrl} 
                        alt={`Sign for "${word.text}"`}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-1 text-center text-xs font-medium truncate w-full">
                      {word.text}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
        
        {mode === 'paragraph' && result.words.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Original Text:</h3>
            <p className="text-muted-foreground">
              {result.words.map(word => word.text).join(' ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
